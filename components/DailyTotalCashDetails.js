import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, Select, Divider, Space, Row, Col } from 'antd';
import { getDatabase, ref, set, onValue, get, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt, update } from "firebase/database";
import useDisableNumberInputScroll from './hooks/useDisableNumberInputScroll';
const { Title } = Typography;

const tableColumns = [
    { title: 'Sr.no', dataIndex: 'srNo', key: 'srNo', render: (_, __, index) => index + 1 },
    {
        title: 'Date', dataIndex: 'date', key: 'date',
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
    { title: 'Truck No', dataIndex: 'truckNo', key: 'truckNo' },
    { title: 'Nature', dataIndex: 'nature', key: 'nature' },
    { title: 'Heading', dataIndex: 'heading', key: 'heading' },
    { title: 'Sub Heading', dataIndex: 'subHeading', key: 'subHeading' },
    { title: 'Particulars/Remarks', dataIndex: 'remarks', key: 'remarks' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

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

const DailyTotalCashDetails = ({ dailyEntryData, dailyTruckCashIncome, dailyTruckCashExpense, dataSource, fetchEntries, yesterdayData, vehicleData }) => {
    const [incomingData, setIncomingData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);

    const [incomingModalOpen, setIncomingModalOpen] = useState(false);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [form2] = Form.useForm();
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
    const [items, setItems] = useState({});
    const [loading, setLoading] = useState(false);
    const [newNature, setNewNature] = useState('');
    const [newPayMedium, setNewPayMedium] = useState('');

    useDisableNumberInputScroll();
    useEffect(() => {
        // console.log('dailyTruckCashIncome : ', dailyTruckCashIncome);
        // console.log('dailyTruckCashExpense : ', dailyTruckCashExpense);
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
                // Add key property to each entry
                let incomeEntries = Array.isArray(data.income)
                    ? data.income.map((entry, idx) => ({
                        ...entry,
                        key: entry.key || `${entry.date || today}-${entry.heading || ''}-${idx}`
                    }))
                    : [];
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

                let expenseEntries = Array.isArray(data.expense)
                    ? data.expense.map((entry, idx) => ({
                        ...entry,
                        key: entry.key || `${entry.date || today}-${entry.heading || ''}-${idx}`
                    }))
                    : [];
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

                console.log(incomeEntries, expenseEntries);
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

    }, [dataSource, dailyTruckCashIncome, dailyTruckCashExpense]);

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, []);

    // Fetch all lists from Firebase Realtime Database
    const fetchItems = async () => {
        setLoading(true);
        const db = getDatabase();
        const newItems = {};

        await new Promise(resolve => {
            onValue(ref(db, 'headings/'), (snapshot) => {
                const data = snapshot.val();
                let arr = [];
                if (Array.isArray(data)) {
                    arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
                }
                newItems['heading'] = arr;
                resolve();
            }, { onlyOnce: true });
        })

        await new Promise(resolve => {
            onValue(ref(db, 'subheadings/'), (snapshot) => {
                const data = snapshot.val();
                let arr = [];
                if (Array.isArray(data)) {
                    arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
                }
                newItems['subheading'] = arr;
                resolve();
            }
                , { onlyOnce: true });
        }
        )

        await new Promise(resolve => {
            onValue(ref(db, 'payMedium/'), (snapshot) => {
                const data = snapshot.val();
                let arr = [];
                if (Array.isArray(data)) {
                    arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
                }
                newItems['payMedium'] = arr;
                resolve();
            }, { onlyOnce: true });
        }
        )

        await new Promise(resolve => {
            onValue(ref(db, 'nature/'), (snapshot) => {
                const data = snapshot.val();
                let arr = [];
                if (Array.isArray(data)) {
                    arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
                }
                newItems['nature'] = arr;
                resolve();
            }
                , { onlyOnce: true });
        }
        )
        console.log('Fetched Items: ', newItems);
        setItems(newItems);
        setLoading(false);
    };

    const addNewPayMedium = async () => {
        // Check for duplicates before adding
        if (newPayMedium && items.payMedium && items.payMedium.some(opt => opt.value === newPayMedium)) {
            alert('Pay Medium already exists');
            return;
        }
        if (newPayMedium && items.payMedium && !items.payMedium.some(opt => opt.value === newPayMedium)) {
            const db = getDatabase();
            const refPath = 'payMedium';
            const newItem = { value: newPayMedium, label: newPayMedium };
            let arr = items['payMedium'] ? [...items['payMedium']] : [];
            arr.push(newItem);
            await set(ref(db, refPath), arr).then(() => {
                alert('New pay medium added successfully');
                setItems(prev => ({
                    ...prev,
                    payMedium: arr
                }));
                setNewPayMedium('');
            });
        }
    };

    const addNewNature = async () => {
        // Check for duplicates before adding
        if (newNature && items.nature && items.nature.some(opt => opt.value === newNature)) {
            alert('Nature already exists');
            return;
        }
        if (newNature && items.nature && !items.nature.some(opt => opt.value === newNature)) {
            const db = getDatabase();
            const refPath = 'nature';
            const newItem = { value: newNature, label: newNature };
            let arr = items['nature'] ? [...items['nature']] : [];
            arr.push(newItem);
            await set(ref(db, refPath), arr).then(() => {
                alert('New nature added successfully');
                setItems(prev => ({
                    ...prev,
                    nature: arr
                }));
                setNewNature('');
            });
        }
    };

    // Add new option handlers
    const addNewHeading = async () => {
        // Check for duplicates before adding
        if (newHeading && items.heading && items.heading.some(opt => opt.value === newHeading)) {
            alert('Heading already exists');
            return;
        }
        if (newHeading && items.heading && !items.heading.some(opt => opt.value === newHeading)) {
            const db = getDatabase();
            const refPath = 'headings';
            const newItem = { value: newHeading, label: newHeading };
            let arr = items['heading'] ? [...items['heading']] : [];
            arr.push(newItem);
            await set(ref(db, refPath), arr).then(() => {
                alert('New heading added successfully');
                setItems(prev => ({
                    ...prev,
                    heading: arr
                }));
                setNewHeading('');
            });
        }
    };
    const addNewSubHeading = async () => {
        // Check for duplicates before adding
        if (newSubHeading && items.subheading && items.subheading.some(opt => opt.value === newSubHeading)) {
            alert('Sub-heading already exists');
            return;
        }
        if (newSubHeading && items.subheading && !items.subheading.some(opt => opt.value === newSubHeading)) {
            const db = getDatabase();
            const refPath = 'subheadings';
            const newItem = { value: newSubHeading, label: newSubHeading };
            let arr = items['subheading'] ? [...items['subheading']] : [];
            arr.push(newItem);
            await set(ref(db, refPath), arr).then(() => {
                alert('New sub-heading added successfully');
                setItems(prev => ({
                    ...prev,
                    subheading: arr
                }));
                setNewSubHeading('');
            });
        }
    };

    const handleIncomingSubmit = () => {
        form.validateFields().then(values => {
            setIncomingData([
                ...incomingData,
                {
                    key: Date.now(),
                    date: values.date.format('YYYY-MM-DD'),
                    truckNo: values.truckNo,
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
            const todaysDate = new Date().toISOString().split('T')[0];
            const cashRef = ref(db, 'cash/' + todaysDate + '/income/' + index + '/');
            set(cashRef, {
                date: values.date.format('YYYY-MM-DD'),
                truckNo: values.truckNo,
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

            const updateRef = ref(db, 'cash/' + todaysDate + '/');
            update(updateRef, {
                dailyChange: totalIncome - totalExpense,
                closingBalance: closingBalance + parseFloat(values.amount),
            })

            if (values.type === 'Cash') {
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
                    truckNo: values.truckNo,
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
            const todaysDate = new Date().toISOString().split('T')[0];
            const cashRef = ref(db, 'cash/' + todaysDate + '/expense/' + index + '/');
            set(cashRef, {
                date: values.date.format('YYYY-MM-DD'),
                truckNo: values.truckNo,
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

            const updateRef = ref(db, 'cash/' + todaysDate + '/');
            update(updateRef, {
                dailyChange: totalIncome - totalExpense,
                closingBalance: closingBalance + parseFloat(values.amount),
            })

            if (values.type === 'Cash') {
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

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 32,
                    padding: '10px 0',
                    background: '#fafafa',
                    borderTop: '1px solid #eee',
                    fontSize: 13,
                    width: '100%',
                }}
            >
                <div>
                    <b>Opening Balance:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={openingBalance}
                        onWheel={e => e.target.blur()}
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
                        onWheel={e => e.target.blur()}
                    // onChange={e => setDailyChange(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Closing Balance:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={closingBalance}
                        onWheel={e => e.target.blur()}
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
                        onWheel={e => e.target.blur()}
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
                        // rowKey={record => record.key}
                        rowKey={'key'}
                    />
                    <Modal
                        title="Add Incoming Entry"
                        open={incomingModalOpen}
                        onCancel={() => setIncomingModalOpen(false)}
                        onOk={handleIncomingSubmit}
                        okText="Submit"
                        width={'80%'}
                    >
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                                        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Select Nature"
                                            options={items.nature ? items.nature.map(n => ({ value: n.value, label: n.label })) : []}
                                            dropdownRender={menu => (
                                                <>
                                                    {menu}
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Space style={{ padding: '0 8px 4px' }}>
                                                        <Input
                                                            placeholder="Add new nature"
                                                            value={newNature}
                                                            onChange={e => setNewNature(e.target.value)}
                                                            onKeyDown={e => e.stopPropagation()}
                                                        />
                                                        <Button type="text" onClick={addNewNature}>
                                                            Add
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item name="truckNo" label="Truck No">
                                        <Select
                                            showSearch
                                            placeholder="Vehicle No."
                                            optionFilterProp="children"
                                            allowClear
                                            // onChange={(value) => setVehicleNo(value)}
                                            // onSearch={onSearch}
                                            filterOption={filterOption}
                                            options={vehicleData}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item name="type" label="Pay Medium" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Pay Medium"
                                            options={items.payMedium ? items.payMedium.map(pm => ({ value: pm.value, label: pm.label })) : []}
                                            dropdownRender={menu => (
                                                <>
                                                    {menu}
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Space style={{ padding: '0 8px 4px' }}>
                                                        <Input
                                                            placeholder="Add new pay medium"
                                                            value={newPayMedium}
                                                            onChange={e => setNewPayMedium(e.target.value)}
                                                            onKeyDown={e => e.stopPropagation()}
                                                        />
                                                        <Button type="text" onClick={addNewPayMedium}>
                                                            Add
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>


                            </Row>

                            <Row gutter={16}>

                                <Col span={8}>
                                    <Form.Item name="heading" label="Heading" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Heading"
                                            options={items.heading ? items.heading.map(h => ({ value: h.value, label: h.label })) : []}
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
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="subHeading" label="Sub Heading" rules={[{ required: false }]}>
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder="Select Sub Heading"
                                            options={items.subheading ? items.subheading.map(sh => ({ value: sh.value, label: sh.label })) : []}
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
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]} >
                                        <Input type="number" onWheel={e => e.target.blur()} />
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Form.Item name="remarks" label="Remarks" rules={[{ required: false }]}>
                                <Input.TextArea />
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
                        // rowKey={record => record.key}
                        rowKey={'key'}
                    />
                    <Modal
                        title="Add Expense Entry"
                        open={expenseModalOpen}
                        onCancel={() => setExpenseModalOpen(false)}
                        onOk={handleExpenseSubmit}
                        okText="Submit"
                        width={'80%'}
                    >
                        <Form form={form2} layout="vertical">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                                        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Nature"
                                            options={items.nature ? items.nature.map(n => ({ value: n.value, label: n.label })) : []}
                                            dropdownRender={menu => (
                                                <>
                                                    {menu}
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Space style={{ padding: '0 8px 4px' }}>
                                                        <Input
                                                            placeholder="Add new nature"
                                                            value={newNature}
                                                            onChange={e => setNewNature(e.target.value)}
                                                            onKeyDown={e => e.stopPropagation()}
                                                        />
                                                        <Button type="text" onClick={addNewNature}>
                                                            Add
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>

                                 <Col span={6}>
                                    <Form.Item name="truckNo" label="Truck No">
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder="Vehicle No."
                                            optionFilterProp="children"
                                            // onChange={(value) => setVehicleNo(value)}
                                            // onSearch={onSearch}
                                            filterOption={filterOption}
                                            options={vehicleData}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}

                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>

                                 <Col span={6}>
                                    <Form.Item name="type" label="Pay Medium" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Pay Medium"
                                            options={items.payMedium ? items.payMedium.map(pm => ({ value: pm.value, label: pm.label })) : []}
                                            dropdownRender={menu => (
                                                <>
                                                    {menu}
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Space style={{ padding: '0 8px 4px' }}>
                                                        <Input
                                                            placeholder="Add new pay medium"
                                                            value={newPayMedium}
                                                            onChange={e => setNewPayMedium(e.target.value)}
                                                            onKeyDown={e => e.stopPropagation()}
                                                        />
                                                        <Button type="text" onClick={addNewPayMedium}>
                                                            Add
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>

                                
                            </Row>

                            <Row gutter={16}>
                               <Col span={8}>
                                    <Form.Item name="heading" label="Heading" rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Heading"
                                            options={items.heading ? items.heading.map(h => ({ value: h.value, label: h.label })) : []}
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
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="subHeading" label="Sub Heading" rules={[{ required: false }]}>
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Select Sub Heading"
                                            options={items.subheading ? items.subheading.map(sh => ({ value: sh.value, label: sh.label })) : []}
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
                                </Col>

                                 <Col span={8}>
                                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]} >
                                        <Input type="number" onWheel={e => e.target.blur()} />
                                    </Form.Item>
                                </Col>
                               

                               
                            </Row>

                             <Form.Item name="remarks" label="Remarks" rules={[{ required: false }]}>
                                        <Input.TextArea />
                                    </Form.Item>
                            

                        </Form>
                    </Modal>
                </div>
            </div>


        </>
    );
};

export default DailyTotalCashDetails;