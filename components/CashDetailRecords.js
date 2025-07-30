import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, DatePicker, Typography, Select, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";
const { Title } = Typography;
const { RangePicker } = DatePicker;

// Sample data
const initialData = [
  
];

const filterOptions = (data, key) => {
  const unique = [...new Set(data.map(item => item[key]))];
  return unique.map(val => ({ text: val, value: val }));
};

const CashDetailRecords = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    const db = getDatabase();
     const today = new Date().toISOString().split('T')[0];
    const cashRef = ref(db, 'cash/' + today);
    onValue(cashRef, snapshot => {
      const data = snapshot.val() || [];
        const records = [...data.income , ...data.expense ];
        console.log('records', records);
      setData(records);
      setFilteredData(records);
    });
  }, []);
  // Table column search/filter helpers
  let searchInput = null;
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { searchInput = node; }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Filter by dropdown for Nature, Heading, Sub Heading, Type
  const columns = [
    { title: 'Sr.no', dataIndex: 'srno', key: 'srno', width: 70 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    {
      title: 'Nature',
      dataIndex: 'nature',
      key: 'nature',
      filters: filterOptions(data, 'nature'),
      onFilter: (value, record) => record.nature === value,
      ...getColumnSearchProps('nature'),
    },
    {
      title: 'Heading',
      dataIndex: 'heading',
      key: 'heading',
      filters: filterOptions(data, 'heading'),
      onFilter: (value, record) => record.heading === value,
      ...getColumnSearchProps('heading'),
    },
    {
      title: 'Sub Heading',
      dataIndex: 'subHeading',
      key: 'subHeading',
      filters: filterOptions(data, 'subHeading'),
      onFilter: (value, record) => record.subHeading === value,
      ...getColumnSearchProps('subHeading'),
    },
    { title: 'Particulars/Remarks', dataIndex: 'remarks', key: 'remarks', width: 180 },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: filterOptions(data, 'type'),
      onFilter: (value, record) => record.type === value,
      ...getColumnSearchProps('type'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: val => <b>{val}</b>,
      width: 120,
    },
  ];

  // Search/Reset handlers
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  // Date filter logic
  const handleDateFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      const from = dateRange[0].format('YYYY-MM-DD');
      const to = dateRange[1].format('YYYY-MM-DD');
      const filtered = data.filter(
        item => item.date >= from && item.date <= to
      );
      setFilteredData(filtered);
    }
  };
  const handleClearDateFilter = () => {
    setDateRange([null, null]);
    setFilteredData(data);
  };

  // Calculate total amount
  const totalAmount = filteredData.reduce((sum, row) => sum + Number(row.amount), 0);

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Cash Detail Records</Title>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>From Date:</span>
        <DatePicker
          value={dateRange[0]}
          onChange={date => setDateRange([date, dateRange[1]])}
          style={{ width: 140 }}
        />
        <span>To Date:</span>
        <DatePicker
          value={dateRange[1]}
          onChange={date => setDateRange([dateRange[0], date])}
          style={{ width: 140 }}
        />
        <Button type="primary" onClick={handleDateFilter}>Apply</Button>
        <Button onClick={handleClearDateFilter}>Close</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 20 }}
        bordered
        size="small"
        rowKey="srno"
      />
      <Divider />
      <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
        Total Amount: {totalAmount}
      </div>
    </div>
  );
};

export default CashDetailRecords;