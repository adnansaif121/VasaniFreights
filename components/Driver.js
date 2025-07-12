import React, { useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Upload } from 'antd';
import { InboxOutlined, UserOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import ViewPartyDetails from './ViewPartyDetails';
import ViewDriverDetails from './ViewDriverDetails';

const Driver = () => {
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
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [partySelectedForEdit, setPartySelectedForEdit] = useState(-1);
    const [modelPartySelected, setModelPartySelected] = useState(null);
    const [licenseDate, setLicenseDate] = useState(null);
    const [licenseType, setLicenseType] = useState(null);

    const { Dragger } = Upload;
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

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
                            date: data[key].date,
                            vehicleNo: data[key].vehicleNo,
                            transactionStatus: data[key].transactionStatus || 'open',
                            mt: data[key].mt,
                            from: data[key].tripDetails[0].from,
                            to: data[key].tripDetails[0].to,
                            paid: data[key].tripDetails[0].payStatus,
                            bhejneWaliParty: data[key].tripDetails[0].bhejneWaala,
                            paaneWaliParty: data[key].tripDetails[0].paaneWaala,
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
                            bhadaKaunDalega: (data[key]?.firstPayment === undefined) ? null : data[key]?.firstPayment[0]?.bhadaKaunDalega,
                            vehicleStatus: data[key].vehicleStatus,
                            furtherPayments: data[key].furtherPayments || {},
                            driver: data[key]?.driver1?.value || null,
                        }
                    )
                });
            }
            console.log(ds);
            ds = ds.sort(
                (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
            );
            setDisplayDataSource(ds);
            setDataSource(ds);
        });

        // create dummy party List

        const driverRef = ref(db, 'drivers/');
        onValue(driverRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'drivers');
            // updateStarCount(postElement, data);
            let drivers = []; // Data Source
            if (data !== null) {
                Object.values(data).map((driver, i) => {

                    drivers.push(driver);

                })
            }
            setPartyIds(Object.keys(data));
            // setPartyListAll([...parties]);
            setPartyList([...drivers]);
            setDisplayPartyList([...drivers]);
            console.log("Display Party list", [...drivers])
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
        let partyIndex = parseInt(e.key);
        console.log('click ', e, displayPartyList, partyIndex);
        setPartySelected(displayPartyList[partyIndex]);
        setSelectedPartyIndex(partyIndex);
        setPartyName(displayPartyList[partyIndex].label);
        setPartyLocation(displayPartyList[partyIndex].location);
        setLicenseDate(displayPartyList[partyIndex].LicenseDate);
        setLicenseType(displayPartyList[partyIndex].LicenseType || null);
        setPartyContact(displayPartyList[partyIndex].Contact);
        setPartyDescription(displayPartyList[partyIndex].description);
        console.log(displayPartyList[partyIndex]);
        console.log(e.item.props.value);

        let driver = displayPartyList[partyIndex].label;
        let ds = [];
        console.log(dataSource);
        for (let i = 0; i < dataSource.length; i++) {
            // console.log(dataSource[i].driversDetails[0].?.toLowerCase(), party.toLowerCase());
            if (dataSource[i].driver !== undefined && dataSource[i].driver !== null) {
                // for (let j = 0; j < dataSource[i].driversDetails.length; j++) {
                    if (dataSource[i].driver.toLowerCase() === driver.toLowerCase()) {
                        ds.push(dataSource[i]);
                    }
                // }
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
            render: (text, record, index) => { return index + 1; }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return new Date(record.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            }
        },
        {
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
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
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
        },

        {
            title: 'Total Freight',
            dataIndex: 'totalFreight',
            key: 'totalFreight',
        },
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
        console.log(`selected ${value} value`);
        setFilterType(value);
        let _displayDataSource = [];
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth();
        switch (value) {
            case "lastMonth":
                let month_first_date = (new Date(year, month, 1)).getTime();
                _displayDataSource = dataSource.filter(
                    (item) => {
                        let itemDate = new Date(item.date).getTime();
                        return itemDate >= month_first_date;
                    }
                )
                setDisplayDataSource([..._displayDataSource]);
                console.log(_displayDataSource);
                break;
            case "lastQuarter":
                // let year = (new Date()).getFullYear();
                let quarter = Math.floor(((new Date()).getMonth() + 3) / 3);
                let quarterStartMonth = [0, 3, 6, 9] //jan, April, July, Oct
                let quarter_first_date = (new Date(year, quarterStartMonth[quarter - 1], 1)).getTime();
                _displayDataSource = dataSource.filter(
                    (item) => {
                        let itemDate = new Date(item.date).getTime();
                        return itemDate >= quarter_first_date;
                    }
                )
                setDisplayDataSource([..._displayDataSource]);
                break;
            case "last6Months":
                let _last6thMonthYear = year;
                let _last6thmonth = month - 6;
                if (_last6thmonth >= 0) {
                    _last6thMonthYear--;
                    _last6thmonth = 12 + _last6thMonthYear;
                }
                let last6month_start_date = (new Date(_last6thMonthYear, _last6thmonth, 1)).getTime();
                _displayDataSource = dataSource.filter(
                    (item) => {
                        let itemDate = new Date(item.date).getTime();
                        return itemDate >= last6month_start_date;
                    }
                )
                setDisplayDataSource([..._displayDataSource]);
                break;
            case "lastYear":
                let _lastYear_start_date = (new Date(year - 1, 0, 1)).getTime();
                _displayDataSource = dataSource.filter(
                    (item) => {
                        let itemDate = new Date(item.date).getTime();
                        return itemDate >= _lastYear_start_date;
                    }
                )
                setDisplayDataSource([..._displayDataSource]);
                break;
            case "lastFinancialYear":
                let _lastFinancialYear_start_date = (new Date(year - 1, 3, 1)).getTime();
                let _lastFinancialYear_end_date = (new Date(year, 2, 31)).getTime();
                _displayDataSource = dataSource.filter(
                    (item) => {
                        let itemDate = new Date(item.date).getTime();
                        return itemDate >= _lastFinancialYear_start_date && itemDate <= _lastFinancialYear_end_date;
                    }
                )
                setDisplayDataSource([..._displayDataSource]);
                break;
            default:
                console.log(value);
                setDisplayDataSource([...dataSource]);
        }
    };

    const [open, setOpen] = useState(false);
    const showDrawer = (index) => {
        console.log('showDrawer', index);
        console.log(displayPartyList, displayPartyList[index]);
        console.log(displayPartyList[index].LicenseType || null);
        setPartySelectedForEdit(index);
        setModelPartySelected(displayPartyList[index]);
        setPartyName(displayPartyList[index].label);
        setPartyLocation(displayPartyList[index].location);
        setLicenseDate(displayPartyList[index].LicenseDate);
        setLicenseType(displayPartyList[index].LicenseType || null);
        setPartyContact(displayPartyList[index].Contact);
        setPartyDescription(displayPartyList[index].description);
        setOpen(true)
    };

    const onClose = () => {
        setOpen(false);
    };

    const editParty = () => {
        console.log('Edit Party');
        console.log(partySelected);
        const db = getDatabase();
        const partyRef = ref(db, 'drivers/' + partyIds[partySelectedForEdit]);
        set(partyRef, {
            label: partyName,
            value: partyName,
            location: partyLocation,
            LicenseDate: licenseDate,
            LicenseType: licenseType,
            Contact: partyContact,
            description: partyDescription
        });

        // let pl = partyList;
        let dpl = displayPartyList;
        dpl[partySelectedForEdit] = {
            label: partyName,
            value: partyName,
            location: (partyLocation || ''),
            LicenseDate: (licenseDate || ''),
            LicenseType: (licenseType || null),
            Contact: (partyContact || ''),
            description: (partyDescription || '')
        }
        //  setPartyList([...parties]);
        setDisplayPartyList([...dpl]);
        onClose();
    }

    const handleCustomFilter = () => {
        if (customStartDate === null) {
            alert("Please Enter Start Date");
            return;
        }
        if (customEndDate === null) {
            alert("Please Enter End Date");
            return;
        }
        let _custom_start_date = new Date(customStartDate).getTime();
        let _custom_end_date = new Date(customEndDate).getTime();
        let _displayDataSource = dataSource.filter(
            (item) => {
                let itemDate = new Date(item.date).getTime();
                return itemDate >= _custom_start_date && itemDate <= _custom_end_date;
            }
        )
        setDisplayDataSource(_displayDataSource);
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div className={styles.container}>
                <div className={styles.part1}>
                    <Input onChange={handleSearch} placeholder='Search' />
                    <div className={styles.menu} style={{ display: 'flex', height: '80vh', overflowY: "auto", backgroundColor: 'white' }}>

                        <div style={{ backgroundColor: 'white', marginLeft: '2px', borderRadius: '5px', padding: '0px 5px 0px 5px' }}>
                            {displayPartyList.map((item, index) => {
                                return (
                                    <div key={index} style={{ padding: '6px 0px 6px 0px', color: 'blue' }}>
                                        <Button onClick={() => showDrawer(index)} icon={
                                            (item.contact === undefined || item.address === undefined) ?
                                                <span style={{ color: 'red' }}><UserOutlined /></span>
                                                :
                                                <UserOutlined />
                                        }></Button>
                                    </div>
                                )
                            })}
                        </div>

                        <Menu
                            onClick={onClick}
                            style={{
                                width: "100%",
                            }}
                            mode="inline"
                            items={displayPartyList.map(({label}, index) => ({label, key: index}))}
                        />
                    </div>
                </div>
                <div className={styles.part2}>
                    <div >
                        <Row justify={'space-between'} style={{ width: '75vw' }}>
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
                                            <Input type='date' placeholder='start Date' onChange={(e) => setCustomStartDate(e.target.value)}></Input>
                                        </Col>
                                        <Col>
                                            <Input type='date' placeholder='end Date' onChange={(e) => setCustomEndDate(e.target.value)}></Input>
                                        </Col>
                                        <Col>
                                            <Button onClick={handleCustomFilter}>Apply</Button>
                                        </Col>
                                    </Row> : null
                                }
                            </Col>
                            {/* <Col>
                                <Button type="primary" onClick={showDrawer}>
                                    View/Edit Party Profile
                                </Button>
                            </Col> */}
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
                                            <Input placeholder="Please enter user name" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            // name="Party Location"
                                            label="Driver Location"
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
                                                onChange={(e) => setPartyLocation(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            // name="Address"
                                            label="License Date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select an owner',
                                                },
                                            ]}
                                        >
                                            <Input
                                                type='date'
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="License Date"
                                                value={licenseDate}
                                                onChange={(e) => setLicenseDate(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="License type"
                                            name="License type"
                                        >
                                            <Select
                                                placeholder="License type"
                                                optionFilterProp="children"
                                                value={licenseType}
                                                onChange={(e) => setLicenseType(e)}
                                                options={[
                                                    {
                                                        value: 'Heavy Vehicle',
                                                        label: 'Heavy Vehicle',
                                                    },
                                                    {
                                                        value: 'Light Vehicle',
                                                        label: 'Light Vehicle',
                                                    }
                                                ]}
                                            />
                                        </Form.Item>

                                    </Col>
                                    <Col span={8}>
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
                                                onChange={(e) => setPartyContact(e.target.value)}
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
                                            <Input.TextArea rows={4} placeholder="please enter url description" value={partyDescription} onChange={(e) => setPartyDescription(e.target.value)} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                            banned files.
                                        </p>
                                    </Dragger>
                                </Row>
                            </Form>
                        </Drawer>



                    </div>
                    <Table size="small" className={styles.table} dataSource={displayDataSource} columns={columns} expandable={{
                        expandedRowRender: (record) => <ViewDriverDetails />
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
