import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Badge, Modal, Tooltip } from 'antd';
import { BellOutlined, UserOutlined, SearchOutlined, FileTextOutlined, EyeTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import ViewPartyDetails from './ViewHareKrishnaParty';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import RemarkModal, {RemarkButton} from './common/RemarkModal';

const NaveenKakaParty = () => {
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

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [remarkData, setRemarkData] = useState([]);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [bankData, setBankData] = useState([]);
    // const [dateFilter, setDateFilter] = useState('');
    // const [filteredRows, setFilteredRows] = useState(allRows);

    useEffect(() => {
        const getData = async () => {

            const db = getDatabase();
            // Get data from database
            const starCountRef = ref(db, 'dailyEntry/');
            // console.log(starCountRef);
            let ds = []; // Data Source
            const dbref = ref(db);

            const partyRef = ref(db, 'parties/');
            let partyNameList = [];

            await get(child(dbref, 'dailyEntry')).then((snapshot) => {
                const data = snapshot.val();
                console.log(data);
                // updateStarCount(postElement, data);
                if (data) {
                    setAllTableData(data);
                    Object.keys(data).map((key, i) => {
                        for (let j = 0; j < data[key].tripDetails.length; j++) {
                            console.log(data[key].firstPayment, 'firstPayment');
                            if (data[key].firstPayment === undefined || data[key].firstPayment[j] === undefined) continue;
                            let partyName = data[key]?.firstPayment[j]?.partyForTransporterPayment || '';
                            if (partyName !== '' && !partyNameList.includes(partyName) && data[key].firstPayment[j].bhadaKaunDalega === 'NaveenKaka') {
                                partyNameList.push(partyName);
                            }
                            // partyNameList.push(data[key]?.firstPayment[j]?.partyForTransporterPayment || null);

                            let receivedAmt = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === 'NaveenKaka') ?
                                (
                                    parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                                    parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                                    parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                                    parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                                    (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                    (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                                )
                                : 0;

                            if ((data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === 'NaveenKaka')) {
                                ds.push(
                                    {
                                        partyForTransporterPayment: data[key]?.firstPayment[j]?.partyForTransporterPayment || '',
                                        key: key + j,
                                        id: i + 1,
                                        lrno: data[key]?.firstPayment[j]?.lrno || '',
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
                                        totalFreight: data[key].tripDetails[j].totalFreight,
                                        received: receivedAmt,
                                        dieselAndKmDetails: data[key].dieselAndKmDetails,
                                        tripDetails: data[key].tripDetails,
                                        driversDetails: data[key].driversDetails,
                                        kaataParchi: data[key].kaataParchi,
                                        firstPayment: data[key].firstPayment,
                                        bhadaKaunDalega: (data[key]?.firstPayment === undefined) ? null : data[key]?.firstPayment[j]?.bhadaKaunDalega,
                                        vehicleStatus: data[key].vehicleStatus,
                                        furtherPayments: data[key].furtherPayments || {},
                                        remainingBalance: (data[key].tripDetails[j].remainingBalance === undefined ? null : data[key].tripDetails[j].remainingBalance),
                                        extraAmtRemark: data[key].tripDetails[j].extraAmtRemark,
                                        pohchId: data[key].firstPayment[j].pohchId,
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
            }).catch((error) => {
                console.log(error);
            })

            const bankRef = ref(db, 'bankData/');
                    onValue(bankRef, (snapshot) => {
                        const data = snapshot.val();
                        let _bankData = [];
                        if (data !== null) {
                            for (let i = 0; i < data.data.length; i++) {
                                _bankData.push({
                                    label: data.data[i].bankName,
                                    value: data.data[i].bankName,
                                    key: data.data[i].key
                                })
                            }
                        }
                        setBankData([..._bankData]);
                    })

            let parties = []; // Data Source
            await onValue(partyRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data, 'parties');
                // updateStarCount(postElement, data);
                
                if (data !== null) {
                    Object.values(data).map((party, i) => {
                        if (partyNameList.includes(party.label)) {
                            parties.push(party);
                        }
                        // partyNameList.push(party.label);
                    })
                    setPartyIds(Object.keys(data));
                }

                // setPartyListAll([...parties]);
                setPartyList([...parties]);
                setDisplayPartyList([...parties]);
            });

            const transporterRef = ref(db, 'transporters/');
            await onValue(transporterRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data, 'transporters');
                // updateStarCount(postElement, data);
                // let transporters = []; // Data Source
                if (data !== null) {
                    Object.values(data).map((transporter, i) => {
                        if (partyNameList.includes(transporter.label)) {
                            parties.push(transporter);
                        }
                        // transporters.push(transporter);
                    })
                }
                 setPartyList([...parties]);
                setDisplayPartyList([...parties]);
                // setTransporterList([...transporters]);
            });
        }

        getData();
    }, [refreshKey]);

    // Add a handler to open the modal
    const handleViewClick = (record, index) => {
        setSelectedRow({ record, index });
        setViewModalOpen(true);
    };

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
        saveAs(data, "NaveenKaka.xlsx");
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
            // console.log(dataSource[i].firstPayment[0].bhadaKaunDalega?.toLowerCase(), party.toLowerCase());
            if (dataSource[i].firstPayment === undefined || dataSource[i].bhadaKaunDalega === undefined) continue;
            if (dataSource[i].partyForTransporterPayment?.toLowerCase() === party.toLowerCase()) {
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
            title: 'Remark',
            dataIndex: 'remark',
            render: (text, record) => (
                <RemarkButton record={record} />
            ),
        },
        {

            // width:'7%',
            title: 'Pohch Id',
            dataIndex: 'pohchId',
            key: 'pohchId',
            ...getColumnSearchProps('pohchId'),
            // render: (text, record, index) => { return index + 1; }
        },
        {
            // width:'4%',
            title: 'Payment Status',
            dataIndex: 'transactionStatus',
            key: 'transactionStatus',
            render: (text, record, index) => {
                if (text === undefined || text === null || text === '') {
                    return <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>
                }
                if (text === 'close') {
                    return <span style={{ color: 'green', fontWeight: 'bold' }}>CLOSE</span>
                } else if (text === 'open') {
                    return <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>
                } else {
                    return <span style={{ color: 'orange', fontWeight: 'bold' }}>{text}</span>
                }
                return index + 1;
            },
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
            title: 'Remaining Balance',
            dataIndex: 'remainingBalance',
            key: 'remainingBalance',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            ...getColumnSearchProps('from'),
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            ...getColumnSearchProps('to'),
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
        const partyRef = ref(db, 'parties/' + partyIds[partySelectedForEdit]);
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
        dpl[partySelectedForEdit] = {
            label: partyName,
            value: partyName,
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
                            <Col>
                                <Button onClick={handleClearFilter}>Clear Filter</Button>
                            </Col>
                            <Col>
                                <Button type="primary" style={{ marginLeft: '20px' }} onClick={exportToExcel}>
                                    Export to Excel
                                </Button>
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
                                // vehicleData={vehicleData}
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

export default NaveenKakaParty;
