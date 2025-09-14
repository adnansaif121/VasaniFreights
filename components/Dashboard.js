"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react'
import { Button, Table, Form } from 'antd';
import styles from '../styles/Dashboard.module.css';
import { Tabs } from 'antd';
import DailyEntry from './DailyEntry';
import Party from './Party';
import Transporter from './Transporter';
import NaveenKaka from './NaveenKaka';
import Driver from './Driver';
import NavLabel from './common/NavLabel';
import EmptyPage from './common/EmptyPage';
import AddDetails from './AddDetails';
import Pohch from './Pohch';
import Uvlogistics from './Uvlogistics';
import HareKrishna from './HareKrishna';
import Cheque from './Cheque';
import Cash from './Cash';
import ManageItems from './ManageItems';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";

export default function Dashboard() {
    const [driverForm] = Form.useForm();
    const [createPartyForm] = Form.useForm();
    // Drivers List
    const [driverList, setDriverList] = useState([]);
    const [newDriverName, setNewDriverName] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [Locations, setLocations] = useState([]);
    // Maal List
    const [MaalList, setMaalList] = useState([]);
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

     const [partyList, setPartyList] = useState([[], [], [], [], [], []]);

    const [lastKey, setLastKey] = useState(null);
    const [firstKey, setFirstKey] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [pumpList, setPumpList] = useState([]);
    const [dailyEntryData, setDailyEntryData] = useState(null);
    const [partyData, setPartyData] = useState(null);
    const [transporterData, setTransporterData] = useState(null);
    const [driverData, setDriverData] = useState(null);
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
            setPartyData(data);
            // updateStarCount(postElement, data);
            let parties = []; // Data Source
            if (data !== null) {
                Object.entries(data).map(([key, party], i) => {
                    parties.push({ ...party, id: key });
                })
            }
            setPartyListAll([...parties]);
        });

        const transporterRef = ref(db, 'transporters/');
        onValue(transporterRef, (snapshot) => {
            const data = snapshot.val();
            setTransporterData(data);
            // updateStarCount(postElement, data);
            let transporters = []; // Data Source
            if (data) {
                Object.entries(data).map(([key, transporter], i) => {
                    transporters.push({ ...transporter, id: key });
                })
            }
            console.log(transporters);
            setTransporterList([...transporters]);
        });

        const driversRef = ref(db, 'drivers/');
        onValue(driversRef, (snapshot) => {
            const data = snapshot.val();
            setDriverData(data);
            // updateStarCount(postElement, data);
            let drivers = []; // Data Source
            if (data) {
                Object.entries(data).map(([key, driver], i) => {
                    drivers.push({ ...driver, id: key });
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
            if (data) {
                setVehicleData(data);
            }
        })

        const pumpDataRef = ref(db, 'pumps/');
        onValue(pumpDataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPumpList(data);
            }
        })
    }, [])

    useEffect(() => {
        fetchEntries();
    }, [])

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

    const addPartyInPartyList = (value, index) => {
        let pl = partyList;
        let party1 = (index === 'party1') ? value : pl[0][0]?.label;
        let party2 = (index === 'party2') ? value : pl[0][1]?.label;
        let transporter = (index === 'transporter') ? value : pl[0][2]?.label;
        pl[0] = [{ label: party1, value: party1 }, { label: party2, value: party2 }, { label: transporter, value: transporter }];
        setPartyList([...pl]);
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
            createPartyForm.resetFields();
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
        }).then(() => {
            alert("Transporter Added Successfully!!");
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
        }).then(() => {
            alert(`Maal ${_newMaal} added successfully`);
        })
    }

    const addNewLocation = (e) => {
        e.preventDefault();
        if (newLocation.trim() === '') {
            alert('Please enter location to add location in the list. Field is empty');
            return;
        }

        for (let i = 0; i < Locations.length; i++) {
            if (newLocation.toUpperCase() === Locations[i].value.toUpperCase()) {
                alert(`Location with name ${Locations[i].value} already exists`);
                return;
            }
        }
        setLocations([...Locations, { value: newLocation, label: newLocation }]);
        setNewLocation('');
        // Create a new party reference with an auto-generated id
        const db = getDatabase();
        const locationsRef = ref(db, 'locations');
        const newLocationRef = push(locationsRef);
        set(newLocationRef, {
            value: newLocation,
            label: newLocation,
        }).then(() => {
            alert("Location Added Successfully!!");
            setNewLocation('');
            return;
        }).catch((error) => {
            console.error("Error adding location:", error);
            alert("Error adding location: " + error.message);
        });
    }

    const addNewBank = (e) => {
        e.preventDefault();
        if (newBank.trim() === '') {
            alert('Please enter bank name to add bank in the list. Field is empty');
            return;
        }
        // Check for duplicates
        for (let i = 0; i < bankData.length; i++) {
            if (newBank.toUpperCase() === bankData[i].value.toUpperCase()) {
                alert(`Bank with name ${bankData[i].value} already exists`);
                return;
            }
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
            driverForm.resetFields();
            return;
        });
    }

    const addNewVehicle = (e) => {
        e.preventDefault();
        if (newVehicleNo.trim() === '') {
            alert('Please enter vehicle no. to add vehicle in the list. Field is empty');
            return;
        }
        for (let i = 0; i < vehicleData.length; i++) {
            if (newVehicleNo.toUpperCase() === vehicleData[i].value.toUpperCase()) {
                alert(`Vehicle with no. ${vehicleData[i].value} already exists`);
                return;
            }
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
        }).then(() => {
            alert(`Vehicle ${newVehicleNo} added successfully`);
        })
        setNewVehicleNo('');

    }

    const addNewPump = (e, newPumpName) => {
        e.preventDefault();
        if (newPumpName.trim() === '') {
            alert('Please enter pump name to add pump in the list. Field is empty');
            return;
        }
        for (let i = 0; i < pumpList.length; i++) {
            if (newPumpName.toUpperCase() === pumpList[i].value.toUpperCase()) {
                alert(`Pump with name ${pumpList[i].value} already exists`);
                return;
            }
        }
        let key = pumpList.length;
        setPumpList([...pumpList, { pumpName: newPumpName, value: newPumpName, label: newPumpName, key: key }]);
        const db = getDatabase();
        const pumpRef = ref(db, 'pumps/' + key);
        // const newBankRef = push(bankRef);
        set(pumpRef, {
            pumpName: newPumpName,
            key: key,
            label: newPumpName,
            value: newPumpName
        }).then(() => {
            alert(`pump ${newPumpName} added successfully`)
        })
        
    }

    const fetchEntries = (direction = 'next', refKey = null) => {
        setIsLoading(true);
        const db = getDatabase();
        let q = ref(db, 'dailyEntry/');
        // if (direction === 'next' && refKey) {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), endAt(refKey), limitToLast(20));
        // } else if (direction === 'prev' && refKey) {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), startAt(refKey), limitToFirst(20));
        // } else {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), limitToLast(20));
        // }
        onValue(q, (snapshot) => {
            const data = snapshot.val();
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
                                (data[key].tripDetails[j].furtherPaymentTotal === undefined ? 0 : data[key].tripDetails[j].furtherPaymentTotal) +
                                (data[key].tripDetails[j].extraAmount === undefined ? 0 : data[key].tripDetails[j].extraAmount) + 
                                (data[key].tripDetails[j].advance === undefined ? 0 : data[key].tripDetails[j].advance) +
                                (data[key].tripDetails[j].commission === undefined ? 0 : data[key].tripDetails[j].commission) +
                                (data[key].tripDetails[j].ghataWajan === undefined ? 0 : data[key].tripDetails[j].ghataWajan) +
                                (data[key].tripDetails[j].tds === undefined ? 0 : data[key].tripDetails[j].tds) +
                                (data[key].tripDetails[j].khotiKharabi === undefined ? 0 : data[key].tripDetails[j].khotiKharabi)
                              
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
                                lrNumber: data[key]?.lrNumber || null,
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
                                totalFreight: parseFloat(data[key]?.tripDetails[j]?.totalFreight).toFixed(2) || null,
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
            setDailyEntryData(data);
        });
    };

    const applyDateSort = (ds) => {
        ds.sort(function (a, b) {
            if (a.dateToSort === b.dateToSort) {
                return new Date(parseInt(b.timestamp)) - new Date(parseInt(a.timestamp));
            }
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateToSort) - new Date(a.dateToSort);
        });
        setDataSource(ds);
        setCompleteDataSource(ds);
    }

    const items = [
        {
            key: '11',
            label: <NavLabel label={'Manage Items'} />,
            children: <ManageItems />,
        },
        {
            key: '0',
            label: <NavLabel label={'Add New Entry'} />,
            children: <AddDetails 
                Locations={Locations}
                vehicleData={vehicleData}
                pumpList={pumpList}
                bankData={bankData}
                partyListAll={partyListAll}
                transporterList={transporterList}
                driverList={driverList}
                setDriverList={setDriverList}
                MaalList={MaalList}
                addNewPump={addNewPump}
                addNewVehicle={addNewVehicle}
                addNewDriver={addNewDriver}
                addNewBank={addNewBank}
                addNewLocation={addNewLocation}
                addNewMaal={addNewMaal}
                addNewTransporter={addNewTransporter}
                addNewParty={addNewParty}
                firstKey={firstKey}
                lastKey={lastKey}
                isLoading={isLoading}
                dataSource={dataSource}
                completeDataSource={completeDataSource}
                addPartyInPartyList={addPartyInPartyList}
                partyList={partyList}
                newTransporter={newTransporter}
                setNewTransporter={setNewTransporter}
                newLocation={newLocation}
                setNewLocation={setNewLocation}
                partyModal={partyModal}
                setPartyModal={setPartyModal}
                createPartyForm={createPartyForm}
                driverForm={driverForm}
                newBank={newBank}
                setNewBank={setNewBank}
                newMaal={newMaal}
                setNewMaal={setNewMaal}
                newVehicleNo={newVehicleNo}
                setNewVehicleNo={setNewVehicleNo}
                driverModal={driverModal}
                setDriverModal={setDriverModal}
            />,
        },
        {
            key: '1',
            label: <NavLabel label={'Daily Entry'} />,
            children: <DailyEntry
                Locations={Locations}
                vehicleData={vehicleData}
                pumpList={pumpList}
                bankData={bankData}
                partyListAll={partyListAll}
                transporterList={transporterList}
                driverList={driverList}
                MaalList={MaalList}
                addNewPump={addNewPump}
                addNewVehicle={addNewVehicle}
                addNewDriver={addNewDriver}
                addNewBank={addNewBank}
                addNewLocation={addNewLocation}
                addNewMaal={addNewMaal}
                addNewTransporter={addNewTransporter}
                addNewParty={addNewParty}
                firstKey={firstKey}
                lastKey={lastKey}
                currentPage={currentPage}
                isLoading={isLoading}
                dataSource={dataSource}
                setDataSource={setDataSource}
                completeDataSource={completeDataSource}
                handleTableChange={handleTableChange}
               addPartyInPartyList={addPartyInPartyList}
                partyList={partyList}
                setPartyList={setPartyList}
                newTransporter={newTransporter}
                setNewTransporter={setNewTransporter}
                newLocation={newLocation}
                setNewLocation={setNewLocation}
                partyModal={partyModal}
                setPartyModal={setPartyModal}
                createPartyForm={createPartyForm}
                driverForm={driverForm}
                newBank={newBank}
                setNewBank={setNewBank}
                newMaal={newMaal}
                setNewMaal={setNewMaal}
                newVehicleNo={newVehicleNo}
                setNewVehicleNo={setNewVehicleNo}
                driverModal={driverModal}
                setDriverModal={setDriverModal}
            />,
        },
        {
            key: '2',
            label: <NavLabel label={'Expenses'} />,
            children: <Cash text={'Cash'} dailyEntryData={dailyEntryData}/>,
        },
        {
            key: '3',
            label: <NavLabel label={'Cheque'} />,
            children: <Cheque text={'Cheque'} dailyEntryData={dailyEntryData}/>,
        },
        {
            key: '5',
            label: <NavLabel label={'Pohch'} />,
            children: <Pohch text={'Pohch'} dailyEntryData={dailyEntryData}/>,
        },
        {
            key: '6',
            label: <NavLabel label={'Party'} />,
            children: <Party dailyEntryData={dailyEntryData} partyData={partyData} bankData={bankData} setBankData={setBankData} />,
        },
        {
            key: '7',
            label: <NavLabel label={'Transporter'} />,
            children: <Transporter dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} />,
        },
        {
            key: '8',
            label: <NavLabel label={'Naveen Kaka'} />,
            children: <NaveenKaka dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData}/>,
        },
        {
            key: '9',
            label: <NavLabel label={'UV Logistics'} />,
            children: <Uvlogistics text={'UV Logistics'} dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} Locations={Locations} setLocations={setLocations} />,
        },
        {
            key: '10',
            label: <NavLabel label={'Hare Krishna'} />,
            children: <HareKrishna text={'Hare Krishna'} dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} />,
        },
        {
            key: '4',
            label: <NavLabel label={'Driver'} />,
            children: <Driver dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} driverList={driverList} driverData={driverData} />,
        }

    ];

    const onChange = (key) => {
        console.log(key);
    };
    return (
        <Tabs centered defaultActiveKey="1" items={items} onChange={onChange} style={{
            zIndex: "1200",
            backgroundColor: "white"
        }} />
    )
}
