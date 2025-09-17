import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import DailyTruckCash from './DailyTruckCash';
import DailyTotalCashDetails from './DailyTotalCashDetails';
import CashDetailRecords from './CashDetailRecords';
import OpenCloseBalanceRecords from './OpenCloseBalanceRecords';
import { getDatabase, ref, set, onValue, push, query, orderByKey, limitToLast, limitToFirst, endAt, startAt } from "firebase/database";

const Cash = ({dailyEntryData, vehicleData}) => {
    const [page, setPage] = useState('Daily Truck Cash');
    const [dailyTruckCashIncome, setDailyTruckCashIncome] = useState(0);
    const [dailyTruckCashExpense, setDailyTruckCashExpense] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [yesterdayData, setYesterdayData] = useState({});
    const db = getDatabase();

    useEffect(() => {
        fetchEntries();

        // Fetch the data from yesterday if no data exists for today
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        const yesterdayCashRef = ref(db, 'cash/' + yesterdayString);
        let yesterdayData = null;
        onValue(yesterdayCashRef, (yesterdaySnapshot) => {
            yesterdayData = yesterdaySnapshot.val();
            setYesterdayData(yesterdayData || null);
        });

    }, []);

    const fetchEntries = (direction = 'next', refKey = null) => {
        // setIsLoading(true);
        // const db = getDatabase();
        // let q;
        // if (direction === 'next' && refKey) {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), endAt(refKey), limitToLast(50));
        // } else if (direction === 'prev' && refKey) {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), startAt(refKey), limitToFirst(50));
        // } else {
        //     q = query(ref(db, 'dailyEntry/'), orderByKey(), limitToLast(50));
        // }
        // onValue(q, (snapshot) => {
        // }, { onlyOnce: true });
        const data = dailyEntryData;
        console.log('Fetched Data:', data);
        let ds = [];
        let keys = [];
        if (data) {
            Object.keys(data).forEach((key, i) => {
                keys.push(key);
                ds.push({
                    key: key,
                    ...data[key],
                });
            });
        }
        console.log('Data Source:', ds);
        setDataSource(ds);
        calDailyTruckCashIncomeExpense(ds);
    };

    const calDailyTruckCashIncomeExpense = (data) => {
        let income = 0;
        let expense = 0;
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        data.forEach((entry) => {
            
            if (entry.date === todayString) {
                console.log('Processing Entry:', entry, entry.date);

                income += entry?.firstPayment?.cashAmount === "" ? 0 : parseFloat(entry?.firstPayment[0]?.cashAmount) || 0;
                expense += entry?.driver1?.TripCash === "" ? 0 : parseFloat(entry?.driver1?.TripCash) || 0;
            }
        });


        console.log('Income:', income);
        console.log('Expense:', expense);
        setDailyTruckCashIncome(income);
        setDailyTruckCashExpense(expense);
    }

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={[ 'Daily Truck Cash','DAILY INCOME & EXPENSES', 'TOTAL INCOME & EXPENSES', 'Open/Close Balance Records']} onChange={(value) => setPage(value)} block />
            </div>
             {page === "Daily Truck Cash" &&
                <DailyTruckCash 
                    dailyEntryData={dailyEntryData}
                    dailyTruckCashIncome={dailyTruckCashIncome}
                    dailyTruckCashExpense={dailyTruckCashExpense}
                />
            }
            {page === "DAILY INCOME & EXPENSES" &&
                <DailyTotalCashDetails
                    vehicleData={vehicleData}
                    dailyEntryData={dailyEntryData}
                    dailyTruckCashIncome={dailyTruckCashIncome}
                    dailyTruckCashExpense={dailyTruckCashExpense}
                    dataSource={dataSource}
                    fetchEntries={fetchEntries}
                    yesterdayData={yesterdayData}
                />
            }
            {page === "TOTAL INCOME & EXPENSES" &&
                <CashDetailRecords dailyEntryData={dailyEntryData}/>
            }
            {page === "Open/Close Balance Records" &&
                <OpenCloseBalanceRecords/>
            }
        </>
    );
};

export default Cash;
