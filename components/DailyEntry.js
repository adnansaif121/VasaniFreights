import React, { useState, useEffect } from 'react'
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip, Card, Divider, Modal, Upload } from 'antd';
import { InboxOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import ViewDailyEntry from './ViewDailyEntry';
import { render } from 'react-dom';
let bankData = [
    {
        key: "0",
        label: "CV ICICI",
        value: "CV ICICI",
    },
    {
        key: "1",
        label: "CCV ICICI",
        value: "CCV ICICI"
    },
    {
        key: "2",
        label: "BV ICICI",
        value: "BV ICICI"
    },
    {
        key: "3",
        label: "RV ICICI",
        value: "RV ICICI"
    },
    {
        key: "4",
        label: "NV ICICI",
        value: "NV ICICI"
    },
    {
        key: "5",
        label: "NCV ICICI",
        value: "NCV ICICI"
    },
    {
        key: "6",
        label: "AV ICICI",
        value: "AV ICICI"
    },
    {
        key: "7",
        label: "VV ICICI",
        value: "VV ICICI"
    },
    {
        key: "8",
        label: "KV ICICI",
        value: "KV ICICI"
    },
    {
        key: "9",
        label: "JV ICICI",
        value: "JV ICICI"
    },
    {
        key: "10",
        label: "CV HUF ICICI",
        value: "CV HUF ICICI"
    },
    {
        key: "11",
        label: "CCV HUF ICICI",
        value: "CCV HUF ICICI"
    },
    {
        key: "12",
        label: "BV HUF ICICI",
        value: "BV HUF ICICI"
    },
    {
        key: "13",
        label: "RV HUF HDFC",
        value: "RV HUF HDFC"
    },
    {
        key: "14",
        label: "RAMA ICICI",
        value: "RAMA ICICI"
    },
    {
        key: "15",
        label: "HKL ICICI",
        value: "HKL ICICI"
    },
    {
        key: "16",
        label: "BV HDFC",
        value: "BV HDFC"
    },
    {
        key: "17",
        label: "KV HDFC",
        value: "KV HDFC"
    },
    {
        key: "18",
        label: "JV HDFC",
        value: "JV HDFC"
    },
    {
        key: "19",
        label: "RKV HDFC",
        value: "RKV HDFC"
    },
    {
        key: "20",
        label: "SV HDFC",
        value: "SV HDFC"
    },
    {
        key: "21",
        label: "DV HDFC",
        value: "DV HDFC"
    },
    {
        key: "22",
        label: "UV GLOBAL HDFC",
        value: "UV GLOBAL HDFC"
    },
    {
        key: "23",
        label: "UV LOGI HDFC",
        value: "UV LOGI HDFC"
    },
    {
        key: "24",
        label: "CCV HDFC",
        value: "CCV HDFC"
    }
];
let vehicleData =
    [{
        key: 0,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 AC 1411",
        value: "MH 18 AC 1411",
        label: "MH 18 AC 1411"
    },
    {
        key: 1,
        owner: "Asha Vasani",
        vehicleNo: "MH 18 AC 1511",
        value: "MH 18 AC 1511",
        label: "MH 18 AC 1511"
    },
    {
        key: 2,
        owner: "Neha Vasani",
        vehicleNo: "MH 18 AP 1811",
        value: "MH 18 AP 1811",
        label: "MH 18 AP 1811"
    },
    {
        key: 3,
        owner: "Nita Vasani",
        vehicleNo: "MH 18 AP 1911",
        value: "MH 18 AP 1911",
        label: "MH 18 AP 1911"
    },
    {
        key: 4,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BA 2011",
        value: "MH 18 BA 2011",
        label: "MH 18 BA 2011"
    },
    {
        key: 5,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2111",
        value: "MH 18 BA 2111",
        label: "MH 18 BA 2111"
    },
    {
        key: 6,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BA 2311",
        value: "MH 18 BA 2311",
        label: "MH 18 BA 2311"
    },
    {
        key: 7,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BA 2411",
        value: "MH 18 BA 2411",
        label: "MH 18 BA 2411"
    },
    {
        key: 8,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2611",
        value: "MH 18 BA 2611",
        label: "MH 18 BA 2611"
    },
    {
        key: 9,
        owner: "Kunal Vasani",
        vehicleNo: "MH 18 BA 2711",
        value: "MH 18 BA 2711",
        label: "MH 18 BA 2711"
    },
    {
        key: 10,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 2811",
        value: "MH 18 BG 2811",
        label: "MH 18 BG 2811"
    },
    {
        key: 11,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 2911",
        value: "MH 18 BG 2911",
        label: "MH 18 BG 2911"
    },
    {
        key: 12,
        owner: "Jayesh Vasani",
        vehicleNo: "MH 18 BG 3011",
        value: "MH 18 BG 3011",
        label: "MH 18 BG 3011"
    },
    {
        key: 13,
        owner: "Nita Vasani",
        vehicleNo: "MH 18 BG 3111",
        value: "MH 18 BG 3111",
        label: "MH 18 BG 3111"
    },
    {
        key: 14,
        owner: "Bhavesh Vasani HUF",
        vehicleNo: "MP 46 H  3211",
        value: "MP 46 H  3211",
        label: "MP 46 H  3211"
    },
    {
        key: 15,
        owner: "Chandresh Vasani HUF",
        vehicleNo: "MP 46 H  3311",
        value: "MP 46 H  3311",
        label: "MP 46 H  3311"
    },
    {
        key: 16,
        owner: "Chetan Vasani HUF",
        vehicleNo: "MP 46 H  3411",
        value: "MP 46 H  3411",
        label: "MP 46 H  3411"
    },
    {
        key: 17,
        owner: "Rajesh Vasani HUF",
        vehicleNo: "MP 46 H  3511",
        value: "MP 46 H  3511",
        label: "MP 46 H  3511"
    },
    {
        key: 18,
        owner: "Veena Vasani",
        vehicleNo: "MH 18 BG 3711",
        value: "MH 18 BG 3711",
        label: "MH 18 BG 3711"
    },
    {
        key: 19,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BG 3811",
        value: "MH 18 BG 3811",
        label: "MH 18 BG 3811"
    },
    {
        key: 20,
        owner: "Chetan Vasani",
        vehicleNo: "MH 18 BH 3911",
        value: "MH 18 BH 3911",
        label: "MH 18 BH 3911"
    },
    {
        key: 21,
        owner: "Chetan Vasani",
        vehicleNo: "MH 18 BH 4011",
        value: "MH 18 BH 4011",
        label: "MH 18 BH 4011"
    },
    {
        key: 22,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BH 4211",
        value: "MH 18 BH 4211",
        label: "MH 18 BH 4211"
    },
    {
        key: 23,
        owner: "Chandresh Vasani",
        vehicleNo: "MH 18 BH 4311",
        value: "MH 18 BH 4311",
        label: "MH 18 BH 4311"
    },
    {
        key: 24,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BZ 4611",
        value: "MH 18 BZ 4611",
        label: "MH 18 BZ 4611"
    },
    {
        key: 25,
        owner: "Rajesh Vasani",
        vehicleNo: "MH 18 BZ 4711",
        value: "MH 18 BZ 4711",
        label: "MH 18 BZ 4711"
    },
    {
        key: 26,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BZ 4811",
        value: "MH 18 BZ 4811",
        label: "MH 18 BZ 4811"
    },
    {
        key: 27,
        owner: "Bhavesh Vasani",
        vehicleNo: "MH 18 BZ 4911",
        value: "MH 18 BZ 4911",
        label: "MH 18 BZ 4911"
    }
    ]

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
export default function DailyEntry() {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [toggle, setToggle] = React.useState(false);
    const [vehicleNo, setVehicleNo] = useState('');
    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);
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
    const [rate, setRate] = useState([0, 0, 0, 0]);
    const [qty, setQty] = useState([0, 0, 0, 0]);
    const [totalFreight, setTotalFreight] = useState(0);
    const [khaliGadiWajan, setKhaliGadiWajan] = useState([0, 0, 0, 0]);
    const [bhariGadiWajan, setBhariGadiWajan] = useState([0, 0, 0, 0]);
    // To Track number of trips
    const [tripCount, setTripCount] = useState(0);
    // to display dynamic Bhada Kaun Dalega list
    const [partyList, setPartyList] = useState([[], [], [], [], [], []]);
    const [partyDetailsList, setPartyDetailsList] = useState([[], [], [], [], [], []]);
    const [selectedPartyIndex, setSelectedPartyIndex] = useState([-1, -1, -1, -1, -1, -1, -1]);
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
    const [newLocation, setNewLocation] = useState('');
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
    // FLAG 
    const [flag, setFlag] = useState(false);

    //Bank
    const [newBank, setNewBank] = useState('');
    const [bankData, setBankData] = useState([]);
    const [dateFilter, setDateFilter] = useState('');

    const [driver1, setDriver1] = useState({});
    const [driver2, setDriver2] = useState({});
    const [conductor, setConductor] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
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
                    ds.push(
                        {
                            date: data[key].date,
                            key: key,
                            id: i + 1,
                            vehicleNo: data[key].vehicleNo,
                            mt: data[key].mt,
                            from: data[key].tripDetails[0].from,
                            to: data[key].tripDetails[0].to,
                            paid: data[key].tripDetails[0].payStatus,
                            bhejneWaliParty: data[key].tripDetails[0].bhejneWaala,
                            paaneWaliParty: data[key].tripDetails[0].paaneWaala,
                            transporter: data[key].tripDetails[0].transporter,
                            maal: data[key].tripDetails[0].maal,
                            qty: data[key].tripDetails[0].qty,
                            rate: data[key].tripDetails[0].rate,
                            totalFreight: data[key].tripDetails[0].totalFreight,
                            received: '100000',
                            dieselAndKmDetails: data[key].dieselAndKmDetails,
                            tripDetails: data[key].tripDetails,
                            driversDetails: data[key].driversDetails,
                            kaataParchi: data[key].kaataParchi,
                            firstPayment: data[key].firstPayment,
                            vehicleStatus: data[key].vehicleStatus,
                            bhadaKaunDalega: (data[key]?.firstPayment === undefined) ? null : data[key]?.firstPayment[0]?.bhadaKaunDalega,
                        }
                    )
                });
            }
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

        const partyRef = ref(db, 'parties/');
        onValue(partyRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'parties');
            // updateStarCount(postElement, data);
            let parties = []; // Data Source
            Object.values(data).map((party, i) => {
                parties.push(party);
            })
            setPartyListAll([...parties]);
        });

        const transporterRef = ref(db, 'transporters/');
        onValue(transporterRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'transporters');
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
            console.log(data, 'drivers');
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
            for (let i = 0; i < data.data.length; i++) {
                _bankData.push({
                    label: data.data[i].bankName,
                    value: data.data[i].bankName,
                    key: data.data[i].key
                })
            }
            setBankData([..._bankData]);
            // console.log(data, 'Bankdata');
        })
    }, [])

    // useEffect(() => {
    //     const tripDetails = form.getFieldsValue(['tripDetails']);
    //     console.log(tripDetails, form);
    // })

    const applyDateSort = (ds) => {
        ds.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });

        setDataSource(ds);
        setCompleteDataSource(ds);
    }

    const handleSave = () => {
        let tripDetails = form.getFieldsValue(['tripDetails']);
        let listOfTrips = [];
        tripDetails?.tripDetails?.forEach((trip) => {
            listOfTrips.push({
                from: trip.from || '',
                to: trip.to || '',
                bhejneWaala: trip.bhejneWaala || '',
                paaneWaala: trip.paaneWaala || '',
                transporter: trip.transporter || '',
                maal: trip.Maal || '',
                qty: trip.qty || 0,
                rate: trip.rate || 0,
                totalFreight: parseInt(trip.rate) * parseInt(trip.qty) || 0,
                payStatus: trip.payStatus || '',
            });
        }
        );

        let driversDetails = form1.getFieldsValue(['DriversDetails']);
        let listOfDrivers = [];
        driversDetails?.DriversDetails?.forEach((driver) => {
            listOfDrivers.push({
                driverName: driver?.driverName || '',
                driverContact: driver?.driverContact || '',
                driverLicenseDate: driver?.driverLicenseDate || '',
                driverTripCash: driver?.driverTripCash || ''
            });
        }
        );

        if (form1?.getFieldsValue(['DriversDetails']).DriversDetails === undefined || driversDetails.length === 0) listOfDrivers = null;

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
                bhadaKaunDalega: payment?.bhadaKaunDalega || '',
                pohchAmount: payment?.pohchAmount || '',
                pohchDate: payment?.pohchDate || '',

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
            });
        }
        );

        // console.log(form3.getFieldsValue(['paymentDetails']));

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
        console.log(listOfTrips, listOfDrivers, listOfKaataParchi, listOfFirstPayment);

        console.log(form1?.getFieldsValue(['DriversDetails']));
        const db = getDatabase();
        let id = guidGenerator();
        set(ref(db, 'dailyEntry/' + id), {
            date: date,
            vehicleNo: vehicleNo || '',
            mt: mt,
            vehicleStatus: vehicleStatus || '',
            // payStatus: payStatus || '',
            dieselAndKmDetails: { ...dieselAndKmDetails } || null,
            tripDetails: listOfTrips || null,
            driversDetails: listOfDrivers || null,
            kaataParchi: listOfKaataParchi || null,
            firstPayment: listOfFirstPayment || null,

            // FIELDS DATA
            tripDetailsFields: (form?.getFieldsValue(['tripDetails']) || null),
            driversDetailsFields: (listOfDrivers === null) ? null : (form1?.getFieldsValue(['DriversDetails']) || null),
            kaataParchiFields: (listOfKaataParchi === null) ? null : (form2?.getFieldsValue(['kaataParchi']) || null),
            firstPaymentFields: (listOfFirstPayment === null) ? null : (form3?.getFieldsValue(['paymentDetails']) || null)
        }).then(() => {
            console.log('Data saved');
            alert('Data Saved Successfully');
            console.log({
                date: date,
                vehicleNo: vehicleNo || '',
                mt: mt,
                vehicleStatus: vehicleStatus || '',
                // payStatus: payStatus || '',
                dieselAndKmDetails: { ...dieselAndKmDetails },
                tripDetails: listOfTrips,
                driversDetails: listOfDrivers,
                kaataParchi: listOfKaataParchi,
                firstPayment: listOfFirstPayment,

                // FIELDS DATA
                tripDetailsFields: form.getFieldsValue(['tripDetails']),
                driversDetailsFields: form1.getFieldsValue(['DriversDetails']),
                kaataParchiFields: form2.getFieldsValue(['kaataParchi']),
                firstPaymentFields: form3.getFieldsValue(['paymentDetails'])
            });
        }).catch((error) => {
            console.error('Error:', error);
        });

        console.log('Save button clicked');
    }

    const onMTCheck = (e) => {
        setMT(e.target.checked);
    }

    const columns = [
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Truck No.',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
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
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    const addPartyInPartyList = (value, index) => {
        let pl = partyList;
        let party1 = form.getFieldValue(['tripDetails', index, 'bhejneWaala']);
        let party2 = form.getFieldValue(['tripDetails', index, 'paaneWaala']);
        let transporter = form.getFieldValue(['tripDetails', index, 'transporter']);
        pl[index] = [{ label: party1, value: party1 }, { label: party2, value: party2 }, { label: transporter, value: transporter }];
        setPartyList([...pl]);

        let plDetails = partyDetailsList;
        let party1Details = 'no details available';
        let party2Details = 'no details available';
        let transporterDetails = 'no details available';
        for (let i = 0; i < plDetails.length; i++) {
            if (plDetails[i].value === party1) party1Details = `${plDetails[i].address || 'Address notFound'} ${plDetails[i].contact || 'Contact notFound'}`;
            if (plDetails[i].value === party2) party2Details = `${plDetails[i].address || 'Address notFound'} ${plDetails[i].contact || 'Contact notFound'}`;
            if (plDetails[i].value === transporter) transporterDetails = `${plDetails[i].address || 'Address notFound'} ${plDetails[i].contact || 'Contact notFound'}`;
        }
        plDetails[index] = [{ party1Details, party2Details, transporterDetails }];
        console.log(plDetails);
        setPartyDetailsList([...plDetails]);
    }

    const addNewParty = (e) => {
        e.preventDefault();
        for(let i = 0; i < partyListAll.length; i++){
            if(newParty.toUpperCase() === partyListAll[i].value.toUpperCase()){
                alert(`Party with name ${partyListAll[i].value} already exists.` );
                return;
            }
        }
        setPartyListAll([...partyListAll, { value: newParty, label: newParty }]);
        setNewParty('');
        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const partyListRef = ref(db, 'parties');
        const newPartyRef = push(partyListRef);
        set(newPartyRef, {
            value: newParty,
            label: newParty,
        });
    }

    const addNewTransporter = (e) => {

        e.preventDefault();
        for(let i = 0; i < transporterList.length; i++){
            if(newTransporter.toUpperCase() === transporterList[i].value.toUpperCase()){
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

    const addNewBank = (e) => {
        e.preventDefault();
        let key = bankData.length;
        setBankData([...bankData, { value: newBank, label: newBank, key: key }]);
        setNewBank('');

        const db = getDatabase();
        const bankRef = ref(db, 'bankData/data/' + key);
        // const newBankRef = push(bankRef);
        set(bankRef, {
            value: newBank,
            label: newBank,
            key: key,
        })
    }

    const addNewDriver = (e) => {

        e.preventDefault();
        for(let i = 0; i < driverList.length; i++){
            if(newDriverName.toUpperCase() === driverList[i].value.toUpperCase()){
                alert("Driver with this name already exists");
                return;
            }
        }
        setDriverList([...driverList, { value: newDriverName, label: newDriverName }]);
        setNewDriverName('');

        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const driverListRef = ref(db, 'drivers');
        const newDriverRef = push(driverListRef);
        set(newDriverRef, {
            value: newDriverName,
            label: newDriverName,
        });
    }
    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                                <Form.Item style={{ width: '20%' }} label="Date">
                                    <Input type='date' value={date} onChange={(e) => setDate(e.target.value)} ></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '30%' }} label="Vehicle No."
                                    name="vehicleNo">
                                    <Select
                                        showSearch
                                        placeholder="Vehicle No."
                                        optionFilterProp="children"
                                        onChange={(value) => setVehicleNo(value)}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={vehicleData}
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
                                        onChange={(value) => setVehicleStatus(value)}
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
                                                                    onChange={(value) => {addPartyInPartyList(value, name); 
                                                                        let _selectedPartyIndex = selectedPartyIndex;
                                                                        for(let i = 0; i < partyListAll.length; i++){
                                                                            if(partyListAll[i].value.toUpperCase() === value.toUpperCase()){
                                                                                _selectedPartyIndex[name] = i;
                                                                                break;
                                                                            }
                                                                        }
                                                                        // console.log(_selectedPartyIndex);
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
                                                                <Tooltip placement="top" 
                                                                // title={partyDetailsList[name]?.party1Details}
                                                                    title={selectedPartyIndex[name] !== -1 ? `${partyListAll[selectedPartyIndex[name]].address || 'Address not available'} ${partyListAll[selectedPartyIndex[name]].contact || 'Contact Not Available'} ${partyListAll[selectedPartyIndex[name]].location || 'Location not available'}`: 'Not available'}
                                                                >

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
                                                                    onChange={(value) => {
                                                                        addPartyInPartyList(value, name)
                                                                        let _selectedPartyIndex = selectedPartyIndex;
                                                                        for(let i = 0; i < partyListAll.length; i++){
                                                                            if(partyListAll[i].value.toUpperCase() === value.toUpperCase()){
                                                                                _selectedPartyIndex[name+1] = i;
                                                                                break;
                                                                            }
                                                                        }
                                                                        // console.log(_selectedPartyIndex);
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
                                                                <Tooltip placement="top" 
                                                                // title={partyDetailsList[name]?.party2Details}
                                                                title={selectedPartyIndex[name+1] !== -1 ? `${partyListAll[selectedPartyIndex[name+1]].address || 'Address not available'} ${partyListAll[selectedPartyIndex[name+1]].contact || 'Contact Not Available'} ${partyListAll[selectedPartyIndex[name+1]].location || ' '}`: 'Not available'}
                                                                >
                                                                    <EyeOutlined />
                                                                </Tooltip>
                                                            </div>
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
                                                                <Tooltip placement="top" title={partyDetailsList[name]?.transporterDetails}>
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
                                                        setDriver1(option);
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
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
                                                                <Input
                                                                    placeholder="Please enter item"
                                                                    value={newDriverName}
                                                                    onChange={(e) => setNewDriverName(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

                                                                </Button>
                                                            </Space>
                                                        </>
                                                    )}
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
                                                <Input onChange={(e) => {
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
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
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
                                                                <Input
                                                                    placeholder="Please enter item"
                                                                    value={newDriverName}
                                                                    onChange={(e) => setNewDriverName(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

                                                                </Button>
                                                            </Space>
                                                        </>
                                                    )}
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
                                                <Input onChange={(e) => {
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
                                                        console.log(option);
                                                    }}
                                                    // onSearch={onSearch}
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
                                                                <Input
                                                                    placeholder="Please enter item"
                                                                    value={newDriverName}
                                                                    onChange={(e) => setNewDriverName(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

                                                                </Button>
                                                            </Space>
                                                        </>
                                                    )}
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
                                                <Input onChange={(e) => {
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
                                <Form.Item style={{ width: '20%' }} label="Jana KM">
                                    <Input value={janaKm} onChange={(e) => { setJanaKm(e.target.value) }} placeholder='Jana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} label="Aana KM">
                                    <Input value={aanaKm} onChange={(e) => { setAanaKm(e.target.value) }} placeholder='Aana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} label="Trip KM">
                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))} onChange={(e) => { setTripKm(e.target.value) }} placeholder='Trip KM' type='number'></Input> */}
                                    {Math.abs(parseInt(janaKm) - parseInt(aanaKm))}
                                </Form.Item>
                                <Form.Item style={{ width: '20%' }} label="Milometer">
                                    <Input value={milometer} onChange={(e) => { setMilometer(e.target.value) }} placeholder='Milometer'></Input>
                                </Form.Item>
                            </Flex>

                            {/* Diesel */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} label="Diesel">
                                    <Input value={dieselQty} onChange={(e) => setDieselQty(e.target.value)} placeholder='Diesel' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} label="Pump Name">
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

                                <Form.Item style={{ width: '20%' }} label="Average">
                                    {(Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || 0}
                                    {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))/((parseInt(dieselQty)||0) + (parseInt(midwayDiesel)||0))} onChange={(e) => { setAverage(e.target.value) }} placeholder='Average' type='number'></Input> */}
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} label="Midway Diesel">
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
                        <Button type="primary" onClick={handleSave}>Save</Button>
                    </Form>
                </div>
            </>,
        },
        {
            key: '5',
            label: 'First Payment Details',
            forceRender: true,
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
                                                                    onChange={() => setFlag(!flag)}
                                                                    // onSearch={onSearch}
                                                                    filterOption={filterOption}
                                                                    options={[
                                                                        ...partyList[name],
                                                                        // {label: form.getFieldsValue(['tripDetails'])?.tripDetails[name]?.bhejneWaala, value: form.getFieldsValue(['tripDetails']).tripDetails[name]?.bhejneWaala},
                                                                        // { label: form.getFieldsValue(['tripDetails'])?.tripDetails[name]?.paaneWaala, value: form.getFieldsValue(['tripDetails']).tripDetails[name]?.paaneWaala},
                                                                        // {label: form.getFieldValue(['tripDetails'])?.tripDetails[name]?.transporter, value: form.getFieldValue(['tripDetails']).tripDetails[name]?.transporter},
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
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical" >
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
                                <Input placeholder="Please enter user name"  />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                // name="Party Location"
                                label="Party Location"
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
                                    placeholder="Party Location"
                                    
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                // name="Address"
                                label="Address"
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
                                    placeholder="Party Address"
                                    
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                                <Input.TextArea rows={4} placeholder="please enter url description"  />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </Row>
                </Form>
            </Modal>
            <div>
                <Input style={{ width: "20%", marginLeft: '40px' }} type='date' value={dateFilter} onChange={handleDateFilter} />
                <Button onClick={() => {
                    setDataSource(completeDataSource);
                    setDateFilter(null);
                }}>Clear Date</Button>
            </div>
            {/* {[...rate[0]]} */}
            <div style={{ width: "95vw", overflowX: 'auto', marginLeft: '20px', height: '60vh', backgroundColor: 'white' }}>
                <Table size="small" dataSource={dataSource} columns={columns} expandable={{
                    expandedRowRender: (record) =>
                        <ViewDailyEntry
                            data={record}
                            Locations={Locations}
                            partyListAll={partyListAll}
                            transporterList={transporterList}
                            driverList={driverList}
                            vehicleData={vehicleData}
                            MaalList={MaalList}
                            bankData={bankData}
                        />,
                    rowExpandable: (record) => true,
                }} pagination={'none'}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto', paddingTop: '10px', width: '90vw' }}>
                <Button style={{ border: '2px solid black' }} block onClick={() => setToggle(!toggle)}>Add New Details</Button>
            </div>
            <div style={{ width: "95vw" }} className={styles.addNewDetails}>
                {toggle &&
                    <>
                        <Collapse items={items} defaultActiveKey={['1']} />

                    </>
                }
            </div>
        </>
    )
}
