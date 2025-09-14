import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Badge, Modal, Tooltip } from 'antd';
import { BellOutlined, EyeTwoTone, FileTextOutlined, UserOutlined, SearchOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, get, child, update } from "firebase/database";
import ViewPartyDetails from './ViewHareKrishnaParty';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Transporter from './Transporter';
import RemarkModal, {RemarkButton} from './common/RemarkModal';

const TransporterParty = ({dailyEntryData, bankData, setBankData, partyData, transporterData}) => {
    const [partyList, setPartyList] = useState([]);
    const [displayPartyList, setDisplayPartyList] = useState([]);
    const [filterType, setFilterType] = useState('none');
    const [partySelected, setPartySelected] = useState({});
    const [partyName, setPartyName] = useState('');
    const [partyLocation, setPartyLocation] = useState('');
    const [partyAddress, setPartyAddress] = useState('');
    const [partyContact, setPartyContact] = useState('');
    const [partyDescription, setPartyDescription] = useState('');
    const [partySelectedForEdit, setPartySelectedForEdit] = useState(-1);
    const [partyIds, setPartyIds] = useState([]);
    const [selectedPartyIndex, setSelectedPartyIndex] = useState(0);
    const [dataSource, setDataSource] = useState([]); // Table Data
    const [displayDataSource, setDisplayDataSource] = useState([]);
    const [allTableData, setAllTableData] = useState({});
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [modelPartySelected, setModelPartySelected] = useState(null);
    const [dataUpdateFlag, setDataUpdateFlag] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [transporterParties, setTransporterParties] = useState({});

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);

    const [remarkData, setRemarkData] = useState([]);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    // const [bankData, setBankData] = useState([]);

    useEffect(() => {
        const getData = async () => {

            const db = getDatabase();
            // Get data from database
            const starCountRef = ref(db, 'dailyEntry/');
            // console.log(starCountRef);
            let ds = []; // Data Source
            const dbref = ref(db);

            const partyRef = ref(db, 'transporters/');
            let partyNameList = [];
            let _transporterParties = {}
            // await get(child(dbref, 'dailyEntry')).then((snapshot) => {
            // }).catch((error) => {
            //     console.log(error);
            // })
            const data = dailyEntryData;
            // console.log(data);
            // updateStarCount(postElement, data);
            if (data) {
                setAllTableData(data);
                Object.keys(data).map((key, i) => {
                    for (let j = 0; j < data[key].tripDetails.length; j++) {
                        if (data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega.toUpperCase().trim() === 'HARE KRISHNA') {
                            continue;
                        }

                        const transporter = data[key].tripDetails[j].transporter || '';
                        if (transporter !== '' && !partyNameList.includes(transporter)) {
                            partyNameList.push(transporter);
                        }

                        if (data[key].firstPayment === undefined || data[key].firstPayment[j] === undefined) continue;
                        let partyName = data[key]?.firstPayment[j]?.partyForTransporterPayment || '';
                        if (_transporterParties[transporter] !== undefined && partyName !== '') {
                            _transporterParties[transporter] = [..._transporterParties[transporter], partyName];
                        }
                        else {
                            if (partyName !== '') _transporterParties[transporter] = ['All', partyName];
                            // _transporterParties[transporter] = ['All', partyName];
                        }

                        // partyNameList.push(data[key]?.firstPayment[j]?.partyForTransporterPayment || null);

                        let receivedAmt = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === transporter) ?
                            (
                                parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                                parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                                parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                                parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                                (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                            )
                            : 0;

                        if ((data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === transporter)) {
                            ds.push(
                                {
                                    partyForTransporterPayment: data[key]?.firstPayment[j]?.partyForTransporterPayment || '',
                                    key: key + j,
                                    id: i + 1,
                                    lrNumber: data[key]?.lrNumber || '',
                                    date: data[key]?.date,
                                    vehicleNo: data[key]?.vehicleNo,
                                    transactionStatus: data[key]?.tripDetails[j].transactionStatus || 'open',
                                    mt: data[key]?.mt,
                                    from: data[key].tripDetails[j].from,
                                    to: data[key].tripDetails[j].to,
                                    paid: data[key].tripDetails[j].payStatus,
                                    bhejneWaliParty: data[key].tripDetails[j].bhejneWaala,
                                    paaneWaliParty: data[key].tripDetails[j].paaneWaala,
                                    transporter: data[key].tripDetails[j].transporter,
                                    maal: data[key].tripDetails[j].maal,
                                    qty: data[key].tripDetails[j].qty,
                                    rate: data[key].tripDetails[j].rate,
                                    totalFreight: parseFloat(data[key].tripDetails[j].totalFreight).toFixed(2),
                                    received: receivedAmt,
                                    dieselAndKmDetails: data[key].dieselAndKmDetails,
                                    tripDetails: data[key].tripDetails,
                                    driversDetails: data[key].driversDetails,
                                    kaataParchi: data[key].kaataParchi,
                                    firstPayment: data[key].firstPayment,
                                    commission: data[key].tripDetails[j].commission || 0,
                                    advance: data[key].tripDetails[j].advance || 0,
                                    bhadaKaunDalega: (data[key]?.firstPayment === undefined) ? null : data[key]?.firstPayment[j]?.bhadaKaunDalega,
                                    vehicleStatus: data[key].vehicleStatus,
                                    furtherPayments: data[key].furtherPayments || {},
                                    remainingBalance: (data[key].tripDetails[j].remainingBalance === undefined ? null : parseFloat(data[key].tripDetails[j].remainingBalance).toFixed(2)),
                                    extraAmtRemark: data[key].tripDetails[j].extraAmtRemark
                                }
                            )
                        }
                    }
                });
            }
            console.log(ds);
            ds = ds.sort(
                (a, b) => Number(new Date(a.date)) - Number(new Date(b.date)),
            );
            setDisplayDataSource(ds);
            setDataSource(ds);
            setTransporterParties(_transporterParties);

            // const bankRef = ref(db, 'bankData/');
            //         onValue(bankRef, (snapshot) => {
            //             const data = snapshot.val();
            //             let _bankData = [];
            //             if (data !== null) {
            //                 for (let i = 0; i < data.data.length; i++) {
            //                     _bankData.push({
            //                         label: data.data[i].bankName,
            //                         value: data.data[i].bankName,
            //                         key: data.data[i].key
            //                     })
            //                 }
            //             }
            //             setBankData([..._bankData]);
            //         })

            // await onValue(partyRef, (snapshot) => {
            // });
            // const data = transporterData
            // updateStarCount(postElement, data);
            let parties = []; // Data Source
            if (transporterData !== null) {
                Object.values(transporterData).map((party, i) => {
                    if (party.label.toUpperCase().trim() === ('Hare Krishna').toUpperCase()) return; // Skip Hare Krishna party
                    if (partyNameList.includes(party.label)) {
                        parties.push(party);
                    }
                    // partyNameList.push(party.label);
                })
                setPartyIds(Object.keys(transporterData));
            }

            // setPartyListAll([...parties]);
            setPartyList([...parties]);
            setDisplayPartyList([...parties]);
        }

        getData();
    }, [refreshKey]);

    const exportToExcel = () => {
        // Prepare data: remove unwanted fields if needed
        const exportData = displayDataSource.map(row => {
            const { key, ...rest } = row; // remove key if you don't want it in Excel
            return rest;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "HareKrishna.xlsx");
    };


    const handle_Search = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (e) => {
        console.log(e.target.value);
        if (e.target.value.trim() == '') setDisplayPartyList([...partyList]);
        let query = e.target.value;
        let parties = partyList;
        let filtered = parties.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
        setDisplayPartyList([...filtered]);
        console.log(filtered, 'FILTERED');
    }

    const onClick = (index) => {
        console.log('click ', index);
        let partyIndex = parseInt(index);
        setPartySelected(displayPartyList[partyIndex]);
        setSelectedPartyIndex(partyIndex);

        console.log(displayPartyList[partyIndex]);
        // console.log(e.item.props.value);

        let party = displayPartyList[partyIndex].label;
        let ds = [];
        console.log(dataSource);
        for (let i = 0; i < dataSource.length; i++) {
            console.log(dataSource[i].transporter, party);
            // console.log(dataSource[i].firstPayment[0].bhadaKaunDalega?.toLowerCase(), party.toLowerCase());
            if (dataSource[i].firstPayment === undefined || dataSource[i].bhadaKaunDalega === undefined) continue;
            if (dataSource[i].transporter?.toLowerCase() === party.toLowerCase()) {
                ds.push(dataSource[i]);
            }
        }
        console.log(ds);
        console.log(displayPartyList);
        console.log('Selected Party: ', party, 'Index: ', partyIndex);
        setDisplayDataSource([...ds]);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handle_Search(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handle_Search(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        onClick={() => { setSelectedKeys([]); handle_Search([], confirm, dataIndex) }}
                    >
                        Clear
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ fontSize: 20, color: filtered ? 'red' : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <Button type="link" onClick={() => handleViewClick(record, index)}>
                    View
                </Button>
            ),
        },
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: 'LR No.',
            dataIndex: 'lrNumber',
            key: 'lrNumber',
            ...getColumnSearchProps('lrNumber'),
        },
        {
            title: 'Payment Status',
            dataIndex: 'transactionStatus',
            key: 'transactionStatus',
            render: (text, record) => (
                <p>
                    {record.transactionStatus === 'open' ? (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>
                    ) : (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>CLOSE</span>
                    )}
                </p>
            ),
            filters: [
                { text: 'Open', value: 'open' },
                { text: 'Close', value: 'close' }
            ],
            onFilter: (value, record) => {
                if (value === 'open') {
                    // Show both 'open' and empty
                    return record.transactionStatus === 'open';
                }
                // Only show 'close'
                return record.transactionStatus === 'close';
            },
            // render: (text) => { text == 'open' ? <><ExclamationOutlined />OPEN</> : <CheckOutlined /> }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => {
                let date = new Date(text);
                console.log(date, date.getDay(), date.getMonth());
                return (
                    <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                )
            }
        },
        {
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            ...getColumnSearchProps('vehicleNo'),
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
            title: 'Sender',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
            ...getColumnSearchProps('bhejneWaliParty'),
        },
        {
            title: 'Receiver',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
            ...getColumnSearchProps('paaneWaliParty'),
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
        },
        {
            title: 'Commission',
            dataIndex: 'commission',
            key: 'commission',
        },
        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
        },
        {
            title: 'Remaining Balance',
            dataIndex: 'remainingBalance',
            key: 'remainingBalance',
        },
        {
            title: 'Remark',
            key: 'remark',
            render: (text, record) => (
                <RemarkButton record={record} />
            ),
        }
    ];

    const filterMenuItems = [
        {
            label: 'Date Filter',
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

    const [open, setOpen] = useState(false);
    const showDrawer = (index) => {
        setPartySelectedForEdit(index);
        setModelPartySelected(displayPartyList[index]);
        setPartyName(displayPartyList[index].label);
        setPartyLocation(displayPartyList[index].location);
        setPartyAddress(displayPartyList[index].address);
        setPartyContact(displayPartyList[index].contact);
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
        const partyRef = ref(db, 'transporters/' + partyIds[partySelectedForEdit]);
        update(partyRef, {
            label: partyName,
            // value: partyName,
            location: partyLocation || '',
            address: partyAddress || '',
            contact: partyContact || '',
            description: partyDescription || ''
        }).then(() => {
            alert("Transporter detail Updated Successfully!!");
            return;
        });

        // let pl = partyList;
        let dpl = displayPartyList;
        dpl[partySelectedForEdit] = {
            label: partyName,
            // value: partyName,
            location: (partyLocation || ''),
            address: (partyAddress || ''),
            contact: (partyContact || ''),
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

    const handleDisplayTableChange = (list) => {
        setDisplayDataSource([...list]);
        setRefreshKey(prevKey => prevKey + 1); // Force table refresh
    }

    // Function to clear the filter
    const handleClearFilter = () => {
        setDisplayDataSource([...dataSource]);
        setFilterType('none');
    };

    const handlePartyFilterChange = (value) => {
        let displayedData = dataSource;
        let transporterSelected = partySelected.label;
        console.log('Selected Party: ', transporterSelected, 'Party for Transporter: ', value);
        let partyForTransporterSelected = value;
        let ds = [];
        if (partyForTransporterSelected === 'All') {
            for (let i = 0; i < displayedData.length; i++) {
                if (displayedData[i].transporter === transporterSelected) {
                    ds.push(displayedData[i]);
                }
            }
        }
        else {
            for (let i = 0; i < displayedData.length; i++) {
                if (displayedData[i].transporter === transporterSelected && displayedData[i].partyForTransporterPayment === partyForTransporterSelected) {
                    ds.push(displayedData[i]);
                }
            }
        }
        console.log(ds);
        setDisplayDataSource([...ds]);
    }

    // Add a handler to open the modal
    const handleViewClick = (record, index) => {
        setSelectedRow({ record, index });
        setViewModalOpen(true);
    };

    // Date filter logic
    const handleDateFilter = () => {
        if (dateRange[0] && dateRange[1]) {
            const from = dateRange[0].format('YYYY-MM-DD');
            const to = dateRange[1].format('YYYY-MM-DD');
            const filtered = displayDataSource.filter(
                item => item.date >= from && item.date <= to
            );
            // setFilteredData(filtered);
            setDisplayDataSource(filtered);
        }
    };
    const handleClearDateFilter = () => {
        setDateRange([null, null]);
        setDisplayDataSource(dataSource);
    };
    return (
        <>
            <div className={styles.container}>
                <div className={styles.part1}>
                    <Input onChange={handleSearch} placeholder='Search' />
                    <Button onClick={() => setDisplayDataSource(dataSource)} icon={<EyeTwoTone />} style={{ width: '100%' }}>
                        View All
                    </Button>
                    <div className={styles.menu} style={{ display: 'flex', height: '80vh', overflowY: "auto", backgroundColor: 'white' }}>

                        <div style={{ backgroundColor: 'white', marginLeft: '2px', borderRadius: '5px', padding: '0px 5px 0px 5px' }}>
                            {displayPartyList.map((item, index) => {
                                return (
                                    <div key={index} style={{ padding: '6px 0px 6px 0px', color: 'blue' }}>
                                        <Button onClick={() => showDrawer(index)} icon={
                                            (item.contact === undefined || item.contact === '' || item.address === undefined || item.address === '' || item.location === undefined || item.location === '') ?
                                                <span style={{ color: 'red' }}><UserOutlined /></span>
                                                :
                                                <UserOutlined />
                                        }></Button>

                                    </div>
                                )
                            })}
                        </div>

                        <Menu
                            onClick={(e) => onClick(e.key.slice(4))}
                            style={{
                                width: "100%",
                                backgroundColor: 'white'
                            }}
                            theme='light'
                            mode="inline"
                            items={displayPartyList.map((item, index) => ({
                                ...item,
                                key: `key-${index}`,
                                label: (
                                    <Tooltip title={item.label}>
                                        <span>{item.label}</span>
                                    </Tooltip>
                                ),
                            }))}

                        />
                    </div>
                </div>
                <div className={styles.part2}>
                    <div >
                        <Row style={{ width: '75vw' }}>

                            <Col>
                                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <span>From Date:</span>
                                    <DatePicker
                                        value={dateRange[0]}
                                        format={'DD-MM-YYYY'}
                                        onChange={date => setDateRange([date, dateRange[1]])}
                                        style={{ width: 140 }}
                                    />
                                    <span>To Date:</span>
                                    <DatePicker
                                        value={dateRange[1]}
                                        format={'DD-MM-YYYY'}
                                        onChange={date => setDateRange([dateRange[0], date])}
                                        style={{ width: 140 }}
                                    />
                                    <Button type="primary" onClick={handleDateFilter}>Apply</Button>
                                    <Button onClick={handleClearDateFilter}>Close</Button>
                                </div>
                            </Col>
                            <Col>
                                <Button type="primary" style={{ marginLeft: '20px' }} onClick={exportToExcel}>
                                    Export to Excel
                                </Button>
                            </Col>
                            <Col>
                                <span style={{ marginLeft: '20px' }}> Select Party : </span>
                                <Select
                                    defaultValue="none"
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={handlePartyFilterChange}
                                    options={transporterParties[partySelected.label] ? transporterParties[partySelected.label].map((party, index) => ({
                                        label: party,
                                        value: party,
                                        key: index
                                    })) : []}
                                    placeholder="Select Party"
                                />
                            </Col>

                        </Row>

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
                                                onChange={(e) => setPartyLocation(e.target.value)}
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
                                                onChange={(e) => setPartyAddress(e.target.value)}
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
                            </Form>
                        </Drawer>



                    </div>
                    <Table key={refreshKey} size="small" className={styles.table} dataSource={displayDataSource} columns={columns}
                        // expandable={{
                        //     expandedRowRender: (record, index) => <ViewPartyDetails
                        //         indexAtAllData={index}
                        //         allDataAtDisplay={displayDataSource}
                        //         setDisplayDataSource={setDisplayDataSource} data={record} vehicleData={vehicleData} bankData={bankData} handleDisplayTableChange={handleDisplayTableChange} setDataUpdateFlag={setDataUpdateFlag} />
                        //     ,
                        //     rowExpandable: (record) => true,
                        // }}
                        pagination={'none'}
                    />

                    <Modal
                        open={viewModalOpen}
                        onCancel={() => setViewModalOpen(false)}
                        footer={null}
                        width={'100%'}
                        title="Party Details"
                        destroyOnClose
                        style={{ top: 10 }}
                    >
                        {selectedRow && (
                            <ViewPartyDetails
                                indexAtAllData={selectedRow.index}
                                allDataAtDisplay={displayDataSource}
                                setDisplayDataSource={setDisplayDataSource}
                                data={selectedRow.record}
                                bankData={bankData}
                                setBankData={setBankData}
                                handleDisplayTableChange={handleDisplayTableChange}
                                setDataUpdateFlag={setDataUpdateFlag}
                            />
                        )}
                    </Modal>

                    <RemarkModal
                        open={remarkModalOpen}
                        onCancel={() => setRemarkModalOpen(false)}
                        remarkData={remarkData}
                    />

                </div>
            </div>
        </>
    );
};

export default TransporterParty;
