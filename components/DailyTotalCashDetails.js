import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, Select, Divider, Space } from 'antd';

const { Title } = Typography;

const tableColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Heading', dataIndex: 'heading', key: 'heading' },
    { title: 'Sub Heading', dataIndex: 'subHeading', key: 'subHeading' },
    { title: 'Particulars/Remarks', dataIndex: 'remarks', key: 'remarks' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

const staticIncoming = [{
    key: '1',
    date: '2025-07-17',
    heading: 'Cash Received',
    subHeading: 'Sales',
    remarks: 'Opening Balance',
    type: 'Cash',
    amount: 10000,
}];

const staticExpense = [{
    key: '1',
    date: '2025-07-17',
    heading: 'Cash Paid',
    subHeading: 'Purchase',
    remarks: 'Opening Expense',
    type: 'Cash',
    amount: 5000,
}];

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

const DailyTotalCashDetails = () => {
    const [incomingData, setIncomingData] = useState(staticIncoming);
    const [expenseData, setExpenseData] = useState(staticExpense);

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

    const [openingBalance, setOpeningBalance] = useState(10000); // You can set initial value as needed
    const [closingBalance, setClosingBalance] = useState(5000);  // You can set initial value as needed
    const [remark, setRemark] = useState('');
    const diffAmount = closingBalance - openingBalance;

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
                    heading: values.heading,
                    subHeading: values.subHeading,
                    remarks: values.remarks,
                    type: values.type,
                    amount: values.amount,
                }
            ]);
            form.resetFields();
            setIncomingModalOpen(false);
        });
    };

    const handleExpenseSubmit = () => {
        form2.validateFields().then(values => {
            setExpenseData([
                ...expenseData,
                {
                    key: Date.now(),
                    date: values.date.format('YYYY-MM-DD'),
                    heading: values.heading,
                    subHeading: values.subHeading,
                    remarks: values.remarks,
                    type: values.type,
                    amount: values.amount,
                }
            ]);
            form2.resetFields();
            setExpenseModalOpen(false);
        });
    };

    return (
        <>
       
        <div style={{ display: 'flex', gap: 32, padding: 24, height: '100%' }}>
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
                        onChange={e => setOpeningBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Closing Balance:</b>
                    <Input
                        style={{ width: 120, marginLeft: 8 }}
                        type="number"
                        value={closingBalance}
                        onChange={e => setClosingBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <b>Diff Amount:</b>
                    <span style={{ marginLeft: 8 }}>{diffAmount}</span>
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
            </div>

         </>
    );
};

export default DailyTotalCashDetails;