import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, Divider } from 'antd';
import { getDatabase, ref, set, onValue, push } from "firebase/database";

const { Title } = Typography;

// Table columns for Truck Income
const incomeColumns = [
    { title: 'Sr.no', dataIndex: 'srno', key: 'srno', width: 70 },
    { title: 'Date', dataIndex: 'cashDate', key: 'cashDate' },
    { title: 'Trip Date', dataIndex: 'tripDate', key: 'tripDate' },
    { title: 'Truck No', dataIndex: 'truckNo', key: 'truckNo' },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Amount', dataIndex: 'cashAmount', key: 'cashAmount', render: (val) => <b>{val}</b> },
    { title: 'Verify', dataIndex: 'verify', key: 'verify', render: (val) => val ? '✔️' : '❌' },
];

// Table columns for Truck Expense
const expenseColumns = [
    { title: 'Sr.no', dataIndex: 'srno', key: 'srno', width: 70 },
    { title: 'Trip Date', dataIndex: 'tripDate', key: 'tripDate' },
    { title: 'First Driver', dataIndex: 'driver', key: 'driver'},
    { title: 'Truck No', dataIndex: 'truckNo', key: 'truckNo' },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Amount', dataIndex: 'tripCash', key: 'tripCash', render: (val) => <b>{val}</b> },
    { title: 'Verify', dataIndex: 'verify', key: 'verify', render: (val) => val ? '✔️' : '❌' },
];

const DailyTruckCash = () => {
    const [incomeData, setIncomeData] = useState([
        {
            srno: 1,
            cashDate: '2025-07-17',
            tripDate: '2025-07-17',
            truckNo: 'MH12AB1234',
            from: 'Pune',
            to: 'Mumbai',
            cashAmount: 5000,
            verify: true,
        },
    ]);
    const [expenseData, setExpenseData] = useState([
        {
            srno: 1,
            tripDate: '2025-07-17',
            driver: 'Ramesh',
            truckNo: 'MH12AB1234',
            from: 'Pune',
            to: 'Mumbai',
            tripCash: 2000,
            verify: false,
        },
    ]);

    // Modal states
    const [incomeModalOpen, setIncomeModalOpen] = useState(false);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);

    const [incomeForm] = Form.useForm();
    const [expenseForm] = Form.useForm();

    useEffect(() => {
        const db = getDatabase();
        // Fetch daily entry data from Firebase
        const starCountRef = ref(db, 'dailyEntry/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            let ds_income = []; // Data Source
            let ds_expense = []; // Data Source for expenses
            if (data) {
                Object.keys(data).map((key, i) => {
                    for (let j = 0; j < data[key].tripDetails.length; j++) {
                        let receivedAmt = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined) ?
                            (
                                parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                                parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                                parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                                // parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                                (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                            )
                            : 0;

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
                                srno: ds_income.length + 1,
                                cashDate: cashDate,
                                tripDate: data[key]?.date,
                                truckNo: data[key]?.vehicleNo || 'N/A',
                                from: data[key]?.tripDetails[j]?.from || 'N/A',
                                to: data[key]?.tripDetails[j]?.to || 'N/A',
                                verify: data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined ? data[key].firstPayment[j].verify : false,
                                cashAmount: cashAmount,
                            });

                            ds_expense.push({
                                srno: ds_expense.length + 1,
                                tripDate: data[key]?.date,
                                driver: data[key]?.driver1?.label || 'Not Available',
                                truckNo: data[key]?.vehicleNo || 'N/A',
                                from: data[key]?.tripDetails[j]?.from || 'N/A',
                                to: data[key]?.tripDetails[j]?.to || 'N/A',
                                tripCash: data[key]?.driver1?.TripCash || 0,
                                verify: data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined ? data[key].firstPayment[j].verify : false,
                            });

                        }
                    }
                });
            }

            setIncomeData([...ds_income]);
            setExpenseData([...ds_expense]);
        });

    }, [])

    // Add new income entry
    const handleIncomeSubmit = () => {
        incomeForm.validateFields().then(values => {
            setIncomeData([
                ...incomeData,
                {
                    srno: incomeData.length + 1,
                    tripDate: values.tripDate.format('YYYY-MM-DD'),
                    driverName: values.driverName,
                    truckNo: values.truckNo,
                    from: values.from,
                    to: values.to,
                    amount: Number(values.amount),
                    verify: values.verify || false,
                }
            ]);
            incomeForm.resetFields();
            setIncomeModalOpen(false);
        });
    };

    // Add new expense entry
    const handleExpenseSubmit = () => {
        expenseForm.validateFields().then(values => {
            setExpenseData([
                ...expenseData,
                {
                    srno: expenseData.length + 1,
                    date: values.date.format('YYYY-MM-DD'),
                    tripDate: values.tripDate.format('YYYY-MM-DD'),
                    truckNo: values.truckNo,
                    from: values.from,
                    to: values.to,
                    amount: Number(values.amount),
                    verify: values.verify || false,
                }
            ]);
            expenseForm.resetFields();
            setExpenseModalOpen(false);
        });
    };

    // Calculate total amounts
    const totalIncome = incomeData.reduce((sum, row) => sum + Number(parseFloat(row.amount)), 0);
    const totalExpense = expenseData.reduce((sum, row) => sum + Number(parseFloat(row.amount)), 0);

    return (
        <div style={{ display: 'flex', gap: 32, padding: 24, height: '100%' }}>
            {/* Truck Income Partition */}
            <div style={{ flex: 1, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4}>Truck Income</Title>
                    {/* <Button type="primary" onClick={() => setIncomeModalOpen(true)}>
                        Add New Entry
                    </Button> */}
                </div>
                <Table
                    columns={incomeColumns}
                    dataSource={incomeData}
                    pagination={false}
                    bordered
                    size="small"
                    rowKey="srno"
                />
                <Divider />
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
                    Total Amount: {totalIncome}
                </div>
                <Modal
                    title="Add Truck Income Entry"
                    open={incomeModalOpen}
                    onCancel={() => setIncomeModalOpen(false)}
                    onOk={handleIncomeSubmit}
                    okText="Submit"
                >
                    <Form form={incomeForm} layout="vertical">
                        <Form.Item name="tripDate" label="Trip Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="driverName" label="First Driver Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="truckNo" label="Truck No" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="from" label="From" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="to" label="To" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="verify" label="Verify" valuePropName="checked">
                            <Input type="checkbox" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            {/* Truck Expense Partition */}
            <div style={{ flex: 1, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4}>Truck Expense</Title>
                    <Button type="primary" onClick={() => setExpenseModalOpen(true)}>
                        Add New Entry
                    </Button>
                </div>
                <Table
                    columns={expenseColumns}
                    dataSource={expenseData}
                    pagination={false}
                    bordered
                    size="small"
                    rowKey="srno"
                />
                <Divider />
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
                    Total Amount: {totalExpense}
                </div>
                <Modal
                    title="Add Truck Expense Entry"
                    open={expenseModalOpen}
                    onCancel={() => setExpenseModalOpen(false)}
                    onOk={handleExpenseSubmit}
                    okText="Submit"
                >
                    <Form form={expenseForm} layout="vertical">
                        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="tripDate" label="Trip Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="truckNo" label="Truck No" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="from" label="From" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="to" label="To" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="verify" label="Verify" valuePropName="checked">
                            <Input type="checkbox" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default DailyTruckCash;