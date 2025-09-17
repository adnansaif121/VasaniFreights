import React, { useRef, useState, useEffect } from 'react';
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs, DatePicker, Pagination } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, CheckCircleFilled, WarningFilled, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);
console.log(todayDate);

const Cheque = ({ dailyEntryData }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [completeDataSource, setCompleteDataSource] = useState([]);
    const [dataSource, setDataSource] = useState([]); // Table Data
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [editingDepositDateRow, setEditingDepositDateRow] = useState(null);
    const [newDepositDate, setNewDepositDate] = useState('');
    const [exportRows, setExportRows] = useState([]);

    useEffect(() => {
        // const db = getDatabase();
        // Get data from database
        // const starCountRef = ref(db, 'dailyEntry/');
        // console.log(starCountRef);
        // onValue(starCountRef, (snapshot) => {
        // });
        if (dailyEntryData === null) return;
        const data = dailyEntryData;
        // console.log(data);
        // updateStarCount(postElement, data);
        let ds = []; // Data Source
        if (data) {
            Object.keys(data).map((key, i) => {
                for (let j = 0; j < data[key].tripDetails.length; j++) {
                    if (data[key].firstPayment !== undefined && data[key].firstPayment[j] !== undefined && data[key].firstPayment[j].chequeAmount !== '') {
                        console.log(data[key]);
                        // let _pohchId = (''+new Date().getFullYear()).substring(2) + '' + (new Date().getMonth()+1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
                        // updatePohchId(key, _pohchId);
                        ds.push(
                            {
                                date: data[key].date,
                                timestamp: key,
                                key: key,
                                id: i + 1,
                                vehicleNo: data[key].vehicleNo,
                                from: data[key].tripDetails[j].from,
                                to: data[key].tripDetails[j].to,
                                revisedTo: data[key].tripDetails[j].revisedTo,
                                paid: data[key].tripDetails[j].payStatus,
                                bhejneWaliParty: data[key].tripDetails[j].bhejneWaala,
                                paaneWaliParty: data[key].tripDetails[j].paaneWaala,
                                maal: data[key].tripDetails[j].maal,
                                qty: data[key].tripDetails[j].qty,
                                rate: data[key].tripDetails[j].rate,
                                revisedRate: data[key].tripDetails[j].revisedRate,
                                totalFreight: parseFloat(data[key].tripDetails[j].totalFreight).toFixed(2),
                                // pohchRecievedDate: data[key].firstPayment[j].pohchDate,
                                // pohchAmt: data[key].firstPayment[j].pohchAmount,
                                paymentStatus: data[key].tripDetails[j].transactionStatus,
                                courierStatus: data[key].tripDetails[j].courierStatus,
                                courierSentDate: data[key].tripDetails[j].courierSentDate,
                                pohchId: data[key].firstPayment[j].pohchId,
                                depositStatus: data[key].tripDetails[j].chequeDepositStatus,
                                depositDate: data[key].tripDetails[j].chequeDepositDate,
                                chequeNumber: data[key].firstPayment[j].chequeNumber,
                                chequeDate: data[key].firstPayment[j].chequeDate,
                                chequeAmount: data[key].firstPayment[j].chequeAmount,
                                chequeName: data[key].firstPayment[j].chequeBank,
                                tripExpense: data[key]?.driver1?.TripCash,
                                tollExpense: data[key].tripDetails[j].tollExpense,
                                UVLogsPaymentStatus: data[key].tripDetails[j].UVLogsPaymentStatus,
                            }
                        )
                    }
                }
            });
        }
        console.log(ds);
        applyDateSort(ds);
        // setDataSource(ds);
        // setCompleteDataSource(ds);

    }, [dailyEntryData])

    const applyDateSort = (ds) => {
        ds.sort(function (a, b) {
            if (a.dateToSort === b.dateToSort) {
                console.log('same date found')
                return new Date(parseInt(b.timestamp)) - new Date(parseInt(a.timestamp));
            }
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });

        setDataSource(ds);
        setCompleteDataSource(ds);
    }

    const handle_Search = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const applyDateFilter = (e) => {
        let startDate = fromDate;
        let endDate = toDate;
        console.log(startDate, endDate);
        if (startDate === null || endDate === null) {
            alert("Please select start and end date");
            return;
        }
        let _startDate = new Date(startDate).getTime();
        let _endDate = new Date(endDate).getTime();
        // console.log(completeDataSource);
        let _displayDataSource = completeDataSource.filter(
            (item) => {
                let itemDate = new Date(item.date).getTime();
                console.log(item.date, itemDate);
                return itemDate >= _startDate && itemDate <= _endDate;
            }
        )
        setDataSource(_displayDataSource);

    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                {dataIndex === 'chequeDate' || dataIndex === 'date' ? (
                    <DatePicker
                        format="DD-MM-YYYY"
                        style={{ marginBottom: 8, display: 'block' }}
                        value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
                        onChange={date => setSelectedKeys(date ? [date.format('YYYY-MM-DD')] : [])}
                        onPressEnter={() => confirm()}
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
                    />
                )}

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
            if (dataIndex === 'chequeDate' || dataIndex === 'date') {
                if (!record[dataIndex]) return false;
                const recordDate = dayjs(record[dataIndex]).format('YYYY-MM-DD');
                return recordDate === value;
            }
            if (dataIndex === 'courierStatus' && value === 'pending') {
                return record[dataIndex] === null || record[dataIndex] === undefined || record[dataIndex] === '';
            }
            // dataIndex === 'pohchRecievedDate' && value !== null ?  `${new Date(record[dataIndex]).getDate()}/${new Date(record[dataIndex]).getMonth()+1}/${new Date(record[dataIndex]).getFullYear()}` : 
            return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
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
            width: '3%',
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            render: (text, record, index) => { return index + 1; }
        },
        {
            width: '4%',
            title: 'Pay',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            filters: [
                { text: 'Open', value: 'open' },
                { text: 'Close', value: 'close' }
            ],
            onFilter: (value, record) => {
                if (value === 'open') {
                    // Show both 'open' and empty
                    return record.paymentStatus === 'open' || record.paymentStatus === '' || record.paymentStatus === undefined || record.paymentStatus === null;
                }
                // Only show 'close'
                return record.paymentStatus === 'close';
            },
            render: (text, record, index) => {
                if (text === undefined || text === null || text === '') {
                    return <span style={{ color: 'red', fontSize: '30px' }}><WarningFilled /></span>
                }
                if (text === 'close') {
                    return <span style={{ color: 'green', fontSize: '30px' }}><CheckCircleFilled /></span>
                } else if (text === 'open') {
                    return <span style={{ color: 'red', fontSize: '30px' }}><WarningFilled /></span>
                } else {
                    return <span style={{ color: 'orange', fontSize: '30px' }}>{text}</span>
                }
                return index + 1;
            }
        },
        {
            title: 'Deposit Status',
            dataIndex: 'depositStatus',
            key: 'depositStatus',
            ...getColumnSearchProps('depositStatus'),
            // Increase the width of this column
            width: '8%',
            render: (text, record, index) => {
                if (text === undefined || text === null || text === '') {
                    // return a radio button as Sent or Pending
                    return (
                        <>
                            {/* <Radio.Group onChange={(e) => text=e.target.value} options={[{label: 'Sent', value: 'Sent'}, {label: 'Pending', value: 'Pending'}]} defaultValue="sent" block buttonStyle="solid"/> */}
                            <span style={{ color: 'red' }}><WarningFilled />Pending</span>
                            <Button
                                type='primary'
                                size='small'
                                onClick={() => {
                                    // Ask for Confirmation
                                    if (!confirm("Are you sure you want to update the deposit status?")) {
                                        return;
                                    }
                                    // update the deposit status in the database
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        chequeDepositStatus: 'Sent'
                                    }).then(() => {
                                        alert("Deposit Status Updated Successfully!!");
                                        return;
                                    })
                                }}>Click For Sent</Button>
                        </>

                    )
                }
                return (
                    text === 'Sent' ?
                        <span style={{ color: 'green' }}><CheckCircleFilled />Sent</span> : <span style={{ color: 'red' }}><WarningFilled />Pending</span>

                )
            }
        },
        {
            title: 'Deposit Date',
            dataIndex: 'depositDate',
            key: 'depositDate',
            width: '7%',
            render: (text, record, index) => {
                // If editing this row, show input and save button
                if (editingDepositDateRow === record.key) {
                    return (
                        <>
                            <Input
                                size='small'
                                type="date"
                                value={newDepositDate}
                                onChange={e => setNewDepositDate(e.target.value)}
                            />
                            <Button
                                size='small'
                                onClick={() => {
                                    if (!newDepositDate) {
                                        alert("Please select a date");
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to update the deposit date?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        chequeDepositDate: newDepositDate
                                    }).then(() => {
                                        alert("Cheque Deposit Date Updated Successfully!!");
                                        setEditingDepositDateRow(null);
                                        setNewDepositDate('');
                                    });
                                }}
                                style={{ marginLeft: 4 }}
                            >Save</Button>
                            <Button
                                size='small'
                                onClick={() => {
                                    setEditingDepositDateRow(null);
                                    setNewDepositDate('');
                                }}
                                style={{ marginLeft: 4 }}
                            >Cancel</Button>
                        </>
                    );
                }
                // If no date, show input and save as before
                if (text === undefined || text === null || text === '') {
                    return (
                        <>
                            <Input
                                size='small'
                                type="date"
                                value={newDepositDate}
                                onChange={e => setNewDepositDate(e.target.value)}
                            />
                            <Button
                                size='small'
                                onClick={() => {
                                    if (!newDepositDate) {
                                        alert("Please select a date");
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to update the deposit date?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        chequeDepositDate: newDepositDate
                                    }).then(() => {
                                        alert("Cheque Deposit Date Updated Successfully!!");
                                        setNewDepositDate('');
                                    });
                                }}
                                style={{ marginLeft: 4 }}
                            >Save</Button>
                        </>
                    );
                }
                // Show date and edit button
                let date = new Date(text);
                return (
                    <>
                        <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                        <Button
                            size='small'
                            icon={<EditOutlined />}
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setEditingDepositDateRow(record.key);
                                setNewDepositDate(text ? text.split('T')[0] : '');
                            }}
                        >Edit</Button>
                    </>
                );
            }
        },
        {
            width: '5%',
            title: 'Cheque No.',
            dataIndex: 'chequeNumber',
            key: 'chequeNumber',
            // fixed: 'left',
            ...getColumnSearchProps('chequeNumber'),
        },
        {
            width: '5%',
            title: 'Cheque Date',
            dataIndex: 'chequeDate',
            key: 'chequeDate',
            ...getColumnSearchProps('chequeDate'),
            render: (text, record) => {
                if (text === undefined || text === null || text === '') {
                    return <>
                        <Input size='small' type="date" onChange={(e) => text = e.target.value}></Input>
                        <Button
                            // type='primary'
                            size='small'
                            onClick={() => {
                                // check if the text is empty
                                if (text === undefined || text === null || text === '') {
                                    alert("Please select a date");
                                    return;
                                }
                                // Ask for Confirmation
                                if (!confirm("Are you sure you want to update the cheque date?")) {
                                    return;
                                }
                                // update the cheque date in the database
                                const db = getDatabase();
                                const starCountRef = ref(db, 'dailyEntry/' + record.key + '/firstPayment/0/');
                                update(starCountRef, {
                                    chequeDate: text
                                }).then(() => {
                                    alert("Cheque Date Updated Successfully!!");
                                    return;
                                })
                            }}>Save</Button>
                    </>;
                }
                let date = new Date(text);

                return (
                    <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                )
            }
        },
        {
            width: '5%',
            title: 'Cheque Amt',
            dataIndex: 'chequeAmount',
            key: 'chequeAmount',
        },
        {
            width: '5%',
            title: 'Cheque Name',
            dataIndex: 'chequeName',
            key: 'chequeName',
        },
        {
            width: '7%',
            title: 'Trip Start Date',
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
            width: '9%',
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            // fixed: 'left',   
            ...getColumnSearchProps('vehicleNo'),
        },
        {
            width: '7%',
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: '7%',
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: 40,
            title: 'Sender',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
        },
        {
            width: 40,
            title: 'Receiver',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
        },
        {
            width: 40,
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: 40,
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',

        },
        {
            width: 40,
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',

        },
        {
            width: 40,
            title: 'Total Freight',
            dataIndex: 'totalFreight',
            key: 'totalFreight',
            render: (text, record) => {
                // calculate the total freight and return
                let totalFreight = text;
                if (record.revisedRate !== undefined && record.qty !== undefined) {
                    totalFreight = record.qty * record.revisedRate;
                }
                else if (record.rate !== undefined && record.qty !== undefined) {
                    totalFreight = record.qty * record.rate;
                }
                return (
                    <span>{totalFreight}</span>
                )
            }
        }

    ];

    const exportToExcel = () => {
        // Get the list of keys to export from columns (skip columns without dataIndex)
        const exportKeys = columns
            .filter(col => col.dataIndex)
            .map(col => col.dataIndex);

        // Prepare data: only include keys present in exportKeys
        let array = [];
        if((fromDate !== null || toDate !== null)|| exportRows.length === 0)array = dataSource;
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
        saveAs(data, "cheque.xlsx");
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div>
                    <span style={{ marginLeft: '40px' }}>From Date:</span>
                    <Input style={{ width: "20%", marginLeft: '10px' }} type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <span style={{ marginLeft: '40px' }}>To Date:</span>
                    <Input style={{ width: "20%", marginLeft: '10px' }} type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    <Button onClick={applyDateFilter}>Apply Filter</Button>
                    <Button onClick={() => {
                        setDataSource(completeDataSource);
                        setFromDate(null);
                        setToDate(null);
                    }}>Clear Date</Button>
                </div>
                <div>
                    <Button type="primary" style={{ margin: '20px' }} onClick={exportToExcel}>
                        Export to Excel
                    </Button>
                </div>


                {/* <div>
                    <Pagination
                        pageSize={20}
                        current={currentPage}
                        total={1000} // Or your dynamic total
                        showSizeChanger={false}
                        onChange={handleTableChange}
                    />
                </div> */}
            </div>

            <div style={{ width: "100vw", overflowX: 'scroll', overflowY: 'scroll', height: '84vh', backgroundColor: 'white' }}>
                <Table scroll={{ x: 2000, y: 400 }} bordered style={{ zIndex: '100', height: '100%' }} size="small" dataSource={dataSource} columns={columns} pagination={false} onChange={(pagination, filters, sorter, extra) => {
                    setExportRows(extra.currentDataSource); // This is the filtered/sorted data
                }} />
            </div>

        </>
    )
}

export default Cheque;
