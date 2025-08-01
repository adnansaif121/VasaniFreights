import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, Select, Divider, Space } from 'antd';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt, update } from "firebase/database";

const { Title } = Typography;

const tableColumns = [
    { title: 'Sr.no', dataIndex: 'srNo', key: 'srNo', render: (_, __, index) => index + 1 },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Nature', dataIndex: 'nature', key: 'nature' },
    { title: 'Heading', dataIndex: 'heading', key: 'heading' },
    { title: 'Sub Heading', dataIndex: 'subHeading', key: 'subHeading' },
    { title: 'Particulars/Remarks', dataIndex: 'remarks', key: 'remarks' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

// const staticIncoming = [{
//     key: '1',
//     date: '2025-07-17',
//     nature: 'income',
//     heading: 'Cash Received',
//     subHeading: 'Sales',
//     remarks: 'Opening Balance',
//     type: 'Cash',
//     amount: 10000,
// }];

// const staticExpense = [{
//     key: '1',
//     date: '2025-07-17',
//     nature: 'expense',
//     heading: 'Cash Paid',
//     subHeading: 'Purchase',
//     remarks: 'Opening Expense',
//     type: 'Cash',
//     amount: 5000,
// }];

const typeOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank', label: 'Bank' },
    { value: 'Online', label: 'Online' },
    { value: 'Cheque', label: 'Cheque' },
];

const initialHeadingOptions = [
    { value: 'Cash Received', label: 'Cash Received' },
    { value: 'Cash Paid', label: 'Cash Paid' },
];

const initialSubHeadingOptions = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Purchase', label: 'Purchase' },
];

const DailyTotalCashDetails = ({ dailyTruckCashIncome, dailyTruckCashExpense, dataSource, fetchEntries, yesterdayData }) => {
    const [incomingData, setIncomingData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);

    const [incomingModalOpen, setIncomingModalOpen] = useState(false);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    // Dropdown state for Heading/SubHeading
    const [headingOptions, setHeadingOptions] = useState(initialHeadingOptions);
    const [subHeadingOptions, setSubHeadingOptions] = useState(initialSubHeadingOptions);
    const [newHeading, setNewHeading] = useState('');
    const [newSubHeading, setNewSubHeading] = useState('');

    const [headingOptions2, setHeadingOptions2] = useState(initialHeadingOptions);
    const [subHeadingOptions2, setSubHeadingOptions2] = useState(initialSubHeadingOptions);
    const [newHeading2, setNewHeading2] = useState('');
    const [newSubHeading2, setNewSubHeading2] = useState('');

    const [openingBalance, setOpeningBalance] = useState(0); // You can set initial value as needed
    const [closingBalance, setClosingBalance] = useState(0);  // You can set initial value as needed
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [remark, setRemark] = useState('');
    const [diffAmount, setDiffAmount] = useState(0);

    useEffect(() => {
        let _totalIncome = 0;
        let _totalExpense = 0;
        //    fetch Cash Data
        const db = getDatabase();
        // check if cash data exists for today
        const today = new Date().toISOString().split('T')[0];
        const cashRef = ref(db, 'cash/' + today);
        onValue(cashRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Fetched Cash Data:', data);
            // Process the fetched data as needed
            if (data) {
                let incomeEntries = Array.isArray(data.income) ? [...data.income] : [];
                if (incomeEntries.length > 0) {
                    incomeEntries[0] = {
                        key: 'incoming-total',
                        date: new Date().toISOString().split('T')[0],
                        heading: 'Truck Income',
                        nature: 'Income',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashIncome || 0,
                    };
                } else {
                    incomeEntries = [{
                        key: 'incoming-total',
                        date: new Date().toISOString().split('T')[0],
                        heading: 'Truck Income',
                        nature: 'Income',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashIncome || 0,
                    }];
                }

                let expenseEntries = Array.isArray(data.expense) ? [...data.expense] : [];
                if (expenseEntries.length > 0) {
                    expenseEntries[0] = {
                        key: 'expense-total',
                        date: new Date().toISOString().split('T')[0],
                        nature: 'Expense',
                        heading: 'Truck Expense',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashExpense || 0,
                    };
                } else {
                    expenseEntries = [{
                        key: 'expense-total',
                        date: new Date().toISOString().split('T')[0],
                        nature: 'Expense',
                        heading: 'Truck Expense',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashExpense || 0,
                    }];
                }

                setIncomingData([...incomeEntries]);
                setExpenseData([...expenseEntries]);

                for (const entry of incomeEntries) {
                    _totalIncome += parseFloat(entry.amount) || 0;
                }

                for (const entry of expenseEntries) {
                    _totalExpense += parseFloat(entry.amount) || 0;
                }

                setTotalIncome(_totalIncome);
                setTotalExpense(_totalExpense);
                setOpeningBalance(yesterdayData ? yesterdayData.closingBalance || 0 : 0);
                setClosingBalance(yesterdayData ? (yesterdayData.closingBalance + (_totalIncome - _totalExpense)) || 0 : (_totalIncome - _totalExpense) || 0);
                // Update entry in backend
                let incomeCashRef = ref(db, 'cash/' + today + '/income/0/');
                update(incomeCashRef, {
                    amount: dailyTruckCashIncome || 0,
                    date: today,
                    nature: 'Income',
                    heading: 'Truck Income',
                    subHeading: '',
                    remarks: '',
                    type: 'Total',
                });
                let expenseCashRef = ref(db, 'cash/' + today + '/expense/0/');
                update(expenseCashRef, {
                    amount: dailyTruckCashExpense || 0,
                    date: today,
                    nature: 'Expense',
                    heading: 'Truck Expense',
                    subHeading: '',
                    remarks: '',
                    type: 'Total',
                });
                let cashDataRef = ref(db, 'cash/' + today);
                update(cashDataRef, {
                    openingBalance: yesterdayData ? yesterdayData.closingBalance || 0 : 0,
                    closingBalance: yesterdayData ? (yesterdayData.closingBalance + (_totalIncome - _totalExpense)) || 0 : (_totalIncome - _totalExpense) || 0,
                    dailyChange: _totalIncome - _totalExpense,
                }).then(() => {
                    console.log('Updated cash data for today:', today);
                    console.log('Total Income:', _totalIncome);
                    console.log('Total Expense:', _totalExpense);
                    console.log('YesterdayData', yesterdayData);
                    console.log('Opening Balance', openingBalance, (yesterdayData ? yesterdayData.closingBalance || 0 : 0));
                    console.log('Closing Balance', closingBalance, yesterdayData ? (yesterdayData.closingBalance + (_totalIncome - _totalExpense)) || 0 : (_totalIncome - _totalExpense) || 0);
                });
            } else {
                setIncomingData([]);
                setExpenseData([]);
                
                // Initialize cash data for today if it doesn't exist
                set(cashRef, {
                    income: [{
                        key: 'income-total',
                        date: new Date().toISOString().split('T')[0],
                        nature: 'Income',
                        heading: 'Truck Income',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashIncome || 0,
                    }],
                    expense: [{
                        key: 'expense-total',
                        date: new Date().toISOString().split('T')[0],
                        nature: 'Expense',
                        heading: 'Truck Expense',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashExpense || 0,
                    }],
                    date: today,
                    dailyChange: dailyTruckCashIncome - dailyTruckCashExpense,
                    openingBalance: yesterdayData ? yesterdayData.closingBalance || 0 : 0,
                    closingBalance: yesterdayData ? (yesterdayData.closingBalance + (dailyTruckCashIncome - dailyTruckCashExpense)) || 0 : (dailyTruckCashIncome - dailyTruckCashExpense) || 0,
                    remarks: remark,
                    diffAmount: diffAmount || 0,
                }).then(() => {
                    console.log('Initialized cash data for today:', today);
                    setIncomingData([{
                        key: 'incoming-total',
                        date: new Date().toISOString().split('T')[0],
                        heading: 'Truck Income',
                        nature: 'Income',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashIncome || 0,
                    }]);
                    setExpenseData([{
                        key: 'expense-total',
                        date: new Date().toISOString().split('T')[0],
                        heading: 'Truck Expense',
                        nature: 'Expense',
                        subHeading: '',
                        remarks: '',
                        type: 'Total',
                        amount: dailyTruckCashExpense || 0,
                    }]);
                    setTotalIncome(dailyTruckCashIncome || 0);
                    setTotalExpense(dailyTruckCashExpense || 0);
                    setOpeningBalance(yesterdayData ? yesterdayData.closingBalance || 0 : 0);
                    setClosingBalance(yesterdayData ? (yesterdayData.closingBalance + (dailyTruckCashIncome - dailyTruckCashExpense)) || 0 : (dailyTruckCashIncome - dailyTruckCashExpense) || 0);
                });
            }
        }, { onlyOnce: true });
    }, [dataSource]);

    // Add new option handlers
    const addNewHeading = () => {
        if (newHeading && !headingOptions.some(opt => opt.value === newHeading)) {
            setHeadingOptions([...headingOptions, { value: newHeading, label: newHeading }]);
            setNewHeading('');
        }
    };
    const addNewSubHeading = () => {
        if (newSubHeading && !subHeadingOptions.some(opt => opt.value === newSubHeading)) {
            setSubHeadingOptions([...subHeadingOptions, { value: newSubHeading, label: newSubHeading }]);
            setNewSubHeading('');
        }
    };
    const addNewHeading2 = () => {
        if (newHeading2 && !headingOptions2.some(opt => opt.value === newHeading2)) {
            setHeadingOptions2([...headingOptions2, { value: newHeading2, label: newHeading2 }]);
            setNewHeading2('');
        }
    };
    const addNewSubHeading2 = () => {
        if (newSubHeading2 && !subHeadingOptions2.some(opt => opt.value === newSubHeading2)) {
            setSubHeadingOptions2([...subHeadingOptions2, { value: newSubHeading2, label: newSubHeading2 }]);
            setNewSubHeading2('');
        }
    };

    const handleIncomingSubmit = () => {
        form.validateFields().then(values => {
            setIncomingData([
                ...incomingData,
                {
                    key: Date.now(),
                    date: values.date.format('YYYY-MM-DD'),
                    nature: values.nature,
                    heading: values.heading,
                    subHeading: values.subHeading,
                    remarks: values.remarks,
                    type: values.type,
                    amount: values.amount,
                }
            ]);
            form.resetFields();
            setIncomingModalOpen(false);
        
        // save the data to the Firebase database
        const db = getDatabase();
        const index = incomingData.length;
        const cashRef = ref(db, 'cash/' + values.date.format('YYYY-MM-DD') + '/income/'+ index + '/');
        set(cashRef, {
            date: values.date.format('YYYY-MM-DD'),
            nature: values.nature,
            heading: values.heading,
            subHeading: values.subHeading,
            remarks: values.remarks,
            type: values.type,
            amount: values.amount,
        }).then(() => {
            console.log('Incoming entry added successfully');
        }).catch((error) => {
            console.error('Error adding incoming entry:', error);
        });

        const updateRef = ref(db, 'cash/' + values.date.format('YYYY-MM-DD') +'/');
        update(updateRef, {
            dailyChange: totalIncome - totalExpense,
            closingBalance: closingBalance + parseFloat(values.amount),
        })

        if(values.type === 'Cash'){
            setClosingBalance(parseFloat(closingBalance) + parseFloat(values.amount));
            setTotalIncome(parseFloat(totalIncome) + parseFloat(values.amount));
        }
        });

    };

    const handleExpenseSubmit = () => {
        form2.validateFields().then(values => {
            setExpenseData([
                ...expenseData,
                {
                    key: Date.now(),
                    date: values.date.format('YYYY-MM-DD'),
                    nature: values.nature,
                    heading: values.heading,
                    subHeading: values.subHeading,
                    remarks: values.remarks,
                    type: values.type,
                    amount: values.amount,
                }
            ]);
            form2.resetFields();
            setExpenseModalOpen(false);
       
        // save the data to the Firebase database
        const db = getDatabase();
        const index = expenseData.length;
        const cashRef = ref(db, 'cash/' + values.date.format('YYYY-MM-DD') + '/expense/' + index + '/');
        set(cashRef, {
            date: values.date.format('YYYY-MM-DD'),
            nature: values.nature,
            heading: values.heading,
            subHeading: values.subHeading,
            remarks: values.remarks,
            type: values.type,
            amount: values.amount,
        }).then(() => {
            console.log('Expense entry added successfully');
        }).catch((error) => {
            console.error('Error adding expense entry:', error);
        });

        const updateRef = ref(db, 'cash/' + values.date.format('YYYY-MM-DD') +'/');
        update(updateRef, {
            dailyChange: totalIncome - totalExpense,
            closingBalance: closingBalance + parseFloat(values.amount),
        })

        if(values.type === 'Cash'){
            setTotalExpense(parseFloat(totalExpense) + parseFloat(values.amount));
            setClosingBalance(closingBalance - values.amount);
        }
         });
    };

    const handleSave = () => {
        const db = getDatabase();
        const today = new Date().toISOString().split('T')[0];
        const cashRef = ref(db, 'cash/' + today + '/');
        update(cashRef, {
            diffAmount: diffAmount,
            remarks: remark,
        })
    }

    return (
        <>

            <div style={{ display: 'flex', gap: 4, padding: 24, height: '100%' }}>
                <div style={{ flex: 1, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={4}>Daily Incoming/Additions</Title>
                        <Button type="primary" onClick={() => setIncomingModalOpen(true)}>
                            Add New Entry
                        </Button>
                    </div>
                    <Table
                        columns={tableColumns}
                        dataSource={incomingData}
                        pagination={false}
                        bordered
                        size="small"
                    />
                    <Modal
                        title="Add Incoming Entry"
                        open={incomingModalOpen}
                        onCancel={() => setIncomingModalOpen(false)}
                        onOk={handleIncomingSubmit}
                        okText="Submit"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Nature"
                                    options={[{ value: 'income', label: 'Income' }, { value: 'addition', label: 'Addition' }]}
                                />
                            </Form.Item>
                            <Form.Item name="heading" label="Heading" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Heading"
                                    options={headingOptions}
                                    dropdownRender={menu => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Add new heading"
                                                    value={newHeading}
                                                    onChange={e => setNewHeading(e.target.value)}
                                                    onKeyDown={e => e.stopPropagation()}
                                                />
                                                <Button type="text" onClick={addNewHeading}>
                                                    Add
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item name="subHeading" label="Sub Heading" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Sub Heading"
                                    options={subHeadingOptions}
                                    dropdownRender={menu => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Add new sub heading"
                                                    value={newSubHeading}
                                                    onChange={e => setNewSubHeading(e.target.value)}
                                                    onKeyDown={e => e.stopPropagation()}
                                                />
                                                <Button type="text" onClick={addNewSubHeading}>
                                                    Add
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item name="remarks" label="Particulars/Remarks" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select options={typeOptions} />
                            </Form.Item>
                            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div style={{ flex: 1, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={4}>Daily Expense/Deposits</Title>
                        <Button type="primary" onClick={() => setExpenseModalOpen(true)}>
                            Add New Entry
                        </Button>
                    </div>
                    <Table
                        columns={tableColumns}
                        dataSource={expenseData}
                        pagination={false}
                        bordered
                        size="small"
                    />
                    <Modal
                        title="Add Expense Entry"
                        open={expenseModalOpen}
                        onCancel={() => setExpenseModalOpen(false)}
                        onOk={handleExpenseSubmit}
                        okText="Submit"
                    >
                        <Form form={form2} layout="vertical">
                            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Nature"
                                    options={[{ value: 'expense', label: 'Expense' }, { value: 'deduction', label: 'Deduction' }]}
                                />
                            </Form.Item>
                            <Form.Item name="heading" label="Heading" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Heading"
                                    options={headingOptions2}
                                    dropdownRender={menu => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Add new heading"
                                                    value={newHeading2}
                                                    onChange={e => setNewHeading2(e.target.value)}
                                                    onKeyDown={e => e.stopPropagation()}
                                                />
                                                <Button type="text" onClick={addNewHeading2}>
                                                    Add
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item name="subHeading" label="Sub Heading" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Select Sub Heading"
                                    options={subHeadingOptions2}
                                    dropdownRender={menu => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Add new sub heading"
                                                    value={newSubHeading2}
                                                    onChange={e => setNewSubHeading2(e.target.value)}
                                                    onKeyDown={e => e.stopPropagation()}
                                                />
                                                <Button type="text" onClick={addNewSubHeading2}>
                                                    Add
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item name="remarks" label="Particulars/Remarks" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select options={typeOptions} />
                            </Form.Item>
                            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 32,
                    padding: '24px 0',
                    background: '#fafafa',
                    borderTop: '1px solid #eee',
                    fontSize: 18,
                    width: '100%',
                }}
            >
                <div>
                    <b>Opening Balance:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={openingBalance}
                        // onChange={e => setOpeningBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Daily Cash Change:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={totalIncome - totalExpense}
                        readOnly
                        // onChange={e => setDailyChange(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Closing Balance:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={closingBalance}
                        // onChange={e => setClosingBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Diff Amount:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={diffAmount}
                        onChange={e => setDiffAmount(Number(e.target.value))}
                        placeholder="Enter diff amount"
                    />
                </div>
                <div>
                    <b>Remark:</b>
                    <Input
                        style={{ width: 220, marginLeft: 8 }}
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                        placeholder="Enter remark"
                    />
                </div>
                <div><Button type="primary" onClick={handleSave}>Save DiffAmount And Remark</Button></div>
            </div>

        </>
    );
};

export default DailyTotalCashDetails;