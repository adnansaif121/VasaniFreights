import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Typography, Drawer, DatePicker, Badge } from 'antd';
import { BellOutlined, UserOutlined, SearchOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import ViewPartyDetails from './ViewHareKrishnaParty';
import Highlighter from 'react-highlight-words';

const bankData = [
    {
        key: "0",
        label: "CV ICICI",
        value: "CV ICICI",
    },
    {
        key: "1",
        label: "CCV ICICI",
        value: "CCV ICICI"
    },
    {
        key: "2",
        label: "BV ICICI",
        value: "BV ICICI"
    },
    {
        key: "3",
        label: "RV ICICI",
        value: "RV ICICI"
    },
    {
        key: "4",
        label: "NV ICICI",
        value: "NV ICICI"
    },
    {
        key: "5",
        label: "NCV ICICI",
        value: "NCV ICICI"
    },
    {
        key: "6",
        label: "AV ICICI",
        value: "AV ICICI"
    },
    {
        key: "7",
        label: "VV ICICI",
        value: "VV ICICI"
    },
    {
        key: "8",
        label: "KV ICICI",
        value: "KV ICICI"
    },
    {
        key: "9",
        label: "JV ICICI",
        value: "JV ICICI"
    },
    {
        key: "10",
        label: "CV HUF ICICI",
        value: "CV HUF ICICI"
    },
    {
        key: "11",
        label: "CCV HUF ICICI",
        value: "CCV HUF ICICI"
    },
    {
        key: "12",
        label: "BV HUF ICICI",
        value: "BV HUF ICICI"
    },
    {
        key: "13",
        label: "RV HUF HDFC",
        value: "RV HUF HDFC"
    },
    {
        key: "14",
        label: "RAMA ICICI",
        value: "RAMA ICICI"
    },
    {
        key: "15",
        label: "HKL ICICI",
        value: "HKL ICICI"
    },
    {
        key: "16",
        label: "BV HDFC",
        value: "BV HDFC"
    },
    {
        key: "17",
        label: "KV HDFC",
        value: "KV HDFC"
    },
    {
        key: "18",
        label: "JV HDFC",
        value: "JV HDFC"
    },
    {
        key: "19",
        label: "RKV HDFC",
        value: "RKV HDFC"
    },
    {
        key: "20",
        label: "SV HDFC",
        value: "SV HDFC"
    },
    {
        key: "21",
        label: "DV HDFC",
        value: "DV HDFC"
    },
    {
        key: "22",
        label: "UV GLOBAL HDFC",
        value: "UV GLOBAL HDFC"
    },
    {
        key: "23",
        label: "UV LOGI HDFC",
        value: "UV LOGI HDFC"
    },
    {
        key: "24",
        label: "CCV HDFC",
        value: "CCV HDFC"
    }
];
const vehicleData =
    [{
        key: 0,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 AC 1411",
        value: "MH 18 AC 1411",
        label: "MH 18 AC 1411"
    },
    {
        key: 1,
        owner: "Asha Vasani",
        vehicleNo: "MH 18 AC 1511",
        value: "MH 18 AC 1511",
        label: "MH 18 AC 1511"
    },
    {
        key: 2,
        owner: "Neha Vasani",
        vehicleNo: "MH 18 AP 1811",
        value: "MH 18 AP 1811",
        label: "MH 18 AP 1811"
    },
    {
        key: 3,
        owner: "Nita Vasani",
        vehicleNo: "MH 18 AP 1911",
        value: "MH 18 AP 1911",
        label: "MH 18 AP 1911"
    },
    {
        key: 4,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BA 2011",
        value: "MH 18 BA 2011",
        label: "MH 18 BA 2011"
    },
    {
        key: 5,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2111",
        value: "MH 18 BA 2111",
        label: "MH 18 BA 2111"
    },
    {
        key: 6,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BA 2311",
        value: "MH 18 BA 2311",
        label: "MH 18 BA 2311"
    },
    {
        key: 7,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BA 2411",
        value: "MH 18 BA 2411",
        label: "MH 18 BA 2411"
    },
    {
        key: 8,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2611",
        value: "MH 18 BA 2611",
        label: "MH 18 BA 2611"
    },
    {
        key: 9,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2711",
        value: "MH 18 BA 2711",
        label: "MH 18 BA 2711"
    },
    {
        key: 10,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 2811",
        value: "MH 18 BG 2811",
        label: "MH 18 BG 2811"
    },
    {
        key: 11,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 2911",
        value: "MH 18 BG 2911",
        label: "MH 18 BG 2911"
    },
    {
        key: 12,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 3011",
        value: "MH 18 BG 3011",
        label: "MH 18 BG 3011"
    },
    {
        key: 13,
        owner: "Nita Vasani",
        vehicleNo: "MH 18 BG 3111",
        value: "MH 18 BG 3111",
        label: "MH 18 BG 3111"
    },
    {
        key: 14,
        owner: "Bhavesh Vasani HUF",
        vehicleNo: "MP 46 H  3211",
        value: "MP 46 H  3211",
        label: "MP 46 H  3211"
    },
    {
        key: 15,
        owner: "Chandresh Vasani HUF",
        vehicleNo: "MP 46 H  3311",
        value: "MP 46 H  3311",
        label: "MP 46 H  3311"
    },
    {
        key: 16,
        owner: "Chetan Vasani HUF",
        vehicleNo: "MP 46 H  3411",
        value: "MP 46 H  3411",
        label: "MP 46 H  3411"
    },
    {
        key: 17,
        owner: "Rajesh Vasani HUF",
        vehicleNo: "MP 46 H  3511",
        value: "MP 46 H  3511",
        label: "MP 46 H  3511"
    },
    {
        key: 18,
        owner: "Veena Vasani",
        vehicleNo: "MH 18 BG 3711",
        value: "MH 18 BG 3711",
        label: "MH 18 BG 3711"
    },
    {
        key: 19,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BG 3811",
        value: "MH 18 BG 3811",
        label: "MH 18 BG 3811"
    },
    {
        key: 20,
        owner: "Chetan Vasani",
        vehicleNo: "MH 18 BH 3911",
        value: "MH 18 BH 3911",
        label: "MH 18 BH 3911"
    },
    {
        key: 21,
        owner: "Chetan Vasani",
        vehicleNo: "MH 18 BH 4011",
        value: "MH 18 BH 4011",
        label: "MH 18 BH 4011"
    },
    {
        key: 22,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BH 4211",
        value: "MH 18 BH 4211",
        label: "MH 18 BH 4211"
    },
    {
        key: 23,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BH 4311",
        value: "MH 18 BH 4311",
        label: "MH 18 BH 4311"
    },
    {
        key: 24,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BZ 4611",
        value: "MH 18 BZ 4611",
        label: "MH 18 BZ 4611"
    },
    {
        key: 25,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BZ 4711",
        value: "MH 18 BZ 4711",
        label: "MH 18 BZ 4711"
    },
    {
        key: 26,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BZ 4811",
        value: "MH 18 BZ 4811",
        label: "MH 18 BZ 4811"
    },
    {
        key: 27,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BZ 4911",
        value: "MH 18 BZ 4911",
        label: "MH 18 BZ 4911"
    }
    ]

const HareKrishna = () => {
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
                            if (partyName !== '' && !partyNameList.includes(partyName)) {
                                partyNameList.push(partyName);
                            }
                            // partyNameList.push(data[key]?.firstPayment[j]?.partyForTransporterPayment || null);

                            let receivedAmt = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === 'Hare Krishna') ?
                                (
                                    parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                                    parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                                    parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                                    parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                                    (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                    (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                                )
                                : 0;

                            if ((data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === 'Hare Krishna')) {
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
            }).catch((error) => {
                console.log(error);
            })

            await onValue(partyRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data, 'parties');
                // updateStarCount(postElement, data);
                let parties = []; // Data Source
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
        }

        getData();
    }, [refreshKey]);

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
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
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
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: 'LR No.',
            dataIndex: 'lrno',
            key: 'lrno',
            ...getColumnSearchProps('lrno'),
        },
        {
            title: 'Payment Status',
            dataIndex: 'transactionStatus',
            key: 'transactionStatus',
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
            title: 'Sender',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
            ...getColumnSearchProps('bhejneWaliParty'),
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
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
            dataIndex: 'transporterCommission',
            key: 'transporterCommission',
        },
        {
            title: 'Advance',
            dataIndex: 'advanceReceived',
            key: 'advanceReceived',
        },
        {
            title: 'Remaining Balance',
            dataIndex: 'remainingBalance',
            key: 'remainingBalance',
        },
        {
            title: 'Remark',
            dataIndex: 'extraAmtRemark',
            key: 'extraAmtRemark',
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
                            items={displayPartyList}

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
                    <Table key={refreshKey} size="small" className={styles.table} dataSource={displayDataSource} columns={columns} expandable={{
                        expandedRowRender: (record, index) => <ViewPartyDetails
                            indexAtAllData={index}
                            allDataAtDisplay={displayDataSource}
                            setDisplayDataSource={setDisplayDataSource} data={record} vehicleData={vehicleData} bankData={bankData} handleDisplayTableChange={handleDisplayTableChange} setDataUpdateFlag={setDataUpdateFlag} />
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

export default HareKrishna;
