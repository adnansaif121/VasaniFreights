"use client"; // This is a client component 👈🏽

import React, { useState } from 'react'
import { Button, Table } from 'antd';
import styles from '../styles/Dashboard.module.css';
import { Tabs } from 'antd';
import DailyEntry from './DailyEntry';
import Party from './Party';
import Transporter from './Transporter';
import NaveenKaka from './NaveenKaka';
import Driver from './Driver';
import NavLabel from './common/NavLabel';
import EmptyPage from './common/EmptyPage';
import AddDetails from './AddDetails';
import Pohch from './Pohch';
import Uvlogistics from './Uvlogistics';

const items = [
    {
        key: '0',
        label: <NavLabel label={'Add New Entry'}/>,
        children: <AddDetails />,
    },
    {
        key: '1',
        label: <NavLabel label={'Daily Entry'}/>,
        children: <DailyEntry />,
    },
    {
        key: '2',
        label: <NavLabel label={'Cash'}/>,
        children: <EmptyPage text={'Cash'}/>,
    },
    {
        key: '3',
        label: <NavLabel label={'Driver'}/>,
        children: <Driver />,
    },
    {
        key: '4',
        label: <NavLabel label={'Pohch'}/>,
        children: <Pohch text={'Pohch'}/>,
    },
    {
        key: '5',
        label: <NavLabel label={'Party'}/>,
        children: <Party/>,
    },
    {
        key: '6',
        label: <NavLabel label={'Transporter'}/>,
        children: <Transporter/>,
    },
    {
        key: '7',
        label: <NavLabel label={'Naveen Kaka'}/>,
        children: <NaveenKaka/>,
    },
    {
        key: '8',
        label: <NavLabel label={'UV Logistics'}/>,
        children: <Uvlogistics text={'UV Logistics'}/>,
    },
    {
        key: '9',
        label: <NavLabel label={'Hare Krishna'}/>,
        children: <EmptyPage text={'Hare Krishna'}/>,
    },
    {
        key: '10',
        label: <NavLabel label={'Report'}/>,
        children: <EmptyPage text={'Report'}/>,
    }
];

export default function Dashboard() {
    const onChange = (key) => {
        console.log(key);
      };
    return (
        <Tabs centered defaultActiveKey="1" items={items} onChange={onChange} style={{    zIndex: "1200",
            backgroundColor: "white"}} />
    )
}
