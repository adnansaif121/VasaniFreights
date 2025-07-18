import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Divider } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
const { Meta } = Card;
const ViewPartyDetails = ({ indexAtAllData, allDataAtDisplay, setDisplayDataSource, data, bankData, vehicleData, handleDisplayTableChange, setDataUpdateFlag }) => {
    const [newBank, setNewBank] = useState('');
    const [form] = Form.useForm();
    const [furtherPaymentTotal, setFurtherPaymentTotal] = useState(0);
    const [firstPaymentTotal, setFirstPaymentTotal] = useState(0);
    const [extraAmount, setExtraAmount] = useState(0);
    const [extraAmtRemark, setExtraAmtRemark] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    // const [bankData, setBankData] = useState([..._bankData]);

    const [amountReceived, setAmountReceived] = useState((data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].pohchAmount || 0) +
        parseInt(data.firstPayment[0].cashAmount || 0) +
        parseInt(data.firstPayment[0].chequeAmount || 0) +
        parseInt(data.firstPayment[0].onlineAmount || 0)));
    const [form4] = Form.useForm();

    useEffect(() => {
        console.log('data', data);
        console.log(indexAtAllData, allDataAtDisplay);
        let index = parseInt(data.key[data.key.length - 1]);
        if (data.tripDetails[index].furtherPayments !== undefined && data.tripDetails[index].furtherPayments !== null && data.tripDetails[index].furtherPayments.FurtherPayments !== undefined) {
            let furtherPayments = data.tripDetails[index].furtherPayments;
            form4.setFieldsValue(furtherPayments);
        }

        if (data.firstPayment !== undefined) {
            let total = (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].cashAmount || 0)) +
                (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].onlineAmount || 0)) +
                (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].chequeAmount || 0));
            setFirstPaymentTotal(total);
        }

        if (data.tripDetails[index].furtherPayments !== undefined && data.tripDetails[index].furtherPayments !== null && data.tripDetails[index].furtherPayments.FurtherPayments !== undefined) {
            updateTotal();
        }

        if (data.tripDetails[index].extraAmount !== undefined) setExtraAmount(data.tripDetails[index].extraAmount);
        if (data.tripDetails[index].extraAmtRemark !== undefined) setExtraAmtRemark(data.tripDetails[index].extraAmtRemark)
        if (data.tripDetails[index].transactionStatus !== undefined) setTransactionStatus(data.tripDetails[index].transactionStatus);
        else setTransactionStatus('open');
    }, []);

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleSave = () => {
        const db = getDatabase();
        // let id = guidGenerator();
        let index = parseInt(data.key[data.key.length - 1]);
        console.log(data.key, index);
        let data_key = data.key.slice(0, -1);
        console.log(form4.getFieldsValue(['FurtherPayments']));
        let obj_to_save = data.tripDetails[index];
        obj_to_save.furtherPayments = form4.getFieldsValue(['FurtherPayments']).FurtherPayments === undefined ? null : form4.getFieldsValue(['FurtherPayments']) || null;
        obj_to_save.firstPaymentTotal = firstPaymentTotal;
        obj_to_save.furtherPaymentTotal = furtherPaymentTotal;
        obj_to_save.extraAmount = extraAmount;
        obj_to_save.extraAmtRemark = extraAmtRemark;
        obj_to_save.transactionStatus = (transactionStatus !== null ? transactionStatus : 'open');
        obj_to_save.remainingBalance = data.tripDetails[index].totalFreight - firstPaymentTotal - (furtherPaymentTotal || 0) - extraAmount;
        // let dataToSave = data;
        // data.furtherPayments = form4.getFieldsValue(['FurtherPayments'])
        console.log(obj_to_save);
        set(ref(db, 'dailyEntry/' + data_key + '/tripDetails/' + index + '/'), {
            ...obj_to_save
        }).then(() => {
            console.log('Data saved');
            alert('Data Saved Successfully');
            let dataList = allDataAtDisplay;
            dataList[indexAtAllData].tripDetails[index] = { ...obj_to_save };
            console.log(dataList);
            // setDisplayDataSource([...dataList]);
            handleDisplayTableChange(dataList)
            let num = Math.floor(Math.random() * 100 + 1);
            // setDataUpdateFlag(num);
        }).catch((error) => {
            console.error('Error:', error, obj_to_save);
        });
    }

    const addNewBank = (e) => {
        e.preventDefault();
        if (newBank.trim() === '') {
            alert('Please enter bank name to add bank in the list. Field is empty');
            return;
        }
        let key = bankData.length;
        // setBankData([...bankData, { value: newBank, label: newBank, key: key }]);

        bankData = [...bankData, { value: newBank, label: newBank, key: key }];
        const db = getDatabase();
        const bankRef = ref(db, 'bankData/data/' + key);
        // const newBankRef = push(bankRef);
        set(bankRef, {
            bankName: newBank,
            key: key,
        })

        setNewBank('');
    }

    const updateTotal = () => {
        let f_payment = form4.getFieldsValue(['FurtherPayments'])
        let total = 0;
        for (let i = 0; i < f_payment.FurtherPayments.length; i++) {
            total += parseInt(f_payment.FurtherPayments[i].amount);
        }
        setFurtherPaymentTotal(total);
        // console.log(f_payment);
    }

    const radioStyle = {
        '.ant-radio-button-wrapper-checked[value="open"]': {
            backgroundColor: '#52c41a !important',
            borderColor: '#52c41a !important',
            color: 'white !important'
        },
        '.ant-radio-button-wrapper-checked[value="close"]': {
            backgroundColor: '#ff4d4f !important',
            borderColor: '#ff4d4f !important',
            color: 'white !important'
        }
    };

    return (
        <>
            <div>
                <Row>
                    <Col>
                        <Card title="Payment Details" style={{ margin: '5px', width: '500px' }}>

                            <table style={{ border: '1px solid black', padding: '5px', borderRadius: '10px', width: '100%' }}>
                                <thead>
                                    <tr style={{ border: '1px solid black' }}>
                                        <th style={{ border: '1px solid black' }}>Type</th>
                                        <th style={{ border: '1px solid black' }}>Amount</th>
                                        <th style={{ border: '1px solid black' }}>Bank/Courier Date</th>
                                        <th style={{ border: '1px solid black' }}>Bank</th>
                                        <th style={{ border: '1px solid black' }}>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ border: '1px solid black' }}>
                                        <td ><h3>Pohch</h3></td>
                                        <td >
                                            <Form.Item >
                                                <Input value={(data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].pohchAmount))} placeholder='amount' type='number' />
                                            </Form.Item>
                                        </td >
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? 0 : data.firstPayment[0].pohchDate} placeholder='date' type='date' />
                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? 'NA' : data.firstPayment[0].pohchSendTo || ''}></Input>

                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item>
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].pohchRemarks} placeholder='remarks' />
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr style={{ border: '1px solid black' }}>
                                        <td ><h3>Cash</h3></td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].cashAmount || 0)} placeholder='amount' type='number' />
                                            </Form.Item>
                                        </td >
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].cashDate} placeholder='date' type='date' />
                                            </Form.Item>
                                        </td>
                                        <td >
                                        </td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].cashRemarks} placeholder='remarks' />
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr style={{ border: '1px solid black' }}>
                                        <td ><h3>Online</h3></td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : parseInt(data.firstPayment[0].onlineAmount || 0)} placeholder='amount' type='number' />
                                            </Form.Item>
                                        </td >
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].onlineDate} placeholder='date' type='date' />
                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item >
                                                <Select
                                                    showSearch
                                                    placeholder="Bank"
                                                    optionFilterProp="children"
                                                    // onChange={onChange}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={bankData}
                                                    defaultValue={data.firstPayment === undefined ? null : data.firstPayment[0].onlineBank}
                                                    dropdownRender={(menu) => (
                                                        <>
                                                            {menu}
                                                            <Divider
                                                                style={{
                                                                    margin: '8px 0',
                                                                }}
                                                            />
                                                            <Space
                                                                style={{
                                                                    padding: '0 8px 4px',
                                                                }}
                                                            >
                                                                <Input
                                                                    placeholder="Please enter item"
                                                                    value={newBank}
                                                                    onChange={(e) => setNewBank(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewBank(e)}>

                                                                </Button>
                                                            </Space>
                                                        </>
                                                    )}
                                                />
                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].onlineRemarks} placeholder='remarks' />
                                            </Form.Item>
                                        </td>
                                    </tr>
                                    <tr style={{ border: '1px solid black' }}>
                                        <td ><h3>Cheque</h3></td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : parseInt(data.firstPayment[0].chequeAmount || 0)} placeholder='amount' type='number' />
                                            </Form.Item>
                                        </td >
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].chequeDate} placeholder='date' type='date' />
                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item>
                                                <Select
                                                    showSearch
                                                    placeholder="Bank"
                                                    optionFilterProp="children"
                                                    // onChange={onChange}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={bankData}
                                                    defaultValue={data.firstPayment === undefined ? null : data.firstPayment[0].chequeBank}
                                                    dropdownRender={(menu) => (
                                                        <>
                                                            {menu}
                                                            <Divider
                                                                style={{
                                                                    margin: '8px 0',
                                                                }}
                                                            />
                                                            <Space
                                                                style={{
                                                                    padding: '0 8px 4px',
                                                                }}
                                                            >
                                                                <Input
                                                                    placeholder="Please enter item"
                                                                    value={newBank}
                                                                    onChange={(e) => setNewBank(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewBank(e)}>

                                                                </Button>
                                                            </Space>
                                                        </>
                                                    )}
                                                />
                                            </Form.Item>
                                        </td>
                                        <td >
                                            <Form.Item >
                                                <Input value={data.firstPayment === undefined ? null : data.firstPayment[0].chequeRemarks} placeholder='remarks' />
                                            </Form.Item>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div>
                                <h3>Total : {firstPaymentTotal}</h3>
                            </div>
                            {/* <Meta title="Total" description= /> */}
                        </Card>
                    </Col>

                    <Col>
                        <Card title="Remaining Balance" style={{ margin: '5px', width: '500px' }}>
                            <Form
                                layout="vertical"
                                initialValues={{
                                    totalFreight: data.tripDetails ? data.tripDetails[parseInt(data.key[data.key.length - 1])]?.totalFreight : 0,
                                    firstPay: firstPaymentTotal || 0,
                                    furtherPayment: furtherPaymentTotal || 0,
                                    commission: 0,
                                    ghataWajan: 0,
                                    tds: 0,
                                    khotiKharabi: 0,
                                    remainingBalance: 0,
                                }}
                                onValuesChange={(_, allValues) => {
                                    // Calculate Remaining Balance on any change
                                    const {
                                        totalFreight = 0,
                                        firstPay = 0,
                                        furtherPayment = 0,
                                        commission = 0,
                                        ghataWajan = 0,
                                        tds = 0,
                                        khotiKharabi = 0,
                                    } = allValues;
                                    const remaining =
                                        Number(totalFreight) -
                                        Number(firstPay) -
                                        Number(furtherPayment) -
                                        Number(commission) -
                                        Number(ghataWajan) -
                                        Number(tds) -
                                        Number(khotiKharabi);
                                    form.setFieldsValue({ remainingBalance: remaining });
                                }}
                                form={form}
                            >
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td><label>Total Freight</label></td>
                                            <td>
                                                <Form.Item name="totalFreight" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>First Pay</label></td>
                                            <td>
                                                <Form.Item name="firstPay" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Further Payment</label></td>
                                            <td>
                                                <Form.Item name="furtherPayment" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Commission</label></td>
                                            <td>
                                                <Form.Item name="commission" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Ghata Wajan</label></td>
                                            <td>
                                                <Form.Item name="ghataWajan" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>TDS</label></td>
                                            <td>
                                                <Form.Item name="tds" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Khoti Kharabi</label></td>
                                            <td>
                                                <Form.Item name="khotiKharabi" style={{ marginBottom: 0 }}>
                                                    <Input type="number" />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Remaining Balance</label></td>
                                            <td>
                                                <Form.Item name="remainingBalance" style={{ marginBottom: 0 }}>
                                                    <Input type="number" readOnly style={{ background: '#f5f5f5' }} />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                <Card title="Add Further Payment Details" style={{ margin: '20px' }} >

                    <Form
                        name=' Further Payment Details'
                        form={form4}
                    >
                        <Form.List name="FurtherPayments" >
                            {(fields, { add, remove }) => (
                                <table style={{ border: '1px solid black', padding: '5px' }}>
                                    <tbody>
                                        <tr style={{ border: '1px solid black' }}>
                                            <th style={{ border: '1px solid black' }}>Amount</th>
                                            <th style={{ border: '1px solid black' }}>Mode of Payment</th>
                                            <th style={{ border: '1px solid black' }}>Bank</th>
                                            <th style={{ border: '1px solid black' }}>Date</th>
                                            <th style={{ border: '1px solid black' }}>Remarks</th>
                                            <th style={{ border: '1px solid black' }}>Remove</th>
                                        </tr>

                                        {fields.map(({ key, name, ...restField }) => (

                                            <tr key={key}>
                                                <td>
                                                    <Form.Item name={[name, 'amount']} >
                                                        <Input placeholder='Amount' type='number' onChange={updateTotal} ></Input>
                                                    </Form.Item>
                                                </td>
                                                <td>
                                                    <Form.Item name={[name, 'modeOfPayment']} >
                                                        <Select
                                                            showSearch
                                                            placeholder="Mode"
                                                            optionFilterProp="children"
                                                            // onChange={onChange}
                                                            // onSearch={onSearch}
                                                            filterOption={filterOption}
                                                            options={[
                                                                {
                                                                    value: 'Cash',
                                                                    label: 'Cash',
                                                                },
                                                                {
                                                                    value: 'Online',
                                                                    label: 'Online',
                                                                },
                                                                {
                                                                    value: 'Cheque',
                                                                    label: 'Cheque',
                                                                },
                                                            ]}
                                                        />

                                                    </Form.Item>
                                                </td>
                                                <td>
                                                    <Form.Item name={[name, 'bank']}>
                                                        <Select
                                                            showSearch
                                                            placeholder="Bank"
                                                            optionFilterProp="children"
                                                            // onChange={onChange}
                                                            // onSearch={onSearch}
                                                            filterOption={filterOption}
                                                            options={bankData}
                                                            dropdownRender={(menu) => (
                                                                <>
                                                                    {menu}
                                                                    <Divider
                                                                        style={{
                                                                            margin: '8px 0',
                                                                        }}
                                                                    />
                                                                    <Space
                                                                        style={{
                                                                            padding: '0 8px 4px',
                                                                        }}
                                                                    >
                                                                        <Input
                                                                            placeholder="Please enter item"
                                                                            value={newBank}
                                                                            onChange={(e) => setNewBank(e.target.value)}
                                                                            onKeyDown={(e) => e.stopPropagation()}
                                                                        />
                                                                        <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewBank(e)}>

                                                                        </Button>
                                                                    </Space>
                                                                </>
                                                            )}
                                                        />
                                                    </Form.Item>
                                                </td>
                                                <td>
                                                    <Form.Item name={[name, 'date']}>
                                                        <Input type='date'></Input>
                                                    </Form.Item>
                                                </td>
                                                <td>
                                                    <Form.Item name={[name, 'remarks']} >
                                                        <Input placeholder='remarks'></Input>
                                                    </Form.Item>
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => {
                                                            let confirmDelete = confirm("Are you sure to delete this Payment Entry?");
                                                            if (confirmDelete) {
                                                                let furtherPayments = form4.getFieldsValue(['FurtherPayments']);
                                                                let amt = furtherPayments.FurtherPayments[name].amount
                                                                setFurtherPaymentTotal(furtherPaymentTotal - amt);
                                                                remove(name)
                                                            }

                                                        }}
                                                    />
                                                </td>
                                            </tr>

                                        ))}

                                        <tr>
                                            <td>
                                                <Form.Item style={{ margin: 'auto' }}>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add new
                                                    </Button>
                                                </Form.Item>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>

                            )}
                        </Form.List>

                    </Form>
                    <div>
                        <h3>Total : {furtherPaymentTotal}</h3>
                    </div>
                </Card>

                <Card title='Remaining Balance' style={{ margin: '20px' }}>

                    <table style={{ border: '1px solid black', padding: '10px' }}>
                        <tbody>
                            <tr>
                                <th style={{ border: '1px solid black' }}>Total Freight</th>
                                <th style={{ border: '1px solid black' }}>First Payment Total</th>
                                <th style={{ border: '1px solid black' }}>Further Payment Total</th>
                                <th style={{ border: '1px solid black' }}>Extra Amount</th>

                            </tr>

                            <tr>
                                <td>
                                    <span>{data.tripDetails !== undefined ? data.tripDetails[parseInt(data.key[data.key.length - 1])].totalFreight : 0}</span>
                                </td>
                                <td>
                                    <span>{firstPaymentTotal || 0}</span>
                                </td>
                                <td>
                                    <span>{furtherPaymentTotal || 0}</span>
                                </td>
                                <td>
                                    <Input type='number' value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)}></Input>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                   

                    <div style={{ border: '1px black dotted', marginTop: '20px', padding: '20px', fontSize: '20px' }}>
                        Remaining : {data.tripDetails[parseInt(data.key[data.key.length - 1])].totalFreight - firstPaymentTotal - (furtherPaymentTotal || 0) - extraAmount}
                    </div>
                </Card>

                <Card title="Transaction Status" style={{ margin: '20px' }}>
                    <Row>
                        <Col span={5}>
                            <Radio.Group className="transaction-radio-group" value={transactionStatus} defaultValue="open" buttonStyle="solid" onChange={(e) => setTransactionStatus(e.target.value)}  style={radioStyle}>
                                <Radio.Button value="open" style={ transactionStatus === 'open' ? {backgroundColor: 'red'} : {backgroundColor: 'white'}}>Open</Radio.Button>
                                <Radio.Button value="close" style={ transactionStatus === 'close' ? {backgroundColor: 'green'} : {backgroundColor: 'white'}}>Close</Radio.Button>
                            </Radio.Group>
                        </Col>

                        <Col span={5}>
                            <Form layout="inline">
                                <Form.Item label="Remark">
                                    <Input placeholder='remark' value={extraAmtRemark} onChange={(e) => setExtraAmtRemark(e.target.value)}></Input>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                </Card>

                <Button style={{ marginTop: '5px' }} type='primary' onClick={handleSave}>Save</Button>

                {/* <div>
                    <h4>Transaction Status: </h4>
                </div> */}
            </div>


        </>
    );
};

export default ViewPartyDetails;

