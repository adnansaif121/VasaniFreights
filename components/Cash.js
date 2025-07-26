import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import DailyTruckCash from './DailyTruckCash';
import DailyTotalCashDetails from './DailyTotalCashDetails';

const Cash = () => {
    const [page, setPage] = useState('Daily Total Cash Details');

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={['Daily Total Cash Details', 'Daily Truck Cash']} onChange={(value) => setPage(value)} block />
            </div>
            {page === "Daily Total Cash Details" &&
                <DailyTotalCashDetails/>
            }
            {page === "Daily Truck Cash" &&
                <DailyTruckCash/>
            }
        </>
    );
};

export default Cash;
