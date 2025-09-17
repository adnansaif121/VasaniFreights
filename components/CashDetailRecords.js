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

const CashDetailRecords = ({ dailyEntryData }) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);

  console.log('CashDetailRecords rendered with dailyEntryData:');
  useEffect(() => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const cashRef = ref(db, 'cash/' + today);
    console.log('Cash Details Records useEffect running for date:', today);
    onValue(cashRef, snapshot => {
      const data = snapshot.val() || [];
      console.log('Fetched Cash Data for Today:', data);
      if (data.income || data.expense) {
        if (!data.income) data.income = [];
        if (!data.expense) data.expense = [];
        let incomeEntries = Array.isArray(data.income)
          ? data.income.filter(entry => entry.type !== 'Total').map((entry, idx) => ({
            ...entry,
            key: entry.key || `${entry.date || today}-${entry.heading || ''}-${idx}`
          }))
          : [];
        let expenseEntries = Array.isArray(data.expense)
          ? data.expense.filter(entry => entry.type !== 'Total').map((entry, idx) => ({
            ...entry,
            key: entry.key || `${entry.date || today}-${entry.heading || ''}-${idx}`
          }))
          : [];
        const records = [...incomeEntries, ...expenseEntries];
        console.log('records', records);
        // setData(records);
        // setFilteredData(records);
        addRecordsFromDailyEntryData(records);
      }
    });
  }, []);

  const addRecordsFromDailyEntryData = (existingRecords) => {
    const data = dailyEntryData;
    let ds_income = []; // Data Source
    let ds_expense = []; // Data Source for expenses
    if (data) {
      Object.keys(data).map((key, i) => {
        for (let j = 0; j < data[key].tripDetails.length; j++) {

          let cashAmount = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined) ?
            parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount)
            : 0;
          let cashDate = (data[key]?.firstPayment !== undefined && data[key].firstPayment[j] !== undefined) ?
            data[key].firstPayment[j].cashDate
            : null;
          let _date = new Date(data[key]?.date);
          // Check if this date is today's date
          if (_date.toDateString() === new Date().toDateString()) {
            // If it is, add it to the data source
            ds_income.push({
              // srno: ds_income.length + 1,
              key: key + '_' + j + '_income',
              cashDate: cashDate,
              tripDate: data[key]?.date,
              truckNo: data[key]?.vehicleNo || 'N/A',
              from: data[key]?.tripDetails[j]?.from || 'N/A',
              to: data[key]?.tripDetails[j]?.to || 'N/A',
              verify: data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined ? data[key].firstPayment[j].verify : false,
              // cashAmount: cashAmount,
              amount: cashAmount,
              heading: 'Cash Received from Trip',
              type: 'Cash',
            });

            ds_expense.push({
              // srno: ds_expense.length + 1,
              key: key + '_' + j + '_expense',
              tripDate: data[key]?.date,
              driver: data[key]?.driver1?.label || 'Not Available',
              truckNo: data[key]?.vehicleNo || 'N/A',
              from: data[key]?.tripDetails[j]?.from || 'N/A',
              to: data[key]?.tripDetails[j]?.to || 'N/A',
              // tripCash: data[key]?.driver1?.TripCash || 0,
              amount: data[key]?.driver1?.TripCash ? parseInt(data[key]?.driver1?.TripCash) : 0,
              heading: 'Trip Cash Paid to Driver',
              type: 'Cash',
              verify: data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined ? data[key].firstPayment[j].verify : false,
            });

          }
        }
      });
    }

    console.log('CASH DETAIL RECORDS',[...existingRecords, ...ds_income, ...ds_expense]);
    setData([...existingRecords, ...ds_income, ...ds_expense]);
    setFilteredData([...existingRecords, ...ds_income, ...ds_expense]);
    // setIncomeData([...ds_income]);
    // setExpenseData([...ds_expense]);
  }
  // Table column search/filter helpers
  let searchInput = null;
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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
            // onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
            onClick={() => { setSelectedKeys([]); handleSearch([], confirm, dataIndex) }}
          >
            Clear
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ fontSize: 20, color: filtered ? 'red' : undefined }} />
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
    { title: 'Sr.no', dataIndex: 'srno', key: 'srno', width: 70, render: (_, __, index) => index + 1 },

    {
      title: 'Nature',
      dataIndex: 'nature',
      key: 'nature',
      filters: filterOptions(data, 'nature'),
      onFilter: (value, record) => record.nature === value,
      ...getColumnSearchProps('nature'),
    },
    {
      title: 'Date', dataIndex: 'date', key: 'date', width: 120,
      render:
        (text) => {
          if (!text) return '';
          // display date in dd-mm-yyyy format
          const date = new Date(text);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
    },
    {
      title: 'Trip Date', dataIndex: 'tripDate', key: 'tripDate', width: 120,
      render:
        (text) => {
          if (!text) return '';
          // display date in dd-mm-yyyy format
          const date = new Date(text);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
    },
    {
      title: 'Truck No', dataIndex: 'truckNo', key: 'truckNo', width: 100,
      render: (text) => <b>{text}</b>
    },
    { title: 'From', dataIndex: 'from', key: 'from', width: 100 },
    { title: 'To', dataIndex: 'to', key: 'to', width: 100 },
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
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 180 },
    {
      title: 'Payment Mode',
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
      // render: (record) => <b>{record?.cashAmount || record?.tripCash || record?.amount || 0}</b>,
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
        // rowKey="srno"
        rowKey={record => record.key}
      />
      <Divider />
      <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
        Total Amount: {totalAmount}
      </div>
    </div>
  );
};

export default CashDetailRecords;