"use client"; // This is a client component 👈🏽

import React, {useState} from 'react'
import { Button, Table } from 'antd';
import styles from '../styles/Dashboard.module.css'

import DailyEntry from './DailyEntry';
import Party from './Party';
import Transporter from './Transporter';
import NaveenKaka from './NaveenKaka';
import Driver from './Driver';

export default function Dashboard() {
    const [nav, setNav] = useState("DailyEntry");
  return (
    <div>
        <div className={styles.navbar}>
            <div  
                className={`${styles["nav"]} ${nav=='DailyEntry'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('DailyEntry')}>Daily Entry</div>
            <div 
                className={`${styles["nav"]} ${nav=='Cash'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Cash')}>Cash</div>
            <div 
                className={`${styles["nav"]} ${nav=='Driver'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Driver')}>Driver</div>
            <div 
                className={`${styles["nav"]} ${nav=='Pohch'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Pohch')}>Pohch</div>
            <div
                className={`${styles["nav"]} ${nav=='Party'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Party')}>Party</div>
            <div 
                className={`${styles["nav"]} ${nav=='Transporter'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Transporter')}>Transporter</div>
            <div 
                className={`${styles["nav"]} ${nav=='NaveenKaka'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('NaveenKaka')}>Naveen Kaka</div>
            <div 
                className={`${styles["nav"]} ${nav=='UvLogs'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('UvLogs')}>UV Logistics</div>
            <div
                className={`${styles["nav"]} ${nav=='HareKrishna'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('HareKrishna')}>Hare Krishna</div>
            <div 
                className={`${styles["nav"]} ${nav=='Report'?styles["activeNav"]:''}`} 
                onClick={()=>setNav('Report')}>Report</div>
        </div>

        <div style={{position:"absolute", top:"15%", width:'100vw' }}>
            {nav == "DailyEntry" && 
                <DailyEntry></DailyEntry>
            }
            {nav == "Cash" && 
                <div>Cash</div>
            }
            {nav == "Driver" && 
                <Driver></Driver>
            }
            {nav == "Pohch" && 
                <div>Pohch</div>
            }
            {nav == "Party" && 
                <Party></Party>
            }
            {nav == "Transporter" && 
                <></>
                // <Transporter></Transporter>
            }
            {nav == "NaveenKaka" && 
                <NaveenKaka></NaveenKaka>
            }
            {nav == "UvLogs" && 
                <div>UV Logistics</div>
            }
            {nav == "HareKrishna" && 
                <div>Hare Krishna</div>
            }
            {nav == "Report" && 
                <div>Report</div>
            }

        </div>
    </div>
  )
}
