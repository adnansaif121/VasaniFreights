import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Party.module.css';
import { Input, Card, Menu, Table, Form, Select, Button, Row, Col, Radio, Dropdown, Space, Modal, Typography, Drawer, DatePicker, Badge, Tooltip, Pagination } from 'antd';
import { BellOutlined, UserOutlined, SearchOutlined, FileTextOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, ExclamationOutlined, CheckOutlined, DownOutlined, ExclamationCircleTwoTone, EyeTwoTone } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, get, child, update } from "firebase/database";
import ViewPartyDetails from './ViewHareKrishnaParty';
import Highlighter from 'react-highlight-words';
import RemarkModal, { RemarkButton } from './common/RemarkModal';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Party = ({ dailyEntryData, partyData, bankData, setBankData }) => {
    const [partyList, setPartyList] = useState([]);
    const [displayPartyList, setDisplayPartyList] = useState([]);
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
    const [dateRange, setDateRange] = useState([null, null]);
    const [exportRows, setExportRows] = useState([]);
    // const [bankData, setBankData] = useState([]);

    const handleViewClick = (record, index) => {
        setSelectedRow({ record, index });
        setViewModalOpen(true);
    };
    useEffect(() => {
        const db = getDatabase();
        // Get data from database
        const starCountRef = ref(db, 'dailyEntry/');
        // console.log(starCountRef);
        let ds = []; // Data Source
        const dbref = ref(db);

        const partyRef = ref(db, 'parties/');
        let partyNameList = [];
        // onValue(partyRef, (snapshot) => {
        // });
        // const data = snapshot.val();
        // console.log(data, 'parties');
        // updateStarCount(postElement, data);
        let parties = []; // Data Source
        if (partyData !== null) {
            Object.values(partyData).map((party, i) => {
                parties.push(party);
                partyNameList.push(party.label);
            })
            setPartyIds(Object.keys(partyData));
        }

        // setPartyListAll([...parties]);
        setPartyList([...parties]);
        setDisplayPartyList([...parties]);

        // const bankRef = ref(db, 'bankData/');
        // onValue(bankRef, (snapshot) => {
        //     const data = snapshot.val();
        //     let _bankData = [];
        //     if (data !== null) {
        //         for (let i = 0; i < data.data.length; i++) {
        //             _bankData.push({
        //                 label: data.data[i].bankName,
        //                 value: data.data[i].bankName,
        //                 key: data.data[i].key
        //             })
        //         }
        //     }
        //     setBankData([..._bankData]);
        // })

        // get(child(dbref, 'dailyEntry')).then((snapshot) => {
        // }).catch((error) => {
        //     console.log(error);
        // })
        const data = dailyEntryData;
        console.log(data);
        // updateStarCount(postElement, data);
        if (data) {
            setAllTableData(data);
            Object.keys(data).map((key, i) => {
                for (let j = 0; j < data[key].tripDetails.length; j++) {

                    let receivedAmt = (data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && partyNameList.includes(data[key].firstPayment[j].bhadaKaunDalega || "nn")) ?
                        (
                            parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                            parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                            parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                            parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                            (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                            (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                        )
                        : 0;

                    if ((data[key].firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined && partyNameList.includes(data[key].firstPayment[j].bhadaKaunDalega || "nn"))) {
                        ds.push(
                            {
                                key: key + j,
                                id: i + 1,
                                date: data[key].date,
                                vehicleNo: data[key].vehicleNo,
                                transactionStatus: data[key].tripDetails[j].transactionStatus || 'open',
                                mt: data[key].mt,
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
        console.log(ds);

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

        // console.log(displayPartyList[partyIndex]);
        // console.log(e.item.props.value);

        let party = displayPartyList[partyIndex].label;
        let ds = [];
        console.log(dataSource);
        for (let i = 0; i < dataSource.length; i++) {
            // console.log(dataSource[i].firstPayment[0].bhadaKaunDalega?.toLowerCase(), party.toLowerCase());
            if (dataSource[i].firstPayment === undefined || dataSource[i].bhadaKaunDalega === undefined) continue;
            if (dataSource[i].bhadaKaunDalega?.toLowerCase() === party.toLowerCase()) {
                ds.push(dataSource[i]);
            }
        }
        console.log(ds);
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
                {dataIndex === 'date' ? (
                    <DatePicker
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
                    />
                ) : (
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
                    />)}
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
        onFilter: (value, record) => {
            if (dataIndex === 'date') {
                if (!record[dataIndex]) return false;
                const recordDate = dayjs(record[dataIndex]).format('YYYY-MM-DD');
                return recordDate === value;
            }
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        },
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
            ...getColumnSearchProps('date'),
            render: (text) => {
                let date = new Date(text);
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
            ...getColumnSearchProps('from'),
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            ...getColumnSearchProps('to'),
        },
        {
            title: 'Transporter',
            dataIndex: 'transporter',
            key: 'transporter',
            ...getColumnSearchProps('transporter'),
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
            title: 'Remark',
            key: 'remark',
            render: (text, record) => (
                <RemarkButton record={record} />
            ),
        },
    ];

    const exportToExcel = () => {
        // Get the list of keys to export from columns (skip columns without dataIndex)
        const exportKeys = columns
            .filter(col => col.dataIndex)
            .map(col => col.dataIndex);

        // Prepare data: only include keys present in exportKeys
        let array = [];
        if((dateRange[0] !== null && dateRange[1] !== null)|| exportRows.length === 0)array = displayDataSource;
        else array = exportRows;
        const exportData = array.map(row => {
            const filteredRow = {};
            exportKeys.forEach(key => {
                filteredRow[key] = row[key];
            });
            return filteredRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Party.xlsx");
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
        // console.log('Edit Party');
        // console.log(partySelected);
        const db = getDatabase();
        const partyRef = ref(db, 'parties/' + partyIds[partySelectedForEdit]);
        update(partyRef, {
            label: partyName,
            value: partyName,
            location: partyLocation || '',
            address: partyAddress || '',
            contact: partyContact || '',
            description: partyDescription || '',
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

    const handleDisplayTableChange = (list) => {
        setDisplayDataSource([...list]);
        setRefreshKey(prevKey => prevKey + 1); // Force table refresh
    }

    // Date filter logic
    const handleDateFilter = () => {
        if (dateRange[0] && dateRange[1]) {
            const from = dateRange[0].format('YYYY-MM-DD');
            const to = dateRange[1].format('YYYY-MM-DD');
            const filtered = dataSource.filter(
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
                        View All   </Button>
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

                        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <div>
                                <span>From Date:</span>
                                <DatePicker
                                    value={dateRange[0]}
                                    format={"DD-MM-YYYY"}
                                    onChange={date => setDateRange([date, dateRange[1]])}
                                    style={{ width: 140 }}
                                />
                                <span>To Date:</span>
                                <DatePicker
                                    value={dateRange[1]}
                                    format={"DD-MM-YYYY"}
                                    onChange={date => setDateRange([dateRange[0], date])}
                                    style={{ width: 140 }}
                                />
                                <Button type="primary" onClick={handleDateFilter}>Apply</Button>
                                <Button onClick={handleClearDateFilter}>Close</Button>
                            </div>
                            <Button type="primary" onClick={exportToExcel} style={{ marginRight: '20px' }}>
                                Export to Excel
                            </Button>
                        </div>
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

                    <Table key={refreshKey} size="small" className={styles.table} dataSource={displayDataSource} columns={columns} onChange={(pagination, filters, sorter, extra) => {
                        setExportRows(extra.currentDataSource); // This is the filtered/sorted data
                    }}
                    // expandable={{
                    //     expandedRowRender: (record, index) => <ViewPartyDetails
                    //         indexAtAllData={index}
                    //         allDataAtDisplay={displayDataSource} 
                    //         setDisplayDataSource={setDisplayDataSource} data={record} vehicleData={vehicleData} bankData={bankData} handleDisplayTableChange={handleDisplayTableChange} setDataUpdateFlag={setDataUpdateFlag} />
                    //     ,
                    //     rowExpandable: (record) => true,
                    // }}
                    // pagination={false}
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

export default Party;
