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

const Uvlogistics = () => {

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
    // For Editing Revised To   
    const [editingRevisedToKey, setEditingRevisedToKey] = useState(null);
    const [editingRevisedToValues, setEditingRevisedToValues] = useState({});
    const [newLocation, setNewLocation] = useState('');
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
                        if (data[key].firstPayment !== undefined && data[key].firstPayment[j] !== undefined && data[key].firstPayment[j].bhadaKaunDalega === 'UvLogs') {
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
                                    // bhejneWaliParty: data[key].tripDetails[j].bhejneWaala,
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
                    {/* <Button
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
                    </Button> */}
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
            width: '9%',
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            fixed: 'left',
            ...getColumnSearchProps('vehicleNo'),
        },
        {
            width: '7%',
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
            width: 200,
            title: 'Revised To',
            dataIndex: 'revisedTo',
            key: 'revisedTo',
            render: (text, record) => {
                // Add editing state for Revised To
                if (editingRevisedToKey === record.key) {
                    return (
                        <>
                            <Select
                                showSearch
                                style={{ width: 140 }}
                                placeholder="Revised To"
                                value={editingRevisedToValues[record.key] ?? text}
                                optionFilterProp="children"
                                onChange={(value) => setEditingRevisedToValues(prev => ({ ...prev, [record.key]: value }))}
                                filterOption={filterOption}
                                options={Locations}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="Please enter item"
                                                value={newLocation}
                                                onChange={(e) => setNewLocation(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (!newLocation) {
                                                        alert("Please enter a value to add location.");
                                                        return;
                                                    }
                                                    if (Locations.some(loc => loc.label.toLowerCase() === newLocation.toLowerCase())) {
                                                        alert(`Location with name ${newLocation} already exists.`);
                                                        return;
                                                    }
                                                    setLocations([...Locations, { value: newLocation, label: newLocation }]);
                                                    setNewLocation('');
                                                }}
                                            />
                                        </Space>
                                    </>
                                )}
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingRevisedToValues[record.key];
                                    if (!value) {
                                        alert('Please select a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        revisedTo: value
                                    }).then(() => {
                                        alert("Revised To Updated Successfully!!");
                                        setEditingRevisedToKey(null);
                                        setEditingRevisedToValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                            <Button
                                onClick={() => {
                                    setEditingRevisedToKey(null);
                                    setEditingRevisedToValues(prev => ({ ...prev, [record.key]: '' }));
                                }}
                                style={{ marginLeft: 8 }}
                            >Cancel</Button>
                        </>
                    );
                }

                // If value is empty, show select directly
                if (text === undefined || text === null || text === '') {
                    return (
                        <>
                            <Select
                                showSearch
                                style={{ width: 140 }}
                                placeholder="Revised To"
                                value={editingRevisedToValues[record.key] ?? text}
                                optionFilterProp="children"
                                onChange={(value) => setEditingRevisedToValues(prev => ({ ...prev, [record.key]: value }))}
                                filterOption={filterOption}
                                options={Locations}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="Please enter item"
                                                value={newLocation}
                                                onChange={(e) => setNewLocation(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (!newLocation) {
                                                        alert("Please enter a value to add location.");
                                                        return;
                                                    }
                                                    if (Locations.some(loc => loc.label.toLowerCase() === newLocation.toLowerCase())) {
                                                        alert(`Location with name ${newLocation} already exists.`);
                                                        return;
                                                    }
                                                    setLocations([...Locations, { value: newLocation, label: newLocation }]);
                                                    setNewLocation('');
                                                }}
                                            />
                                        </Space>
                                    </>
                                )}
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingRevisedToValues[record.key];
                                    if (!value) {
                                        alert('Please select a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        revisedTo: value
                                    }).then(() => {
                                        alert("Revised To Updated Successfully!!");
                                        setEditingRevisedToValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                        </>
                    );
                }

                // Otherwise, show value and edit button
                return (
                    <>
                        <span>{text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null}</span>
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setEditingRevisedToKey(record.key);
                                setEditingRevisedToValues(prev => ({ ...prev, [record.key]: '' }));
                            }}
                        />
                    </>
                );
            }
        },
        {
            width: 100,
            title: 'Receiver',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
        },
        {
            width: 100,
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
            render: (text) => {
                // make 1st letter capital and other small and return
                return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: 100,
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',

        },
        {
            width: 100,
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',

        },
        {
            width: 180,
            title: 'Revised Rate',
            dataIndex: 'revisedRate',
            key: 'revisedRate',
            render: (text, record) => {
                if (editingRevisedRateKey === record.key) {
                    return (
                        <>
                            <Input
                                style={{ width: 120 }}
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={editingRevisedRateValues[record.key] ?? text}
                                onChange={e =>
                                    setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: e.target.value }))
                                }
                                placeholder="Revised Rate"
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingRevisedRateValues[record.key];
                                    if (!value) {
                                        alert('Please enter a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        revisedRate: value
                                    }).then(() => {
                                        alert("Revised Rate Updated Successfully!!");
                                        setEditingRevisedRateKey(null);
                                        setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                            <Button
                                onClick={() => {
                                    setEditingRevisedRateKey(null);
                                    setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: '' }));
                                }}
                                style={{ marginLeft: 8 }}
                            >Cancel</Button>
                        </>
                    );
                }

                if (text === undefined || text === null || text === '') {
                    return (
                        <>
                            <Input
                                style={{ width: 120 }}
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={editingRevisedRateValues[record.key] ?? text}
                                onChange={e =>
                                    setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: e.target.value }))
                                }
                                placeholder="Revised Rate"
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingRevisedRateValues[record.key];
                                    if (!value) {
                                        alert('Please enter a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        revisedRate: value
                                    }).then(() => {
                                        alert("Revised Rate Updated Successfully!!");
                                        setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                        </>
                    );
                }

                return (
                    <>
                        <span>{text}</span>
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setEditingRevisedRateKey(record.key);
                                setEditingRevisedRateValues(prev => ({ ...prev, [record.key]: text }));
                            }}
                        />
                    </>
                );
            }
        },
        {
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
        },
        {
            width: 100,
            title: 'Trip Expense',
            dataIndex: 'tripExpense',
            key: 'tripExpense',
        },
        {
            width: 200,
            title: 'Toll Expense',
            dataIndex: 'tollExpense',
            key: 'tollExpense',
            render: (text, record) => {
                // If editing this row
                if (editingTollKey === record.key) {
                    return (
                        <>
                            <Input
                                style={{ width: 140 }}
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={editingTollValues[record.key] ?? text}
                                onChange={e => setEditingTollValues(prev => ({ ...prev, [record.key]: e.target.value }))}
                                placeholder="Toll Expense"
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingTollValues[record.key];
                                    if (!value) {
                                        alert('Please enter a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        tollExpense: value
                                    }).then(() => {
                                        alert("Toll Expense Updated Successfully!!");
                                        setEditingTollKey(null);
                                        setEditingTollValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                            <Button
                                onClick={() => {
                                    setEditingTollKey(null);
                                    setEditingTollValues(prev => ({ ...prev, [record.key]: '' }));
                                }}
                                style={{ marginLeft: 8 }}
                            >Cancel</Button>
                        </>
                    );
                }

                // If value is empty, show input directly
                if (text === undefined || text === null || text === '') {
                    return (
                        <>
                            <Input
                                style={{ width: 140 }}
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={editingTollValues[record.key] ?? text}
                                onChange={e => setEditingTollValues(prev => ({ ...prev, [record.key]: e.target.value }))}
                                placeholder="Toll Expense"
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingTollValues[record.key];
                                    if (!value) {
                                        alert('Please enter a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        tollExpense: value
                                    }).then(() => {
                                        alert("Toll Expense Updated Successfully!!");
                                        setEditingTollValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                        </>
                    );
                }

                // Otherwise, show value and edit button
                return (
                    <>
                        <span>{text}</span>
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setEditingTollKey(record.key);
                                setEditingTollValues(prev => ({ ...prev, [record.key]: text }));
                            }}
                        />
                    </>
                );
            }
        },
        {
            width: 100,
            title: 'Diesel Amount',
            dataIndex: 'dieselExpense',
            key: 'dieselExpense',
        },
        {
            width: 200,
            title: 'Payment Status',
            dataIndex: 'UVLogsPaymentStatus',
            key: 'UVLogsPaymentStatus',
            fixed: 'right',
            ...getColumnSearchProps('UVLogsPaymentStatus'),
            render: (text, record) => {
                if (editingPaymentStatusKey === record.key) {
                    return (
                        <>
                            <Select
                                style={{ width: 120 }}
                                value={editingPaymentStatusValues[record.key] ?? text}
                                onChange={(value) =>
                                    setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: value }))
                                }
                                options={uvPaymentStatusList}
                                placeholder="Select Payment Status"
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                style={{ width: '100px' }}
                                                placeholder="Add new status"
                                                value={newPaymentStatus}
                                                onChange={(e) => setNewPaymentStatus(e.target.value)}
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (!newPaymentStatus) return;
                                                    setUvPaymentStatusList([...uvPaymentStatusList, { value: newPaymentStatus, label: newPaymentStatus }]);
                                                    setNewPaymentStatus('');
                                                }}
                                            />
                                        </Space>
                                    </div>
                                )}
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingPaymentStatusValues[record.key];
                                    if (!value) {
                                        alert('Please select a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        UVLogsPaymentStatus: value
                                    }).then(() => {
                                        alert("Payment Status Updated Successfully!!");
                                        setEditingPaymentStatusKey(null);
                                        setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                            <Button
                                onClick={() => {
                                    setEditingPaymentStatusKey(null);
                                    setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: '' }));
                                }}
                                style={{ marginLeft: 8 }}
                            >Cancel</Button>
                        </>
                    );
                }

                if (text === undefined || text === null || text === '') {
                    return (
                        <>
                            <Select
                                style={{ width: 120 }}
                                value={editingPaymentStatusValues[record.key] ?? text}
                                onChange={(value) =>
                                    setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: value }))
                                }
                                options={uvPaymentStatusList}
                                placeholder="Select Payment Status"
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                style={{ width: '100px' }}
                                                placeholder="Add new status"
                                                value={newPaymentStatus}
                                                onChange={(e) => setNewPaymentStatus(e.target.value)}
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (!newPaymentStatus) return;
                                                    setUvPaymentStatusList([...uvPaymentStatusList, { value: newPaymentStatus, label: newPaymentStatus }]);
                                                    setNewPaymentStatus('');
                                                }}
                                            />
                                        </Space>
                                    </div>
                                )}
                            />
                            <Button
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    const value = editingPaymentStatusValues[record.key];
                                    if (!value) {
                                        alert('Please select a value to save');
                                        return;
                                    }
                                    if (!confirm("Are you sure you want to save the changes?")) {
                                        return;
                                    }
                                    const db = getDatabase();
                                    const starCountRef = ref(db, 'dailyEntry/' + record.key + '/tripDetails/0/');
                                    update(starCountRef, {
                                        UVLogsPaymentStatus: value
                                    }).then(() => {
                                        alert("Payment Status Updated Successfully!!");
                                        setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: '' }));
                                        return;
                                    })
                                }}
                                style={{ marginLeft: 8 }}
                            />
                        </>
                    );
                }

                return (
                    <>
                        <span>{text}</span>
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setEditingPaymentStatusKey(record.key);
                                setEditingPaymentStatusValues(prev => ({ ...prev, [record.key]: text }));
                            }}
                        />
                    </>
                );
            }
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

export default Uvlogistics;
