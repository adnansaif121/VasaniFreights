import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Divider } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
const { Meta } = Card;
const ViewPartyDetails = ({ data, bankData, vehicleData }) => {
    const [newBank, setNewBank] = useState('');

    const [furtherPaymentTotal, setFurtherPaymentTotal] = useState(0);
    const [firstPaymentTotal, setFirstPaymentTotal] = useState(0);
    const [extraAmount, setExtraAmount] = useState(0);
    const [extraAmtRemark, setExtraAmtRemark] = useState(null);
    // const [bankData, setBankData] = useState([]);

    const [amountReceived, setAmountReceived] = useState((data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].pohchAmount || 0) +
        parseInt(data.firstPayment[0].cashAmount || 0) +
        parseInt(data.firstPayment[0].chequeAmount || 0) +
        parseInt(data.firstPayment[0].onlineAmount || 0)));
    const [form4] = Form.useForm();

    useEffect(() => {
        console.log('data', data);

        if (data.furtherPayments.FurtherPayments !== undefined) {
            let furtherPayments = data.furtherPayments;
            form4.setFieldsValue(furtherPayments);
        }

        if (data.firstPayment !== undefined) {
            let total = (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].cashAmount || 0)) +
                (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].onlineAmount || 0)) +
                (data.firstPayment === undefined ? 0 : parseInt(data.firstPayment[0].chequeAmount || 0));
            setFirstPaymentTotal(total);
        }

        if (data.furtherPayments.FurtherPayments !== undefined) {
            updateTotal();
        }

        if (data.extraAmount !== undefined) setExtraAmount(data.extraAmount);
        if (data.extraAmtRemark !== undefined) setExtraAmtRemark(data.extraAmtRemark)
    }, []);

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleSave = () => {
        const db = getDatabase();
        // let id = guidGenerator();
        set(ref(db, 'dailyEntry/' + data.key), {
            date: data.date || '',
            vehicleNo: data.vehicleNo || '',
            mt: data.mt,
            vehicleStatus: data.vehicleStatus || '',
            // payStatus: payStatus || '',
            dieselAndKmDetails: data.dieselAndKmDetails || '',
            tripDetails: data.tripDetails || '',
            driversDetails: data.driversDetails || '',
            kaataParchi: data.kaataParchi || '',
            firstPayment: data.firstPayment || '',
            furtherPayments: form4.getFieldsValue(['FurtherPayments']),

            firstPaymentTotal: firstPaymentTotal,
            furtherPaymentTotal: furtherPaymentTotal,
            extraAmount: extraAmount,
            extraAmtRemark: extraAmtRemark
            // FIELDS DATA
            // tripDetailsFields: form.getFieldsValue(['tripDetails']),
            // driversDetailsFields: form1.getFieldsValue(['DriversDetails']),
            // kaataParchiFields: form2.getFieldsValue(['kaataParchi']),
            // firstPaymentFields: form3.getFieldsValue(['paymentDetails'])
        }).then(() => {
            console.log('Data saved');
            alert('Data Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const addNewBank = (e) => {
        e.preventDefault();
        let key = bankData.length;
        setBankData([...bankData, { value: newBank, label: newBank, key: key }]);
        setNewBank('');

        const db = getDatabase();
        const bankRef = ref(db, 'bankData/data/' + key);
        // const newBankRef = push(bankRef);
        set(bankRef, {
            value: newBank,
            label: newBank,
            key: key,
        })
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
    return (
        <>
            <div>
                {/* <div className={styles.summary} style={{display:'flex', justifyContent: 'center'}}>
                    <Row justify={'space-between'}>
                        <Col>
                            <h3>Amount Received Till Date :
                                <span style={{color: 'green'}}>{amountReceived}</span>
                            </h3>
                        </Col>
                    </Row>

                </div> */}


                <Card title="Payment Details" style={{margin: '20px'}}>

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
                                        {/* <Select
                                                                                showSearch
                                                                                placeholder="Pohch Send To"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={[
                                                                                    // ...partyList[name],
                                                                                    { label: 'UV Logistics', value: 'UvLogs' },
                                                                                    { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                                                                ]}
                                                                            /> */}
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

                <Card title="Add Further Payment Details" style={{margin: '20px'}} >

                    <Form
                        name=' Further Payment Details'
                        form={form4}
                    >
                        <Form.List name="FurtherPayments" >
                            {(fields, { add, remove }) => (
                                <table style={{ border: '1px solid black', padding: '5px' }}>
                                    <tr style={{ border: '1px solid black' }}>
                                        <th style={{ border: '1px solid black' }}>Amount</th>
                                        <th style={{ border: '1px solid black' }}>Mode of Payment</th>
                                        <th style={{ border: '1px solid black' }}>Bank</th>
                                        <th style={{ border: '1px solid black' }}>Date</th>
                                        <th style={{ border: '1px solid black' }}>Remarks</th>
                                        <th style={{ border: '1px solid black' }}>Remove</th>
                                    </tr>

                                    {fields.map(({ key, name, ...restField }) => (
                                        <>
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
                                                            if (confirmDelete)
                                                                remove(name)

                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            {/* <Row key={key}>
                                                    <Col>
                                                        <Form.Item name={[name, 'amount']} label="Amount" style={{ margin: '3px' }}>
                                                            <Input placeholder='Amount' type='number'  ></Input>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col>
                                                        <Form.Item name={[name, 'modeOfPayment']} label="Mode of Payment" style={{ margin: '3px' }}>
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
                                                    </Col>
                                                    <Col>
                                                        <Form.Item name={[name, 'bank']} label='bank'>
                                                            <Select
                                                                showSearch
                                                                placeholder="Bank"
                                                                optionFilterProp="children"
                                                                // onChange={onChange}
                                                                // onSearch={onSearch}
                                                                filterOption={filterOption}
                                                                options={bankData}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col>
                                                        <Form.Item name={[name, 'date']} label="date" style={{ margin: '3px' }}>
                                                            <Input type='date'></Input>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col>
                                                        <Form.Item name={[name, 'remarks']} label="Remarks" style={{ margin: '3px' }}>
                                                            <Input placeholder='remarks'></Input>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col>
                                                        <MinusCircleOutlined
                                                            className="dynamic-delete-button"
                                                            onClick={() => remove(name)}
                                                        />
                                                    </Col>
                                                </Row> */}
                                        </>

                                    ))}
                                    <Form.Item style={{ margin: 'auto' }}>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add new
                                        </Button>
                                    </Form.Item>

                                </table>

                            )}
                        </Form.List>

                    </Form>
                    <div>
                        <h3>Total : {furtherPaymentTotal}</h3>
                    </div>
                </Card>

                <Card title='Remaining Balance' style={{margin: '20px'}}>
                    <Row justify={'space-between'}>
                        <Col>
                            <Card title="Total Freight" size='small'>
                                <span>{data.tripDetails[0].totalFreight}</span>
                            </Card>
                        </Col>
                        <Col>
                            <span style={{fontSize: '50px'}}>- {"{"}</span>
                        </Col>
                        <Col>

                            <Card title="First Payment Total" size='small'>
                                <span>{firstPaymentTotal||0}</span>
                            </Card>
                        </Col>
                        <Col>
                            <Card title="Further Payment Total" size='small'>
                                <span>{furtherPaymentTotal||0}</span>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Extra Amount" size='small'>
                                <Input type='number' value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)}></Input>
                                <Input placeholder='remark' value={extraAmtRemark} onChange={(e) => setExtraAmtRemark(e.target.value)}></Input>
                            </Card>
                        </Col>
                        <Col>
                        <span style={{fontSize: '50px'}}>{"}"}</span>
                        </Col>
                    </Row>

                    <div style={{border: '1px black dotted',marginTop: '20px', padding: '20px', fontSize: '20px'}}>
                        Remaining : {data.tripDetails[0].totalFreight - firstPaymentTotal - (furtherPaymentTotal||0) - extraAmount}
                    </div>
                </Card>

                <Card title="Transaction Status" style={{margin: '20px'}}>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">Open</Radio.Button>
                        <Radio.Button value="b">Close</Radio.Button>
                    </Radio.Group>
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

