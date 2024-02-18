import React, { useState, useEffect } from 'react'
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { CloseOutlined } from '@ant-design/icons';

export default function DailyEntry() {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [toggle, setToggle] = React.useState(false);
    const [vehicleNo, setVehicleNo] = useState('');
    const [mt, setMT] = useState(false);
    const [payStatus, setPayStatus] = useState('Paid');
    const [janaKm, setJanaKm] = useState('');
    const [aanaKm, setAanaKm] = useState('');
    const [tripKm, setTripKm] = useState('');
    const [milometer, setMilometer] = useState('');
    const [dieselQty, setDieselQty] = useState('');
    const [pumpName, setPumpName] = useState('');
    const [average, setAverage] = useState('');
    const [midwayDiesel, setMidwayDiesel] = useState('');
    const [rate, setRate] = useState([0, 0, 0, 0]);
    const [qty, setQty] = useState([0, 0, 0, 0]);
    const [totalFreight, setTotalFreight] = useState(0);
    const [khaliGadiWajan, setKhaliGadiWajan] = useState([0, 0, 0, 0]);
    const [bhariGadiWajan, setBhariGadiWajan] = useState([0, 0, 0, 0]);

    useEffect(()=>{
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

    });


    },[])

    const handleSave = () => {
        const tripDetails = form.getFieldsValue(['tripDetails']);
        let listOfTrips = [];
        tripDetails?.tripDetails?.forEach((trip) => {
            listOfTrips.push({
                from: trip.from || '',
                to: trip.to || '',
                bhejneWaliParty: trip.bhejneWaala || '',
                paaneWaliParty: trip.paaneWaala || '',
                transporter: trip.transporter || '',
                maal: trip.Maal|| '',
                qty: trip.qty || '',
                rate: trip.rate || '',
                totalFreight: parseInt(trip.rate)*parseInt(trip.qty) || '',
            });
        }
        );

        const driversDetails = form1.getFieldsValue(['DriversDetails']);
        let listOfDrivers = [];
        driversDetails?.DriversDetails?.forEach((driver) => {
            listOfDrivers.push({
                driverName: driver.driverName || '',
                driverContact: driver.driverContact || '',
                driverLicenseDate: driver.driverLicenseDate || '',
                driverTripCash: driver.driverTripCash ||''
            });
        }
        );

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
                pohchAmount: payment.pohchAmount || '',
                pohchDate: payment.pohchDate || '',
                pohchBank: payment.pohchBank || '',
                pohchRemarks: payment.pohchRemarks || '',
                cashAmount: payment.cashAmount || '',
                cashDate: payment.cashDate || '',
                cashBank: payment.cashBank || '',
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

        console.log(listOfTrips, listOfDrivers, listOfKaataParchi, listOfFirstPayment);
        
        const db = getDatabase();
        let id = guidGenerator();
        set(ref(db, 'dailyEntry/' + id), {
            vehicleNo: vehicleNo||'',
            mt: mt,
            payStatus: payStatus||'',
            janaKm: janaKm||'',
            aanaKm: aanaKm||'',
            tripKm: tripKm||'',
            milometer: milometer||'',
            dieselQty: dieselQty||'',
            pumpName: pumpName||'',
            average: average||'',
            midwayDiesel: midwayDiesel||'',


            tripDetails: listOfTrips,
            driversDetails: listOfDrivers,
            kaataParchi: listOfKaataParchi,
            firstPayment: listOfFirstPayment
        }).then(() => {
            console.log('Data saved');
            alert('Data Saved Successfully');
        }).catch((error) => {
            console.error('Error:', error);
        });

        console.log('Save button clicked');
    }

    const onMTCheck = (e) => {
        setMT(e.target.checked);
    }

    const dataSource = [
        {
            key: '1',
            id: '1',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',
            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },
        {
            key: '2',
            id: '2',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',

            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },
    ];

    const columns = [
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Truck No.',
            dataIndex: 'truckNo',
            key: 'truckNo',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
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
        },
        {
            title: 'Paane Wali Party',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
        },
        {
            title: 'Transporter',
            dataIndex: 'transporter',
            key: 'transporter',
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
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
        },

    ];

    function guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const items = [
        {
            key: '1',
            label: 'Trip Details',
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
                    >

                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>

                                <Form.Item style={{ width: '30%' }} label="Vehicle No."
                                    name="vehicleNo">
                                    <Select
                                        showSearch
                                        placeholder="Vehicle No."
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'MH 04 1234',
                                                label: 'MH 04 1234',
                                            },
                                            {
                                                value: 'MH 04 1235',
                                                label: 'MH 04 1235',
                                            },
                                            {
                                                value: 'MH 04 1236',
                                                label: 'MH 04 1236',
                                            },
                                        ]}
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
                                        // onChange={onChange}
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
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    // label="MT"
                                    name="mt"
                                >
                                    <Checkbox onChange={onMTCheck} >MT</Checkbox>
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
                                    }}
                                  >
                                        {fields.map(({ key, name, ...restField }) => (
                                            
                                                <Card size="small"
                                                    title={`Unit ${name + 1}`}
                                                    key={key}
                                                    extra={
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                remove(name);
                                                            }}
                                                        /> }>
                                                    {/* <h3 style={{ padding: '10px' }}>UNIT {name + 1} {console.log(fields)}</h3> */}
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{ width: "100%", height: 30, marginTop:'10px' }} justify={'space-around'} align='center'>
                                                                <Form.Item style={{ width: '20%' }} label="From"
                                                                    name={[name, 'from']}>
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="from"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
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
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} label="Bhejne waale"
                                                                    name={[name,'bhejneWaala']}>
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Bhejne waale"
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
                                                                </Form.Item>
                                                                
                                                                <Tooltip placement="top" title={'Malharganj new bus stand 8812329201'}>
                                                                    <Button>i</Button>
                                                                </Tooltip>


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
                                                                        options={[
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
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} label="Paane Waala"
                                                                    name={[name, 'paaneWaala']}>
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Paane waala"
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
                                                                </Form.Item>
                                                                <div></div>
                                                            </Flex>
                                                            <Flex style={{ width: "100%", height: 30 }} justify={'space-around'} align='center'>
                                                                <Form.Item style={{ width: '15%' }} label="Maal"
                                                                    name={[name, 'Maal']}>
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Maal"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
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
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Qty"
                                                                    name={[name, 'qty']}
                                                                >
                                                                    <Input type='number' 
                                                                    value={qty} 
                                                                    onChange={(e)=>{let q = qty; q[name] = e.target.value; setQty([...q])}}>

                                                                    </Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Rate"
                                                                    name={[name, 'rate']}
                                                                >
                                                                    <Input type='number' 
                                                                    value={rate} 
                                                                    onChange={(e)=>{let r = rate; r[name] = e.target.value; setRate([...r])}}
                                                                    ></Input>
                                                                </Form.Item>
                                                                {console.log((form.getFieldValue(['tripDetails', name, 'rate'])||0)*(form.getFieldValue(['tripDetails', name, 'qty'])||0))}
                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Total Freight"
                                                                    // name={[name, 'totalFreight']}
                                                                >
                                                                    {parseInt(rate[name])*parseInt(qty[name])}
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
                                                                </Form.Item>

                                                                {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}

                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </Card>
                                                
                                            
                                        ))}
                                <Form.Item style={{ margin: 'auto' }}>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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

                            <Form.Item style={{ width: '50%', margin: 'auto' }}
                                label="To Pay/ Paid"
                                name="To Pay/ Paid"                           
                            >
                                <Radio.Group
                                    options={[{ label: 'To Pay', value: 'To Pay' }, { label: 'Paid', value: 'Paid' }]}
                                    onChange={(e)=>{setPayStatus(e.target.value)}}
                                    value={'Paid'}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </Form.Item>
                        </Flex>
                    </Flex>
                    <Button type="primary" block onClick={handleSave}>Save</Button>

                </Form>
            </div>
            </>,
        },
// {
//     key: '2',
//     label: 'Party And Transporter Details',

//     children: <>
//         <div>
//             <Form name="Party And Transporter Details"
//                 // labelCol={{
//                 //     span: 8,
//                 // }}
//                 // wrapperCol={{
//                 //     span: 16,
//                 // }}
//                 style={{
//                     maxWidth: 1200,
//                 }}
//                 initialValues={{
//                     remember: true,
//                 }}
//                 // onFinish={onFinish}
//                 // onFinishFailed={onFinishFailed}
//                 autoComplete="off">

//                 <Flex gap="middle" align="start" vertical>

//                     {/* Transporter Details */}
//                     <Flex style={{
//                         width: '100%',
//                         height: 60,
//                     }} justify={'space-around'} align={'center'}>

//                         <Form.Item style={{ width: '20%' }}
//                             label="Address"
//                             name="address"
//                         >
//                             <Input></Input>
//                         </Form.Item>

//                         <Form.Item style={{ width: '20%' }}
//                             label="Contact"
//                             name="contact"
//                         >
//                             <Input></Input>
//                         </Form.Item>

//                     </Flex>
//                 </Flex>
//             </Form>
//         </div>
//     </>,
// },
{
    key: '3',
        label: 'Driver | Diesel | Km | Milometer | Avg Details',
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
                        >
                        <Flex gap="middle" align="start" vertical>


                            <Form.List name="DriversDetails" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <div style={{ borderRadius: '10px', border: '1px solid green' }}>
                                                    <h3 style={{ padding: '10px' }}>
                                                        {name === 0 ? 'Driver 1' : (name === 1) ? 'Driver 2' : 'Conductor'}
                                                    </h3>
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{ width: "1000px", height: 30 }} justify={'space-around'} align='center'>

                                                                <Form.Item style={{ width: '20%' }}
                                                                    name={[name, 'driverName']}
                                                                    label='Name'
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Driver"
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
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, 'driverContact']} label="contact">
                                                                    <Input placeholder='contact' />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, 'driverLicenseDate']} label="License Date">
                                                                    <Input placeholder='License Date' type='date' />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name={[name, 'driverTripCash']} label="Cash">
                                                                    <Input placeholder='Trip Cash' type='number' />
                                                                </Form.Item>

                                                                <Tooltip placement="top" title={'Driver Image'} >
                                                                    <Button style={{ marginBottom: '22px' }}>View</Button>
                                                                </Tooltip>
                                                                <MinusCircleOutlined onClick={() => remove(name)} />

                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </div>
                                            </Flex>
                                        ))}
                                        {fields.length < 3 &&
                                            <Form.Item style={{ margin: 'auto' }}>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add new Driver/Conductor
                                                </Button>
                                            </Form.Item>
                                        }
                                    </>
                                )}
                            </Form.List>



                            {/* KM */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} name="Jana KM" label="Jana KM">
                                    <Input value={janaKm} onChange={(e)=>{setJanaKm(e.target.value)}} placeholder='Jana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Aana KM" label="Aana KM">
                                    <Input value={aanaKm} onChange={(e)=>{setAanaKm(e.target.value)}} placeholder='Aana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Trip KM" label="Trip KM">
                                    <Input value={Math.abs(janaKm-aanaKm)} onChange={(e)=>{setTripKm(e.target.value)}} placeholder='Trip KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Milometer" label="Milometer">
                                    <Input value={milometer} onChange={(e)=>{setMilometer(e.target.value)}} placeholder='Milometer'></Input>
                                </Form.Item>
                            </Flex>

                            {/* Diesel */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} name="Diesel Qty" label="Diesel">
                                    <Input value={dieselQty} onChange={(e)=>setDieselQty(e.target.value)} placeholder='Diesel' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Pump Name" label="Pump Name">
                                    <Select
                                        showSearch
                                        placeholder="Pump Name"
                                        optionFilterProp="children"
                                        onChange={(e)=>{setPumpName(e)}}
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
                                    <Input value={average} onChange={(e)=>{setAverage(e.target.value)}} placeholder='Average' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Midway diesel" label="Midway Diesel">
                                    <Input value={midwayDiesel} onChange={(e)=>setMidwayDiesel(e.target.value)} placeholder='Midway Diesel'></Input>
                                </Form.Item>
                            </Flex>
                        </Flex>
                        <Button type="primary" block onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        },
{
    key: '4',
        label: 'Kaata Parchi Details',
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
                        <Button type="primary" block onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        },
{
    key: '5',
        label: 'First Payment Details',
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
                        >

                        <Flex gap="middle" align="start" vertical>
                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="paymentDetails" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex key={key} style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <Card style={{ borderRadius: '10px', border: '1px solid green', padding: '5px' }}>
                                                    <Row justify={'space-between'}>
                                                        <Col>
                                                            <h3 style={{ padding: '10px' }}>Unit {name + 1} </h3>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item label="Bhada kaun dalega" name={[name, 'bhadaKaunDalega']}>
                                                                <Radio.Group
                                                                    options={[{ label: 'Party', value: 'Party' },
                                                                    { label: 'Transporter', value: 'Transporter' },
                                                                    { label: 'UV Logistics', value: 'UvLogs' },
                                                                    { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                                                    ]}
                                                                    // onChange={onChange4}
                                                                    // value={'Party'}
                                                                    optionType="button"
                                                                    buttonStyle="solid"
                                                                />
                                                            </Form.Item>
                                                        </Col>
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

                                                        <table style={{ border: '1px solid black', padding: '5px', borderRadius: '10px' }}>
                                                            <tr style={{ border: '1px solid black' }}>
                                                                <th style={{ border: '1px solid black' }}>Type</th>
                                                                <th style={{ border: '1px solid black' }}>Amount</th>
                                                                <th style={{ border: '1px solid black' }}>date</th>
                                                                <th style={{ border: '1px solid black' }}>Bank</th>
                                                                <th style={{ border: '1px solid black' }}>Remarks</th>
                                                            </tr>
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
                                                                    <Form.Item name={[name, 'pohchBank']}>
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
                                                                    <Form.Item name={[name, 'cashBank']}>
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
                                                                    </Form.Item>
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
                                                                    <Form.Item name={[name,'chequeBank']}>
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
                                                                    </Form.Item>
                                                                </td>
                                                                <td >
                                                                    <Form.Item name={[name, 'chequeRemarks']}>
                                                                        <Input placeholder='remarks' />
                                                                    </Form.Item>
                                                                </td>
                                                            </tr>
                                                        </table>



                                                    </div>

                                                </Card>
                                            </Flex>
                                        ))}
                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add new Unit
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Flex>
                        <Button type="primary" block onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        }
    ];

return (
    <>

        <Input style={{ width: "20%", marginLeft: '40px' }} type='date' />
        {/* {[...rate[0]]} */}
        <div style={{ width: "100vw",overflowX:'auto', marginLeft: '20px' }}>
            <Table dataSource={dataSource} columns={columns} expandable={{
                expandedRowRender: (record) => <Collapse accordion items={items} />,
                rowExpandable: (record) => true,
            }} />
        </div>
        <Button style={{ marginLeft: "50px" }} onClick={() => setToggle(!toggle)}>Add New Details</Button>
        <div className={styles.addNewDetails}>
            {toggle &&
                <>
                    <Collapse items={items} defaultActiveKey={['1']} />
                    
                </>
            }
        </div>
    </>
)
}
