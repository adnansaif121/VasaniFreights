import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, CheckCircleFilled, WarningFilled, EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import firebase from '../config/firebase'
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import ViewDailyEntry from './ViewDailyEntry';
// import { vehicleData } from './data';
import CreatePartyForm from './common/CreatePartyForm';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);
console.log(todayDate);

const Cheque = () => {

    const [driverForm] = Form.useForm();
    const [createPartyForm] = Form.useForm();
    // Drivers List
    const [driverList, setDriverList] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    // Locations list
    const [Locations, setLocations] = useState([
        {
            value: 'mumbai',
            label: 'Mumbai',
        },
        {
            value: 'pune',
            label: 'Pune',
        },
        {
            value: 'nagpur',
            label: 'Nagpur',
        },
        {
            value: 'nashik',
            label: 'Nashik',
        },
        {
            value: 'aurangabad',
            label: 'Aurangabad',
        }
    ]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
    // All Transporter List for Transporter Select
    const [transporterList, setTransporterList] = useState([]);
    const [newTransporter, setNewTransporter] = useState('');
    // Data to display in the table
    const [completeDataSource, setCompleteDataSource] = useState([]);
    const [dataSource, setDataSource] = useState([]); // Table Data
    // FLAG 
    //Bank
    const [newBank, setNewBank] = useState('');
    const [bankData, setBankData] = useState([]);
    const [dateFilter, setDateFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

    // MODAL VARIABLES:
    const [partyModal, setPartyModal] = useState({});

    const [driverModal, setDriverModal] = useState({
        label: '',
        value: '',
        location: '',
        LicenseDate: '',
        contact: '',
        licenseDocument: null, // Add this new field
    });
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [uvPaymentStatusList, setUvPaymentStatusList] = useState([
        {
            value: 'Received',
            label: 'Received',
        },
        {
            value: 'Pending',
            label: 'Pending',
        },
    ]);
    // For Editing Toll Expense
    const [editingTollKey, setEditingTollKey] = useState(null);
    const [editingTollValues, setEditingTollValues] = useState({});
    // For Editing Payment Status
    const [editingPaymentStatusKey, setEditingPaymentStatusKey] = useState(null);
    const [editingPaymentStatusValues, setEditingPaymentStatusValues] = useState({});
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    // For Editing Revised Rate
    const [editingRevisedRateKey, setEditingRevisedRateKey] = useState(null);
    const [editingRevisedRateValues, setEditingRevisedRateValues] = useState({});

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
                Object.keys(data).map((key, i) => {
                    for (let j = 0; j < data[key].tripDetails.length; j++) {
                        if (data[key].firstPayment !== undefined && data[key].firstPayment[j] !== undefined && data[key].firstPayment[j].chequeAmount !== '') {
                            console.log(data[key]);
                            // let _pohchId = (''+new Date().getFullYear()).substring(2) + '' + (new Date().getMonth()+1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
                            // updatePohchId(key, _pohchId);
                            ds.push(
                                {
                                    date: data[key].date,
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
                                    totalFreight: data[key].tripDetails[j].totalFreight,
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
        });

        const locationsRef = ref(db, 'locations/');
        onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'Locations');
            // updateStarCount(postElement, data);
            let locations = []; // Data Source
            if (data) {
                Object.values(data).map((location, i) => {
                    locations.push(location);
                })
                setLocations([...locations]);
            }
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
        saveAs(data, "Uvlogistics.xlsx");
    };

    const applyDateSort = (ds) => {
        ds.sort(function (a, b) {
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
        // console.log(completeDataSource);
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
            dataIndex === 'courierStatus' && value === 'pending' ? record[dataIndex] === null || record[dataIndex] === undefined || record[dataIndex] === '' : record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) ||
                // dataIndex === 'pohchRecievedDate' && value !== null ?  `${new Date(record[dataIndex]).getDate()}/${new Date(record[dataIndex]).getMonth()+1}/${new Date(record[dataIndex]).getFullYear()}` : 
                record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
            // ...getColumnSearchProps('courierSentDate'),
            width: '7%',
            render: (text, record, index) => {
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
                                if (!confirm("Are you sure you want to update the deposit date?")) {
                                    return;
                                }
                                // update the deposit date in the database
                                const db = getDatabase();
                                const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                update(starCountRef, {
                                    chequeDepositDate: text
                                }).then(() => {
                                    alert("Cheque Deposit Date Updated Successfully!!");
                                    return;
                                })
                            }}>Save</Button>
                    </>
                }
                let date = new Date(text);
                return (
                    <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                )
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

            <span style={{ marginLeft: '40px' }}>From Date:</span>
            <Input style={{ width: "20%", marginLeft: '10px' }} type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <span style={{ marginLeft: '40px' }}>To Date:</span>
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
            <div style={{ width: "100vw", overflowX: 'scroll', overflowY: 'scroll', height: '84vh', backgroundColor: 'white' }}>
                <Table scroll={{ x: 2000, y: 400 }} bordered style={{ zIndex: '100', height: '100%' }} size="small" dataSource={dataSource} columns={columns} pagination={false} />
            </div>

        </>
    )
}

export default Cheque;
