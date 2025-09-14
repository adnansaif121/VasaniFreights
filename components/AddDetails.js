import React, { useRef, useState, useEffect } from 'react';
import { Input, Popover, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload, message, Tabs } from 'antd';
import { SearchOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import firebase from '../config/firebase'
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import CreatePartyForm from './common/CreatePartyForm';
import CreateDriverForm from './common/CreateDriverForm';
import useDisableNumberInputScroll from './hooks/useDisableNumberInputScroll';

let todayDate = (new Date()).toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).split(',')[0].split('/');
todayDate = todayDate[2] + '-' + (parseInt(todayDate[0]) < 10 ? '0' + todayDate[0] : todayDate[0]) + '-' + (parseInt(todayDate[1]) < 10 ? '0' + todayDate[1] : todayDate[1]);

const AddDetails = ({
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
    addPartyInPartyList,
    partyList,
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
    setNewVehicleNo
}) => {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [vehicleNo, setVehicleNo] = useState('');
    const [date, setDate] = useState(todayDate);
    const [mt, setMT] = useState(false);
    const [vehicleStatus, setVehicleStatus] = useState('');
    const [payStatus, setPayStatus] = useState('Paid');
    const [janaKm, setJanaKm] = useState(0);
    const [aanaKm, setAanaKm] = useState(0);
    const [tripKm, setTripKm] = useState('');
    const [milometer, setMilometer] = useState('');
    const [dieselQty, setDieselQty] = useState('');
    const [pumpName, setPumpName] = useState('');
    const [newPumpName, setNewPumpName] = useState('');
    const [average, setAverage] = useState('');
    const [midwayDiesel, setMidwayDiesel] = useState('');
    const [rate, setRate] = useState([0, 0, 0, 0]);
    const [qty, setQty] = useState([0, 0, 0, 0]);
    const [bhadaKaunDalega, setBhadaKaunDalega] = useState(null);
    const [partyForTransporterPayment, setPartyForTransporterPayment] = useState('');

    // to display dynamic Bhada Kaun Dalega list
   
    // const [partyDetailsList, setPartyDetailsList] = useState([[], [], [], [], [], []]);
    const [selectedPartyIndex, setSelectedPartyIndex] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
    const [selectedTransporterIndex, setSelectedTransporterIndex] = useState(-1);
    
    const [transporterSelected, setTransporterSelected] = useState(false);
   
    const [lrNumber, setLrNumber] = useState('');
    const [driver1, setDriver1] = useState({});
    const [driver2, setDriver2] = useState({});
    const [conductor, setConductor] = useState({});

    const [driver1Value, setDriver1Value] = useState();
    const [driver2Value, setDriver2Value] = useState();
    const [conductorValue, setConductorValue] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

   
    // const [newVehicleNo, setNewVehicleNo] = useState('');
    // const [driverModal, setDriverModal] = useState({});
    const [toggleKaataParchi, setToggleKaataParchi] = useState(false);
    const [pohchAmount, setPohchAmount] = useState(0);
    // const [pumpList, setPumpList] = useState([]);
    const [totalFreight, setTotalFreight] = useState(0);
    const { TextArea } = Input;

    const PohchId = ('' + new Date().getFullYear()).substring(2) + '' + (new Date().getMonth() + 1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);

    useEffect(() => {
        setTotalFreight(isNaN(parseFloat(rate[0]) * parseFloat(qty[0])) ? 0 : (parseFloat(rate[0]) * parseFloat(qty[0])).toFixed(2) || 0);
    }, [rate, qty]);

    useDisableNumberInputScroll();

    const resetDriverList = () => {
        let _driverList = driverList;
        // Enable all selected Option:
        for (let i = 0; i < _driverList.length; i++) {
            _driverList[i].disabled = false;
        }

        setDriverList([..._driverList]);
    }

    const handleSave = () => {
        let tripDetails = form.getFieldsValue(['tripDetails']);
        if (tripDetails.tripDetails === undefined) {
            alert("Trips are not added. Please add trips to create entry");
            return;
        }
        let listOfTrips = [];
        tripDetails?.tripDetails?.forEach((trip, index) => {
            listOfTrips.push({
                from: trip.from || '',
                to: trip.to || '',
                bhejneWaala: trip.bhejneWaala || '',
                bhejneWaalaPartyId: partyListAll[selectedPartyIndex[0]].id || 'Not available',
                // bhejneWaaliPartyAddress: partyListAll[selectedPartyIndex[0]].address || 'Not available',
                // bhejneWaaliPartyContact: partyListAll[selectedPartyIndex[0]].contact || 'Not available',
                // bhejneWaaliPartyLocation: partyListAll[selectedPartyIndex[0]].location || 'Not available',
                paaneWaala: trip.paaneWaala || '',
                paaneWaalaPartyId: partyListAll[selectedPartyIndex[1]].id || 'Not available',
                // paaneWaaliPartyAddress: partyListAll[selectedPartyIndex[1]].address || 'Not available',
                // paaneWaaliPartyContact: partyListAll[selectedPartyIndex[1]].contact || 'Not available',
                // paaneWaaliPartyLocation: partyListAll[selectedPartyIndex[1]].location || 'Not available',
                transporter: trip.transporter || '',
                transporterId: transporterList[selectedTransporterIndex]?.id || 'Not available',
                // transporterAddress: transporterList[selectedTransporterIndex]?.address || 'Not available',
                // transporterContact: transporterList[selectedTransporterIndex]?.contact || 'Not available',
                // transporterLocation: transporterList[selectedTransporterIndex]?.location || 'Not available',
                maal: trip.Maal || '',
                qty: trip.qty || 0,
                rate: trip.rate || 0,
                totalFreight: parseFloat(parseFloat(trip.rate) * parseFloat(trip.qty)).toFixed(2) || 0,
                payStatus: payStatus || '',
                extraAmtRemarks: trip.extraAmtRemarks || '',
                remainingBalance: parseFloat(parseFloat(trip.rate) * parseFloat(trip.qty)).toFixed(2) -
                    ((form3.getFieldsValue(['paymentDetails']).paymentDetails !== undefined && form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index] !== undefined) ?
                        parseFloat(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].cashAmount || 0) || 0 +
                        parseFloat(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].onlineAmount || 0) || 0 +
                        parseFloat(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].chequeAmount || 0) || 0
                        :
                        0
                    )
            });
        }
        );

        let kaataParchi = form2.getFieldsValue(['kaataParchi']);
        let listOfKaataParchi = [];
        kaataParchi?.kaataParchi?.forEach((parchi) => {
            listOfKaataParchi.push({
                unloadingDate: parchi?.unloadingDate || '',
                khaliGadiWajan: parchi?.khaliGadiWajan || '',
                bhariGadiWajan: parchi?.bhariGadiWajan || '',
                maalKaWajan: parchi?.maalKaWajan || '',
                ghaateAllowed: parchi?.ghaateAllowed || '',
                ghaateActual: parchi?.ghaateActual || '',
                remarks: parchi?.remarks || ''
            });
        }
        );

        if (form2.getFieldsValue(['kaataParchi']).kaataParchi === undefined || kaataParchi.length === 0) listOfKaataParchi = null;

        let firstPayment = form3.getFieldsValue(['paymentDetails']);
        let listOfFirstPayment = [];
        firstPayment?.paymentDetails?.forEach((payment) => {
            listOfFirstPayment.push({
                bhadaKaunDalega: bhadaKaunDalega || '',
                partyForNaveenKaka: payment?.partyForNaveenKaka || '',
                partyForTransporterPayment: partyForTransporterPayment || '',
                pohchAmount: payment?.pohchAmount || '',
                pohchId: (payment?.pohchAmount !== undefined || payment?.pohchAmount !== '') ? PohchId : '',
                pohchDate: payment?.pohchDate || '',
                pohchSendTo: payment?.pohchSendTo || '',
                pohchRemarks: payment?.pohchRemarks || '',
                cashAmount: payment?.cashAmount || '',
                cashDate: payment?.cashDate || '',
                cashRemarks: payment?.cashRemarks || '',
                onlineAmount: payment?.onlineAmount || '',
                onlineDate: payment?.onlineDate || '',
                onlineBank: payment?.onlineBank || '',
                onlineRemarks: payment?.onlineRemarks || '',
                chequeAmount: payment?.chequeAmount || '',
                chequeDate: payment?.chequeDate || '',
                chequeBank: payment?.chequeBank || '',
                chequeRemarks: payment?.chequeRemarks || '',
                chequeNumber: payment?.chequeNumber || '',
            });
        }
        );
        // IF bhadaKaunDalega is 'NaveenKaka' or 'HareKrishna' or transporterSelected, AND partyForTransporterPayment is not empty, then set or update the entry in database at '/'


        if (form3.getFieldsValue(['paymentDetails']).paymentDetails === undefined || form3.getFieldsValue(['paymentDetails']).paymentDetails[0] === undefined || firstPayment.length === 0) listOfFirstPayment = null;

        let dieselAndKmDetails = {
            janaKm: janaKm || 0,
            aanaKm: aanaKm || 0,
            tripKm: Math.abs(janaKm - aanaKm) || '',
            milometer: milometer || '',
            dieselQty: dieselQty || '',
            pumpName: pumpName || '',
            average: (Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || 0,
            midwayDiesel: midwayDiesel || ''
        }

        if (dieselAndKmDetails === undefined || dieselAndKmDetails.length === 0) dieselAndKmDetails = null;

        const db = getDatabase();
        // let id = guidGenerator();
        let id = new Date().getTime();
        set(ref(db, 'dailyEntry/' + id), {
            date: date,
            vehicleNo: vehicleNo || '',
            mt: mt,
            vehicleStatus: vehicleStatus || '',
            // payStatus: payStatus || '',
            dieselAndKmDetails: { ...dieselAndKmDetails } || null,
            tripDetails: listOfTrips || null,
            // driversDetails: listOfDrivers || null,
            kaataParchi: listOfKaataParchi || null,
            firstPayment: listOfFirstPayment || null,

            //DRIVER DATA
            lrNumber: lrNumber || '',
            driver1: driver1 || null,
            driver1Id: driver1?.id || 'Not available',
            // driver1Address: driver1?.location || 'Not available',
            // driver1Contact: driver1?.contact || 'Not available',
            // driver1LicenseDate: driver1?.LicenseDate || 'Not available',
            driver2: driver2 || null,
            driver2Id: driver2?.id || 'Not available',
            // driver2Address: driver2?.location || 'Not available',
            // driver2Contact: driver2?.contact || 'Not available',
            // driver2LicenseDate: driver2?.LicenseDate || 'Not available',
            conductor: conductor || null,
            conductorId: conductor?.id || 'Not available'
            // conductorAddress: conductor?.location || 'Not available',
            // conductorContact: conductor?.contact || 'Not available',
            // conductorLicenseDate: conductor?.LicenseDate || 'Not available',

        }).then(() => {
            alert('Data Saved Successfully');
            form.resetFields();
            form1.resetFields();
            form2.resetFields();
            form3.resetFields();
            setDate(todayDate);
            setVehicleNo('');
            setMT('');
            setLrNumber('');
            setVehicleStatus('');
            setDriver1({});
            setDriver2({});
            setConductor({});
            setJanaKm(0);
            setAanaKm(0);
            setMilometer(0);
            setDieselQty(0);
            setPumpName(null);
            setAverage(0);
            setMidwayDiesel(0);
            setDriver1Value(null);
            setDriver2Value(null);
            setConductorValue(null);
            resetDriverList();
            setTotalFreight(0);
        }).catch((error) => {
            console.error('Error:', error);
        });

    }

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        addNewParty();
        createPartyForm.resetFields();
        setIsModalOpen(false);
    };

    const handleDriverOk = () => {

        addNewDriver();
        driverForm.resetFields();
        setIsDriverModalOpen(false);
        setDriverModal({});
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

           <CreateDriverForm
               isDriverModalOpen={isDriverModalOpen}
               handleDriverOk={handleDriverOk}
               handleDriverCancel={handleDriverCancel}
               driverForm={driverForm}
               driverModal={driverModal}
               setDriverModal={setDriverModal}
           />

            <div className={styles.addNewDetails}>
                <div style={{ width: '100%' }}>
                    <Row gutter={16}>
                        {/* Left Half: Trip & Driver Details */}
                        <Col span={12}>
                            <Card style={{ marginBottom: '10px' }} >
                                <div>
                                    <Flex style={{ width: "100%", height: 53 }} justify='space-between' align='center'>
                                        <Form.Item style={{ width: '48%' }} label="Date">
                                            <Input type='date' value={date} onChange={(e) => setDate(e.target.value)}></Input>
                                        </Form.Item>

                                        <Form.Item style={{ width: '48%' }} label="Vehicle">
                                            <Select
                                                showSearch
                                                value={vehicleNo}
                                                placeholder="Vehicle No."
                                                optionFilterProp="children"
                                                onChange={(value) => setVehicleNo(value)}
                                                // onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={vehicleData}
                                                dropdownRender={(menu) => (
                                                    <>
                                                        {menu}
                                                        <Divider
                                                            style={{
                                                                margin: '8px 0',
                                                            }}
                                                        />
                                                        <Space
                                                            style={{
                                                                padding: '0 8px 4px',
                                                            }}
                                                        >
                                                            <Input
                                                                placeholder="Please enter item"
                                                                value={newVehicleNo}
                                                                onChange={(e) => setNewVehicleNo(e.target.value)}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                            />
                                                            <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                                                addNewVehicle(e)
                                                            }}>

                                                            </Button>
                                                        </Space>
                                                    </>
                                                )}
                                            />
                                        </Form.Item>


                                    </Flex>

                                    <Form
                                        name="Trip Details"
                                        style={{
                                            // maxWidth: 1200,
                                        }}
                                        initialValues={{
                                            remember: true,
                                            tripDetails: [{}],
                                        }}
                                        autoComplete="off"
                                        form={form}
                                    >


                                        <Flex gap="middle" vertical>


                                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                                            <Form.List name="tripDetails" >
                                                {(fields) => (
                                                    <>
                                                        {fields.map(({ key, name }) => (
                                                            <div
                                                                key={key}
                                                            >
                                                                <Flex gap="middle" vertical>



                                                                    <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>
                                                                        <Form.Item style={{ width: '48%' }} label="From"
                                                                            name={[name, 'from']}>
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="from"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={Locations}
                                                                                dropdownRender={(menu) => (
                                                                                    <>
                                                                                        {menu}
                                                                                        <Divider
                                                                                            style={{
                                                                                                margin: '8px 0',
                                                                                            }}
                                                                                        />
                                                                                        <Space
                                                                                            style={{
                                                                                                padding: '0 8px 4px',
                                                                                            }}
                                                                                        >
                                                                                            <Input
                                                                                                placeholder="Please enter item"
                                                                                                value={newLocation}
                                                                                                onChange={(e) => setNewLocation(e.target.value)}
                                                                                                onKeyDown={(e) => e.stopPropagation()}
                                                                                            />
                                                                                            <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                                                                                addNewLocation(e);
                                                                                            }}>

                                                                                            </Button>
                                                                                        </Space>
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '48%' }}
                                                                            label="To"
                                                                            name={[name, 'to']}
                                                                        >
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="To/Unloading Point"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={Locations}
                                                                                dropdownRender={(menu) => (
                                                                                    <>
                                                                                        {menu}
                                                                                        <Divider
                                                                                            style={{
                                                                                                margin: '8px 0',
                                                                                            }}
                                                                                        />
                                                                                        <Space
                                                                                            style={{
                                                                                                padding: '0 8px 4px',
                                                                                            }}
                                                                                        >
                                                                                            <Input
                                                                                                placeholder="Please enter item"
                                                                                                value={newLocation}
                                                                                                onChange={(e) => setNewLocation(e.target.value)}
                                                                                                onKeyDown={(e) => e.stopPropagation()}
                                                                                            />
                                                                                            <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                                                                                // e.preventDefault();
                                                                                                // if (newLocation.trim() === "") {
                                                                                                //     alert("Please enter a value to add location.")
                                                                                                //     return;
                                                                                                // }
                                                                                                // for (let i = 0; i < Locations.length; i++) {
                                                                                                //     if (Locations[i].label.toLowerCase() === newLocation.toLowerCase()) {
                                                                                                //         alert(`Location with name ${Locations[i].label} already exists.`);
                                                                                                //         return;
                                                                                                //     }
                                                                                                // }
                                                                                                // setLocations([...Locations, { value: newLocation, label: newLocation }]);
                                                                                                // setNewLocation('');
                                                                                                addNewLocation(e);
                                                                                            }}>

                                                                                            </Button>
                                                                                        </Space>
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Form.Item>


                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>

                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                            <Form.Item style={{ width: '100%' }} label="Sender"
                                                                                name={[name, 'bhejneWaala']}>
                                                                                <Select
                                                                                    showSearch
                                                                                    placeholder="Bhejne waale"
                                                                                    optionFilterProp="children"
                                                                                    onChange={(value) => {
                                                                                        addPartyInPartyList(value, 'party1');
                                                                                        let _selectedPartyIndex = selectedPartyIndex;
                                                                                        for (let i = 0; i < partyListAll.length; i++) {
                                                                                            if (partyListAll[i].value.toUpperCase() === value.toUpperCase()) {
                                                                                                _selectedPartyIndex[name] = i;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        setSelectedPartyIndex([..._selectedPartyIndex]);
                                                                                    }}
                                                                                    // onSearch={onSearch}
                                                                                    filterOption={filterOption}
                                                                                    options={partyListAll}
                                                                                    dropdownRender={(menu) => (
                                                                                        <>
                                                                                            {menu}
                                                                                            <Divider
                                                                                                style={{
                                                                                                    margin: '8px 0',
                                                                                                }}
                                                                                            />
                                                                                            <Space
                                                                                                style={{
                                                                                                    padding: '0 8px 4px',
                                                                                                }}
                                                                                            >
                                                                                                <Button onClick={() => setIsModalOpen(true)}>Add New</Button>
                                                                                            </Space>
                                                                                        </>
                                                                                    )}
                                                                                // style={{ flex: 1 }}
                                                                                />
                                                                            </Form.Item>
                                                                            {selectedPartyIndex[name] !== -1 && (
                                                                                <Popover
                                                                                    placement="right"
                                                                                    title={partyListAll[selectedPartyIndex[name]].label || 'Party Details'}
                                                                                    content={
                                                                                        <div style={{ minWidth: 180 }}>
                                                                                            <div><b>Address:</b> {partyListAll[selectedPartyIndex[name]].address || 'Not available'}</div>
                                                                                            <div><b>Contact:</b> {partyListAll[selectedPartyIndex[name]].contact || 'Not available'}</div>
                                                                                            <div><b>Location:</b> {partyListAll[selectedPartyIndex[name]].location || 'Not available'}</div>
                                                                                        </div>
                                                                                    }
                                                                                    trigger="click"
                                                                                >
                                                                                    <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >

                                                                                    </Button>
                                                                                </Popover>
                                                                            )}
                                                                        </div>



                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                            <Form.Item style={{ width: '100%' }} label="Reciever"
                                                                                name={[name, 'paaneWaala']}>
                                                                                <Select
                                                                                    showSearch
                                                                                    placeholder="Paane waala"
                                                                                    optionFilterProp="children"
                                                                                    onChange={(value) => {
                                                                                        addPartyInPartyList(value, 'party2')
                                                                                        let _selectedPartyIndex = selectedPartyIndex;
                                                                                        for (let i = 0; i < partyListAll.length; i++) {
                                                                                            if (partyListAll[i].value.toUpperCase() === value.toUpperCase()) {
                                                                                                _selectedPartyIndex[name + 1] = i;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        setSelectedPartyIndex([..._selectedPartyIndex]);
                                                                                    }}
                                                                                    // onSearch={onSearch}
                                                                                    filterOption={filterOption}
                                                                                    options={partyListAll}
                                                                                    dropdownRender={(menu) => (
                                                                                        <>
                                                                                            {menu}
                                                                                            <Divider
                                                                                                style={{
                                                                                                    margin: '8px 0',
                                                                                                }}
                                                                                            />
                                                                                            <Space
                                                                                                style={{
                                                                                                    padding: '0 8px 4px',
                                                                                                }}
                                                                                            >
                                                                                                <Button onClick={() => setIsModalOpen(true)}>Add New</Button>
                                                                                            </Space>
                                                                                        </>
                                                                                    )}
                                                                                />
                                                                            </Form.Item>
                                                                            {selectedPartyIndex[name + 1] !== -1 && (
                                                                                <Popover
                                                                                    placement="right"
                                                                                    title={partyListAll[selectedPartyIndex[name + 1]].label || 'Party Details'}
                                                                                    content={
                                                                                        <div style={{ minWidth: 180 }}>
                                                                                            <div><b>Address:</b> {partyListAll[selectedPartyIndex[name + 1]].address || 'Not available'}</div>
                                                                                            <div><b>Contact:</b> {partyListAll[selectedPartyIndex[name + 1]].contact || 'Not available'}</div>
                                                                                            <div><b>Location:</b> {partyListAll[selectedPartyIndex[name + 1]].location || 'Not available'}</div>
                                                                                        </div>
                                                                                    }
                                                                                    trigger="click"
                                                                                >
                                                                                    <Button icon={<EyeOutlined />} type="default" size="small" style={{ marginBottom: '24px' }}>

                                                                                    </Button>
                                                                                </Popover>
                                                                            )}
                                                                        </div>

                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>
                                                                        <Form.Item style={{ width: '48%' }}
                                                                            label="To Pay/ Paid"
                                                                            name={[name, 'payStatus']}
                                                                        >

                                                                            {/* Provide a Select component replacing Radio Group */}
                                                                            <Select
                                                                                style={{ width: '100%' }}
                                                                                showSearch
                                                                                placeholder="To Pay/Paid"
                                                                                optionFilterProp="children"
                                                                                defaultValue="Paid"
                                                                                // value={'Paid'}
                                                                                // set default value as 'Paid'
                                                                                onChange={(value) => { setPayStatus(value) }}
                                                                                // onChange={(value) => {
                                                                                //     let _obj = tripDetails;
                                                                                //     _obj[name].payStatus = value;
                                                                                //     setTripDetails([..._obj]);
                                                                                // }}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={[{ label: 'To Pay', value: 'To Pay' }, { label: 'Paid', value: 'Paid' }]}
                                                                            />

                                                                        </Form.Item>

                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                                            <Form.Item style={{ width: '100%' }}
                                                                                label="Transporter"
                                                                                name={[name, 'transporter']}
                                                                            >


                                                                                <Select
                                                                                    showSearch
                                                                                    placeholder="Transporter"
                                                                                    optionFilterProp="children"
                                                                                    onChange={(value) => {
                                                                                        addPartyInPartyList(value, 'transporter');
                                                                                        setTransporterSelected(value);
                                                                                        let _transporterList = transporterList;
                                                                                        for (let i = 0; i < _transporterList.length; i++) {
                                                                                            if (_transporterList[i].value === value) {
                                                                                                setSelectedTransporterIndex(i);
                                                                                                break;
                                                                                            }
                                                                                        }

                                                                                    }}
                                                                                    // onSearch={onSearch}
                                                                                    filterOption={filterOption}
                                                                                    options={transporterList}
                                                                                    dropdownRender={(menu) => (
                                                                                        <>
                                                                                            {menu}
                                                                                            <Divider
                                                                                                style={{
                                                                                                    margin: '8px 0',
                                                                                                }}
                                                                                            />
                                                                                            <Space
                                                                                                style={{
                                                                                                    padding: '0 8px 4px',
                                                                                                }}
                                                                                            >
                                                                                                <Input
                                                                                                    placeholder="Please enter item"
                                                                                                    value={newTransporter}
                                                                                                    onChange={(e) => setNewTransporter(e.target.value)}
                                                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                                                />
                                                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewTransporter(e)}>

                                                                                                </Button>
                                                                                            </Space>
                                                                                        </>
                                                                                    )}
                                                                                />


                                                                            </Form.Item>
                                                                            {selectedTransporterIndex !== -1 && (
                                                                                <Popover
                                                                                    placement="right"
                                                                                    title={transporterList[selectedTransporterIndex]?.label || 'Transporter Details'}
                                                                                    content={
                                                                                        <div style={{ minWidth: 100 }}>
                                                                                            <div><b>Address:</b> {transporterList[selectedTransporterIndex]?.address || 'Not available'}</div>
                                                                                            <div><b>Contact:</b> {transporterList[selectedTransporterIndex]?.contact || 'Not available'}</div>
                                                                                            <div><b>Location:</b> {transporterList[selectedTransporterIndex]?.location || 'Not available'}</div>
                                                                                        </div>
                                                                                    }
                                                                                    trigger="click"
                                                                                >

                                                                                    <Button icon={<EyeOutlined />} type="default" size="small" style={{ marginBottom: '24px' }}>
                                                                                    </Button>
                                                                                </Popover>
                                                                            )}
                                                                        </div>


                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>
                                                                        <Form.Item style={{ width: '48%' }}
                                                                            label="Qty"
                                                                            name={[name, 'qty']}
                                                                        >
                                                                            <Input type='number'
                                                                                onWheel={e => e.target.blur()}
                                                                                value={qty}
                                                                                // defaultValue={0}
                                                                                onChange={(e) => { let q = qty; q[name] = e.target.value; setQty([...q]) }}>

                                                                            </Input>
                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '48%' }}
                                                                            label="Rate"
                                                                            name={[name, 'rate']}
                                                                        >
                                                                            <Input type='number'
                                                                                onWheel={e => e.target.blur()}
                                                                                value={rate}
                                                                                // defaultValue={0}
                                                                                onChange={(e) => { let r = rate; r[name] = e.target.value; setRate([...r]) }}
                                                                            ></Input>
                                                                        </Form.Item>
                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>
                                                                        <Form.Item style={{ width: '48%' }}
                                                                            label="Total Freight"
                                                                        // name={[name, 'totalFreight']}
                                                                        >
                                                                            <Input value={totalFreight}>
                                                                            </Input>
                                                                            {/* {parseInt(rate[name]) * parseInt(qty[name])} */}
                                                                            {/* <Input value={rate[name]*qty[name]}></Input> */}
                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '48%' }} label="Maal"
                                                                            name={[name, 'Maal']}>
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="Maal"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={MaalList}
                                                                                dropdownRender={(menu) => (
                                                                                    <>
                                                                                        {menu}
                                                                                        <Divider
                                                                                            style={{
                                                                                                margin: '8px 0',
                                                                                            }}
                                                                                        />
                                                                                        <Space
                                                                                            style={{
                                                                                                padding: '0 8px 4px',
                                                                                            }}
                                                                                        >
                                                                                            <Input
                                                                                                placeholder="Please enter item"
                                                                                                value={newMaal}
                                                                                                onChange={(e) => setNewMaal(e.target.value)}
                                                                                                onKeyDown={(e) => e.stopPropagation()}
                                                                                            />
                                                                                            <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                                                                                // e.preventDefault();
                                                                                                // for (let i = 0; i < MaalList.length; i++) {
                                                                                                //     if (MaalList[i].label.toLowerCase() === newMaal.toLowerCase()) {
                                                                                                //         alert(`Maal with name ${MaalList[i].label} already exists.`);
                                                                                                //         return;
                                                                                                //     }
                                                                                                // }
                                                                                                // setMaalList([...MaalList, { value: newMaal, label: newMaal }]);
                                                                                                // setNewMaal('');
                                                                                                addNewMaal(e);
                                                                                            }}>

                                                                                            </Button>
                                                                                        </Space>
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Form.Item>

                                                                    </Flex>

                                                                </Flex>



                                                            </div>
                                                        ))}
                                                    </>

                                                )}
                                            </Form.List>

                                        </Flex>


                                    </Form>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <Form name="Driver | Diesel | Km | Milometer | Avg Details"
                                        style={{
                                            maxWidth: 1200,
                                        }}
                                        initialValues={{
                                            remember: true,
                                        }}
                                        autoComplete="off"
                                        form={form1}
                                    >
                                        <Flex gap="middle" vertical>

                                            <Flex style={{ width: "100%", height: 20, display: 'flex' }} justify='space-between' align='center'>
                                                {/* Lorry Receipt Number */}
                                                <Form.Item style={{ width: '48%' }} label="Lorry Receipt No.">
                                                    <Input value={lrNumber} onChange={(e) => { setLrNumber(e.target.value) }} placeholder='Lorry Receipt No.' />
                                                </Form.Item>

                                                <Form.Item style={{ width: '48%' }} label="Trip Cash" id='tripcash'>
                                                    <Input value={driver1.TripCash} onChange={(e) => {
                                                       setDriver1({ ...driver1, TripCash: e.target.value });
                                                    }} placeholder='Trip Cash' type='number' onWheel={e => e.target.blur()} />
                                                </Form.Item>
                                            </Flex>

                                            <Flex style={{ width: "100%", height: 20, display: 'flex' }} justify='space-between' align='center'>
                                                {/* Name */}
                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Form.Item style={{ width: '100%' }} label="Driver 1">

                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            onChange={(value, option) => {
                                                                if (driver1.label !== undefined) {
                                                                    let _driverList = driverList;
                                                                    // Enable Last selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === driver1.label) {
                                                                            _driverList[i].disabled = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    // Disable Currently Selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }

                                                                    setDriverList([..._driverList]);
                                                                }
                                                                else {
                                                                    let _driverList = driverList;
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                    setDriverList([..._driverList]);

                                                                }
                                                                setDriver1({
                                                                    ...option,
                                                                    TripCash: driver1.TripCash || '', // preserve TripCash if already set
                                                                    DebitCredit: driver1.DebitCredit || '',
                                                                });
                                                                setDriver1Value(value);
                                                            }}
                                                            // onSearch={onSearch}
                                                            value={driver1Value}
                                                            filterOption={filterOption}
                                                            options={driverList}
                                                            dropdownRender={(menu) => (
                                                                <>
                                                                    {menu}
                                                                    <Divider
                                                                        style={{
                                                                            margin: '8px 0',
                                                                        }}
                                                                    />
                                                                    <Space
                                                                        style={{
                                                                            padding: '0 8px 4px',
                                                                        }}
                                                                    >
                                                                        <Button onClick={() => setIsDriverModalOpen(true)}>Add New</Button>
                                                                    </Space>
                                                                </>
                                                            )}
                                                        />
                                                    </Form.Item>
                                                    {driver1 && (
                                                        <Popover
                                                            placement="right"
                                                            title={driver1.label || 'Driver Details'}
                                                            content={
                                                                <div style={{ minWidth: 180 }}>
                                                                    <div><b>Contact:</b> {driver1.Contact || 'Not available'}</div>
                                                                    <div><b>Licence Date:</b> {
                                                                        driver1.LicenseDate
                                                                            ? (() => {
                                                                                const [year, month, day] = driver1.LicenseDate.split('-');
                                                                                return `${day}/${month}/${year}`;
                                                                            })()
                                                                            : 'Not available'
                                                                    }</div>
                                                                    <div><b>Location:</b> {driver1.location || 'Not available'}</div>
                                                                </div>
                                                            }
                                                            trigger="click"
                                                        >
                                                            <Button icon={<EyeOutlined />} type="default" size="small" style={{ marginBottom: '24px' }}>

                                                            </Button>
                                                        </Popover>
                                                    )}
                                                </div>

                                                {/* Radio button for debit and credit */}
                                                <Form.Item style={{ width: '48%' }} label="Debit/Credit">

                                                    {/* Replacing Radio group with the Select Component */}
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        showSearch
                                                        // placeholder="To Pay/Paid"
                                                        optionFilterProp="children"
                                                        defaultValue="Debit"
                                                        onChange={(value) => {
                                                            let _obj = driver1;
                                                            _obj.DebitCredit = value;
                                                            setDriver1(_obj);
                                                        }}
                                                        filterOption={filterOption}
                                                        options={[{ label: 'Debit', value: 'Debit' }, { label: 'Credit', value: 'Credit' }]}
                                                    />
                                                </Form.Item>
                                            </Flex>

                                            <Flex style={{ width: "100%", height: 20 }} justify='space-between' align='center'>

                                                {/* Name */}
                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Form.Item style={{ width: '100%' }} label="Driver 2">
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            onChange={(value, option) => {
                                                                if (driver2.label !== undefined) {
                                                                    let _driverList = driverList;
                                                                    // Enable Last selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === driver2.label) {
                                                                            _driverList[i].disabled = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    // Disable Currently Selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }

                                                                    setDriverList([..._driverList]);
                                                                }
                                                                else {
                                                                    let _driverList = driverList;
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                    setDriverList([..._driverList]);

                                                                }
                                                                setDriver2(option);
                                                                setDriver2Value(value)
                                                            }}
                                                            // onSearch={onSearch}
                                                            value={driver2Value}
                                                            filterOption={filterOption}
                                                            options={driverList}
                                                            dropdownRender={(menu) => (
                                                                <>
                                                                    {menu}
                                                                    <Divider
                                                                        style={{
                                                                            margin: '8px 0',
                                                                        }}
                                                                    />
                                                                    <Space
                                                                        style={{
                                                                            padding: '0 8px 4px',
                                                                        }}
                                                                    >
                                                                        {/* <Input
                                                                            placeholder="Please enter item"
                                                                            value={newDriverName}
                                                                            onChange={(e) => setNewDriverName(e.target.value)}
                                                                            onKeyDown={(e) => e.stopPropagation()}
                                                                        />
                                                                        <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}> */}

                                                                        {/* </Button> */}

                                                                        <Button onClick={() => setIsDriverModalOpen(true)}>Add New</Button>
                                                                    </Space>
                                                                </>
                                                            )}
                                                        />
                                                    </Form.Item>
                                                    {driver2 && (
                                                        <Popover
                                                            placement="right"
                                                            title={driver2.label || 'Driver Details'}
                                                            content={
                                                                <div style={{ minWidth: 180 }}>
                                                                    <div><b>Contact:</b> {driver2.Contact || 'Not available'}</div>
                                                                    <div><b>Licence Date:</b> {
                                                                        driver2.LicenseDate
                                                                            ? (() => {
                                                                                const [year, month, day] = driver2.LicenseDate.split('-');
                                                                                return `${day}/${month}/${year}`;
                                                                            })()
                                                                            : 'Not available'
                                                                    }</div>
                                                                    <div><b>Location:</b> {driver2.location || 'Not available'}</div>
                                                                </div>
                                                            }
                                                            trigger="click"
                                                        >
                                                            <Button icon={<EyeOutlined />} type="default" size="small" style={{ marginBottom: '24px' }}>

                                                            </Button>
                                                        </Popover>
                                                    )}
                                                </div>

                                                {/* View */}
                                                {/* <td>
                                                    <Tooltip placement="top" title={driver2.Contact + '\n' + driver2.LicenseDate} >
                                                        <EyeOutlined />
                                                    </Tooltip>
                                                </td> */}

                                                {/* Name */}
                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Form.Item style={{ width: '100%' }} label="Conductor">
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            onChange={(value, option) => {
                                                                if (conductor.label !== undefined) {
                                                                    let _driverList = driverList;
                                                                    // Enable Last selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === conductor.label) {
                                                                            _driverList[i].disabled = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    // Disable Currently Selected Option:
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }

                                                                    setDriverList([..._driverList]);
                                                                }
                                                                else {
                                                                    let _driverList = driverList;
                                                                    for (let i = 0; i < _driverList.length; i++) {
                                                                        if (_driverList[i].label === value) {
                                                                            _driverList[i].disabled = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                    setDriverList([..._driverList]);

                                                                }
                                                                setConductor(option);
                                                                setConductorValue(value);
                                                            }}
                                                            // onSearch={onSearch}
                                                            value={conductorValue}
                                                            filterOption={filterOption}
                                                            options={driverList}
                                                            dropdownRender={(menu) => (
                                                                <>
                                                                    {menu}
                                                                    <Divider
                                                                        style={{
                                                                            margin: '8px 0',
                                                                        }}
                                                                    />
                                                                    <Space
                                                                        style={{
                                                                            padding: '0 8px 4px',
                                                                        }}
                                                                    >
                                                                        <Button onClick={() => setIsDriverModalOpen(true)}>Add New</Button>
                                                                    </Space>
                                                                </>
                                                            )}
                                                        />
                                                    </Form.Item>
                                                    {conductor && (
                                                        <Popover
                                                            placement="right"
                                                            title={conductor.label || 'Driver Details'}
                                                            content={
                                                                <div style={{ minWidth: 180 }}>
                                                                    <div><b>Contact:</b> {conductor.Contact || 'Not available'}</div>
                                                                    <div><b>Licence Date:</b>  {
                                                                        conductor.LicenseDate
                                                                            ? (() => {
                                                                                const [year, month, day] = conductor.LicenseDate.split('-');
                                                                                return `${day}/${month}/${year}`;
                                                                            })()
                                                                            : 'Not available'
                                                                    }</div>
                                                                    <div><b>Location:</b> {conductor.location || 'Not available'}</div>
                                                                </div>
                                                            }
                                                            trigger="click"
                                                        >
                                                            <Button icon={<EyeOutlined />} type="default" size="small" style={{ marginBottom: '24px' }}>

                                                            </Button>
                                                        </Popover>
                                                    )}
                                                </div>

                                                {/* View */}
                                                {/* <td>
                                                    <Tooltip placement="top" title={conductor.Contact + '\n' + conductor.LicenseDate} >
                                                        <EyeOutlined />
                                                    </Tooltip>
                                                </td> */}

                                            </Flex>

                                            {/* KM */}
                                            <Flex style={{
                                                width: '100%',
                                                height: 20,
                                            }} justify='space-between' align={'center'}>
                                                <Form.Item style={{ width: '48%' }} label="Jana KM">
                                                    <Input value={janaKm || 0} onChange={(e) => {console.log(e.target.value, driver1); setJanaKm(e.target.value) }} placeholder='Jana KM' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>

                                                <Form.Item style={{ width: '48%' }} label="Aana KM">
                                                    <Input value={aanaKm || 0} onChange={(e) => { setAanaKm(e.target.value) }} placeholder='Aana KM' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>

                                            </Flex>

                                            <Flex style={{
                                                width: '100%',
                                                height: 20,
                                            }} justify='space-between' align={'center'}>
                                                <Form.Item style={{ width: '48%' }} label="Trip KM">
                                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))} onChange={(e) => { setTripKm(e.target.value) }} placeholder='Trip KM' type='number'></Input> */}
                                                    <Input value={Math.abs(parseInt(janaKm || 0) - parseInt(aanaKm || 0))}></Input>
                                                </Form.Item>

                                                <Form.Item style={{ width: '48%' }} label="Diesel">
                                                    <Input value={dieselQty || 0} onChange={(e) => setDieselQty(e.target.value)} placeholder='Diesel' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>

                                            </Flex>

                                            {/* Diesel */}
                                            <Flex style={{
                                                width: '100%',
                                                height: 20,
                                            }} justify='space-between' align={'center'}>
                                                
                                                <Form.Item style={{ width: '48%' }} label="Diesel Amount">
                                                    <Input value={milometer || 0} onChange={(e) => { setMilometer(e.target.value) }} placeholder='Milometer'></Input>
                                                </Form.Item>

                                                

                                                <Form.Item style={{ width: '48%' }} label="Average">
                                                    <Input value={(Math.abs(parseInt(janaKm ||0) - parseInt(aanaKm || 0)) / ((parseFloat(dieselQty) || 1) + (parseFloat(midwayDiesel) || 0))).toFixed(2) || 0}></Input>
                                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))/((parseInt(dieselQty)||0) + (parseInt(midwayDiesel)||0))} onChange={(e) => { setAverage(e.target.value) }} placeholder='Average' type='number'></Input> */}
                                                </Form.Item>
                                            </Flex>

                                            <Flex style={{
                                                width: '100%',
                                                height: 20,
                                            }} justify='space-between' align={'center'}>
                                                <Form.Item style={{ width: '48%' }} label="Pump Name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Pump Name"
                                                        optionFilterProp="children"
                                                        onChange={(e) => { setPumpName(e) }}
                                                        value={pumpName}
                                                        // onSearch={onSearch}
                                                        filterOption={filterOption}
                                                        options={pumpList}
                                                        dropdownRender={(menu) => (
                                                            <>
                                                                {menu}
                                                                <Divider
                                                                    style={{
                                                                        margin: '8px 0',
                                                                    }}
                                                                />
                                                                <Space
                                                                    style={{
                                                                        padding: '0 8px 4px',
                                                                    }}
                                                                >
                                                                    <Input
                                                                        placeholder="Please enter item"
                                                                        value={newPumpName}
                                                                        onChange={(e) => setNewPumpName(e.target.value)}
                                                                        onKeyDown={(e) => e.stopPropagation()}
                                                                    />
                                                                    <Button type="text" icon={<PlusOutlined />} onClick={(e) => {

                                                                        addNewPump(e, newPumpName);setNewPumpName('');
                                                                    }}>

                                                                    </Button>
                                                                </Space>
                                                            </>
                                                        )}
                                                    />
                                                </Form.Item>

                                                <Form.Item style={{ width: '48%' }} label="Midway Diesel">
                                                    <Input value={midwayDiesel || 0} onChange={(e) => setMidwayDiesel(e.target.value)} placeholder='Midway Diesel' type='number'></Input>
                                                </Form.Item>
                                            </Flex>
                                        </Flex>

                                    </Form>
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card style={{ marginBottom: '10px', width: '100%' }} size="small">
                                <div>
                                    <Form name='Kaata Parchi Details'
                                        style={{
                                            width: '100%'
                                        }}
                                        initialValues={{
                                            remember: true,
                                            kaataParchi: [{}]
                                        }}
                                        // onFinish={onFinish}
                                        // onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        form={form2}
                                    >
                                        <Flex gap="middle" vertical style={{ width: '100%' }}>


                                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                                            <Form.List name="kaataParchi" >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            // <Flex key={key} style={{ width: '100%' }} align={'center'}>


                                                            <div
                                                                key={key}
                                                            >
                                                                <Flex gap="middle" vertical>

                                                                    <Flex style={{
                                                                        width: '100%',
                                                                        height: 40,
                                                                        marginTop: '20px'
                                                                    }} align={'center'} >

                                                                        <Form.Item style={{ width: '100%' }} name={[name, "remarks"]} label="Kaata Parchi Remarks">
                                                                            {/* <Input placeholder='remarks' ></Input> */}
                                                                            <TextArea rows={2} placeholder='remarks' />
                                                                        </Form.Item>



                                                                    </Flex>
                                                                    <Flex style={{
                                                                        width: '100%',
                                                                        height: 30,
                                                                    }} justify={'space-between'} align={'center'} >
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                                                            <Form.Item style={{ width: '100%' }} name={[name, "kaataParchiAmount"]} label="Amount">

                                                                                <Input placeholder='amount' ></Input>


                                                                            </Form.Item>
                                                                            <Button style={{ width: '55%', marginTop: '-25px' }} onClick={() => setToggleKaataParchi(!toggleKaataParchi)}>{!toggleKaataParchi ? 'CLICK FOR MORE' : 'CLICK FOR LESS'}</Button>
                                                                        </div>
                                                                    </Flex>


                                                                    {toggleKaataParchi &&
                                                                        <>
                                                                            <Flex style={{
                                                                                width: '100%',
                                                                                height: 20,
                                                                            }} justify={'space-around'} align={'center'} >
                                                                                <Form.Item style={{ width: '45%' }} name={[name, 'unloadingDate']} label="Unloading Date">
                                                                                    <Input placeholder='Unloading Date' type='date'></Input>
                                                                                </Form.Item>

                                                                                <Form.Item style={{ width: '45%' }} name={[name, 'khaliGadiWajan']} label="Khaali Gadi wajan">
                                                                                    <Input placeholder='Weight' type='number' onWheel={e => e.target.blur()}></Input>
                                                                                </Form.Item>
                                                                            </Flex>

                                                                            <Flex style={{
                                                                                width: '100%',
                                                                                height: 20,
                                                                            }} justify={'space-around'} align={'center'} >

                                                                                <Form.Item style={{ width: '45%' }} name={[name, 'bhariGadiWajan']} label="Bhari Gaadi Wajan">
                                                                                    <Input placeholder='Weight' type='number' onWheel={e => e.target.blur()}></Input>
                                                                                </Form.Item>
                                                                                <Form.Item style={{ width: '45%' }} name={[name, "maalKaWajan"]} label="Maal Ka Wajan">
                                                                                    <Input placeholder='weight' type='number' onWheel={e => e.target.blur()}></Input>
                                                                                </Form.Item>
                                                                            </Flex>



                                                                            <Flex style={{
                                                                                width: '100%',
                                                                                height: 20,
                                                                            }} justify={'space-around'} align={'center'}>

                                                                                <Form.Item style={{ width: '45%' }} name={[name, "ghaateAllowed"]} label="Ghaate Allowed">
                                                                                    <Input placeholder='input' ></Input>
                                                                                </Form.Item>

                                                                                <Form.Item style={{ width: '45%' }} name={[name, "ghaateActual"]} label="Ghaate Actual">
                                                                                    <Input placeholder='input' ></Input>
                                                                                </Form.Item>



                                                                            </Flex>
                                                                        </>
                                                                    }



                                                                </Flex>



                                                            </div>

                                                        ))}

                                                    </>
                                                )}
                                            </Form.List>
                                        </Flex>

                                    </Form>
                                </div>
                            </Card>

                            <Card >
                                <div>

                                    <Form name='Trip se kya mila'
                                        style={{
                                            maxWidth: 1500,
                                        }}
                                        initialValues={{
                                            remember: true,
                                            paymentDetails: [{}]
                                        }}
                                        autoComplete="off"
                                        form={form3}
                                    >

                                        <Form.Item label="Bhada kaun dalega" name={[0, 'bhadaKaunDalega']}>

                                            <Select
                                                showSearch
                                                placeholder="Bhada Kaun Dalega"
                                                optionFilterProp="children"
                                                onChange={(value) => setBhadaKaunDalega(value)}
                                                // onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={[
                                                    ...partyList[0].filter(opt => opt && opt.value !== undefined && opt.label !== undefined),
                                                    // {label: form.getFieldsValue(['tripDetails'])?.tripDetails[name]?.bhejneWaala, value: form.getFieldsValue(['tripDetails']).tripDetails[name]?.bhejneWaala},
                                                    // { label: form.getFieldsValue(['tripDetails'])?.tripDetails[name]?.paaneWaala, value: form.getFieldsValue(['tripDetails']).tripDetails[name]?.paaneWaala},
                                                    // {label: form.getFieldValue(['tripDetails'])?.tripDetails[name]?.transporter, value: form.getFieldValue(['tripDetails']).tripDetails[name]?.transporter},
                                                    { label: 'UV Logistics Ledger', value: 'UvLogs' },
                                                    { label: 'Naveen Kaka Ledger', value: 'NaveenKaka' }
                                                ]}
                                            />
                                        </Form.Item>

                                        {(bhadaKaunDalega === 'HareKrishna' || bhadaKaunDalega === 'HareKrishna' || bhadaKaunDalega === 'NaveenKaka' || bhadaKaunDalega === transporterSelected) &&
                                            <Form.Item label="Select Party" name={[0, 'partyForTransporterPayment']}>
                                                <Select
                                                    showSearch
                                                    placeholder="Bhada Kaun Dalega"
                                                    optionFilterProp="children"
                                                    onChange={(value) => setPartyForTransporterPayment(value)}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={[
                                                        ...partyList[0]
                                                    ]}
                                                />
                                            </Form.Item>
                                        }

                                        <Flex gap="middle" align="start" vertical>
                                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                                            <Form.List name="paymentDetails" >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>


                                                                <div
                                                                    key={key}
                                                                    style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }}
                                                                >
                                                                    {/* Pohch Id if pohch amount is not null */}
                                                                    {(pohchAmount !== '' && pohchAmount !== null && pohchAmount !== undefined) ?
                                                                        <div style={{ marginBottom: '10px', backgroundColor: 'lightgrey', padding: '5px', borderRadius: '5px' }}>
                                                                            <h5>Pohch Id: {PohchId}</h5>
                                                                        </div>
                                                                        : null
                                                                    }

                                                                    <table style={{ width: '100%' }}>
                                                                        <thead>
                                                                            <tr style={{ border: '1px solid black' }}>
                                                                                <th style={{ border: '1px solid grey', borderRadius: '5px' }}>Type</th>
                                                                                <th style={{ border: '1px solid grey', borderRadius: '5px' }}>Amount</th>
                                                                                <th style={{ border: '1px solid grey', borderRadius: '5px' }}>Bank/Received Date</th>
                                                                                <th style={{ border: '1px solid grey', borderRadius: '5px', minWidth: '100px' }}>Name</th>
                                                                                <th style={{ border: '1px solid grey', borderRadius: '5px' }}>Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>


                                                                            <tr >
                                                                                <td ><h3>Pohch</h3></td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'pohchAmount']} >
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()} onChange={(e) => { setPohchAmount(e.target.value) }} />
                                                                                    </Form.Item>
                                                                                </td >
                                                                                <td >
                                                                                    <Form.Item name={[name, 'pohchDate']}>
                                                                                        <Input placeholder='date' type='date' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'pohchSendTo']} >

                                                                                        <Select
                                                                                            showSearch
                                                                                            placeholder="Pohch Send To"
                                                                                            optionFilterProp="children"
                                                                                            // onChange={onChange}
                                                                                            // onSearch={onSearch}
                                                                                            filterOption={filterOption}
                                                                                            options={[
                                                                                                ...partyList[name],
                                                                                                { label: 'UV Logistics', value: 'UvLogs' },
                                                                                                { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                                                                            ]}
                                                                                        />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'pohchRemarks']}>
                                                                                        <Input placeholder='remarks' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style={{ border: '1px solid black' }}>
                                                                                <td ><h3>Cash</h3></td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'cashAmount']}>
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()} />
                                                                                    </Form.Item>
                                                                                </td >
                                                                                <td >
                                                                                    <Form.Item name={[name, 'cashDate']}>
                                                                                        <Input placeholder='date' type='date' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >

                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'cashRemarks']}>
                                                                                        <Input placeholder='remarks' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style={{ border: '1px solid black' }}>
                                                                                <td ><h3>Online</h3></td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'onlineAmount']}>
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()} />
                                                                                    </Form.Item>
                                                                                </td >
                                                                                <td >
                                                                                    <Form.Item name={[name, 'onlineDate']}>
                                                                                        <Input placeholder='date' type='date' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'onlineBank']}>
                                                                                        <Select
                                                                                            showSearch
                                                                                            placeholder="Bank"
                                                                                            optionFilterProp="children"
                                                                                            // onChange={onChange}
                                                                                            // onSearch={onSearch}
                                                                                            filterOption={filterOption}
                                                                                            options={[...bankData]}
                                                                                            dropdownRender={(menu) => (
                                                                                                <>
                                                                                                    {menu}
                                                                                                    <Divider
                                                                                                        style={{
                                                                                                            margin: '8px 0',
                                                                                                        }}
                                                                                                    />
                                                                                                    <Space
                                                                                                        style={{
                                                                                                            padding: '0 8px 4px',
                                                                                                        }}
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Please enter item"
                                                                                                            value={newBank}
                                                                                                            onChange={(e) => setNewBank(e.target.value)}
                                                                                                            onKeyDown={(e) => e.stopPropagation()}
                                                                                                        />
                                                                                                        <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewBank(e)}>

                                                                                                        </Button>
                                                                                                    </Space>
                                                                                                </>
                                                                                            )}
                                                                                        />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'onlineRemarks']}>
                                                                                        <Input placeholder='remarks' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style={{ border: '1px solid black' }}>
                                                                                <td ><h3>Cheque</h3></td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'chequeAmount']}>
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()} />
                                                                                    </Form.Item>
                                                                                </td >
                                                                                <td >
                                                                                    <Form.Item name={[name, 'chequeDate']}>
                                                                                        <Input placeholder='date' type='date' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'chequeBank']}>
                                                                                        <Select
                                                                                            showSearch
                                                                                            placeholder="Bank"
                                                                                            optionFilterProp="children"
                                                                                            // onChange={onChange}
                                                                                            // onSearch={onSearch}
                                                                                            filterOption={filterOption}
                                                                                            options={[...bankData]}
                                                                                            dropdownRender={(menu) => (
                                                                                                <>
                                                                                                    {menu}
                                                                                                    <Divider
                                                                                                        style={{
                                                                                                            margin: '8px 0',
                                                                                                        }}
                                                                                                    />
                                                                                                    <Space
                                                                                                        style={{
                                                                                                            padding: '0 8px 4px',
                                                                                                        }}
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Please enter item"
                                                                                                            value={newBank}
                                                                                                            onChange={(e) => setNewBank(e.target.value)}
                                                                                                            onKeyDown={(e) => e.stopPropagation()}
                                                                                                        />
                                                                                                        <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewBank(e)}>

                                                                                                        </Button>
                                                                                                    </Space>
                                                                                                </>
                                                                                            )}
                                                                                        />
                                                                                    </Form.Item>
                                                                                </td>
                                                                                <td >
                                                                                    <Form.Item name={[name, 'chequeRemarks']}>
                                                                                        <Input placeholder='remarks' />
                                                                                    </Form.Item>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>


                                                                    <Form.Item name={[name, 'chequeNumber']} label="Cheque Number" style={{ marginTop: '10px' }}>
                                                                        <Input placeholder='Cheque Number' />
                                                                    </Form.Item>
                                                                </div>


                                                            </Flex>
                                                        ))}



                                                    </>
                                                )}
                                            </Form.List>
                                        </Flex>

                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>



                    <Button type="primary" onClick={handleSave} style={{ width: '95vw' }} >Save</Button>
                </div>
            </div>
        </>
    )
}

export default AddDetails;
