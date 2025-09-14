import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DatePicker, Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";
import ViewDailyEntry from './ViewDailyEntry';
import CreatePartyForm from './common/CreatePartyForm';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import RemarkModal, { RemarkButton } from './common/RemarkModal';

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);

const DailyEntry = ({
    Locations,
    vehicleData,
    pumpList,
    bankData,
    partyListAll,
    transporterList,
    driverList,
    MaalList,
    addNewPump,
    addNewVehicle,
    addNewDriver,
    addNewBank,
    addNewLocation,
    addNewMaal,
    addNewTransporter,
    addNewParty,
    firstKey,
    lastKey,
    currentPage,
    isLoading,
    dataSource,
    completeDataSource,
    handleTableChange,
    addPartyInPartyList,
    partyList,
    setPartyList,
    newTransporter,
    setNewTransporter,
    newLocation,
    setNewLocation,
    newBank,
    setNewBank,
    partyModal,
    setPartyModal,
    createPartyForm,
    driverForm,
    newMaal,
    setNewMaal,
    setDriverList,
    driverModal,
    setDriverModal,
    newVehicleNo,
    setNewVehicleNo,
    setDataSource,
}) => {
    // const [driverForm] = Form.useForm();
    // const [createPartyForm] = Form.useForm();
    // Drivers List
    // const [driverList, setDriverList] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    // Locations list
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    // const [Locations, setLocations] = useState([]);
    // Maal List
    // const [MaalList, setMaalList] = useState([]);
    // const [newMaal, setNewMaal] = useState('');
    //All Party List for Party Select
    // const [partyListAll, setPartyListAll] = useState([]);
    // All Transporter List for Transporter Select
    // const [transporterList, setTransporterList] = useState([]);
    // const [newTransporter, setNewTransporter] = useState('');
    // Data to display in the table
    // const [completeDataSource, setCompleteDataSource] = useState([]);
    // const [dataSource, setDataSource] = useState([]); // Table Data
    //Bank
    // const [newBank, setNewBank] = useState('');
    // const [bankData, setBankData] = useState([]);
    const [dateFilter, setDateFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

    // MODAL VARIABLES:
    // const [partyModal, setPartyModal] = useState({});
    // const [vehicleData, setVehicleData] = useState([]);
    // const [newVehicleNo, setNewVehicleNo] = useState('');

    // const [driverModal, setDriverModal] = useState({
    //     label: '',
    //     value: '',
    //     location: '',
    //     LicenseDate: '',
    //     contact: '',
    //     licenseDocument: null, // Add this new field
    // });
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [remarkData, setRemarkData] = useState([]);


    // const [lastKey, setLastKey] = useState(null);
    // const [firstKey, setFirstKey] = useState(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);
    // const [pumpList, setPumpList] = useState([]);

    // Handler to open modal
    const handleViewClick = (record) => {
        setSelectedRow(record);
        setViewModalOpen(true);
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
                {dataIndex === 'date' ? (
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
                style={{
                    fontSize: 20,
                    color: filtered ? 'red' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            if (dataIndex === 'date') {
                return record.dateToSort === value;
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
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>Date</span>
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            ...getColumnSearchProps('date'),
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
                // <Button type="link" onClick={() => handleViewRemarks(record)}>
                //     <FileTextOutlined style={{ fontSize: 'larger' }} />
                // </Button>
                <RemarkButton record={record} />
            ),
        },
    ];

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
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

            {/* <Input style={{ width: "20%", marginLeft: '20px' }} type='date' value={dateFilter} onChange={handleDateFilter} />
            <Button onClick={() => {
                setDataSource(completeDataSource);
                setDateFilter(null);
            }}>Clear Date</Button> */}
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
            <Button type="primary"  onClick={exportToExcel}>
                Export to Excel
            </Button>
            <div style={{ width: "100vw", overflowX: 'auto', marginLeft: '0px', height: '84.5vh', backgroundColor: 'white' }}>
                <Table
                    style={{ zIndex: '100' }}
                    bordered
                    size="small"
                    scroll={{ y: 450 }}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: 20,
                        // current: currentPage,
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
                    width={'100%'}
                    style={{ top: 10 }}
                    // title="Daily Entry Details"
                    destroyOnClose
                    closeIcon={
                        <Button
                            type="primary"
                            size="small"
                            style={{ marginTop: '-20px', marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                            pumpList={pumpList}
                            newLocation={newLocation}
                            setNewLocation={setNewLocation}
                            addNewPump={addNewPump}
                            addNewVehicle={addNewVehicle}
                            addNewDriver={addNewDriver}
                            addNewBank={addNewBank}
                            addNewLocation={addNewLocation}
                            addNewTransporter={addNewTransporter}
                            addNewParty={addNewParty}
                            firstKey={firstKey}
                            lastKey={lastKey}
                            currentPage={currentPage}
                            addPartyInPartyList={addPartyInPartyList}
                            partyList={partyList}
                            setPartyList={setPartyList}
                            newTransporter={newTransporter}
                            setNewTransporter={setNewTransporter}
                            newBank={newBank}
                            setNewBank={setNewBank}
                            partyModal={partyModal}
                            setPartyModal={setPartyModal}
                            createPartyForm={createPartyForm}
                            driverForm={driverForm}
                            newMaal={newMaal}
                            setNewMaal={setNewMaal}
                            setDriverList={setDriverList}
                            setDriverModal={setDriverModal}
                            newVehicleNo={newVehicleNo}
                            setNewVehicleNo={setNewVehicleNo}
                        />
                    )}
                </Modal>

                <RemarkModal
                    open={remarkModalOpen}
                    onCancel={() => setRemarkModalOpen(false)}
                    remarkData={remarkData}
                />

            </div>

        </>
    )
}

export default DailyEntry;
