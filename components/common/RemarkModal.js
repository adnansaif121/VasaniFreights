import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

// Utility to recursively collect all remark fields
const collectRemarks = (obj, path = '') => {
    let remarks = [
        { key: 'Kaata Parchi', value: obj?.kaataParchi[0]?.remarks || '(empty)' },
        { key: 'First Pay Pohch', value: obj?.firstPayment[0]?.pohchRemarks || '(empty)' },
        { key: 'First Pay Cash', value: obj?.firstPayment[0]?.cashRemarks || '(empty)' },
        { key: 'First Pay Online', value: obj?.firstPayment[0]?.onlineRemarks || '(empty)' },
        { key: 'First Pay Cheque', value: obj?.firstPayment[0]?.chequeRemarks || '(empty)' },
    ];
    let furtherPayments = obj?.tripDetails[0]?.furtherPayments?.FurtherPayments || [];
    furtherPayments.forEach((payment, index) => {
        remarks.push({ key: `Further Pay ${index + 1}`, value: payment.remarks || '(empty)' });
    });
    remarks.push({ key: 'Extra Amount Remark', value: obj?.tripDetails[0]?.extraAmtRemark || '(empty)' });

    // if (Array.isArray(obj)) {
    //     obj.forEach((item, idx) => {
    //         remarks = remarks.concat(collectRemarks(item, `${path}[${idx}]`));
    //     });
    // } else if (typeof obj === 'object' && obj !== null) {
    //     Object.entries(obj).forEach(([key, value]) => {
    //         if (key.toLowerCase().includes('remark')) {
    //             remarks.push({ key: path ? `${path}.${key}` : key, value });
    //         }
    //         remarks = remarks.concat(collectRemarks(value, path ? `${path}.${key}` : key));
    //     });
    // }

    return remarks;
};

// The modal itself
const RemarkModal = ({ open, onCancel, remarkData, title = "All Remarks", width = '70vw' }) => (
    <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        title={title}
        width={width}
    >
        {(!remarkData || remarkData.length === 0) ? (
            <div>No remarks found.</div>
        ) : (
            <ul style={{ fontSize: '20px', lineHeight: '2' }}>
                {remarkData.map((item, idx) => (
                    <li key={idx}>
                        <b>{item.key.replace(/\[0\]\./g, ' ').replace(/remark(s)?/gi, '').trim()}:</b> {item.value ? item.value : <i>(empty)</i>}
                    </li>
                ))}
            </ul>
        )}
    </Modal>
);

// The button that opens the modal and handles remark extraction
export const RemarkButton = ({ record }) => {
    const [open, setOpen] = useState(false);
    const [remarkData, setRemarkData] = useState([]);

    const handleOpen = () => {
        let remarks = collectRemarks(record);
        // Sort: remarks with 'tripDetails' in key go last
        remarks.sort((a, b) => {
            const aHasTrip = a.key.includes('tripDetails');
            const bHasTrip = b.key.includes('tripDetails');
            if (aHasTrip === bHasTrip) return 0;
            return aHasTrip ? 1 : -1;
        });
        setRemarkData(remarks);
        setOpen(true);
    };

    return (
        <>
            <Button type="link" onClick={handleOpen}>
                <FileTextOutlined style={{ fontSize: 'larger' }} />
            </Button>
            <RemarkModal
                open={open}
                onCancel={() => setOpen(false)}
                remarkData={remarkData}
            />
        </>
    );
};

export default RemarkModal;