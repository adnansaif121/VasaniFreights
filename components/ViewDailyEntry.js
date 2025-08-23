import React, { useState, useEffect } from "react";
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Popover } from 'antd';
import { MinusCircleOutlined, PlusOutlined, EditFilled, CloseCircleFilled } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import useDisableNumberInputScroll from './hooks/useDisableNumberInputScroll';

const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const ViewDailyEntry = ({ data, Locations, transporterList, partyListAll, driverList, vehicleData, MaalList, bankData, addNewMaal, pumpList }) => {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [toggle, setToggle] = React.useState(false);
    const [vehicleNo, setVehicleNo] = useState('');
    const [date, setDate] = useState(null);
    // const [mt, setMT] = useState(false);
    // const [vehicleStatus, setVehicleStatus] = useState('');
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

    const [lrNumber, setLrNumber] = useState('');
    const [driver1, setDriver1] = useState({});
    const [driver2, setDriver2] = useState({});
    const [conductor, setConductor] = useState({});
    const [locations, setLocations] = useState(Locations);
    const [toggleKaataParchi, setToggleKaataParchi] = useState(false);
    const [bhadaKaunDalega, setBhadaKaunDalega] = useState(null);
    const [partyForTransporterPayment, setPartyForTransporterPayment] = useState(null);
    const [transporter, setTransporter] = useState(null);

    const [pohchAmount, setPohchAmount] = useState(0);
    const [pohchId, setPohchId] = useState(('' + new Date().getFullYear()).substring(2) + '' + (new Date().getMonth() + 1) + '' + new Date().getDate() + '' + parseInt(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000));
    // const [MaalList, setMaalList] = useState([]);

    useDisableNumberInputScroll();
    useEffect(() => {
        // console.log(data, Locations, transporterList, partyListAll, driverList)
        // setFieldsValue of tripDetails:
        let tripDetails = form.getFieldsValue(['tripDetails']);
        tripDetails.tripDetails = data.tripDetails;
        form.setFieldsValue(tripDetails);
        console.log(tripDetails);
        // Make Part List to display in BhadaKaunDalega
        let pl = partyList;
        for (let i = 0; i < tripDetails.tripDetails.length; i++) {
            let item = tripDetails.tripDetails[i];
            pl[i] = [
                { label: item.bhejneWaala, value: item.bhejneWaala },
                { label: item.paaneWaala, value: item.paaneWaala },
                { label: item.transporter, value: item.transporter }
            ];
            setTransporter(item.transporter);

        }
        setPartyList(pl);
        console.log(pl);

        // Driver details 
        console.log(data);
        setLrNumber(data.lrNumber || '');
        setDriver1(data.driver1);
        setDriver2(data.driver2);
        setConductor(data.conductor);
        let dl = driverList;
        for (let i = 0; i < dl.length; i++) {
            if (dl.disabled === true) {
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
        form3.setFieldsValue({ [0]: { bhadaKaunDalega: data.firstPayment?.[0]?.bhadaKaunDalega } });
        form3.setFieldsValue({ [0]: { partyForTransporterPayment: data.firstPayment?.[0]?.partyForTransporterPayment } });
        setBhadaKaunDalega(data.firstPayment?.[0]?.bhadaKaunDalega || '');
        // setRate and setQty
        let r = [];
        let q = [];
        for (let i = 0; i < data.tripDetails.length; i++) {
            r.push(data.tripDetails[i].rate);
            q.push(data.tripDetails[i].qty);
        }
        setRate([...r]);
        setQty([...q]);

        // set Driver KM Details
        setJanaKm(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.janaKm || 0));
        setAanaKm(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.aanaKm || 0));
        // setTripKm(parseInt(data.dieselAndKmDetails.tripKm));
        setMilometer(data.dieselAndKmDetails === undefined ? 0 : parseInt(data.dieselAndKmDetails.milometer || 0));
        setDieselQty(data.dieselAndKmDetails === undefined ? null : parseInt(data.dieselAndKmDetails.dieselQty || 0));
        setPumpName(data.dieselAndKmDetails.pumpName);
        setAverage(data.dieselAndKmDetails.average);
        setMidwayDiesel(data.dieselAndKmDetails === undefined ? 0 : parseInt(data.dieselAndKmDetails.midwayDiesel || 0));

        // setVehicleNo
        setVehicleNo(data.vehicleNo);
        setDate(data.dateToSort)
        let pohchid = data.firstPayment?.[0]?.pohchId || '';
        if (pohchid !== '') {
            setPohchId(data.firstPayment?.[0]?.pohchId);
        }
        setPartyForTransporterPayment(data.firstPayment?.[0]?.partyForTransporterPayment || '');

    }, []);

    // const handleDriverCancel = () => {
    //     setIsDriverModalOpen(false);
    //     setDriverModal({});
    //     driverForm.resetFields();
    // }

    // const handleDriverOk = () => {

    //     addNewDriver();
    //     driverForm.resetFields();
    //     setIsDriverModalOpen(false);
    //     setDriverModal({});
    // }

    // const addNewDriver = (e) => {

    //         // e.preventDefault();
    //         if (driverModal.label === undefined) {
    //             alert("Please Enter Driver Name to submit")
    //         }
    //         let _newDriverName = driverModal.label;
    //         for (let i = 0; i < driverList.length; i++) {
    //             if (_newDriverName.toUpperCase() === driverList[i].value.toUpperCase()) {
    //                 alert("Driver with this name already exists");
    //                 return;
    //             }
    //         }
    //         setDriverList([...driverList, { ...driverModal }]);
    //         setNewDriverName('');

    //         // Create a new party reference with an auto-generated id
    //         const db = getDatabase();
    //         const driverListRef = ref(db, 'drivers');
    //         const newDriverRef = push(driverListRef);
    //         set(newDriverRef, {
    //             ...driverModal
    //         }).then(() => {
    //             alert("Driver Added Successfully!!");
    //             setDriverModal({});
    //             driverForm.resetFields();
    //             return;
    //         });
    //     }

    // const handleSave = () => {
    //     const tripDetails = form.getFieldsValue(['tripDetails']);
    //     let listOfTrips = [];
    //     tripDetails?.tripDetails?.forEach((trip, index) => {
    //         listOfTrips.push({
    //             from: trip.from || '',
    //             to: trip.to || '',
    //             bhejneWaala: trip.bhejneWaala || '',
    //             paaneWaala: trip.paaneWaala || '',
    //             transporter: trip.transporter || '',
    //             maal: trip.maal || '',
    //             qty: trip.qty || 0,
    //             rate: trip.rate || 0,
    //             totalFreight: (parseFloat(trip.rate) * parseFloat(trip.qty)).toFixed(2) || 0,
    //             payStatus: trip.payStatus || '',
    //             courierSentDate: trip.courierSentDate || '',
    //             courierStatus: trip.courierStatus || '',
    //             extraAmount: trip.extraAmount || 0,
    //             extraAmtRemark: trip.extraAmtRemark || '',
    //             firstPaymentTotal: trip.firstPaymentTotal || 0,
    //             furtherPaymentTotal: trip.furtherPaymentTotal || 0,
    //             furtherPayments: trip.furtherPayments || 0,
    //             transactionStatus: trip.transactionStatus || '',
    //             remainingBalance: (parseInt(trip.rate) * parseInt(trip.qty)) -
    //                 ((form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index] !== undefined) ?
    //                     parseInt(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].cashAmount || 0) || 0 +
    //                     parseInt(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].onlineAmount || 0) || 0 +
    //                     parseInt(form3.getFieldsValue(['paymentDetails'])?.paymentDetails[index].chequeAmount || 0) || 0
    //                     :
    //                     0
    //                 )
    //         });
    //     }
    //     );

    //     const kaataParchi = form2.getFieldsValue(['kaataParchi']);
    //     let listOfKaataParchi = [];
    //     kaataParchi?.kaataParchi?.forEach((parchi) => {
    //         listOfKaataParchi.push({
    //             unloadingDate: parchi.unloadingDate || '',
    //             khaliGadiWajan: parchi.khaliGadiWajan || '',
    //             bhariGadiWajan: parchi.bhariGadiWajan || '',
    //             maalKaWajan: parchi.maalKaWajan || '',
    //             ghaateAllowed: parchi.ghaateAllowed || '',
    //             ghaateActual: parchi.ghaateActual || '',
    //             remarks: parchi.remarks || ''
    //         });
    //     }
    //     );

    //     const firstPayment = form3.getFieldsValue(['paymentDetails']);
    //     let listOfFirstPayment = [];
    //     firstPayment?.paymentDetails?.forEach((payment) => {

    //         listOfFirstPayment.push({
    //             bhadaKaunDalega: bhadaKaunDalega || '',
    //             partyForNaveenKaka: payment.partyForNaveenKaka || '',
    //             partyForTransporterPayment: partyForTransporterPayment || '',
    //             pohchAmount: payment.pohchAmount || '',
    //             pohchDate: payment.pohchDate || '',
    //             pohchId: (payment?.pohchAmount !== undefined || payment?.pohchAmount !== '') ? pohchId : '',
    //             pohchSendTo: payment?.pohchSendTo || '',
    //             pohchRemarks: payment.pohchRemarks || '',
    //             cashAmount: payment.cashAmount || '',
    //             cashDate: payment.cashDate || '',
    //             cashRemarks: payment.cashRemarks || '',
    //             onlineAmount: payment.onlineAmount || '',
    //             onlineDate: payment.onlineDate || '',
    //             onlineBank: payment.onlineBank || '',
    //             onlineRemarks: payment.onlineRemarks || '',
    //             chequeAmount: payment.chequeAmount || '',
    //             chequeDate: payment.chequeDate || '',
    //             chequeBank: payment.chequeBank || '',
    //             chequeRemarks: payment.chequeRemarks || '',
    //             chequeNumber: payment.chequeNumber || '',
    //         });
    //     }
    //     );

    //     let dieselAndKmDetails = {
    //         janaKm: janaKm || 0,
    //         aanaKm: aanaKm || 0,
    //         tripKm: Math.abs(janaKm - aanaKm) || '',
    //         milometer: milometer || '',
    //         dieselQty: dieselQty || '',
    //         pumpName: pumpName || '',
    //         average: (Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || '',
    //         midwayDiesel: midwayDiesel || ''
    //     }

    //     console.log(listOfTrips, listOfKaataParchi, listOfFirstPayment);

    //     const db = getDatabase();
    //     // let id = guidGenerator();
    //     let data_key = data.key.slice(0, -1);
    //     // let index = data_key[data_key.length-1];
    //     let starCountRef = ref(db, 'dailyEntry/' + data_key);
    //     update(starCountRef, {
    //         // date: date,
    //         vehicleNo: vehicleNo || '',//done
    //         // mt: mt,
    //         // vehicleStatus: vehicleStatus || '',
    //         // payStatus: payStatus || '',
    //         dieselAndKmDetails: { ...dieselAndKmDetails },//done
    //         tripDetails: listOfTrips,//done
    //         // driversDetails: listOfDrivers,
    //         kaataParchi: listOfKaataParchi,//done
    //         firstPayment: listOfFirstPayment,//done

    //         lrNumber: lrNumber,//done
    //         driver1: driver1,//done
    //         driver2: driver2,//done
    //         conductor: conductor//done
    //     }).then(() => {
    //         console.log('Data saved');
    //         alert('Data Saved Successfully');
    //     }).catch((error) => {
    //         console.error('Error:', error);
    //     });

    //     console.log('Save button clicked');
    // }

    // 1. Save Trip Details
    const handleSaveTripDetails = () => {
        const tripDetails = form.getFieldsValue(['tripDetails']);
        const payment = form3.getFieldsValue(['paymentDetails'])?.paymentDetails[0];
        const trip = tripDetails?.tripDetails?.[0] || {};
        let listOfTrips = [];
        listOfTrips[0] = data.tripDetails[0];
        // tripDetails?.tripDetails?.forEach((trip, index) => {
        listOfTrips[0] = {
            ...listOfTrips[0],
            from: trip.from || '',
            to: trip.to || '',
            bhejneWaala: trip.bhejneWaala || '',
            paaneWaala: trip.paaneWaala || '',
            transporter: trip.transporter || '',
            maal: trip.maal || '',
            qty: trip.qty || 0,
            rate: trip.rate || 0,
            totalFreight: (parseFloat(trip.rate) * parseFloat(trip.qty)).toFixed(2) || 0,
            payStatus: trip.payStatus || '',
            // courierSentDate: trip.courierSentDate || '',
            // courierStatus: trip.courierStatus || '',
            // extraAmount: trip.extraAmount || 0,
            // extraAmtRemark: trip.extraAmtRemark || '',
            // firstPaymentTotal: trip.firstPaymentTotal || 0,
            // furtherPaymentTotal: trip.furtherPaymentTotal || 0,
            // furtherPayments: trip.furtherPayments || 0,
            // transactionStatus: trip.transactionStatus || '',
            remainingBalance: (parseInt(trip.rate) * parseInt(trip.qty)) -
                ((payment !== undefined) ?
                    parseInt(payment.cashAmount || 0) || 0 +
                    parseInt(payment.onlineAmount || 0) || 0 +
                    parseInt(payment.chequeAmount || 0) || 0
                    :
                    0
                )
        };
        // });

        const db = getDatabase();
        let data_key = data.key.slice(0, -1);
        let starCountRef = ref(db, 'dailyEntry/' + data_key);
        update(starCountRef, {
            tripDetails: listOfTrips,
            vehicleNo: vehicleNo || '',
            // dateToSort: date || '',
        }).then(() => {
            alert('Trip Details Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    // 2. Save Driver and Diesel Details
    const handleSaveDriverDetails = () => {
        let dieselAndKmDetails = {
            janaKm: janaKm || 0,
            aanaKm: aanaKm || 0,
            tripKm: Math.abs(janaKm - aanaKm) || '',
            milometer: milometer || '',
            dieselQty: dieselQty || '',
            pumpName: pumpName || '',
            average: (Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || '',
            midwayDiesel: midwayDiesel || ''
        };

        const db = getDatabase();
        let data_key = data.key.slice(0, -1);
        let starCountRef = ref(db, 'dailyEntry/' + data_key);
        update(starCountRef, {
            dieselAndKmDetails: { ...dieselAndKmDetails },
            lrNumber: lrNumber,
            driver1: driver1,
            driver2: driver2,
            conductor: conductor
        }).then(() => {
            alert('Driver & Diesel Details Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    // 3. Save Kaata Parchi Details
    const handleSaveKaataParchi = () => {
        const kaataParchi = form2.getFieldsValue(['kaataParchi']);
        const parchi = kaataParchi?.kaataParchi?.[0] || {};
        let listOfKaataParchi = [];
        listOfKaataParchi[0] = (data.kaataParchi?.[0] || {});
        // kaataParchi?.kaataParchi?.forEach((parchi) => {
        listOfKaataParchi[0] = {
            ...listOfKaataParchi[0],
            unloadingDate: parchi.unloadingDate || '',
            khaliGadiWajan: parchi.khaliGadiWajan || '',
            bhariGadiWajan: parchi.bhariGadiWajan || '',
            maalKaWajan: parchi.maalKaWajan || '',
            ghaateAllowed: parchi.ghaateAllowed || '',
            ghaateActual: parchi.ghaateActual || '',
            remarks: parchi.remarks || ''
        };
        // });

        const db = getDatabase();
        let data_key = data.key.slice(0, -1);
        let starCountRef = ref(db, 'dailyEntry/' + data_key);
        update(starCountRef, {
            kaataParchi: listOfKaataParchi
        }).then(() => {
            alert('Kaata Parchi Details Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    // 4. Save Payment Details
    const handleSavePaymentDetails = () => {
        const firstPayment = form3.getFieldsValue(['paymentDetails']);
        const payment = firstPayment?.paymentDetails[0];
        let listOfFirstPayment = [];
        listOfFirstPayment[0] = data.firstPayment[0] || {};
        // firstPayment?.paymentDetails?.forEach((payment) => {
        listOfFirstPayment[0] = {
            ...listOfFirstPayment[0],
            bhadaKaunDalega: bhadaKaunDalega || '',
            partyForNaveenKaka: payment.partyForNaveenKaka || '',
            partyForTransporterPayment: partyForTransporterPayment || '',
            pohchAmount: payment.pohchAmount || '',
            pohchDate: payment.pohchDate || '',
            pohchId: (payment?.pohchAmount !== undefined || payment?.pohchAmount !== '') ? pohchId : '',
            pohchSendTo: payment?.pohchSendTo || '',
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
            chequeNumber: payment.chequeNumber || '',
        };
        // });

        const db = getDatabase();
        let data_key = data.key.slice(0, -1);
        let starCountRef = ref(db, 'dailyEntry/' + data_key);
        update(starCountRef, {
            firstPayment: listOfFirstPayment
        }).then(() => {
            const tripDetails = form.getFieldsValue(['tripDetails']);
            const trip = tripDetails?.tripDetails?.[0] || {};
            let tripDetailRef = ref(db, 'dailyEntry/' + data_key + '/tripDetails/0/');
            update(tripDetailRef, {
                remainingBalance: (parseInt(trip.rate) * parseInt(trip.qty)) -
                ((payment !== undefined) ?
                    parseInt(payment.cashAmount || 0) || 0 +
                    parseInt(payment.onlineAmount || 0) || 0 +
                    parseInt(payment.chequeAmount || 0) || 0
                    :
                    0
                )
            });
            alert('Payment Details Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };


    const addPartyInPartyList = (value, index) => {
        let pl = partyList;
        let exist = false;
        for (let i = 0; i < pl; i++) {
            if (pl[i].value === value) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            pl[index].push({
                label: value,
                value: value
            });
            setPartyList([...pl]);
        }
    }

    return (
        // <Collapse items={items} activeKey={['1', '3', '4', '5']}></Collapse>
        <>
            <div className={styles.addNewDetails}>
                <div style={{ width: '100%', marginTop: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card style={{ marginBottom: '10px' }}
                                size="small"
                                title="Trip Details"
                                extra={tripDetailsEditFlag ?
                                    <Button type="primary" onClick={(e) => { e.stopPropagation(); setTripDetailsEditFlag(!tripDetailsEditFlag); handleSaveTripDetails() }}>Freeze and Save</Button>
                                    :
                                    <Button type="primary" onClick={(e) => { e.stopPropagation(); setTripDetailsEditFlag(!tripDetailsEditFlag) }}><EditFilled /></Button>
                                }>

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

                                        <Flex gap="middle" align="start" vertical style={{ marginTop: '10px' }}>
                                            <Flex style={{
                                                width: '100%',
                                                height: 20,
                                            }} justify={'space-around'} align={'center'}>
                                                <Form.Item style={{ width: '45%' }} label="Date"
                                                >
                                                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}></Input>
                                                </Form.Item>

                                                <Form.Item style={{ width: '45%' }} label="Vehicle No."
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
                                                        {fields.map(({ key, name }) => (


                                                            <div key={key}>
                                                                <Flex gap="middle" align="start" vertical>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>
                                                                        <Form.Item style={{ width: '45%' }} label="From"
                                                                            name={[name, 'from']}>
                                                                            <Select
                                                                                showSearch
                                                                                placeholder="from"
                                                                                optionFilterProp="children"
                                                                                // onChange={onChange}
                                                                                // onSearch={onSearch}
                                                                                filterOption={filterOption}
                                                                                options={locations}
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
                                                                                                setLocations([...locations, { value: newLocation, label: newLocation }]);
                                                                                                setNewLocation('');
                                                                                            }}>

                                                                                            </Button>
                                                                                        </Space>
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '45%' }}
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
                                                                                options={locations}
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
                                                                                                setLocations([...locations, { value: newLocation, label: newLocation }]);
                                                                                                setNewLocation('');
                                                                                            }}>

                                                                                            </Button>
                                                                                        </Space>
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </Form.Item>
                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>

                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>


                                                                            <Form.Item style={{ width: '100%' }} label="Sender"
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

                                                                            <Popover
                                                                                placement="right"
                                                                                title={data?.tripDetails?.bhejneWaala || 'Party Details'}
                                                                                content={
                                                                                    <div style={{ minWidth: 180 }}>
                                                                                        <div><b>Address:</b> {data?.tripDetails[0]?.bhejneWaaliPartyAddress || 'Not available'}</div>
                                                                                        <div><b>Contact:</b> {data?.tripDetails[0]?.bhejneWaaliPartyContact || 'Not available'}</div>
                                                                                        <div><b>Location:</b> {data?.tripDetails[0]?.bhejneWaaliPartyLocation || 'Not available'}</div>
                                                                                    </div>
                                                                                }
                                                                                trigger="click"
                                                                            >
                                                                                <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >

                                                                                </Button>
                                                                            </Popover>

                                                                        </div>

                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                            <Form.Item style={{ width: '100%' }} label="Reviever"
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
                                                                            <Popover
                                                                                placement="right"
                                                                                title={data?.tripDetails?.paaneWaala || 'Party Details'}
                                                                                content={
                                                                                    <div style={{ minWidth: 180 }}>
                                                                                        <div><b>Address:</b> {data?.tripDetails[0]?.paaneWaaliPartyAddress || 'Not available'}</div>
                                                                                        <div><b>Contact:</b> {data?.tripDetails[0]?.paaneWaaliPartyContact || 'Not available'}</div>
                                                                                        <div><b>Location:</b> {data?.tripDetails[0]?.paaneWaaliPartyLocation || 'Not available'}</div>
                                                                                    </div>
                                                                                }
                                                                                trigger="click"
                                                                            >
                                                                                <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" ></Button>
                                                                            </Popover>
                                                                        </div>

                                                                        {/* <div className='tooltip'>
                                                                            <Tooltip placement="top" title={'Malharganj new bus stand 8812329201'}>
                                                                                <EyeOutlined />
                                                                            </Tooltip>
                                                                        </div> */}
                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>

                                                                        <Form.Item style={{ width: '45%' }}
                                                                            label="To Pay/ Paid"
                                                                            name={[name, 'payStatus']}
                                                                        >
                                                                            {/* <Radio.Group
                                                                                options={[{ label: 'To Pay', value: 'To Pay' }, { label: 'Paid', value: 'Paid' }]}
                                                                                // onChange={(e) => { setPayStatus(e.target.value) }}
                                                                                value={'Paid'}
                                                                                optionType="button"
                                                                                buttonStyle="solid"
                                                                            /> */}
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

                                                                        <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                            <Form.Item style={{ width: '100%' }}
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
                                                                            <Popover
                                                                                placement="right"
                                                                                title={data?.tripDetails?.transporter || 'Transporter Details'}
                                                                                content={
                                                                                    <div style={{ minWidth: 180 }}>
                                                                                        <div><b>Address:</b> {data?.tripDetails[0]?.transporterAddress || 'Not available'}</div>
                                                                                        <div><b>Contact:</b> {data?.tripDetails[0]?.transporterContact || 'Not available'}</div>
                                                                                        <div><b>Location:</b> {data?.tripDetails[0]?.transporterLocation || 'Not available'}</div>
                                                                                    </div>
                                                                                }
                                                                                trigger="click"
                                                                            >
                                                                                <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >
                                                                                </Button>
                                                                            </Popover>
                                                                        </div>
                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>
                                                                        <Form.Item style={{ width: '45%' }}
                                                                            label="Rate"
                                                                            name={[name, 'rate']}
                                                                        >
                                                                            <Input type='number'
                                                                                onWheel={e => e.target.blur()}
                                                                                value={rate}
                                                                                onChange={(e) => { let r = rate; r[name] = e.target.value; setRate([...r]) }}
                                                                            ></Input>
                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '45%' }}
                                                                            label="Qty"
                                                                            name={[name, 'qty']}
                                                                        >
                                                                            <Input type='number'
                                                                                onWheel={e => e.target.blur()}
                                                                                value={qty}
                                                                                onChange={(e) => { let q = qty; q[name] = e.target.value; setQty([...q]) }}>

                                                                            </Input>
                                                                        </Form.Item>


                                                                    </Flex>

                                                                    <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>

                                                                        <Form.Item style={{ width: '45%' }}
                                                                            label="Total Freight"
                                                                        // name={[name, 'totalFreight']}
                                                                        >
                                                                            <Input value={(parseFloat(rate[name]) * parseFloat(qty[name])).toFixed(2)}></Input>

                                                                        </Form.Item>

                                                                        <Form.Item style={{ width: '45%' }} label="Maal"
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
                                                                                                addNewMaal(e, newMaal);
                                                                                                // e.preventDefault();
                                                                                                // setMaalList([...MaalList, { value: newMaal, label: newMaal }]);
                                                                                                // setNewMaal('');
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
                                        {/* <Button type="primary" onClick={handleSave}>Save</Button> */}

                                    </Form>
                                </div>
                            </Card>

                            <Card title="Driver and Diesel" size="small" extra={driverDetailsEditFlag ?
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setDriverDetailsEditFlag(!driverDetailsEditFlag); handleSaveDriverDetails() }}>Freeze and Save</Button>
                                :
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setDriverDetailsEditFlag(!driverDetailsEditFlag) }}><EditFilled /></Button>
                            }>

                                <div>
                                    <Form name="Driver | Diesel | Km | Milometer | Avg Details"
                                        style={{
                                            maxWidth: 1200,
                                            marginTop: '10px'
                                        }}
                                        initialValues={{
                                            remember: true,
                                        }}
                                        autoComplete="off"
                                        form={form1}
                                        disabled={!driverDetailsEditFlag}
                                    >
                                        <Flex gap="middle" align="start" vertical>
                                            <Flex style={{ width: "100%", height: 20, display: 'flex' }} justify={'space-around'} align='center'>

                                                {/* Add Lorry Number */}
                                                <Form.Item style={{ width: '48%' }} label="Lorry No.">
                                                    <Input value={lrNumber} onChange={(e) => { setLrNumber(e.target.value) }} placeholder='Lorry No.' />
                                                </Form.Item>


                                                <Form.Item style={{ width: '48%' }} label="Trip Cash">
                                                    <Input value={driver1 !== null ? driver1.TripCash : null} onChange={(e) => {
                                                        let _obj = driver1 ? { ...driver1 } : {};
                                                        _obj.TripCash = e.target.value;
                                                        setDriver1(_obj);
                                                    }} placeholder='Trip Cash' type='number' onWheel={e => e.target.blur()} />
                                                </Form.Item>


                                            </Flex>

                                            <Flex style={{ width: "100%", height: 20, display: 'flex' }} justify={'space-around'} align='center'>
                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Form.Item style={{ width: '100%' }} label="Driver 1">
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            value={driver1 !== null ? driver1.value : null}
                                                            onChange={(value, option) => {
                                                                console.log(driver1);
                                                                if (driver1 !== null && driver1.label !== undefined) {
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
                                                                setDriver1({
                                                                    ...option,
                                                                    TripCash: driver1?.TripCash || '',
                                                                    DebitCredit: driver1?.DebitCredit || '',
                                                                });
                                                                console.log(option);
                                                            }}
                                                            // onSearch={onSearch}
                                                            filterOption={filterOption}
                                                            options={driverList}
                                                        />
                                                    </Form.Item>
                                                    <Popover
                                                        placement="right"
                                                        title={driver1?.label || 'Driver Details'}
                                                        content={
                                                            <div style={{ minWidth: 180 }}>
                                                                <div><b>Address:</b> {data?.driver1Address || 'Not available'}</div>
                                                                <div><b>Contact:</b> {data?.driver1Contact || 'Not available'}</div>
                                                                <div><b>License:</b> {data?.driver1LicenseDate || 'Not available'}</div>
                                                            </div>
                                                        }
                                                        trigger="click"
                                                    >
                                                        <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >

                                                        </Button>
                                                    </Popover>
                                                </div>

                                                <Form.Item style={{ width: '48%' }} label="Debit/Credit">
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


                                            <Flex style={{ width: "100%", height: 20 }} justify={'space-around'} align='center'>
                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>


                                                    <Form.Item style={{ width: '100%' }} label="Driver 2">
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            value={driver2 !== null ? driver2.value : null}
                                                            onChange={(value, option) => {
                                                                if (driver2 !== null && driver2.label !== undefined) {
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

                                                        />
                                                    </Form.Item>
                                                    <Popover
                                                        placement="right"
                                                        title={driver2?.label || 'Driver Details'}
                                                        content={
                                                            <div style={{ minWidth: 180 }}>
                                                                <div><b>Address:</b> {data?.driver2Address || 'Not available'}</div>
                                                                <div><b>Contact:</b> {data?.driver2Contact || 'Not available'}</div>
                                                                <div><b>License Date:</b> {data?.driver2LicenseDate || 'Not available'}</div>
                                                            </div>
                                                        }
                                                        trigger="click"
                                                    >
                                                        <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >

                                                        </Button>
                                                    </Popover>

                                                </div>

                                                <div style={{ width: '48%', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Form.Item style={{ width: '100%' }} label="Conductor">
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Driver"
                                                            optionFilterProp="children"
                                                            value={conductor !== null ? conductor.value : null}
                                                            onChange={(value, option) => {
                                                                if (conductor !== null && conductor.label !== undefined) {
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

                                                        />
                                                    </Form.Item>

                                                    <Popover
                                                        placement="right"
                                                        title={conductor?.label || 'Conductor Details'}
                                                        content={
                                                            <div style={{ minWidth: 180 }}>
                                                                <div><b>Address:</b> {data?.conductorAddress || 'Not available'}</div>
                                                                <div><b>Contact:</b> {data?.conductorContact || 'Not available'}</div>
                                                                <div><b>License Date:</b> {data?.conductorLicenseDate || 'Not available'}</div>
                                                            </div>
                                                        }
                                                        trigger="click"
                                                    >
                                                        <Button style={{ marginBottom: '24px' }} icon={<EyeOutlined />} type="default" size="small" >

                                                        </Button>
                                                    </Popover>
                                                </div>

                                            </Flex>


                                            {/* KM */}
                                            <Flex style={{
                                                width: '100%',
                                                height: 30,
                                            }} justify={'space-around'} align={'center'}>
                                                <Form.Item style={{ width: '45%' }} label="Jana KM">
                                                    <Input value={janaKm} onChange={(e) => { setJanaKm(e.target.value) }} placeholder='Jana KM' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>

                                                <Form.Item style={{ width: '45%' }} label="Aana KM">
                                                    <Input value={aanaKm} onChange={(e) => { setAanaKm(e.target.value) }} placeholder='Aana KM' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>
                                            </Flex>
                                            <Flex style={{
                                                width: '100%',
                                                height: 30,
                                            }} justify={'space-around'} align={'center'}>
                                                <Form.Item style={{ width: '45%' }} label="Trip KM">
                                                    <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))}></Input>
                                                </Form.Item>
                                                <Form.Item style={{ width: '45%' }} label="Milometer">
                                                    <Input value={milometer} onChange={(e) => { setMilometer(e.target.value) }} placeholder='Milometer'></Input>
                                                </Form.Item>
                                            </Flex>

                                            {/* Diesel */}
                                            <Flex style={{
                                                width: '100%',
                                                height: 30,
                                            }} justify={'space-around'} align={'center'}>
                                                <Form.Item style={{ width: '45%' }} label="Diesel">
                                                    <Input value={dieselQty} onChange={(e) => setDieselQty(e.target.value)} placeholder='Diesel' type='number' onWheel={e => e.target.blur()}></Input>
                                                </Form.Item>

                                                <Form.Item style={{ width: '45%' }} label="Pump Name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Pump Name"
                                                        optionFilterProp="children"
                                                        onChange={(e) => { setPumpName(e) }}
                                                        value={pumpName}
                                                        // onSearch={onSearch}
                                                        filterOption={filterOption}
                                                        options={pumpList}
                                                    />
                                                </Form.Item>
                                            </Flex>
                                            <Flex style={{
                                                width: '100%',
                                                height: 30,
                                            }} justify={'space-around'} align={'center'}>
                                                <Form.Item style={{ width: '45%' }} label="Average">
                                                    <Input value={(Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || 0}></Input>

                                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))/((parseInt(dieselQty)||0) + (parseInt(midwayDiesel)||0))} onChange={(e) => { setAverage(e.target.value) }} placeholder='Average' type='number'></Input> */}
                                                </Form.Item>

                                                <Form.Item style={{ width: '45%' }} label="Midway Diesel">
                                                    <Input value={midwayDiesel} onChange={(e) => setMidwayDiesel(e.target.value)} placeholder='Midway Diesel'></Input>
                                                </Form.Item>
                                            </Flex>
                                        </Flex>
                                        {/* <Button type="primary" onClick={handleSave}>Save</Button> */}
                                    </Form>
                                </div>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card style={{ marginBottom: '10px', width: '100%' }} size="small" title="Kaata Parchi Details" extra={kaataParchiEditFlag ?
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setKaataParchiEditFlag(!kaataParchiEditFlag); handleSaveKaataParchi() }}>Freeze and Save</Button>
                                :
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setKaataParchiEditFlag(!kaataParchiEditFlag) }}><EditFilled /></Button>
                            }>
                                <div>
                                    <Form name='Kaata Parchi Details'
                                        style={{
                                            width: '100%',
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
                                        <Flex gap="middle" vertical style={{ width: '100%' }}>


                                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                                            <Form.List name="kaataParchi" >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            // <Flex key={key} style={{ width: '100%', marginTop: '10px' }} justify={'space-around'} align={'center'}>

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
                                                                            <Input.TextArea rows={2} placeholder='remarks' ></Input.TextArea>
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
                                                                                height: 40,
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
                                                                                height: 40,
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
                                                                                height: 60,
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
                                        {/* <Button type="primary" onClick={handleSave}>Save</Button> */}
                                    </Form>
                                </div>
                            </Card>

                            <Card title="Payment Details" size="small" extra={paymentDetailsEditFlag ?
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setPaymentDetailsEditFlag(!paymentDetailsEditFlag); handleSavePaymentDetails() }}>Freeze and Save</Button>
                                :
                                <Button type="primary" onClick={(e) => { e.stopPropagation(); setPaymentDetailsEditFlag(!paymentDetailsEditFlag) }}><EditFilled /></Button>
                            }>
                                <div>

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
                                        <Form.Item label="Bhada kaun dalega" name={[0, 'bhadaKaunDalega']}>

                                            <Select
                                                showSearch
                                                placeholder="Bhada Kaun Dalega"
                                                optionFilterProp="children"
                                                onChange={(value) => { setFlag(!flag); setBhadaKaunDalega(value) }}
                                                // onSearch={onSearch}
                                                filterOption={filterOption}
                                                options={[
                                                    ...partyList[0],
                                                    { label: 'UV Logistics', value: 'UvLogs' },
                                                    { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                                ]}
                                            />
                                        </Form.Item>

                                        {bhadaKaunDalega === transporter || bhadaKaunDalega === 'NaveenKaka' || bhadaKaunDalega === 'Hare Krishna' ? (
                                            <Form.Item label="Select Party" name={[0, 'partyForTransporterPayment']}>
                                                <Select
                                                    showSearch
                                                    onChange={(value) => setPartyForTransporterPayment(value)}
                                                    placeholder="Party for Transporter Payment"
                                                    optionFilterProp="children"
                                                    filterOption={filterOption}
                                                    options={[
                                                        ...partyList[0]
                                                    ]}
                                                />
                                            </Form.Item>
                                        ) : null}

                                        <Flex gap="middle" align="start" vertical>
                                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                                            <Form.List name="paymentDetails" >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>

                                                                <Row justify={'space-between'}>


                                                                    {/* {flag && form3.getFieldsValue(['paymentDetails']).paymentDetails[name]?.bhadaKaunDalega === 'NaveenKaka' ?
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
                                                                    } */}

                                                                </Row>
                                                                <div
                                                                    key={key}
                                                                >
                                                                    {(pohchAmount !== '' && pohchAmount !== null && pohchAmount !== undefined) ?
                                                                        <div style={{ marginBottom: '10px', backgroundColor: 'lightgrey', padding: '5px', borderRadius: '5px' }}>
                                                                            <h5>Pohch Id: {pohchId}</h5>
                                                                        </div>
                                                                        : null
                                                                    }

                                                                    <table style={{ border: '1px solid black', padding: '5px', borderRadius: '10px', width: '100%' }}>
                                                                        <thead>
                                                                            <tr style={{ border: '1px solid black' }}>
                                                                                <th style={{ border: '1px solid black' }}>Type</th>
                                                                                <th style={{ border: '1px solid black' }}>Amount</th>
                                                                                <th style={{ border: '1px solid black' }}>Bank/Received Date</th>
                                                                                <th style={{ border: '1px solid black', minWidth: '100px' }}>Name</th>
                                                                                <th style={{ border: '1px solid black' }}>Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr style={{ border: '1px solid black' }}>
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
                                                                                                { label: 'UV Logistics Ledger', value: 'UvLogs' },
                                                                                                { label: 'Naveen Kaka Ledger', value: 'NaveenKaka' }
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
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()}/>
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
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()}/>
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
                                                                                        <Input placeholder='amount' type='number' onWheel={e => e.target.blur()}/>
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

                                                                    <Form.Item name={[name, 'chequeNumber']} label="Cheque Number" style={{ marginTop: '10px' }}>
                                                                        <Input placeholder='Cheque Number' />
                                                                    </Form.Item>

                                                                </div>


                                                            </Flex>
                                                        ))}

                                                        {/* <Form.Item style={{ margin: 'auto' }}>
                                                            <Button id='FPDAdd' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Add new Trip
                                                            </Button>
                                                        </Form.Item> */}

                                                    </>
                                                )}
                                            </Form.List>
                                        </Flex>
                                        {/* <Button type="primary" onClick={handleSave}>Save</Button> */}
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default ViewDailyEntry;