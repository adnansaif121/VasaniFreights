import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker } from 'antd';
import { UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import ViewPartyDetails from './ViewPartyDetails';
const Driver = () => {
    const [driverList, setDriverList] = useState([]);
    const [displayDriverList, setDisplayDriverList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filterType, setFilterType] = useState('none');
    const [driverSelected, setDriverSelected] = useState({});
    const [driverName, setDriverName] = useState('');
    // const [driverLocation, setPartyLocation] = useState('');
    const [driverAddress, setDriverAddress] = useState('');
    const [driverContact, setDriverContact] = useState('');
    const [driverDescription, setDriverDescription] = useState('');
    const [driverIds, setDriverIds] = useState([]);
    const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);
    const [dataSource, setDataSource] = useState([]); // Table Data
    const [displayDataSource, setDisplayDataSource] = useState([]);
    const [allTableData, setAllTableData] = useState({});
    useEffect(() => {
        const db = getDatabase();
        // Get data from database
        const starCountRef = ref(db, 'dailyEntry/');
        // console.log(starCountRef);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            // updateStarCount(postElement, data);
            let ds = []; // Data Source
            if (data) {
                setAllTableData(data);
                Object.keys(data).map((key, i) => {
                    ds.push(
                        {
                            key: key,
                            id: i + 1,
                            truckNo: data[key].vehicleNo,
                            mt: data[key].mt,
                            from: data[key].tripDetails[0].from,
                            to: data[key].tripDetails[0].to,
                            paid: data[key].tripDetails[0].payStatus,
                            bhejneWaliParty: data[key].tripDetails[0].bhejneWaliParty,
                            paaneWaliParty: data[key].tripDetails[0].paaneWaliParty,
                            transporter: data[key].tripDetails[0].transporter,
                            maal: data[key].tripDetails[0].maal,
                            qty: data[key].tripDetails[0].qty,
                            rate: data[key].tripDetails[0].rate,
                            totalFreight: data[key].tripDetails[0].totalFreight,
                            received: '100000',
                            dieselAndKmDetails: data[key].dieselAndKmDetails,
                            tripDetails: data[key].tripDetails,
                            driversDetails: data[key].driversDetails,
                            kaataParchi: data[key].kaataParchi,
                            firstPayment: data[key].firstPayment,
                            bhadaKaunDalega: data[key].firstPayment.bhadaKaunDalega,
                        }
                    )
                });
            }
            setDisplayDataSource(ds);
            setDataSource(ds);
        });

        // create dummy party List
        
        const partyRef = ref(db, 'parties/');
        onValue(partyRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'parties');
            // updateStarCount(postElement, data);
            let parties = []; // Data Source
            Object.values(data).map((party, i) => {
                if(party.contact === undefined || party.address === undefined){
                    parties.push({...party, icon: <ExclamationCircleTwoTone twoToneColor="#eb2f96" />});
                }
                else{
                    parties.push(party);
                }
            })
            setPartyIds(Object.keys(data));
            // setPartyListAll([...parties]);
            setPartyList([...parties]);
            setDisplayPartyList([...parties]);
        });

    }, []);

    const handleSearch = (e) => {
        console.log(e.target.value);
        if (e.target.value.trim() == '') setDisplayPartyList([...partyList]);
        let query = e.target.value;
        let parties = partyList;
        let filtered = parties.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
        setDisplayPartyList([...filtered]);
        console.log(filtered, 'FILTERED');
    }

    const onClick = (e) => {
        console.log('click ', e);
        let partyIndex = parseInt(e.key.slice(4));
        setPartySelected(displayPartyList[partyIndex]);
        setSelectedPartyIndex(partyIndex);
        setPartyName(displayPartyList[partyIndex].label);
        setPartyLocation(displayPartyList[partyIndex].location);
        setPartyAddress(displayPartyList[partyIndex].address);
        setPartyContact(displayPartyList[partyIndex].contact);
        setPartyDescription(displayPartyList[partyIndex].description);
        console.log(displayPartyList[partyIndex]);
        console.log(e.item.props.value);

        let party = displayPartyList[partyIndex].label;    
        let ds = [];    
        console.log(dataSource);
        for(let i = 0; i < dataSource.length; i++){
            console.log(dataSource[i].firstPayment[0].bhadaKaunDalega?.toLowerCase(), party.toLowerCase());
            if(dataSource[i].firstPayment[0].bhadaKaunDalega?.toLowerCase() === party.toLowerCase()){
                ds.push(dataSource[i]);
            }
        }
        console.log(ds);
        setDisplayDataSource([...ds]);
    };

    // const dataSource = [
    //     {
    //         key: '1',
    //         id: '1',
    //         transactionStatus: 'open',
    //         truckNo: 'MH 04 1234',
    //         from: 'Pune',
    //         to: 'Mumbai',
    //         paid: 'Paid',
    //         bhejneWaliParty: 'ABC',
    //         paaneWaliParty: 'XYZ',
    //         transporter: 'UV Logistics',
    //         maal: 'Cement',
    //         qty: '100',
    //         rate: '1000',
    //         totalFreight: '100000',
    //         received: '100000'
    //     },
    //     {
    //         key: '2',
    //         id: '2',
    //         transactionStatus: 'open',
    //         truckNo: 'MH 04 1234',
    //         from: 'Pune',
    //         to: 'Mumbai',
    //         paid: 'Paid',
    //         bhejneWaliParty: 'ABC',
    //         paaneWaliParty: 'XYZ',
    //         transporter: 'UV Logistics',
    //         maal: 'Cement',
    //         qty: '100',

    //         rate: '1000',
    //         totalFreight: '100000',
    //         received: '100000'
    //     },
    // ];

    const columns = [
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Status',
            dataIndex: 'transactionStatus',
            key: 'transactionStatus',
            render: (text) => { text === 'open' ? <ExclamationOutlined /> : <CheckOutlined /> }
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

    const filterMenuItems = [
        {
            label: 'None',
            key: '1',
            value: 'none',
        },
        {
            label: 'Last Month',
            key: '2',
            value: 'lastMonth',
        },
        {
            label: 'Last quarter',
            key: '3',
            value: 'lastQuarter',
        },
        {
            label: 'Last 6 months',
            key: '4',
            value: 'last6Months',
        },
        {
            label: 'Last Year',
            key: '5',
            value: 'lastYear',
        },
        {
            label: 'Last Financial Year',
            key: '6',
            value: 'lastFinancialYear',
        },
        {
            label: 'Custom',
            key: '7',
            value: 'custom',
        }
    ]
    
    const handleFilterChange = (value) => {
        console.log(`selected ${value}`);
        setFilterType(value);
    };

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const editParty = () => {
        console.log('Edit Party');
        console.log(partySelected);
        const db = getDatabase();
        const partyRef = ref(db, 'parties/' + partyIds[selectedPartyIndex]);
        set(partyRef, {
            label: partyName,
            value: partyName,
            location: partyLocation,
            address: partyAddress,
            contact: partyContact,
            description: partyDescription
        }); 

        // let pl = partyList;
        let dpl = displayPartyList;
        dpl[selectedPartyIndex] = {
            label: partyName,
            value: partyName,
            location: (partyLocation|| ''),
            address: (partyAddress|| ''),
            contact:( partyContact|| ''),
            description: (partyDescription|| '')
        }
        //  setPartyList([...parties]);
        setDisplayPartyList([...dpl]);
        onClose();
    }
    
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
                        <Row justify={'space-between'} style={{width:'75vw'}}>
                            <Col>
                                <Select
                                    defaultValue="none"
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={handleFilterChange}
                                    options={filterMenuItems}
                                />
                            </Col>
                            <Col>
                                {
                                    filterType === 'custom' ? <Row>
                                        <Col>
                                            <Input type='date' ></Input>
                                        </Col>
                                        <Col>
                                            <Input type='date' ></Input>
                                        </Col>
                                        <Col>
                                            <Button>Apply</Button>
                                        </Col>
                                    </Row> : null
                                }
                            </Col>
                            <Col>
                                <Button type="primary" onClick={showDrawer}>
                                    View/Edit Party Profile
                                </Button>
                            </Col>
                        </Row>


                        {/* <Form >
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
                        </Form> */}

                        <Drawer
                            title="Create a new account"
                            width={720}
                            onClose={onClose}
                            open={open}
                            styles={{
                                body: {
                                    paddingBottom: 80,
                                },
                            }}
                            extra={
                                <Space>
                                    <Button onClick={onClose}>Cancel</Button>
                                    <Button onClick={editParty} type="primary">
                                        Submit
                                    </Button>
                                </Space>
                            }
                        >
                            <Form layout="vertical" hideRequiredMark>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            // name="name"
                                            label="Name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter user name',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Please enter user name" value={partyName} onChange={(e)=>setPartyName(e.target.value)}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            // name="Party Location"
                                            label="Party Location"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter url',
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Party Location"
                                                value={partyLocation}
                                                onChange={(e)=>setPartyLocation(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            // name="Address"
                                            label="Address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select an owner',
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Party Address"
                                                value={partyAddress}
                                                onChange={(e)=>setPartyAddress(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            // name="ContactNumber"
                                            label="Contact Number"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Provide Contact Number',
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Contact Number"
                                                value={partyContact}
                                                onChange={(e)=>setPartyContact(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            // name="description"
                                            label="Description"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'please enter url description',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea rows={4} placeholder="please enter url description" value={partyDescription} onChange={(e)=>setPartyDescription(e.target.value)}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>



                    </div>
                    <Table size="small" className={styles.table} dataSource={displayDataSource} columns={columns} expandable={{
                        expandedRowRender: (record) => <ViewPartyDetails data={record} />
                        ,
                        rowExpandable: (record) => true,
                    }}
                        pagination={'none'}
                    />
                </div>
            </div>
        </>
    );
};

export default Driver;
