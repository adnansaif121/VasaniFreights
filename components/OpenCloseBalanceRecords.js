import React, { useEffect, useState } from 'react';
import { Table, Input, Button, DatePicker, Typography, Divider } from 'antd';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";
const { Title } = Typography;

// Sample data
const initialData = [
  {
    srno: 1,
    date: '2025-07-29',
    openingBalance: 10000,
    dailyChange: 2000,
    closingBalance: 12000,
    diffAmount: 2000,
    remarks: 'Normal day',
  },
  {
    srno: 2,
    date: '2025-07-30',
    openingBalance: 12000,
    dailyChange: -3000,
    closingBalance: 9000,
    diffAmount: -3000,
    remarks: 'High expense',
  },
];

const OpenCloseBalanceRecords = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    // Fetch data from Firebase or any other source
    const db = getDatabase();
    const cashRef = ref(db, 'cash/' );
    onValue(cashRef, snapshot => {
      const data = snapshot.val() || [];
      const records = Object.values(data).map((item, index) => ({
        srno: index + 1,
        date: item.date,
        openingBalance: item.openingBalance,
        dailyChange: item.dailyChange,
        closingBalance: item.closingBalance,
        diffAmount: item.diffAmount,
        remarks: item.remarks,
        }));
      console.log('records', records);
      setData(records);
      setFilteredData(records);
    });
  }, []);

  // Table columns
  const columns = [
    { title: 'Sr.no', dataIndex: 'srno', key: 'srno', width: 70 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120,
      render: (text) => {
        if (!text) return '';
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    { title: 'Opening Balance', dataIndex: 'openingBalance', key: 'openingBalance', render: val => <b>{val}</b> },
    { title: 'Daily Change', dataIndex: 'dailyChange', key: 'dailyChange', render: val => <b>{val}</b> },
    { title: 'Closing Balance', dataIndex: 'closingBalance', key: 'closingBalance', render: val => <b>{val}</b> },
    { title: 'Diffamount', dataIndex: 'diffAmount', key: 'diffAmount', render: val => <b>{val}</b> },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 180 },
  ];

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

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Open/Close Balance Records</Title>
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
    </div>
  );
};

export default OpenCloseBalanceRecords;