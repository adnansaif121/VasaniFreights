import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
const ViewPartyDetails = ({ data, bankData, vehicleData }) => {
    const [partyList, setPartyList] = useState([]);
    const [displayPartyList, setDisplayPartyList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filterType, setFilterType] = useState('none');
    const [partySelected, setPartySelected] = useState({});
    const [partyName, setPartyName] = useState('');
    const [partyLocation, setPartyLocation] = useState('');
    const [partyAddress, setPartyAddress] = useState('');
    const [partyContact, setPartyContact] = useState('');
    const [partyDescription, setPartyDescription] = useState('');
    const [partyIds, setPartyIds] = useState([]);
    const [selectedPartyIndex, setSelectedPartyIndex] = useState(0);
    const [dataSource, setDataSource] = useState([]); // Table Data
    const [displayDataSource, setDisplayDataSource] = useState([]);
    const [allTableData, setAllTableData] = useState({});

    const [amountReceived, setAmountReceived] = useState(parseInt(data.firstPayment[0].pohchAmount || 0) +
        parseInt(data.firstPayment[0].cashAmount || 0) +
        parseInt(data.firstPayment[0].chequeAmount || 0) +
        parseInt(data.firstPayment[0].onlineAmount || 0));
    const [form4] = Form.useForm();

    useEffect(() => {
        console.log('data', data);
        // let tripDetails = form.getFieldsValue(['tripDetails']);
        // tripDetails.tripDetails = data.tripDetails;
        // form.setFieldsValue(tripDetails);
        // console.log(tripDetails);    
        if (data.furtherPayments.FurtherPayments !== undefined) {
            let furtherPayments = data.furtherPayments;
            form4.setFieldsValue(furtherPayments);

            let totalAmount = 0;
            for (let i = 0; i < data.furtherPayments.FurtherPayments.length; i++) {
                totalAmount += parseInt(data.furtherPayments.FurtherPayments[i].amount);
            }
            setAmountReceived(amountReceived + totalAmount);
        }
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

    return (
        <>
            <div>
                <div className={styles.summary} style={{display:'flex', justifyContent: 'center'}}>
                    <Row justify={'space-between'}>
                        <Col>
                            <h3>Amount Received Till Date :
                                <span style={{color: 'green'}}>{amountReceived}</span>
                            </h3>
                        </Col>
                    </Row>

                </div>

                <Card title="Transaction Status">
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">Open</Radio.Button>
                        <Radio.Button value="b">Close</Radio.Button>
                    </Radio.Group>
                </Card>

                <Card title="Payment Details">

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
                                        <Input value={parseInt(data.firstPayment[0].pohchAmount)} placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].pohchDate} placeholder='date' type='date' />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].pohchSendTo || ''}></Input>
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
                                        <Input value={data.firstPayment[0].pohchRemarks} placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Cash</h3></td>
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].cashAmount} placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].cashDate} placeholder='date' type='date' />
                                    </Form.Item>
                                </td>
                                <td >
                                </td>
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].cashRemarks} placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Online</h3></td>
                                <td >
                                    <Form.Item >
                                        <Input value={parseInt(data.firstPayment[0].onlineAmount)} placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].onlineDate} placeholder='date' type='date' />
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
                                            defaultValue={data.firstPayment[0].onlineBank}
                                        />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].onlineRemarks} placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Cheque</h3></td>
                                <td >
                                    <Form.Item >
                                        <Input value={parseInt(data.firstPayment[0].chequeAmount)} placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].chequeDate} placeholder='date' type='date' />
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
                                            defaultValue={data.firstPayment[0].chequeBank}
                                        />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item >
                                        <Input value={data.firstPayment[0].chequeRemarks} placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </Card>

                <Card title="Add Further Payment Details" >

                    <Form
                        name=' Further Payment Details'
                        form={form4}
                    >
                        <Form.List name="FurtherPayments" >
                            {(fields, { add, remove }) => (
                                <table style={{ border: '1px solid black', padding:'5px' }}>
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
                                            <tr>
                                                <td>
                                                    <Form.Item name={[name, 'amount']} >
                                                        <Input placeholder='Amount' type='number'  ></Input>
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
                                                <td style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => {
                                                            let confirmDelete = confirm("Are you sure to delete this Payment Entry?");
                                                            if(confirmDelete)
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
                        <h3>Total : {amountReceived}</h3>
                    </div>
                </Card>

                <Button style={{marginTop:'5px'}} type='primary' onClick={handleSave}>Save</Button>

                {/* <div>
                    <h4>Transaction Status: </h4>
                </div> */}
            </div>


        </>
    );
};

export default ViewPartyDetails;

