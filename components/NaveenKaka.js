import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import PohchHisab from './PohchHisab';
import CashHisab from './CashHisab';
import NaveenKakaParty from './NaveenKakaParty';

const NaveenKaka = ({dailyEntryData, bankData, setBankData, partyData, transporterData}) => {
    const [page, setPage] = useState('Party Hisab');

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={['Party Hisab', 'Pohch Hisab', 'Cash Hisab']} onChange={(value) => setPage(value)} block />
            </div>
            {page === "Party Hisab" &&
                <NaveenKakaParty dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} partyData={partyData} transporterData={transporterData} />
            }
            {page === "Pohch Hisab" &&
                <PohchHisab dailyEntryData={dailyEntryData} bankData={bankData} setBankData={setBankData} />
            }
            {page === "Cash Hisab" &&
               <CashHisab></CashHisab>

            }
        </>
    );
};

export default NaveenKaka;
