import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
const ViewPartyDetails = () => {
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

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div>
                <div className={styles.summary}>
                    <Row justify={'space-between'}>
                        <Col>
                            <h4>Amount Received Till Date : </h4>
                        </Col>
                    </Row>

                </div>
                <Card title="Payment Details">

                    <table style={{ border: '1px solid black', padding: '5px', borderRadius: '10px' }}>
                        <thead>
                            <tr style={{ border: '1px solid black' }}>
                                <th style={{ border: '1px solid black' }}>Type</th>
                                <th style={{ border: '1px solid black' }}>Amount</th>
                                <th style={{ border: '1px solid black' }}>date</th>
                                <th style={{ border: '1px solid black' }}>Bank</th>
                                <th style={{ border: '1px solid black' }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Cash</h3></td>
                                <td >
                                    <Form.Item name={[name, 'cashAmount']}>
                                        <Input placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item name={[name, 'cashDate']}>
                                        <Input placeholder='date' type='date' />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item name={[name, 'cashRemarks']}>
                                        <Input placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Online</h3></td>
                                <td >
                                    <Form.Item name={[name, 'onlineAmount']}>
                                        <Input placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item name={[name, 'onlineDate']}>
                                        <Input placeholder='date' type='date' />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item name={[name, 'onlineBank']}>
                                        <Select
                                            showSearch
                                            placeholder="Bank"
                                            optionFilterProp="children"
                                            // onChange={onChange}
                                            // onSearch={onSearch}
                                            filterOption={filterOption}
                                            options={[
                                                {
                                                    value: 'ABC',
                                                    label: 'ABC',
                                                },
                                                {
                                                    value: 'XYZ',
                                                    label: 'XYZ',
                                                },
                                                {
                                                    value: 'PQR',
                                                    label: 'PQR',
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item name={[name, 'onlineRemarks']}>
                                        <Input placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid black' }}>
                                <td ><h3>Cheque</h3></td>
                                <td >
                                    <Form.Item name={[name, 'chequeAmount']}>
                                        <Input placeholder='amount' type='number' />
                                    </Form.Item>
                                </td >
                                <td >
                                    <Form.Item name={[name, 'chequeDate']}>
                                        <Input placeholder='date' type='date' />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item name={[name, 'chequeBank']}>
                                        <Select
                                            showSearch
                                            placeholder="Bank"
                                            optionFilterProp="children"
                                            // onChange={onChange}
                                            // onSearch={onSearch}
                                            filterOption={filterOption}
                                            options={[
                                                {
                                                    value: 'ABC',
                                                    label: 'ABC',
                                                },
                                                {
                                                    value: 'XYZ',
                                                    label: 'XYZ',
                                                },
                                                {
                                                    value: 'PQR',
                                                    label: 'PQR',
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </td>
                                <td >
                                    <Form.Item name={[name, 'chequeRemarks']}>
                                        <Input placeholder='remarks' />
                                    </Form.Item>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </Card>

                <Card title="Add Further Payment Details" >
                    <Form >
                        <Form.List name="FurtherPayments" >
                            {(fields, { add, remove }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        rowGap: 16,
                                        flexDirection: 'column',
                                        width: "-webkit-fill-available",
                                    }}
                                >
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row key={key}>
                                            <Col>
                                                <Form.Item label="Amount" style={{ margin: '3px' }}>
                                                    <Input placeholder='Amount' type='number'></Input>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item label="Mode of Payment" style={{ margin: '3px' }}>
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
                                                <Form.Item label='bank'>
                                                    <Select
                                                        showSearch
                                                        placeholder="Bank"
                                                        optionFilterProp="children"
                                                        // onChange={onChange}
                                                        // onSearch={onSearch}
                                                        filterOption={filterOption}
                                                        options={[
                                                            {
                                                                value: 'ABC',
                                                                label: 'ABC',
                                                            },
                                                            {
                                                                value: 'XYZ',
                                                                label: 'XYZ',
                                                            },
                                                            {
                                                                value: 'PQR',
                                                                label: 'PQR',
                                                            },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item label="date" style={{ margin: '3px' }}>
                                                    <Input type='date'></Input>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item label="Remarks" style={{ margin: '3px' }}>
                                                    <Input placeholder='remarks'></Input>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(name)}
                                                />
                                            </Col>
                                        </Row>

                                    ))}
                                    <Form.Item style={{ margin: 'auto' }}>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add new
                                        </Button>
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>
                    </Form>
                    <Button type='primary'>Save</Button>
                </Card>

                <div>
                    <h4>Transaction Status: </h4>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">Open</Radio.Button>
                        <Radio.Button value="b">Close</Radio.Button>
                    </Radio.Group>
                </div>
            </div>


        </>
    );
};

export default ViewPartyDetails;
