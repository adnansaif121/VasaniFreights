import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs, DatePicker } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, CheckCircleFilled, WarningFilled, EditOutlined } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import ViewDailyEntry from './ViewDailyEntry';
// import { vehicleData } from './data';
import CreatePartyForm from './common/CreatePartyForm';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
// const ViewDailyEntry = dynamic(() => import('../components/ViewDailyEntry'), {ssr: false});
// import { render } from 'react-dom';
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

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);
console.log(todayDate);

const Pohch = () => {
    const [driverForm] = Form.useForm();
    const [createPartyForm] = Form.useForm();
    const [driverList, setDriverList] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    // Locations list
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    // Maal List
    const [MaalList, setMaalList] = useState([
        {
            value: 'Aata',
            label: 'Aata',
        },
        {
            value: 'Maida',
            label: 'Maida',
        },
        {
            value: 'Scrape',
            label: 'Scrape',
        },
        {
            value: 'Loha',
            label: 'Loha',
        },
    ]);
    const [newMaal, setNewMaal] = useState('');
    //All Party List for Party Select
    const [partyListAll, setPartyListAll] = useState([]);
    const [newParty, setNewParty] = useState('');
    // All Transporter List for Transporter Select
    const [transporterList, setTransporterList] = useState([]);
    const [newTransporter, setNewTransporter] = useState('');
    // Data to display in the table
    const [completeDataSource, setCompleteDataSource] = useState([]);
    const [dataSource, setDataSource] = useState([]); // Table Data
    //Bank
    const [newBank, setNewBank] = useState('');
    const [bankData, setBankData] = useState([]);
    const [dateFilter, setDateFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

    // MODAL VARIABLES:
    const [partyModal, setPartyModal] = useState({});
    const [vehicleData, setVehicleData] = useState([]);
    const [newVehicleNo, setNewVehicleNo] = useState('');
    // const [driverModal, setDriverModal] = useState({});
    const [toggleKaataParchi, setToggleKaataParchi] = useState(false);

    const [driverModal, setDriverModal] = useState({
        label: '',
        value: '',
        location: '',
        LicenseDate: '',
        contact: '',
        licenseDocument: null, // Add this new field
    });
    const [key, setKey] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [editingCourierDateRow, setEditingCourierDateRow] = useState(null);
    const [newCourierDate, setNewCourierDate] = useState('');

    useEffect(() => {
        const db = getDatabase();
        // set(ref(db, 'users/' + '0'), {
        //   username: 'Adnan',
        //   email: 'adnan@tcs.com',
        // });
        // Get data from database
        const starCountRef = ref(db, 'dailyEntry/');
        // console.log(starCountRef);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            // updateStarCount(postElement, data);
            let ds = []; // Data Source
            if (data) {
                Object.keys(data).map((key, i) => {
                    for (let j = 0; j < data[key].tripDetails.length; j++) {
                        if (data[key].firstPayment !== undefined && data[key].firstPayment[j] !== undefined && data[key].firstPayment[j].pohchAmount !== null && data[key].firstPayment[j].pohchAmount !== '') {
                            console.log(data[key]);
                            // let _pohchId = (''+new Date().getFullYear()).substring(2) + '' + (new Date().getMonth()+1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
                            // updatePohchId(key, _pohchId);
                            ds.push(
                                {
                                    timestamp: key,
                                    date: data[key].date,
                                    key: key,
                                    id: i + 1,
                                    vehicleNo: data[key].vehicleNo,
                                    from: data[key].tripDetails[j].from,
                                    to: data[key].tripDetails[j].to,
                                    paid: data[key].tripDetails[j].payStatus,
                                    bhejneWaliParty: data[key].tripDetails[j].bhejneWaala,
                                    paaneWaliParty: data[key].tripDetails[j].paaneWaala,
                                    maal: data[key].tripDetails[j].maal,
                                    qty: data[key].tripDetails[j].qty,
                                    rate: data[key].tripDetails[j].rate,
                                    totalFreight: data[key].tripDetails[j].totalFreight,
                                    pohchRecievedDate: data[key].firstPayment[j].pohchDate,
                                    pohchAmt: data[key].firstPayment[j].pohchAmount,
                                    paymentStatus: data[key].tripDetails[j].transactionStatus,
                                    courierStatus: data[key].tripDetails[j].courierStatus,
                                    courierSentDate: data[key].tripDetails[j].courierSentDate,
                                    pohchId: data[key].firstPayment[j].pohchId,
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
        });
    }, [])

    const exportToExcel = () => {
        // Prepare data: remove unwanted fields if needed
        const exportData = dataSource.map(row => {
            const { key, ...rest } = row; // remove key if you don't want it in Excel
            return rest;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "pohch.xlsx");
    };

    const updatePohchId = async (key) => {
        const pohchId = ('' + new Date().getFullYear()).substring(2) + '' + (new Date().getMonth() + 1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);

        const db = getDatabase();
        const starCountRef = ref(db, 'dailyEntry/' + key + '/firstPayment/0/');
        await update(starCountRef, {
            pohchId: pohchId
        }).then(() => {
            // alert("Pohch Id Updated Successfully!!");
            return;
        })
    }

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

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
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
        console.log(completeDataSource);
        let _displayDataSource = completeDataSource.filter(
            (item) => {
                let itemDate = new Date(item.date).getTime();
                console.log(item.date, itemDate);
                return itemDate >= _startDate && itemDate <= _endDate;
            }
        )
        setDataSource(_displayDataSource);
        setDateFilter(e.target.value);
        // setDisplayDataSource(_displayDataSource);
        // setFromDate(null);

    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                {dataIndex === 'courierSentDate' || dataIndex === 'date' || dataIndex === 'pohchRecievedDate' ? (
                    <DatePicker
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
            if (dataIndex === 'courierStatus' && value === 'pending') {
                return record[dataIndex] === '' || record[dataIndex] === undefined || record[dataIndex] === null;
            }
            if (dataIndex === 'courierSentDate' || dataIndex === 'date' || dataIndex === 'pohchRecievedDate') {
                // Compare only the date part (YYYY-MM-DD)
                if (!record[dataIndex]) return false;
                const recordDate = dayjs(record[dataIndex]).format('YYYY-MM-DD');
                return recordDate === value;
            }
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
            render: (text, record, index) => { return index + 1; }
        },
        {
            width: '4%',
            title: 'Pay Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            // ...getColumnSearchProps('paymentStatus'),
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
                    return <span style={{ color: 'red' }}><WarningFilled /></span>
                }
                if (text === 'close') {
                    return <span style={{ color: 'green' }}><CheckCircleFilled /></span>
                } else if (text === 'open') {
                    return <span style={{ color: 'red' }}><WarningFilled /></span>
                } else {
                    return <span style={{ color: 'orange' }}>{text}</span>
                }
                return index + 1;
            }
        },
        {
            title: 'Courier Status',
            dataIndex: 'courierStatus',
            key: 'courierStatus',
            // ...getColumnSearchProps('courierStatus'),
            // Increase the width of this column
            width: '8%',
            filters: [
                { text: 'Sent', value: 'Sent' },
                { text: 'Pending', value: '' }
            ],
            onFilter: (value, record) => {
                if (value === 'Sent') {
                    // Show both 'Sent' and empty
                    return record.courierStatus === 'Sent';
                }
                // Only show 'Pending'
                return record.courierStatus === '' || record.courierStatus === undefined || record.courierStatus === null;
            },
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
                                    if (!confirm("Are you sure you want to update the courier status?")) {
                                        return;
                                    }
                                    // update the courier status in the database
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        courierStatus: 'Sent'
                                    }).then(() => {
                                        alert("Courier Status Updated Successfully!!");
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
            title: 'Courier Date',
            dataIndex: 'courierSentDate',
            key: 'courierSentDate',
            ...getColumnSearchProps('courierSentDate'),
            width: '7%',
            render: (text, record, index) => {
                // If editing this row, show input and save/cancel buttons
                if (editingCourierDateRow === record.key) {
                    return (
                        <>
                            <Input
                                size='small'
                                type="date"
                                value={newCourierDate}
                                onChange={e => setNewCourierDate(e.target.value)}
                            />
                            <Button
                                size='small'
                                onClick={() => {
                                    if (!newCourierDate) {
                                        alert("Please select a date");
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to update the courier date?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        courierSentDate: newCourierDate
                                    }).then(() => {
                                        alert("Courier Date Updated Successfully!!");
                                        setEditingCourierDateRow(null);
                                        setNewCourierDate('');
                                    });
                                }}
                                style={{ marginLeft: 4 }}
                            >Save</Button>
                            <Button
                                size='small'
                                onClick={() => {
                                    setEditingCourierDateRow(null);
                                    setNewCourierDate('');
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
                                value={newCourierDate}
                                onChange={e => setNewCourierDate(e.target.value)}
                            />
                            <Button
                                size='small'
                                onClick={() => {
                                    if (!newCourierDate) {
                                        alert("Please select a date");
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to update the courier date?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        courierSentDate: newCourierDate
                                    }).then(() => {
                                        alert("Courier Date Updated Successfully!!");
                                        setNewCourierDate('');
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
                                setEditingCourierDateRow(record.key);
                                setNewCourierDate(text ? text.split('T')[0] : '');
                            }}
                        >Edit</Button>
                    </>
                );
            }
        },
        {

            width: '7%',
            title: 'Pohch Id',
            dataIndex: 'pohchId',
            key: 'pohchId',
            ...getColumnSearchProps('pohchId'),
            // render: (text, record, index) => { return index + 1; }
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
            width: '7%',
            title: 'Pohch Received Date',
            dataIndex: 'pohchRecievedDate',
            key: 'pohchRecievedDate',
            ...getColumnSearchProps('pohchRecievedDate'),
            render: (text) => {
                if (text === undefined || text === null || text === '') {
                    return <span>None</span>
                }
                let date = new Date(text);
                console.log(date);

                return (
                    <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                )
            }
        },
        {
            width: '7%',
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            ...getColumnSearchProps('vehicleNo'),
        },
        {
            width: '7%',
            title: 'Pohch Amt',
            dataIndex: 'pohchAmt',
            key: 'pohchAmt',
            render: (text) => {
                console.log(text);
                if (text === undefined || text === null || text === '') {
                    return <span>Not Available</span>
                }
                return (
                    <span>{text}</span>
                )
            }
            // ...getColumnSearchProps('vehicleNo'),
        },
        {
            width: '6%',
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: '6%',
            title: 'Sender',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
            ...getColumnSearchProps('bhejneWaliParty'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: '6%',
            title: 'Receiver',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
            ...getColumnSearchProps('paaneWaliParty'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: '5%',
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


    ];

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    const addNewParty = () => {
        // e.preventDefault();
        if (partyModal.label === undefined) {
            alert('Please Enter Party name');
            return;
        }
        let _newParty = partyModal.label;
        for (let i = 0; i < partyListAll.length; i++) {
            if (_newParty.toUpperCase() === partyListAll[i].value.toUpperCase()) {
                alert(`Party with name ${partyListAll[i].value} already exists.`);
                return;
            }
        }
        setPartyListAll([...partyListAll, { ...partyModal }]);
        // setNewParty('');
        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const partyListRef = ref(db, 'parties');
        const newPartyRef = push(partyListRef);
        set(newPartyRef, {
            ...partyModal
        }).then(() => {
            alert("Party Created Successfully!!");
            setPartyModal({});
            return;
        })
    }

    const addNewTransporter = (e) => {
        if (newTransporter.trim() === "") {
            alert("please enter a value to add transporter.")
            return;
        }
        e.preventDefault();
        for (let i = 0; i < transporterList.length; i++) {
            if (newTransporter.toUpperCase() === transporterList[i].value.toUpperCase()) {
                alert(`Transporter with name ${transporterList[i].value} already exixts`);
                return;
            }
        }
        setTransporterList([...transporterList, { value: newTransporter, label: newTransporter }]);
        setNewTransporter('');

        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const transporterListRef = ref(db, 'transporters');
        const newTransporterRef = push(transporterListRef);
        set(newTransporterRef, {
            value: newTransporter,
            label: newTransporter,
        });
    }

    const addNewMaal = (e, _newMaal) => {
        if (_newMaal === undefined) {
            _newMaal = newMaal;
        }
        if (_newMaal.trim() === "") {
            alert("please enter a value to add maal.")
            return;
        }
        e.preventDefault();
        for (let i = 0; i < MaalList.length; i++) {
            if (_newMaal.toUpperCase() === MaalList[i].value.toUpperCase()) {
                alert(`Maal with name ${MaalList[i].value} already exixts`);
                return;
            }
        }
        setMaalList([...MaalList, { value: _newMaal, label: _newMaal }]);
        setNewMaal('');

        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const maalListRef = ref(db, 'maal');
        const newMaalRef = push(maalListRef);
        set(newMaalRef, {
            value: _newMaal,
            label: _newMaal,
        });
    }

    const addNewBank = (e) => {
        e.preventDefault();
        if (newBank.trim() === '') {
            alert('Please enter bank name to add bank in the list. Field is empty');
            return;
        }
        let key = bankData.length;
        setBankData([...bankData, { bankName: newBank, value: newBank, label: newBank, key: key }]);

        const db = getDatabase();
        const bankRef = ref(db, 'bankData/data/' + key);
        // const newBankRef = push(bankRef);
        set(bankRef, {
            bankName: newBank,
            key: key,
        })

        setNewBank('');
    }

    const addNewDriver = (e) => {

        // e.preventDefault();
        if (driverModal.label === undefined) {
            alert("Please Enter Driver Name to submit")
        }
        let _newDriverName = driverModal.label;
        for (let i = 0; i < driverList.length; i++) {
            if (_newDriverName.toUpperCase() === driverList[i].value.toUpperCase()) {
                alert("Driver with this name already exists");
                return;
            }
        }
        setDriverList([...driverList, { ...driverModal }]);
        setNewDriverName('');

        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const driverListRef = ref(db, 'drivers');
        const newDriverRef = push(driverListRef);
        set(newDriverRef, {
            ...driverModal
        }).then(() => {
            alert("Driver Added Successfully!!");
            setDriverModal({});
            return;
        });
    }

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        createPartyForm.resetFields();
        addNewParty();
        setIsModalOpen(false);
    };

    const handleDriverOk = () => {
        addNewDriver();
        setIsDriverModalOpen(false);
        setDriverModal({});
        driverForm.resetFields();
    }

    const handleCancel = () => {
        createPartyForm.resetFields();
        setIsModalOpen(false);
    };

    const handleDriverCancel = () => {
        setIsDriverModalOpen(false);
        setDriverModal({});
        driverForm.resetFields();
    }

    const handleDateFilter = (e) => {
        let date = e.target.value;
        console.log(date);
        // let _custom_date = new Date(date).getTime();
        // let _custom_end_date = new Date(customEndDate).getTime();
        console.log(completeDataSource);
        let _displayDataSource = completeDataSource.filter(
            (item) => {
                // let itemDate = new Date(item.date).getTime();
                console.log(item.date, date);
                return item.date === date;
            }
        )
        setDataSource(_displayDataSource);
        setDateFilter(e.target.value);
        // setDisplayDataSource(_displayDataSource);
    }

    return (
        <>
            {/* <Input onChange={(e)=>setKey(e.target.value)}/>
            <Button onClick={() => {console.log(key); updatePohchId(key)}}>Update Pohch Id</Button> */}
            <CreatePartyForm
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                createPartyForm={createPartyForm}
                partyModal={partyModal}
                setPartyModal={setPartyModal}
            />

            <Modal title="Create Driver" open={isDriverModalOpen} onOk={handleDriverOk} onCancel={handleDriverCancel}
                footer={[
                    <Button key="back" onClick={handleDriverCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleDriverOk}>
                        Submit
                    </Button>
                ]}
            >
                <Form name="DriverForm" layout="vertical" form={driverForm}>
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
                                <Input onChange={(e) => {
                                    let obj = driverModal;
                                    obj.label = e.target.value;
                                    obj.value = e.target.value;
                                    setDriverModal(obj);
                                }} placeholder="Please enter user name" />
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
                                    placeholder="Driver Location"
                                    onChange={(e) => {
                                        let obj = driverModal;
                                        obj.location = e.target.value;
                                        setDriverModal(obj);
                                    }}
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
                                    style={{
                                        width: '100%',
                                    }}
                                    type='date'
                                    placeholder="License Date"
                                    onChange={(e) => {
                                        let obj = driverModal;
                                        obj.LicenseDate = e.target.value;
                                        setDriverModal(obj);
                                    }}
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
                                    onChange={(value) => {
                                        let obj = driverModal;
                                        obj.LicenseType = value;
                                        setDriverModal(obj);
                                    }}
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
                                    onChange={(e) => {
                                        let obj = driverModal;
                                        obj.Contact = e.target.value;
                                        setDriverModal(obj);
                                    }}
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
                                <Input.TextArea rows={4} placeholder="please enter url description" onChange={(e) => {
                                    let obj = driverModal;
                                    obj.description = e.target.value;
                                    setDriverModal(obj);
                                }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* // Add this inside your Driver Modal Form, you can place it after the Contact Number Form.Item */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Driver's License Document"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload driver license document',
                                    },
                                ]}
                            >
                                <Upload.Dragger
                                    name="licenseDocument"
                                    accept="image/*,.pdf"
                                    multiple={false}
                                    beforeUpload={(file) => {
                                        // Check file size (example: max 5MB)
                                        const isLt5M = file.size / 1024 / 1024 < 5;
                                        if (!isLt5M) {
                                            message.error('Image must be smaller than 5MB!');
                                            return Upload.LIST_IGNORE;
                                        }

                                        // Handle the file
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file);
                                        reader.onload = () => {
                                            let obj = driverModal;
                                            obj.licenseDocument = reader.result; // stores base64 string
                                            setDriverModal(obj);
                                        };

                                        // Prevent default upload
                                        return false;
                                    }}
                                    onRemove={() => {
                                        let obj = driverModal;
                                        obj.licenseDocument = null;
                                        setDriverModal(obj);
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for a single image upload. Please upload drivers license document.
                                    </p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <span style={{ marginLeft: '40px' }}>Pohch Received From Date:</span>
            <Input style={{ width: "20%", marginLeft: '10px' }} type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <span style={{ marginLeft: '40px' }}>Pohch Received To Date:</span>
            <Input style={{ width: "20%", marginLeft: '10px' }} type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
            <Button onClick={applyDateFilter}>Apply Filter</Button>
            <Button onClick={() => {
                setDataSource(completeDataSource);
                setFromDate(null);
                setToDate(null);
                setDateFilter(null);
            }}>Clear Date</Button>
            <Button type="primary" style={{ margin: '20px' }} onClick={exportToExcel}>
                Export to Excel
            </Button>

            <div style={{ width: "98vw", overflowX: 'auto', height: '83vh', backgroundColor: 'white' }}>
                <Table bordered style={{ zIndex: '100' }} size="small" scroll={{ y: 450 }} dataSource={dataSource} columns={columns} pagination={false}
                />
            </div>

        </>
    )
}

export default Pohch;
