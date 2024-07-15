import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import PohchHisab from './PohchHisab';
import CashHisab from './CashHisab';
import NaveenKakaParty from './NaveenKakaParty';

const NaveenKaka = () => {
    const [page, setPage] = useState('Party Hisab');

    return (
        <>
            <div style={{ marginTop: '-20px', marginBottom: '5px' }}>
                <Segmented size='large' options={['Party Hisab', 'Pohch Hisab', 'Cash Hisab']} onChange={(value) => setPage(value)} block />
            </div>
            {page === "Party Hisab" &&
                <NaveenKakaParty></NaveenKakaParty>
            }
            {page === "Pohch Hisab" &&
                <PohchHisab></PohchHisab>
            }
            {page === "Cash Hisab" &&
               <CashHisab></CashHisab>

            }
        </>
    );
};

export default NaveenKaka;
