import {useState, useEffect, useRef} from 'react';
import {Row, Col, Select, Table, Input, Button, Space} from 'antd';
import {SearchOutlined}  from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import styles from '../styles/Party.module.css';
import _default from 'antd/es/grid';
import Highlighter from 'react-highlight-words';
const PohchHisab = () => {
    const [allTableData, setAllTableData] = useState({});
    const [dataSource, setDataSource] = useState([]); // Table Data
    const [displayDataSource, setDisplayDataSource] = useState([]);
    const [filterType, setFilterType] = useState('none');
    const [partyList, setPartyList] = useState([{label: 'All', value: 'All'}]);
    const [partySelected, setPartySelected] = useState('All');
    const [totalPohchAmt, setTotalPohchAmt] = useState(0);
    const [totalRemaining, setTotalRemaining] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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
            let _partyList = [{label: 'All', value: 'All'}];
            let _totalRemaining = 0;
            let _totalPohchAmt = 0;
            if (data) {
                setAllTableData(data);
                let count = 1;
                Object.keys(data).map((key, i) => {
                    for(let j = 0; j < data[key].tripDetails.length; j++){
                        //console.log(data[key], j);  
                        if(data[key].firstPayment !== undefined && data[key].firstPayment[j].bhadaKaunDalega === "NaveenKaka"){
                            ds.push(
                                {
                                    key: key+j,
                                    id: count,
                                    date: data[key].date,
                                    vehicleNo: data[key].vehicleNo,
                                    partyName: data[key].firstPayment[j].partyForNaveenKaka,
                                    PohchDate: data[key].firstPayment[j].pohchDate,
                                    PohchAmt: data[key].firstPayment[j].pohchAmount,
                                    from: data[key].tripDetails[j].from,
                                    to: data[key].tripDetails[j].to,
                                    transporter: data[key].tripDetails[j].transporter,
                                    maal: data[key].tripDetails[j].maal,
                                    qty: data[key].tripDetails[j].qty,
                                    rate: data[key].tripDetails[j].rate,
                                    totalFreight: data[key].tripDetails[j].totalFreight,
                                    //received: '100000',
                                    remainingBalance: parseInt(data[key].tripDetails[j].totalFreight) - (parseInt(data[key].firstPayment[j].cashAmount || 0)+parseInt(data[key].firstPayment[j].chequeAmount || 0)+parseInt(data[key].firstPayment[j].onlineAmount || 0)),//totalFreight-(firstPaymentTotal)
                                    
                                }
                            )
                            count++;
                            _totalPohchAmt += parseInt(data[key].firstPayment[j].pohchAmount);
                            _totalRemaining += ds[ds.length - 1].remainingBalance;
                            _partyList.push({label:data[key].firstPayment[j].partyForNaveenKaka, value:data[key].firstPayment[j].partyForNaveenKaka})
                        }
                    }
                });
            }
            console.log(ds);
            ds = ds.sort(
                (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
            );
            setDisplayDataSource(ds);
            setDataSource(ds);
            setPartyList([..._partyList]);
            setTotalPohchAmt(_totalPohchAmt);
            setTotalRemaining(_totalRemaining);
        });

        

    }, []);

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

    const handle_Search = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
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

    const PohchHisabColumns = [
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
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            ...getColumnSearchProps('vehicleNo'),
        },
        {
            title: 'Pohch Courier date',
            dataIndex: 'PohchDate',
            key: 'PohchDate',
            // render: (text) => { text == 'open' ? <><ExclamationOutlined />OPEN</> : <CheckOutlined /> }
        },
        {
            title: 'Party Name',
            dataIndex: 'partyName',
            key: 'partyName',
            ...getColumnSearchProps('partyName'),
        },
        {
            title: 'Pohch Amt',
            dataIndex: 'PohchAmt',
            key: 'PohchAmt'
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
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
            title: 'Remaining Balance',
            dataIndex: 'remainingBalance',
            key: 'remainingBalance',
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
        }
    ];

    const onPartyChange = (value) => {
        setPartySelected(value);
        let data = allTableData;
        let ds = [];
        if(value === 'All'){
            setDisplayDataSource([...dataSource]);
        }
        else{
            let _dataSource = dataSource;
            ds = _dataSource.filter((item) => item.partyName === value)
            setDisplayDataSource(ds);
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div >
                        {/* <div className={styles.part2}> */}
                        <div >
                            <Row justify={'space-between'} style={{ width: '95vw' }}>
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
                                    <Select
                                        defaultValue="All"
                                        style={{
                                            width: 120,
                                        }}
                                        onChange={onPartyChange}
                                        options={partyList}
                                    />
                                </Col>
                            </Row>


                        </div>

                        <div style={{height: '75vh', background: 'white', overflowX:'auto'}}>
                            <Table size="small" className={styles.fullTable} dataSource={displayDataSource} columns={PohchHisabColumns} 
                                pagination={'none'}
                            />
                        </div>
                        <div style={{border: "1px solid black", padding: '5px', background:'white'}}>
                            <Row justify={'space-evenly'}>
                                <Col>
                                    Count: {displayDataSource.length}
                                </Col>
                                <Col>
                                    Pohch Amount Total: {totalPohchAmt}
                                </Col>
                                <Col>
                                    Total Remaining : {totalRemaining}
                                </Col>
                            </Row>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
    )
}

export default PohchHisab;