"use client"; // This is a client component 👈🏽

import React, {useState} from 'react'
import { Button, Table } from 'antd';
import styles from '../styles/Dashboard.module.css'

import DailyEntry from './DailyEntry';

export default function Dashboard() {
    const [nav, setNav] = useState("DailyEntry");
  return (
    <div>
        <div className={styles.navbar}>
            <Button 
                className={`${styles["nav"]} ${nav=='DailyEntry'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('DailyEntry')}>Daily Entry</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Cash'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Cash')}>Cash</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Driver'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Driver')}>Driver</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Pohch'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Pohch')}>Pohch</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Party'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Party')}>Party</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Transporter'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Transporter')}>Transporter</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='NaveenKaka'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('NaveenKaka')}>Naveen Kaka</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='UvLogs'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('UvLogs')}>UV Logistics</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='HareKrishna'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('HareKrishna')}>Hare Krishna</Button>
            <Button 
                className={`${styles["nav"]} ${nav=='Report'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Report')}>Report</Button>
        </div>

        <div style={{position:"absolute", top:"15%", width:'100vw' }}>
            {nav == "DailyEntry" && 
                <DailyEntry></DailyEntry>
            }
        </div>
    </div>
  )
}
