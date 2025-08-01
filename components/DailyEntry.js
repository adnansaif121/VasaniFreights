import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";
import ViewDailyEntry from './ViewDailyEntry';
import CreatePartyForm from './common/CreatePartyForm';
import Highlighter from 'react-highlight-words';

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);

const DailyEntry = () => {
    const [driverForm] = Form.useForm();
    const [createPartyForm] = Form.useForm();
    // Drivers List
    const [driverList, setDriverList] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    // Locations list
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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

    const [driverModal, setDriverModal] = useState({
        label: '',
        value: '',
        location: '',
        LicenseDate: '',
        contact: '',
        licenseDocument: null, // Add this new field
    });
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [remarkData, setRemarkData] = useState([]);

    const [lastKey, setLastKey] = useState(null);
    const [firstKey, setFirstKey] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const db = getDatabase();

        const locationsRef = ref(db, 'locations/');
        onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            // updateStarCount(postElement, data);
            let locations = []; // Data Source
            if (data) {
                Object.values(data).map((location, i) => {
                    locations.push(location);
                })
                setLocations([...locations]);
            }
        });

        const partyRef = ref(db, 'parties/');
        onValue(partyRef, (snapshot) => {
            const data = snapshot.val();
            // updateStarCount(postElement, data);
            let parties = []; // Data Source
            if (data !== null) {
                Object.values(data).map((party, i) => {
                    parties.push(party);
                })
            }
            setPartyListAll([...parties]);
        });

        const transporterRef = ref(db, 'transporters/');
        onValue(transporterRef, (snapshot) => {
            const data = snapshot.val();
            // updateStarCount(postElement, data);
            let transporters = []; // Data Source
            if (data) {
                Object.values(data).map((transporter, i) => {
                    transporters.push(transporter);
                })
                setTransporterList([...transporters]);
            }
        });

        const driversRef = ref(db, 'drivers/');
        onValue(driversRef, (snapshot) => {
            const data = snapshot.val();
            // updateStarCount(postElement, data);
            let drivers = []; // Data Source
            if (data) {
                Object.values(data).map((driver, i) => {
                    drivers.push(driver)
                })
                setDriverList([...drivers]);
            }
        });

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

        const maalRef = ref(db, 'maal/');
        onValue(maalRef, (snapshot) => {
            const data = snapshot.val();
            const _maal = [];
            if (data) {
                Object.values(data).map((maal, i) => {
                    _maal.push({ label: maal.label, value: maal.value })
                })
                setMaalList([..._maal]);
            }
        })

        const vehicleDataRef = ref(db, 'Vehicles/');
        onValue(vehicleDataRef, (snapshot) => {
            const data = snapshot.val();
            const _vehicleData = snapshot.val();
            if (data) {
                setVehicleData(data);
            }
        })
    }, [])

    useEffect(() => {
        fetchEntries();
    }, [])

    // Utility to recursively collect all remark fields
    const collectRemarks = (obj, path = '') => {
        let remarks = [];
        if (Array.isArray(obj)) {
            obj.forEach((item, idx) => {
                remarks = remarks.concat(collectRemarks(item, `${path}[${idx}]`));
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                if (key.toLowerCase().includes('remark')) {
                    remarks.push({ key: path ? `${path}.${key}` : key, value });
                }
                remarks = remarks.concat(collectRemarks(value, path ? `${path}.${key}` : key));
            });
        }
        return remarks;
    };

    // Handler for view remarks button
    const handleViewRemarks = (record) => {
        const remarks = collectRemarks(record);
        setRemarkData(remarks);
        setRemarkModalOpen(true);
    };

    // Handler to open modal
    const handleViewClick = (record) => {
        setSelectedRow(record);
        setViewModalOpen(true);
    };

    const applyDateSort = (ds) => {
        console.log(ds, 'before sorting');
        ds.sort(function (a, b) {
            if(a.dateToSort === b.dateToSort) {
                console.log('same date found')
                return new Date(parseInt(b.timestamp)) - new Date(parseInt(a.timestamp));
            }
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateToSort) - new Date(a.dateToSort);
        });
        console.log(ds, 'after sorting');
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
                style={{
                    fontSize: 20,
                    color: filtered ? 'red' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
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
            width: 60,
            title: '',
            key: 'action',
            render: (text, record) => (
                <Button type="link" onClick={() => handleViewClick(record)}>
                    View
                </Button>
            ),
        },
        {
            width: 40,
            title: 'Sr no',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => { return index + 1; }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            ...getColumnSearchProps('date'),
            // render: (text) => {
            //     let date = new Date(text);

            //     return (
            //         <span>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
            //     )
            // }
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
            render: (text) => {
                // make 1st letter capital and other small and return
                return text !== null ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            ...getColumnSearchProps('to'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text !== null ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'Paid/To Pay',
            dataIndex: 'paid',
            key: 'paid',
        },
        {
            title: 'Bhejne Wali Party',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
            ...getColumnSearchProps('bhejneWaliParty'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text !== null ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'Paane Wali Party',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
            ...getColumnSearchProps('paaneWaliParty'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text !== null ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            width: 100,
            title: 'Transporter',
            dataIndex: 'transporter',
            key: 'transporter',
            ...getColumnSearchProps('transporter'),
            render: (text) => {
                // make 1st letter capital and other small and return
                return text !== null ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : null;
            }
        },
        {
            title: 'Driver',
            dataIndex: 'driver',
            key: 'driver',
            ...getColumnSearchProps('driver'),
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
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',

        },
        {
            width: 100,
            title: 'Rate/Revised Rate',
            dataIndex: 'rate',
            key: 'rate',
            ...getColumnSearchProps('rate'),
            render: (text, record) => {
                return (
                    <span>
                        {record.rate} / {record.revisedRate ? record.revisedRate : 'NA'}
                    </span>
                );
            }
        },
        {
            title: 'Total Freight',
            dataIndex: 'totalFreight',
            key: 'totalFreight',
        },
        {
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
        },
        {
            width: 60,
            title: 'Remark',
            key: 'remark',
            render: (text, record) => (
                <Button type="link" onClick={() => handleViewRemarks(record)}>
                    <FileTextOutlined style={{fontSize:'larger'}}/>
                </Button>
            ),
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

    const addNewVehicle = (e) => {
        e.preventDefault();
        if (newVehicleNo.trim() === '') {
            alert('Please enter vehicle no. to add vehicle in the list. Field is empty');
            return;
        }
        let key = vehicleData.length;
        setVehicleData([...vehicleData, { vehicleNo: newVehicleNo, value: newVehicleNo, label: newVehicleNo, key: key }]);
        const db = getDatabase();
        const vehicleRef = ref(db, 'Vehicles/' + key);
        // const newBankRef = push(bankRef);
        set(vehicleRef, {
            vehicleNo: newVehicleNo,
            key: key,
            label: newVehicleNo,
            value: newVehicleNo
        })
        setNewVehicleNo('');

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
        // let _custom_date = new Date(date).getTime();
        // let _custom_end_date = new Date(customEndDate).getTime();
        let _displayDataSource = completeDataSource.filter(
            (item) => {
                // let itemDate = new Date(item.date).getTime();
                return item.dateToSort === date;
            }
        )
        setDataSource(_displayDataSource);
        setDateFilter(e.target.value);
        // setDisplayDataSource(_displayDataSource);
    }

    const fetchEntries = (direction = 'next', refKey = null) => {
        setIsLoading(true);
        const db = getDatabase();
        let q;
        if (direction === 'next' && refKey) {
            q = query(ref(db, 'dailyEntry/'), orderByKey(), endAt(refKey), limitToLast(20));
        } else if (direction === 'prev' && refKey) {
            q = query(ref(db, 'dailyEntry/'), orderByKey(), startAt(refKey), limitToFirst(20));
        } else {
            q = query(ref(db, 'dailyEntry/'), orderByKey(), limitToLast(20));
        }
        onValue(q, (snapshot) => {
            const data = snapshot.val();
            console.log('Fetched Data:', data);
            let ds = [];
            let keys = [];
            if (data) {
                Object.keys(data).forEach((key, i) => {
                    keys.push(key);
                    for (let j = 0; j < data[key].tripDetails.length; j++) {
                        let receivedAmt = (data[key]?.firstPayment !== undefined && data[key]?.firstPayment[j] !== undefined) ?
                            (
                                parseInt((data[key].firstPayment[j].cashAmount.trim() === "") ? 0 : data[key].firstPayment[j].cashAmount) +
                                parseInt((data[key].firstPayment[j].chequeAmount.trim() === "") ? 0 : data[key].firstPayment[j].chequeAmount) +
                                parseInt((data[key].firstPayment[j].onlineAmount.trim() === "") ? 0 : data[key].firstPayment[j].onlineAmount) +
                                // parseInt((data[key].firstPayment[j].pohchAmount.trim() === "") ? 0 : data[key].firstPayment[j].pohchAmount) +
                                (data[key].tripDetails[j].furthetPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount)
                            )
                            : 0;

                        let _date = new Date(data[key]?.date);
                        ds.push(
                            {
                                timestamp: key,
                                dateToSort: data[key]?.date,
                                date: `${_date.getDate()}/${_date.getMonth() + 1}/${_date.getFullYear()}`,
                                key: key + j,
                                id: i + 1,
                                vehicleNo: data[key]?.vehicleNo,
                                mt: data[key]?.mt,
                                from: data[key]?.tripDetails[j]?.from || null,
                                to: data[key]?.tripDetails[j]?.to || null,
                                paid: data[key]?.tripDetails[j]?.payStatus || null,
                                bhejneWaliParty: data[key]?.tripDetails[j]?.bhejneWaala || null,
                                paaneWaliParty: data[key]?.tripDetails[j]?.paaneWaala || null,
                                transporter: data[key]?.tripDetails[j]?.transporter || null,
                                maal: data[key]?.tripDetails[j]?.maal || null,
                                qty: data[key]?.tripDetails[j]?.qty || null,
                                rate: data[key]?.tripDetails[j]?.rate || null,
                                revisedRate: data[key]?.tripDetails[j]?.revisedRate || null,
                                totalFreight: data[key]?.tripDetails[j]?.totalFreight || null,
                                received: receivedAmt || null,
                                dieselAndKmDetails: data[key]?.dieselAndKmDetails || null,
                                tripDetails: data[key]?.tripDetails || null,
                                driversDetails: data[key]?.driversDetails || null,
                                kaataParchi: data[key]?.kaataParchi || null,
                                firstPayment: data[key]?.firstPayment || null,
                                vehicleStatus: data[key]?.vehicleStatus || null,
                                bhadaKaunDalega: (data[key]?.firstPayment === undefined) ? null : data[key]?.firstPayment[0]?.bhadaKaunDalega,
                                driver: data[key]?.driver1?.value || null,
                                driver1: data[key]?.driver1 || null,
                                driver2: data[key]?.driver2 || null,
                                conductor: data[key]?.conductor || null,
                            }
                        )
                    }
                });
            }
            // Sort keys for pagination
            keys.sort();
            setFirstKey(keys[0]);
            setLastKey(keys[keys.length - 1]);
            applyDateSort(ds);
            setIsLoading(false);
        });
    };

    const handleTableChange = (pagination) => {
        if (pagination.current > currentPage) {
            // Next page: use first key of current data as endAt
            fetchEntries('next', firstKey);
            setCurrentPage(pagination.current);
        } else if (pagination.current < currentPage) {
            // Previous page: use last key of current data as startAt
            fetchEntries('prev', lastKey);
            setCurrentPage(pagination.current);
        }
    };

    return (
        <>
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

            <Input style={{ width: "20%", marginLeft: '20px' }} type='date' value={dateFilter} onChange={handleDateFilter} />
            <Button onClick={() => {
                setDataSource(completeDataSource);
                setDateFilter(null);
            }}>Clear Date</Button>
            <div style={{ width: "95vw", overflowX: 'auto', marginLeft: '20px', height: '84.5vh', backgroundColor: 'white' }}>
                <Table
                    style={{ zIndex: '100' }}
                    bordered
                    size="small"
                    scroll={{ y: 450 }}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: 20,
                        current: currentPage,
                        showSizeChanger: false,
                        total: 1000 // You can set a large number or fetch the count if needed
                    }}
                    loading={isLoading}
                    onChange={handleTableChange}
                />

                <Modal
                    open={viewModalOpen}
                    onCancel={() => setViewModalOpen(false)}
                    footer={null}
                    width={'100vw'}
                    // title="Daily Entry Details"
                    destroyOnClose
                    closeIcon={
                        <Button
                            type="primary"
                            size="small"
                            style={{marginTop:'-20px', marginRight: '20px',  display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setViewModalOpen(false)}
                            // icon={<CloseOutlined style={{ fontSize: 24 }} />}
                        ><CloseOutlined style={{ fontSize: 15 }} />Close</Button>
                    }
                >
                    {selectedRow && (
                        <ViewDailyEntry
                            data={selectedRow}
                            Locations={Locations}
                            partyListAll={partyListAll}
                            transporterList={transporterList}
                            driverList={driverList}
                            vehicleData={vehicleData}
                            MaalList={MaalList}
                            bankData={bankData}
                            addNewMaal={addNewMaal}
                        />
                    )}
                </Modal>

                <Modal
                    open={remarkModalOpen}
                    onCancel={() => setRemarkModalOpen(false)}
                    footer={null}
                    title="All Remarks"
                    width={'70vw'}
                >
                    {remarkData.length === 0 ? (
                        <div>No remarks found.</div>
                    ) : (
                        <ul style={{ fontSize: '20px', lineHeight: '2' }}>
                            {remarkData.map((item, idx) => (
                                <li key={idx}>
                                    <b>{item.key.replace(/\[0\]\./g, ' ').replace(/remark(s)?/gi, '').trim()}:</b> {item.value ? item.value : <i>(empty)</i>}
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal>

            </div>

        </>
    )
}

export default DailyEntry;
