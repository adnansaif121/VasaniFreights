import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import TransporterTrips from './TransporterTrips';
import TransporterParty from './TransporterParty';

const Transporter = ({dailyEntryData, bankData, setBankData, partyData, transporterData}) => {
    const [page, setPage] = useState('Payment Received Details');

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={[ 'Payment Received Details','No. of trips detail']} onChange={(value) => setPage(value)} block />
            </div>
            {page === "No. of trips detail" &&
                <TransporterTrips dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData}></TransporterTrips>
            }
            {page === "Payment Received Details" &&
                <TransporterParty dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} />
            }
            
        </>
    );
};

export default Transporter;
