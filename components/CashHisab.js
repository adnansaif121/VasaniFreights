import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { getDatabase, ref, set, onValue, push } from "firebase/database";
const CashHisab = () => {
    const [cashPaid, setCashPaid] = useState([]);
    const [cashReceived, setCashReceived] = useState([]);
    const [receivedDate, setReceivedDate] = useState(null);
    const [receivedAmount, setReceivedAmount] = useState(null);
    const [receivedRemark, setReceivedRemark] = useState(null);
    const [paidDate, setPaidDate] = useState(null);
    const [paidAmount, setPaidAmount] = useState(null);
    const [paidRemark, setPaidRemark] = useState(null);
    const [totalAmtPaid, setTotalAmtPaid] = useState(0);
    const [totalAmtReceived, setTotalAmtReceived] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        // Get data from database
        
        const hisabEntryRef = ref(db, 'NaveenKakaHisabEntry/cashPaid/');
        onValue(hisabEntryRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'NaveenKakaHisabEntry');
            // updateStarCount(postElement, data);
            let entries = []; // Data Source
            let _totalPaid = 0;
            if(data){
                Object.values(data).map((entry, i) => {
                    entries.push(entry);
                    _totalPaid += parseInt(entry.amount);
                })
                setCashPaid([...entries]);
                setTotalAmtPaid(_totalPaid);
            }
        });

        const cashReceivedRef = ref(db, 'NaveenKakaHisabEntry/cashReceived');
        onValue(cashReceivedRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'cash Received');
            let entries = [];
            let _totalReceived = 0;
            if(data){
                Object.values(data).map((entry, i) => {
                    entries.push(entry);
                    _totalReceived += parseInt(entry.amount);
                })
                setCashReceived([...entries]);  
                setTotalAmtReceived(_totalReceived);
            }
        })

    }, []);

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function saveCashReceived () {
        const db = getDatabase();
        let id = guidGenerator();
        const cashReceivedRef = ref(db, 'NaveenKakaHisabEntry/cashReceived/'+id);
        set(cashReceivedRef, {
            date: receivedDate, 
            amount: receivedAmount, 
            remark: receivedRemark
        }).then(() => {
            let _cashReceived = cashReceived;
            _cashReceived.push({
                date: receivedDate, 
                amount: receivedAmount, 
                remark: receivedRemark
            })
            setCashReceived([..._cashReceived]);
            setTotalAmtReceived(totalAmtReceived + receivedAmount);
        })

    }

    function saveCashPaid () {
        const db = getDatabase();
        let id = guidGenerator();
        const hisabEntryRef = ref(db, 'NaveenKakaHisabEntry/cashPaid/' + id);
        set(hisabEntryRef, {
            date: paidDate, 
            amount: paidAmount, 
            remark: paidRemark
        }).then(() => {
            let _cashPaid = cashPaid;
            _cashPaid.push({
                date: paidDate, 
                amount: paidAmount, 
                remark: paidRemark
            })
            setCashPaid([..._cashPaid]);
            setTotalAmtPaid(totalAmtPaid + paidAmount);
        })
    }
    return (
        <div>
            <Row>
                <Col span={12}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Row>   
                                <Col>
                                    <Input onChange={(e) => setReceivedDate(e.target.value)} type='date' placeholder='date'></Input>
                                </Col>
                                <Col>
                                    <Input onChange={(e) => setReceivedAmount(e.target.value)} placeholder='Amount'></Input>
                                </Col>
                                <Col>
                                    <Input onChange={(e) => setReceivedRemark(e.target.value)} placeholder='remark'></Input>
                                </Col>
                                
                            </Row>
                                    <Button onClick={saveCashReceived}>Add New Entry</Button>
                        </div>

                    <div style={{ background: 'white', height: '75vh', borderRadius: '10px', margin: '2px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', paddingTop: "10px" }}>
                            <h3>Cash Received</h3>
                        </div>
                        <table style={{width:'100%',border: '1px solid black'}}>
                            <tr style={{border: '1px solid black'}}>
                                <th style={{border: '1px solid black'}}>Date</th>
                                <th style={{border: '1px solid black'}}>Amount</th>
                                <th style={{border: '1px solid black'}}>Remark</th>
                                <th></th>
                            </tr>
                            {cashReceived && cashReceived.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{textAlign: 'center'}}>
                                            {item.date}
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {item.amount}
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {item.remark}
                                        </td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td></td>
                                <td  style={{border: '1px solid black'}}>Total Received Amount: {totalAmtReceived}</td>
                                <td></td>
                            </tr>
                        </table>
                        
                        {/* <h3>Total Amount: {}</h3> */}
                    </div>
                       
                </Col>
                <Col span={12}>

                <div>
                                <Row>
                                    <Col>
                                        <Input onChange={(e) => setPaidDate(e.target.value)} type="date" placeholder='date'></Input>
                                    </Col>
                                    <Col>
                                        <Input onChange={(e) => setPaidAmount(e.target.value)} type='number' placeholder='Amount'></Input>
                                    </Col>
                                    <Col>
                                        <Input onChange={(e) => setPaidRemark(e.target.value)} placeholder='remark'></Input>
                                    </Col>
                                    <Col>
                                        <Button onClick={saveCashPaid}>Add New Entry</Button>
                                    </Col>
                                </Row>
                            </div>
                            
                    <div style={{ background: 'white', height: '75vh', borderRadius: '10px', margin: '2px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', paddingTop: "10px" }}>
                            <h3>Cash Paid</h3>
                        </div>
                        <table style={{width:'100%', border: '1px solid black'}}>
                            <tr>
                                <th style={{border: '1px solid black'}}>Date</th>
                                <th style={{border: '1px solid black'}}>Amount</th>
                                <th style={{border: '1px solid black'}}>Remark</th>
                            </tr>
                            {cashPaid && cashPaid.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{textAlign: 'center'}}>
                                            {item.date}
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {item.amount}
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {item.remark}
                                        </td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td></td>
                                <td style={{border: '1px solid black'}}>Total Paid Amount: {totalAmtPaid}</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>

                            
                </Col>
            </Row>
        </div>
    )
}

export default CashHisab;