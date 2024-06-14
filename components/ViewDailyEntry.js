import React, {useState, useEffect} from "react";
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined, EditFilled, CloseCircleFilled} from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';

const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const ViewDailyEntry = ({data, Locations, transporterList, partyListAll, driverList, vehicleData, MaalList, bankData}) => {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [toggle, setToggle] = React.useState(false);
    const [vehicleNo, setVehicleNo] = useState('');
    const [date, setDate] = useState(null);
    const [mt, setMT] = useState(false);
    const [vehicleStatus, setVehicleStatus] = useState('');
    const [payStatus, setPayStatus] = useState('Paid');
    const [janaKm, setJanaKm] = useState(0);
    const [aanaKm, setAanaKm] = useState(0);
    const [tripKm, setTripKm] = useState('');
    const [milometer, setMilometer] = useState('');
    const [dieselQty, setDieselQty] = useState('');
    const [pumpName, setPumpName] = useState('');
    const [average, setAverage] = useState('');
    const [midwayDiesel, setMidwayDiesel] = useState('');
    // const [rate, setRate] = useState([0, 0, 0, 0]);
    // const [qty, setQty] = useState([0, 0, 0, 0]);
    // To Track number of trips
    const [tripCount, setTripCount] = useState(0);
    // to display dynamic Bhada Kaun Dalega list
    const [rate, setRate] = useState([0, 0, 0, 0]);
    const [qty, setQty] = useState([0, 0, 0, 0]);
    const [partyList, setPartyList] = useState([[], [], [], [], [], []]);
    const [newDriverName, setNewDriverName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [newMaal, setNewMaal] = useState('');
    const [newParty, setNewParty] = useState('');
    const [newTransporter, setNewTransporter] = useState('');
    // Drivers List
    const [_driverList, set_DriverList] = useState([]);
    // FLAG 
    const [flag, setFlag] = useState(false);
    // tripDetails Edit Flag
    const [tripDetailsEditFlag, setTripDetailsEditFlag] = useState(false);
    // DriverDetails Edit Flag
    const [driverDetailsEditFlag, setDriverDetailsEditFlag] = useState(false);
    // KaataParchi Edit Flag
    const [kaataParchiEditFlag, setKaataParchiEditFlag] = useState(false);
    // PaymentDetails Edit Flag
    const [paymentDetailsEditFlag, setPaymentDetailsEditFlag] = useState(false);

    const [driver1, setDriver1] = useState({});
    const [driver2, setDriver2] = useState({});
    const [conductor, setConductor] = useState({});

    useEffect(()=>{
        console.log(data, Locations, transporterList, partyListAll, driverList)


        // setFieldsValue of tripDetails:
        let tripDetails = form.getFieldsValue(['tripDetails']);
        tripDetails.tripDetails = data.tripDetails;
        form.setFieldsValue(tripDetails);
        console.log(tripDetails);
          // Make Part List to display in BhadaKaunDalega
          let pl = partyList;
        for(let i =0; i< tripDetails.tripDetails.length; i++){
            let item = tripDetails.tripDetails[i];
            pl[i] = [
                {label: item.bhejneWaala, value: item.bhejneWaala},
                {label: item.paaneWaala, value: item.paaneWaala},
                {label: item.transporter, value: item.transporter}
            ];
            
        }
        setPartyList(pl);
        console.log(pl);

        // Driver details 
        setDriver1(data.driver1);
        setDriver2(data.driver2);
        setConductor(data.conductor);
        let dl = driverList;
        for(let i = 0; i < dl.length; i++){
            if(dl.disabled === true){
                dl.disabled = false;
            }
        }
        set_DriverList(dl);

        // setFieldsValue of kaataParchi:
        let kaataParchi = form2.getFieldsValue(['kaataParchi']);
        kaataParchi.kaataParchi = data.kaataParchi;
        form2.setFieldsValue(kaataParchi);

        // setFieldsValue of paymentDetails:
        let paymentDetails = form3.getFieldsValue(['paymentDetails']);
        paymentDetails.paymentDetails = data.firstPayment;
        form3.setFieldsValue(paymentDetails);

        // setRate and setQty
        let r = [];
        let q = [];
        for(let i = 0; i < data.tripDetails.length; i++){
            r.push(data.tripDetails[i].rate);
            q.push(data.tripDetails[i].qty);
        }   
        setRate([...r]);
        setQty([...q]);

        // set Driver KM Details
        setJanaKm(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.janaKm));
        setAanaKm(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.aanaKm));
        // setTripKm(parseInt(data.dieselAndKmDetails.tripKm));
        setMilometer(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.milometer));
        setDieselQty(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.dieselQty));
        setPumpName(data.dieselAndKmDetails.pumpName);
        setAverage(data.dieselAndKmDetails.average);
        setMidwayDiesel(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.midwayDiesel));

        // setVehicleNo
        setVehicleNo(data.vehicleNo);  
        setDate(data.date)

    }, [])
    
    const onMTCheck = (e) => {
        setMT(e.target.checked);
    }

    const handleSave = () => {
        const tripDetails = form.getFieldsValue(['tripDetails']);
        let listOfTrips = [];
        tripDetails?.tripDetails?.forEach((trip) => {
            listOfTrips.push({
                from: trip.from || '',
                to: trip.to || '',
                bhejneWaala: trip.bhejneWaala || '',
                paaneWaala: trip.paaneWaala || '',
                transporter: trip.transporter || '',
                maal: trip.maal || '',
                qty: trip.qty || 0,
                rate: trip.rate || 0,
                totalFreight: parseInt(trip.rate) * parseInt(trip.qty) || 0,
                payStatus: trip.payStatus || '',
            });
        }
        );

        // const driversDetails = form1.getFieldsValue(['DriversDetails']);
        // let listOfDrivers = [];
        // driversDetails?.DriversDetails?.forEach((driver) => {
        //     listOfDrivers.push({
        //         driverName: driver.driverName || '',
        //         driverContact: driver.driverContact || '',
        //         driverLicenseDate: driver.driverLicenseDate || '',
        //         driverTripCash: driver.driverTripCash || ''
        //     });
        // }
        // );

        const kaataParchi = form2.getFieldsValue(['kaataParchi']);
        let listOfKaataParchi = [];
        kaataParchi?.kaataParchi?.forEach((parchi) => {
            listOfKaataParchi.push({
                unloadingDate: parchi.unloadingDate || '',
                khaliGadiWajan: parchi.khaliGadiWajan || '',
                bhariGadiWajan: parchi.bhariGadiWajan || '',
                maalKaWajan: parchi.maalKaWajan || '',
                ghaateAllowed: parchi.ghaateAllowed || '',
                ghaateActual: parchi.ghaateActual || '',
                remarks: parchi.remarks || ''
            });
        }
        );

        const firstPayment = form3.getFieldsValue(['paymentDetails']);
        let listOfFirstPayment = [];
        firstPayment?.paymentDetails?.forEach((payment) => {
            listOfFirstPayment.push({
                bhadaKaunDalega: payment.bhadaKaunDalega || '',
                partyForNaveenKaka: payment.partyForNaveenKaka || '',
                pohchAmount: payment.pohchAmount || '',
                pohchDate: payment.pohchDate || '',

                pohchRemarks: payment.pohchRemarks || '',
                cashAmount: payment.cashAmount || '',
                cashDate: payment.cashDate || '',

                cashRemarks: payment.cashRemarks || '',
                onlineAmount: payment.onlineAmount || '',
                onlineDate: payment.onlineDate || '',
                onlineBank: payment.onlineBank || '',
                onlineRemarks: payment.onlineRemarks || '',
                chequeAmount: payment.chequeAmount || '',
                chequeDate: payment.chequeDate || '',
                chequeBank: payment.chequeBank || '',
                chequeRemarks: payment.chequeRemarks || '',
            });
        }
        );

        let dieselAndKmDetails = {
            janaKm: janaKm || 0,
            aanaKm: aanaKm || 0,
            tripKm: Math.abs(janaKm - aanaKm) || '',
            milometer: milometer || '',
            dieselQty: dieselQty || '',
            pumpName: pumpName || '',
            average: (Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || '',
            midwayDiesel: midwayDiesel || ''
        }

        console.log(listOfTrips, listOfKaataParchi, listOfFirstPayment);

        const db = getDatabase();
        // let id = guidGenerator();
        set(ref(db, 'dailyEntry/' + data.key), {
            date: date,
            vehicleNo: vehicleNo || '',
            mt: mt,
            vehicleStatus: vehicleStatus || '',
            // payStatus: payStatus || '',
            dieselAndKmDetails: { ...dieselAndKmDetails },
            tripDetails: listOfTrips,
            // driversDetails: listOfDrivers,
            kaataParchi: listOfKaataParchi,
            firstPayment: listOfFirstPayment,

            driver1: driver1,
            driver2: driver2,
            conductor: conductor
        }).then(() => {
            console.log('Data saved');
            alert('Data Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });

        console.log('Save button clicked');
    }

    
    const addPartyInPartyList = (value, index) => {
        let pl = partyList;
        let exist = false;
        for(let i = 0; i < pl; i++){
            if(pl[i].value === value){
                exist = true;
                break;
            }
        }
        if(!exist){
            pl[index].push({
                label: value,
                value: value
            });
            setPartyList([...pl]);
        }
    }
    
    const items = [
        {
            key: '1',
            label: 'Trip Details',
            extra: (
                <>  
                    {tripDetailsEditFlag ? 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setTripDetailsEditFlag(!tripDetailsEditFlag)}}><CloseCircleFilled /></Button> 
                        : 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setTripDetailsEditFlag(!tripDetailsEditFlag)}}><EditFilled /></Button>
                    }
                </>
            )
            ,
            children: <>
                <div>
                    <Form
                        name="Trip Details"
                        style={{
                            // maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        form={form}
                        disabled={!tripDetailsEditFlag}
                    >

                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} label="Date" 
                                    // className={!tripDetailsEditFlag ? '' : styles.disabled}
                                    name="Date">
                                   <Input type="date" value={data.date} onChange={(e) => setDate(e.target.value)}></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '30%' }} label="Vehicle No." 
                                    // className={!tripDetailsEditFlag ? '' : styles.disabled}
                                    name="vehicleNo">
                                    <Select
                                        showSearch
                                        placeholder="Vehicle No."
                                        optionFilterProp="children"
                                        onChange={(value) => setVehicleNo(value)}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={vehicleData}
                                        // disabled
                                        defaultValue={data.vehicleNo}
                                        
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '30%' }}
                                    label="Status"
                                    name="status"
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        onChange={(value)=>setVehicleStatus(value)}
                                        // value={vehicleStatus}
                                        // onSearch={onSearch}
                                        // filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'standing',
                                                label: 'Standing',
                                            },
                                            {
                                                value: 'inProcess',
                                                label: 'In Process',
                                            },
                                            {
                                                value: 'running',
                                                label: 'Running',
                                            },
                                        ]}
                                        defaultValue={data.vehicleStatus}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    // label="MT"
                                    name="mt"
                                >
                                    <Checkbox onChange={onMTCheck} defaultChecked={data.mt}>MT</Checkbox>
                                </Form.Item>

                            </Flex>

                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="tripDetails" >
                                {(fields, { add, remove }) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            rowGap: 16,
                                            flexDirection: 'column',
                                            width: "-webkit-fill-available",
                                        }}
                                    >
                                        {fields.map(({ key, name, ...restField }) => (

                                            <Card size="small"
                                                title={`Trip ${name + 1}`}
                                                key={key}
                                                extra={
                                                    <CloseOutlined
                                                        onClick={() => {
                                                            remove(name);
                                                            setTripCount(tripCount - 1);
                                                        }}
                                                    />}>
                                                {/* <h3 style={{ padding: '10px' }}>UNIT {name + 1} {console.log(fields)}</h3> */}
                                                <div
                                                    key={key}
                                                >
                                                    <Flex gap="middle" align="start" vertical>

                                                        <Flex style={{ width: "100%", height: 30, marginTop: '10px' }} justify={'space-around'} align='center'>
                                                            <Form.Item style={{ width: '20%' }} label="From"
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
                                                                                    e.preventDefault();
                                                                                    setLocations([...Locations, { value: newLocation, label: newLocation }]);
                                                                                    setNewLocation('');
                                                                                }}>

                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                />
                                                            </Form.Item>

                                                            <Form.Item style={{ width: '20%' }} label="Bhejne waale"
                                                                name={[name, 'bhejneWaala']}>
                                                                <Select
                                                                    showSearch
                                                                    placeholder="Bhejne waale"
                                                                    optionFilterProp="children"
                                                                    onChange={(value) => addPartyInPartyList(value, name)}
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
                                                                                <Input
                                                                                    placeholder="Please enter item"
                                                                                    value={newParty}
                                                                                    onChange={(e) => setNewParty(e.target.value)}
                                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                                />
                                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewParty(e)}>

                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                />
                                                            </Form.Item>

                                                            <div className='tooltip'>
                                                                <Tooltip placement="top" title={'Malharganj new bus stand 8812329201'}>
                                                                    <EyeOutlined />
                                                                </Tooltip>
                                                            </div>


                                                            <Form.Item style={{ width: '20%' }}
                                                                label="To"
                                                                name={[name, 'to']}
                                                            >
                                                                <Select
                                                                    showSearch
                                                                    placeholder="To/Unloading Point"
                                                                    optionFilterProp="children"
                                                                    // onChange={onChange}
                                                                    // onSearch={onSearch}
                                                                    // filterOption={filterOption}
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
                                                                                    e.preventDefault();
                                                                                    setLocations([...Locations, { value: newLocation, label: newLocation }]);
                                                                                    setNewLocation('');
                                                                                }}>

                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                />
                                                            </Form.Item>

                                                            <Form.Item style={{ width: '20%' }} label="Paane Waala"
                                                                name={[name, 'paaneWaala']}>
                                                                <Select
                                                                    showSearch
                                                                    placeholder="Paane waala"
                                                                    optionFilterProp="children"
                                                                    onChange={(value) => addPartyInPartyList(value, name)}
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
                                                                                <Input
                                                                                    placeholder="Please enter item"
                                                                                    value={newParty}
                                                                                    onChange={(e) => setNewParty(e.target.value)}
                                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                                />
                                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewParty(e)}>

                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                />
                                                            </Form.Item>

                                                            <div className='tooltip'>
                                                                <Tooltip placement="top" title={'Malharganj new bus stand 8812329201'}>
                                                                    <EyeOutlined />
                                                                </Tooltip>
                                                            </div>
                                                        </Flex>
                                                        <Flex style={{ width: "100%", height: 30 }} justify={'space-around'} align='center'>
                                                            <Form.Item style={{ width: '15%' }} label="Maal"
                                                                name={[name, 'maal']}>
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
                                                                                    e.preventDefault();
                                                                                    setMaalList([...MaalList, { value: newMaal, label: newMaal }]);
                                                                                    setNewMaal('');
                                                                                }}>

                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                />
                                                            </Form.Item>

                                                            <Form.Item style={{ width: '15%' }}
                                                                label="Qty"
                                                                name={[name, 'qty']}
                                                            >
                                                                <Input type='number'
                                                                    value={qty}
                                                                    onChange={(e) => { let q = qty; q[name] = e.target.value; setQty([...q]) }}>

                                                                </Input>
                                                            </Form.Item>

                                                            <Form.Item style={{ width: '15%' }}
                                                                label="Rate"
                                                                name={[name, 'rate']}
                                                            >
                                                                <Input type='number'
                                                                    value={rate}
                                                                    onChange={(e) => { let r = rate; r[name] = e.target.value; setRate([...r]) }}
                                                                ></Input>
                                                            </Form.Item>
                                                            {/* {console.log((form.getFieldValue(['tripDetails', name, 'rate']) || 0) * (form.getFieldValue(['tripDetails', name, 'qty']) || 0))} */}
                                                            <Form.Item style={{ width: '15%' }}
                                                                label="Total Freight"
                                                            // name={[name, 'totalFreight']}
                                                            >

                                                                {parseInt(rate[name]) * parseInt(qty[name])}
                                                                {/* <Input value={rate[name]*qty[name]}></Input> */}
                                                            </Form.Item>

                                                            <Form.Item style={{ width: '20%' }}
                                                                label="Transporter"
                                                                name={[name, 'transporter']}
                                                            >
                                                                <Select
                                                                    showSearch
                                                                    placeholder="Transporter Name"
                                                                    optionFilterProp="children"
                                                                    onChange={(value) => addPartyInPartyList(value, name)}
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

                                                            <div className='tooltip'>
                                                                <Tooltip placement="top" title={'Malharganj new bus stand 8812329201'}>
                                                                    <EyeOutlined />
                                                                </Tooltip>
                                                            </div>
                                                            {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}

                                                        </Flex>

                                                        <Form.Item style={{ margin: 'auto' }}
                                                            label="To Pay/ Paid"
                                                            name={[name, 'payStatus']}
                                                        >
                                                            <Radio.Group
                                                                options={[{ label: 'To Pay', value: 'To Pay' }, { label: 'Paid', value: 'Paid' }]}
                                                                // onChange={(e) => { setPayStatus(e.target.value) }}
                                                                value={'Paid'}
                                                                optionType="button"
                                                                buttonStyle="solid"
                                                            />
                                                        </Form.Item>
                                                    </Flex>



                                                </div>
                                            </Card>


                                        ))}
                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button type="dashed"
                                                onClick={
                                                    () => {
                                                        add();
                                                        setTripCount(tripCount + 1);
                                                        document.getElementById('FPDAdd').click();
                                                    }}
                                                block icon={<PlusOutlined />}>
                                                Add new
                                            </Button>
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.List>


                            {/* </Flex> */}

                            <Flex style={{
                                width: '100%',
                                height: 60,
                                // border: '1px solid #40a9ff',
                            }} justify={'space-around'} align={'center'}>


                            </Flex>
                        </Flex>
                        <Button type="primary" onClick={handleSave}>Save</Button>

                    </Form>
                </div>
            </>,
        },
        {
            key: '3',
            label: 'Driver | Diesel | Km | Milometer | Avg Details',
            extra: (
                <>  
                    {driverDetailsEditFlag ? 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setDriverDetailsEditFlag(!driverDetailsEditFlag)}}><CloseCircleFilled /></Button> 
                        : 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setDriverDetailsEditFlag(!driverDetailsEditFlag)}}><EditFilled /></Button>
                    }
                </>
            ),
            children: <>
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
                        disabled={!driverDetailsEditFlag}
                    >
                        <Flex gap="middle" align="start" vertical>


                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <table style={{ border: '1px solid black', width: '100%' }}>
                                    <tbody>
                                        <tr style={{ border: '1px solid black' }}>
                                            <th>*</th>
                                            <th style={{ width: '20%' }}>Name</th>
                                            <th>Contact</th>
                                            <th>License Date</th>
                                            <th>Cash</th>
                                            <th>View</th>
                                        </tr>
                                        <tr style={{ border: '1px solid black' }}>
                                            <th>Driver 1</th>
                                            {/* Name */}
                                            <td >
                                                <Select
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    placeholder="Driver"
                                                    optionFilterProp="children"
                                                    value={driver1.value}
                                                    onChange={(value, option) => {
                                                        if (driver1.label !== undefined) {
                                                            let __driverList = _driverList;
                                                            // Enable Last selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === driver1.label) {
                                                                    __driverList[i].disabled = false;
                                                                    break;
                                                                }
                                                            }
                                                            // Disable Currently Selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }

                                                            set_DriverList([...__driverList]);
                                                        }
                                                        else {
                                                            let __driverList = _driverList;
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }
                                                            set_DriverList([...__driverList]);

                                                        }
                                                        setDriver1(option);
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={driverList}
                                                    // dropdownRender={(menu) => (
                                                    //     <>
                                                    //         {menu}
                                                    //         <Divider
                                                    //             style={{
                                                    //                 margin: '8px 0',
                                                    //             }}
                                                    //         />
                                                    //         <Space
                                                    //             style={{
                                                    //                 padding: '0 8px 4px',
                                                    //             }}
                                                    //         >
                                                    //             <Input
                                                    //                 placeholder="Please enter item"
                                                    //                 value={newDriverName}
                                                    //                 onChange={(e) => setNewDriverName(e.target.value)}
                                                    //                 onKeyDown={(e) => e.stopPropagation()}
                                                    //             />
                                                    //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

                                                    //             </Button>
                                                    //         </Space>
                                                    //     </>
                                                    // )}
                                                />
                                            </td>
                                            {/* Contact */}
                                            <td>
                                                <Input value={driver1.Contact} placeholder='contact' />
                                            </td>
                                            {/* License Date */}
                                            <td>
                                                <Input value={driver1.LicenseDate} placeholder='License Date' type='date' />
                                            </td>
                                            {/* Trip Cash */}
                                            <td>
                                                <Input value={driver1.TripCash} onChange={(e) => {
                                                    let _obj = driver1;
                                                    _obj.TripCash = e.target.value;
                                                    setDriver1(_obj);
                                                }} placeholder='Trip Cash' type='number' />
                                            </td>
                                            {/* View */}
                                            <td>
                                                <Tooltip placement="top" title={'Driver Image'} >
                                                    <Button style={{ marginBottom: '22px' }}>View</Button>
                                                </Tooltip>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Driver 2</th>
                                            {/* Name */}
                                            <td>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    placeholder="Driver"
                                                    optionFilterProp="children"
                                                    value={driver2.value}
                                                    onChange={(value, option) => {
                                                        if (driver2.label !== undefined) {
                                                            let __driverList = _driverList;
                                                            // Enable Last selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === driver2.label) {
                                                                    __driverList[i].disabled = false;
                                                                    break;
                                                                }
                                                            }
                                                            // Disable Currently Selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }

                                                            set_DriverList([...__driverList]);
                                                        }
                                                        else {
                                                            let __driverList = _driverList;
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }
                                                            set_DriverList([...__driverList]);

                                                        }
                                                        setDriver2(option);
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={driverList}
                                                    // dropdownRender={(menu) => (
                                                    //     <>
                                                    //         {menu}
                                                    //         <Divider
                                                    //             style={{
                                                    //                 margin: '8px 0',
                                                    //             }}
                                                    //         />
                                                    //         <Space
                                                    //             style={{
                                                    //                 padding: '0 8px 4px',
                                                    //             }}
                                                    //         >
                                                    //             {/* <Input
                                                    //                 placeholder="Please enter item"
                                                    //                 value={newDriverName}
                                                    //                 onChange={(e) => setNewDriverName(e.target.value)}
                                                    //                 onKeyDown={(e) => e.stopPropagation()}
                                                    //             />
                                                    //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}> */}
                                                            
                                                    //             {/* </Button> */}

                                                    //             <Button onClick={()=>setIsModalOpen(true)}>Add New</Button>
                                                    //         </Space>
                                                    //     </>
                                                    // )}
                                                />
                                            </td>
                                            {/* Contact */}
                                            <td>
                                                <Input value={driver2.Contact} placeholder='contact' />
                                            </td>
                                            {/* License Date */}
                                            <td>
                                                <Input value={driver2.LicenseDate} placeholder='License Date' type='date' />
                                            </td>
                                            {/* Trip Cash */}
                                            <td>
                                                <Input value={driver2.TripCash} onChange={(e) => {
                                                    let _obj = driver2;
                                                    _obj.TripCash = e.target.value;
                                                    setDriver2(_obj);
                                                }} placeholder='Trip Cash' type='number' />
                                            </td>
                                            {/* View */}
                                            <td>
                                                <Tooltip placement="top" title={'Driver Image'} >
                                                    <Button style={{ marginBottom: '22px' }}>View</Button>
                                                </Tooltip>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Conductor</th>
                                            {/* Name */}
                                            <td >
                                                <Select
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    placeholder="Driver"
                                                    optionFilterProp="children"
                                                    value={conductor.value}
                                                    onChange={(value, option) => {
                                                        if (conductor.label !== undefined) {
                                                            let __driverList = _driverList;
                                                            // Enable Last selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === conductor.label) {
                                                                    __driverList[i].disabled = false;
                                                                    break;
                                                                }
                                                            }
                                                            // Disable Currently Selected Option:
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }

                                                            set_DriverList([...__driverList]);
                                                        }
                                                        else {
                                                            let __driverList = _driverList;
                                                            for (let i = 0; i < __driverList.length; i++) {
                                                                if (__driverList[i].label === value) {
                                                                    __driverList[i].disabled = true;
                                                                    break;
                                                                }
                                                            }
                                                            set_DriverList([...__driverList]);

                                                        }
                                                        setConductor(option);
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
                                                    filterOption={filterOption}
                                                    options={driverList}
                                                    // dropdownRender={(menu) => (
                                                    //     <>
                                                    //         {menu}
                                                    //         <Divider
                                                    //             style={{
                                                    //                 margin: '8px 0',
                                                    //             }}
                                                    //         />
                                                    //         <Space
                                                    //             style={{
                                                    //                 padding: '0 8px 4px',
                                                    //             }}
                                                    //         >
                                                    //             <Input
                                                    //                 placeholder="Please enter item"
                                                    //                 value={newDriverName}
                                                    //                 onChange={(e) => setNewDriverName(e.target.value)}
                                                    //                 onKeyDown={(e) => e.stopPropagation()}
                                                    //             />
                                                    //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

                                                    //             </Button>
                                                    //         </Space>
                                                    //     </>
                                                    // )}
                                                />
                                            </td>
                                            {/* Contact */}
                                            <td>
                                                <Input value={conductor.Contact} placeholder='contact' />
                                            </td>
                                            {/* License Date */}
                                            <td>
                                                <Input value={conductor.LicenseDate} placeholder='License Date' type='date' />
                                            </td>
                                            {/* Trip Cash */}
                                            <td>
                                                <Input value={conductor.TripCash} onChange={(e) => {
                                                    let _obj = conductor;
                                                    _obj.TripCash = e.target.value;
                                                    setConductor(_obj);
                                                }} placeholder='Trip Cash' type='number' />
                                            </td>
                                            {/* View */}
                                            <td>
                                                <Tooltip placement="top" title={'Driver Image'} >
                                                    <Button style={{ marginBottom: '22px' }}>View</Button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* KM */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }}  label="Jana KM">
                                    <Input value={janaKm} onChange={(e) => { setJanaKm(e.target.value) }} placeholder='Jana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }}  label="Aana KM">
                                    <Input value={aanaKm} onChange={(e) => { setAanaKm(e.target.value) }} placeholder='Aana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Trip KM" label="Trip KM">
                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))} onChange={(e) => { setTripKm(e.target.value) }} placeholder='Trip KM' type='number'></Input> */}
                                    {Math.abs(parseInt(janaKm) - parseInt(aanaKm))}
                                </Form.Item>
                                <Form.Item style={{ width: '20%' }}  label="Milometer">
                                    <Input value={milometer} onChange={(e) => { setMilometer(e.target.value) }} placeholder='Milometer'></Input>
                                </Form.Item>
                            </Flex>

                            {/* Diesel */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }}  label="Diesel">
                                    <Input value={dieselQty} onChange={(e) => setDieselQty(e.target.value)} placeholder='Diesel' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }}  label="Pump Name">
                                    <Select
                                        showSearch
                                        placeholder="Pump Name"
                                        optionFilterProp="children"
                                        onChange={(e) => { setPumpName(e) }}
                                        value={pumpName}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Average" label="Average">
                                    {(Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || 0}
                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))/((parseInt(dieselQty)||0) + (parseInt(midwayDiesel)||0))} onChange={(e) => { setAverage(e.target.value) }} placeholder='Average' type='number'></Input> */}
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }}  label="Midway Diesel">
                                    <Input value={midwayDiesel} onChange={(e) => setMidwayDiesel(e.target.value)} placeholder='Midway Diesel'></Input>
                                </Form.Item>
                            </Flex>
                        </Flex>
                        <Button type="primary" onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        },
        {
            key: '4',
            label: 'Kaata Parchi Details',
            extra: (
                <>  
                    {kaataParchiEditFlag ? 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setKaataParchiEditFlag(!kaataParchiEditFlag)}}><CloseCircleFilled /></Button> 
                        : 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setKaataParchiEditFlag(!kaataParchiEditFlag)}}><EditFilled /></Button>
                    }
                </>
            ),
            children: <>
                <div>
                    <Form name='Kaata Parchi Details'
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form2}
                        disabled={!kaataParchiEditFlag}
                    >
                        <Flex gap="middle" align="start" vertical>


                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="kaataParchi" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <div style={{ borderRadius: '10px', border: '1px solid green' }}>
                                                    <h3 style={{ padding: '10px' }}>Kaata Parchi {name + 1} </h3>
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{
                                                                width: '100%',
                                                                height: 60,
                                                            }} justify={'space-around'} align={'center'} >
                                                                <Form.Item style={{ width: '20%' }} name={[name, 'unloadingDate']} label="Unloading Date">
                                                                    <Input placeholder='Unloading Date' type='date'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, 'khaliGadiWajan']} label="Khaali Gadi wajan">
                                                                    <Input placeholder='Weight' type='number'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, 'bhariGadiWajan']} label="Bhari Gaadi Wajan">
                                                                    <Input placeholder='Weight' type='number'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, "maalKaWajan"]} label="Maal Ka Wajan">
                                                                    <Input placeholder='weight' type='number'></Input>
                                                                </Form.Item>
                                                            </Flex>

                                                            <Flex style={{
                                                                width: '100%',
                                                                height: 60,
                                                            }} justify={'space-around'} align={'center'}>
                                                                <Form.Item style={{ width: '30%' }} name={[name, "ghaateAllowed"]} label="Ghaate Allowed">
                                                                    <Input placeholder='input' ></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '30%' }} name={[name, "ghaateActual"]} label="Ghaate Actual">
                                                                    <Input placeholder='input' ></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '30%' }} name={[name, "remarks"]} label="Remarks">
                                                                    <Input placeholder='remarks' ></Input>
                                                                </Form.Item>

                                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </div>
                                            </Flex>
                                        ))}
                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add new Kaata Parchi
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Flex>
                        <Button type="primary" onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        },
        {
            key: '5',
            label: 'First Payment Details',
            forceRender: true,
            extra: (
                <>  
                    { paymentDetailsEditFlag? 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setPaymentDetailsEditFlag(!paymentDetailsEditFlag)}}><CloseCircleFilled /></Button> 
                        : 
                        <Button type="primary" onClick={(e) => {e.stopPropagation();setPaymentDetailsEditFlag(!paymentDetailsEditFlag)}}><EditFilled /></Button>
                    }
                </>
            ),
            children: <>
                <div>
                    <h3>Trip se kya mila</h3>
                    <Form name='Trip se kya mila'
                        style={{
                            maxWidth: 1500,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        form={form3}
                        disabled={!paymentDetailsEditFlag}
                    >

                        <Flex gap="middle" align="start" vertical>
                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="paymentDetails" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <Card style={{ borderRadius: '10px', border: '1px solid green', padding: '5px', width: '100%' }}>
                                                    <Row justify={'space-between'}>
                                                        <Col>
                                                            <h3 style={{ padding: '10px' }}>Trip {name + 1} </h3>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item label="Bhada kaun dalega" name={[name, 'bhadaKaunDalega']}>
                                                                
                                                                <Select
                                                                    showSearch
                                                                    placeholder="Bhada Kaun Dalega"
                                                                    optionFilterProp="children"
                                                                    onChange={()=>setFlag(!flag)}
                                                                    // onSearch={onSearch}
                                                                    filterOption={filterOption}
                                                                    options={[
                                                                        ...partyList[name],
                                                                        { label: 'UV Logistics', value: 'UvLogs' },
                                                                        { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                                                    ]}
                                                                />
                                                            </Form.Item>

                                                        </Col>

                                                        {flag && form3.getFieldsValue(['paymentDetails']).paymentDetails[name]?.bhadaKaunDalega === 'NaveenKaka' ?
                                                            <Col>
                                                                <Form.Item label="Select Party" name={[name, 'partyForNaveenKaka']}>
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Bhada Kaun Dalega"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            ...partyList[name]
                                                                        ]}
                                                                        
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            :
                                                            null
                                                        }
                                                        <Col>
                                                            <CloseOutlined
                                                                onClick={() => {
                                                                    remove(name);
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div
                                                        key={key}
                                                    >

                                                        <table style={{ border: '1px solid black', padding: '5px', borderRadius: '10px', width: '100%' }}>
                                                            <thead>
                                                                <tr style={{ border: '1px solid black' }}>
                                                                    <th style={{ border: '1px solid black' }}>Type</th>
                                                                    <th style={{ border: '1px solid black' }}>Amount</th>
                                                                    <th style={{ border: '1px solid black' }}>Bank/Courier Date</th>
                                                                    <th style={{ border: '1px solid black' }}>Bank</th>
                                                                    <th style={{ border: '1px solid black' }}>Remarks</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style={{ border: '1px solid black' }}>
                                                                    <td ><h3>Pohch</h3></td>
                                                                    <td >
                                                                        <Form.Item name={[name, 'pohchAmount']} >
                                                                            <Input placeholder='amount' type='number' />
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
                                                                            <Input placeholder='amount' type='number' />
                                                                        </Form.Item>
                                                                    </td >
                                                                    <td >
                                                                        <Form.Item name={[name, 'cashDate']}>
                                                                            <Input placeholder='date' type='date' />
                                                                        </Form.Item>
                                                                    </td>
                                                                    <td >
                                                                        {/* <Form.Item name={[name, 'cashBank']}>
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="Bank"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={[
                                                                                    {
                                                                                        value: 'ABC',
                                                                                        label: 'ABC',
                                                                                    },
                                                                                    {
                                                                                        value: 'XYZ',
                                                                                        label: 'XYZ',
                                                                                    },
                                                                                    {
                                                                                        value: 'PQR',
                                                                                        label: 'PQR',
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </Form.Item> */}
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
                                                                            <Input placeholder='amount' type='number' />
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
                                                                                options={bankData}
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
                                                                            <Input placeholder='amount' type='number' />
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
                                                                                options={bankData}
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



                                                    </div>

                                                </Card>
                                            </Flex>
                                        ))}

                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button id='FPDAdd' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add new Trip
                                            </Button>
                                        </Form.Item>

                                    </>
                                )}
                            </Form.List>
                        </Flex>
                        <Button type="primary" onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        }
    ];

    
    return (
        <Collapse items={items} activeKey={['1', '3', '4', '5']}></Collapse>
    )
}

export default ViewDailyEntry;