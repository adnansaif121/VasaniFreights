import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import TransporterTrips from './TransporterTrips';
import TransporterParty from './TransporterParty';

const Transporter = () => {
    const [page, setPage] = useState('Payment Received Details');

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={['No. of trips detail', 'Payment Received Details']} onChange={(value) => setPage(value)} block />
            </div>
            {page === "No. of trips detail" &&
                <TransporterTrips></TransporterTrips>
            }
            {page === "Payment Received Details" &&
                <TransporterParty></TransporterParty>
            }
            
        </>
    );
};

export default Transporter;
