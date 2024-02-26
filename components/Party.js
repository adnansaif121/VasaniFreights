import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
const Party = () => {
    const [partyList, setPartyList] = useState([]);
    const [displayPartyList, setDisplayPartyList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // create dummy party List
        let list = [];
        for (let i = 0; i < 100; i++) {
            list.push({ key: i, icon: <UserOutlined />, label: 'Party ' + i, });
        }
        setPartyList([...list]);
        setDisplayPartyList([...list]);
    }, []);

    const handleSearch = (e) => {
        console.log(e.target.value);
        if (e.target.value.trim() == '') setDisplayPartyList([...partyList]);
        let query = e.target.value;
        let parties = partyList;
        let filtered = parties.filter((item) => item.label.includes(query));
        setDisplayPartyList([...filtered]);
        console.log(filtered);
    }

    const onClick = (e) => {
        console.log('click ', e);
        let party = e.target.value;
        let partyId = 0;
        let parties = partyList;
        for (let i = 0; i < parties.length; i++) {
            if (parties[i].label == party) {
                partyId = parties[i].key;
                break;
            }
        }
        console.log(partyId);

    };

    const dataSource = [
        {
            key: '1',
            id: '1',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',
            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },
        {
            key: '2',
            id: '2',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',

            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },
    ];

    const columns = [
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Truck No.',
            dataIndex: 'truckNo',
            key: 'truckNo',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Transporter',
            dataIndex: 'transporter',
            key: 'transporter',
        },
        {
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Total Freight',
            dataIndex: 'totalFreight',
            key: 'totalFreight',
        }
    ];

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div className={styles.container}>
                <div className={styles.part1}>
                    <Input onChange={handleSearch} placeholder='Search' />
                    <div className={styles.menu}>
                        <Menu
                            onClick={onClick}
                            style={{
                                width: "100%",
                            }}
                            mode="inline"
                            items={displayPartyList}
                        />
                    </div>
                </div>
                <div className={styles.part2}>
                    <div >

                        <Form >
                            <Row>
                                <Col>
                                    <Form.Item label="Start" name="startDate">
                                        <Input type='date'></Input>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item label="End" name="startDate">
                                        <Input type='date'></Input>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button>Save</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                            <Radio.Button value="a">Last Month</Radio.Button>
                            <Radio.Button value="b">Last Financial Year</Radio.Button>
                            <Radio.Button value="c">Last Quarter</Radio.Button>
                            <Radio.Button value="d">Last 6 months</Radio.Button>
                            <Radio.Button value="e">Last Year</Radio.Button>
                            <Radio.Button value="f">None</Radio.Button>
                        </Radio.Group>





                    </div>
                    <Table dataSource={dataSource} columns={columns} expandable={{
                        expandedRowRender: (record) => <div>
                            <div className={styles.summary}>
                                <Row justify={'space-between'}>
                                    <Col>
                                        <h4>Amount Received Till Date : </h4>
                                    </Col>

                                    <Col>
                                        <h4>Transaction Status: </h4>
                                        <Radio.Group defaultValue="a" buttonStyle="solid">
                                            <Radio.Button value="a">Open</Radio.Button>
                                            <Radio.Button value="b">Close</Radio.Button>
                                        </Radio.Group>
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
                                                {/* <Form.Item name={[name, 'cashBank']}>
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
                                                                                </Form.Item> */}
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
                                                    <Row>
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
                        </div>
                        ,
                        rowExpandable: (record) => true,
                    }} pagination={'none'}
                    />
                </div>
            </div>
        </>
    );
};

export default Party;
