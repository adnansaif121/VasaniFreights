import React from 'react'
import { Input, Button, Table, Collapse, Row, Col, Select, Form, Flex, Radio, Space, Checkbox, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles/DailyEntry.module.css'

export default function DailyEntry() {
    const [toggle, setToggle] = React.useState(false);

    const dataSource = [
        {
            key: '1',
            id: '1',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',
            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },
        {
            key: '2',
            id: '2',
            truckNo: 'MH 04 1234',
            from: 'Pune',
            to: 'Mumbai',
            paid: 'Paid',
            bhejneWaliParty: 'ABC',
            paaneWaliParty: 'XYZ',
            transporter: 'UV Logistics',
            maal: 'Cement',
            qty: '100',

            rate: '1000',
            totalFreight: '100000',
            received: '100000'
        },



    ];

    const columns = [
        {
            title: 'Sr no.',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Truck No.',
            dataIndex: 'truckNo',
            key: 'truckNo',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Paid/To Pay',
            dataIndex: 'paid',
            key: 'paid',
        },
        {
            title: 'Bhejne Wali Party',
            dataIndex: 'bhejneWaliParty',
            key: 'bhejneWaliParty',
        },
        {
            title: 'Paane Wali Party',
            dataIndex: 'paaneWaliParty',
            key: 'paaneWaliParty',
        },
        {
            title: 'Transporter',
            dataIndex: 'transporter',
            key: 'transporter',
        },
        {
            title: 'Maal',
            dataIndex: 'maal',
            key: 'maal',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Total Freight',
            dataIndex: 'totalFreight',
            key: 'totalFreight',
        },
        {
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
        },

    ];

    // Filter `option.label` match the user type `input`
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const items = [
        {
            key: '1',
            label: 'Trip Details',
            children: <>
                <div>
                    <Form
                        name="Trip Details"
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{
                                width: '100%',
                                height: 60,
                                // border: '1px solid #40a9ff',
                            }} justify={'space-around'} align={'center'}>

                                <Form.Item style={{ width: '30%' }} label="Vehicle No."
                                    name="vehicleNo">
                                    <Select
                                        showSearch
                                        placeholder="Vehicle No."
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'MH 04 1234',
                                                label: 'MH 04 1234',
                                            },
                                            {
                                                value: 'MH 04 1235',
                                                label: 'MH 04 1235',
                                            },
                                            {
                                                value: 'MH 04 1236',
                                                label: 'MH 04 1236',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '30%' }}
                                    label="Status"
                                    name="status"
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        // filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'standing',
                                                label: 'Standing',
                                            },
                                            {
                                                value: 'inProcess',
                                                label: 'In Process',
                                            },
                                            {
                                                value: 'running',
                                                label: 'Running',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    // label="MT"
                                    name="mt"
                                >
                                    <Checkbox >MT</Checkbox>
                                </Form.Item>

                            </Flex>

                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="oneunit" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <div style={{ borderRadius: '10px', border: '1px solid green' }}>
                                                    <h3 style={{ padding: '10px' }}>UNIT {name + 1} {console.log(fields)}</h3>
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{ width: "100%", height: 30 }} justify={'space-around'} align='center'>
                                                                <Form.Item style={{ width: '20%' }} label="From"
                                                                    name="From">
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="from"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'mumbai',
                                                                                label: 'Mumbai',
                                                                            },
                                                                            {
                                                                                value: 'pune',
                                                                                label: 'Pune',
                                                                            },
                                                                            {
                                                                                value: 'nagpur',
                                                                                label: 'Nagpur',
                                                                            },
                                                                            {
                                                                                value: 'nashik',
                                                                                label: 'Nashik',
                                                                            },
                                                                            {
                                                                                value: 'aurangabad',
                                                                                label: 'Aurangabad',
                                                                            }
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} label="Bhejne waale"
                                                                    name="bhejneWaale">
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Bhejne waale"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'ABC',
                                                                                label: 'ABC',
                                                                            },
                                                                            {
                                                                                value: 'XYZ',
                                                                                label: 'XYZ',
                                                                            },
                                                                            {
                                                                                value: 'PQR',
                                                                                label: 'PQR',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }}
                                                                    label="To"
                                                                    name="to"
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="To/Unloading Point"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        // filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'mumbai',
                                                                                label: 'Mumbai',
                                                                            },
                                                                            {
                                                                                value: 'pune',
                                                                                label: 'Pune',
                                                                            },
                                                                            {
                                                                                value: 'nagpur',
                                                                                label: 'Nagpur',
                                                                            },
                                                                            {
                                                                                value: 'nashik',
                                                                                label: 'Nashik',
                                                                            },
                                                                            {
                                                                                value: 'aurangabad',
                                                                                label: 'Aurangabad',
                                                                            }
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} label="Paane Waala"
                                                                    name="paanewala">
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Paane waala"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'ABC',
                                                                                label: 'ABC',
                                                                            },
                                                                            {
                                                                                value: 'XYZ',
                                                                                label: 'XYZ',
                                                                            },
                                                                            {
                                                                                value: 'PQR',
                                                                                label: 'PQR',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Item>
                                                                <div></div>
                                                            </Flex>
                                                            <Flex style={{ width: "100%", height: 30 }} justify={'space-around'} align='center'>
                                                                <Form.Item style={{ width: '15%' }} label="Maal"
                                                                    name="Maal">
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Maal"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'Aata',
                                                                                label: 'Aata',
                                                                            },
                                                                            {
                                                                                value: 'Maida',
                                                                                label: 'Maida',
                                                                            },
                                                                            {
                                                                                value: 'Scrape',
                                                                                label: 'Scrape',
                                                                            },
                                                                            {
                                                                                value: 'Loha',
                                                                                label: 'Loha',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Qty"
                                                                    name="qty"
                                                                >
                                                                    <Input></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Rate"
                                                                    name="rate"
                                                                >
                                                                    <Input></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Total Freight"
                                                                    name="totalFreight"
                                                                >
                                                                    <Input></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '15%' }}
                                                                    label="Transporter"
                                                                    name="transporter"
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Transporter Name"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'ABC',
                                                                                label: 'ABC',
                                                                            },
                                                                            {
                                                                                value: 'XYZ',
                                                                                label: 'XYZ',
                                                                            },
                                                                            {
                                                                                value: 'PQR',
                                                                                label: 'PQR',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <MinusCircleOutlined onClick={() => remove(name)} />

                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </div>
                                            </Flex>
                                        ))}
                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add new
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>


                            {/* </Flex> */}

                            <Flex style={{
                                width: '100%',
                                height: 60,
                                // border: '1px solid #40a9ff',
                            }} justify={'space-around'} align={'center'}>

                                <Form.Item style={{ width: '20%', margin: 'auto' }}
                                    label="To Pay/ Paid"
                                    name="To Pay/ Paid"
                                >
                                    <Radio.Group
                                        options={[{ label: 'To Pay', value: 'To Pay' }, { label: 'Paid', value: 'Paid' }]}
                                        // onChange={onChange4}
                                        value={'Paid'}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                            </Flex>
                        </Flex>


                    </Form>
                </div>
            </>,
        },
        // {
        //     key: '2',
        //     label: 'Party And Transporter Details',

        //     children: <>
        //         <div>
        //             <Form name="Party And Transporter Details"
        //                 // labelCol={{
        //                 //     span: 8,
        //                 // }}
        //                 // wrapperCol={{
        //                 //     span: 16,
        //                 // }}
        //                 style={{
        //                     maxWidth: 1200,
        //                 }}
        //                 initialValues={{
        //                     remember: true,
        //                 }}
        //                 // onFinish={onFinish}
        //                 // onFinishFailed={onFinishFailed}
        //                 autoComplete="off">

        //                 <Flex gap="middle" align="start" vertical>

        //                     {/* Transporter Details */}
        //                     <Flex style={{
        //                         width: '100%',
        //                         height: 60,
        //                     }} justify={'space-around'} align={'center'}>

        //                         <Form.Item style={{ width: '20%' }}
        //                             label="Address"
        //                             name="address"
        //                         >
        //                             <Input></Input>
        //                         </Form.Item>

        //                         <Form.Item style={{ width: '20%' }}
        //                             label="Contact"
        //                             name="contact"
        //                         >
        //                             <Input></Input>
        //                         </Form.Item>

        //                     </Flex>
        //                 </Flex>
        //             </Form>
        //         </div>
        //     </>,
        // },
        {
            key: '3',
            label: 'Driver | Diesel | Km | Milometer | Avg Details',
            children: <>
                <div>
                    <Form name="Driver | Diesel | Km | Milometer | Avg Details"
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Flex gap="middle" align="start" vertical>
                            {/* <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <h3>Driver</h3>
                                <h3>Name</h3>
                                <h3>Contact</h3>
                                <h3>License Date</h3>
                                <h3>Trip Cash</h3>
                            </Flex> */}

                            <Form.List name="DriversDetails" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <div style={{ borderRadius: '10px', border: '1px solid green' }}>
                                                    <h3 style={{ padding: '10px' }}>
                                                        {name === 0 ? 'Driver 1' : (name === 1) ? 'Driver 2' : 'Conductor'}
                                                    </h3>
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{ width: "1000px", height: 30 }} justify={'space-around'} align='center'>

                                                                <Form.Item style={{ width: '20%' }}
                                                                    name="Driver1"
                                                                    label='Name'
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Driver"
                                                                        optionFilterProp="children"
                                                                        // onChange={onChange}
                                                                        // onSearch={onSearch}
                                                                        filterOption={filterOption}
                                                                        options={[
                                                                            {
                                                                                value: 'ABC',
                                                                                label: 'ABC',
                                                                            },
                                                                            {
                                                                                value: 'XYZ',
                                                                                label: 'XYZ',
                                                                            },
                                                                            {
                                                                                value: 'PQR',
                                                                                label: 'PQR',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="driver1Contact" label="contact">
                                                                    <Input placeholder='contact' />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="driver1LicenseDate" label="License Date">
                                                                    <Input placeholder='License Date' type='date' />
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="driver1TripCash" label="Cash">
                                                                    <Input placeholder='Trip Cash' type='number' />
                                                                </Form.Item>

                                                                <Tooltip placement="top" title={'Driver Image'} >
                                                                    <Button style={{ marginBottom: '22px' }}>View</Button>
                                                                </Tooltip>
                                                                <MinusCircleOutlined onClick={() => remove(name)} />

                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </div>
                                            </Flex>
                                        ))}
                                        {fields.length < 3 &&
                                            <Form.Item style={{ margin: 'auto' }}>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add new Driver/Conductor
                                                </Button>
                                            </Form.Item>
                                        }
                                    </>
                                )}
                            </Form.List>

                            {/* 1st Driver */}
                            {/* <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>

                                <Form.Item>
                                    <h4>1st Driver</h4>
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    name="Driver1">
                                    <Select
                                        showSearch
                                        placeholder="1st Driver"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver1Contact">
                                    <Input placeholder='contact' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver1LicenseDate">
                                    <Input placeholder='License Date' type='date' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver1TripCash">
                                    <Input placeholder='Trip Cash' type='number' />
                                </Form.Item>
                            </Flex> */}

                            {/* 2nd Driver */}
                            {/* <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>

                                <Form.Item>
                                    <h4>2nd Driver</h4>
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    name="Driver2">
                                    <Select
                                        showSearch
                                        placeholder="2nd Driver"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver2Contact">
                                    <Input placeholder='contact' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver2LicenseDate">
                                    <Input placeholder='License Date' type='date' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="driver2TripCash">
                                    <Input placeholder='Trip Cash' type='number' />
                                </Form.Item>
                            </Flex> */}

                            {/* Conductor */}
                            {/* <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item>
                                    <h4>Conductor</h4>
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }}
                                    name="Conductor">
                                    <Select
                                        showSearch
                                        placeholder="Conductor"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="conductor">
                                    <Input placeholder='contact' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="conductorLicenseDate">
                                    <Input placeholder='License Date' type='date' />
                                </Form.Item>

                                <Form.Item style={{ width: '15%' }} name="conductorTripCash">
                                    <Input placeholder='Trip Cash' type='number' />
                                </Form.Item>
                            </Flex> */}

                            {/* KM */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} name="Jana KM" label="Jana KM">
                                    <Input placeholder='Jana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Aana KM" label="Aana KM">
                                    <Input placeholder='Aana KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Trip KM" label="Trip KM">
                                    <Input placeholder='Trip KM' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Milometer" label="Milometer">
                                    <Input placeholder='Milometer'></Input>
                                </Form.Item>
                            </Flex>

                            {/* Diesel */}
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item style={{ width: '20%' }} name="Diesel Qty" label="Diesel">
                                    <Input placeholder='Diesel' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Pump Name" label="Pump Name">
                                    <Select
                                        showSearch
                                        placeholder="Pump Name"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Average" label="Average">
                                    <Input placeholder='Average' type='number'></Input>
                                </Form.Item>

                                <Form.Item style={{ width: '20%' }} name="Midway diesel" label="Midway Diesel">
                                    <Input placeholder='Midway Diesel'></Input>
                                </Form.Item>
                            </Flex>
                        </Flex>
                    </Form>
                </div>
            </>,
        },
        {
            key: '4',
            label: 'Kaata Parchi Details',
            children: <>
                <div>
                    <Form name='Kaata Parchi Details'
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Flex gap="middle" align="start" vertical>


                            {/* Different unit ka Add Button {Ek unit matlab from, party, to, party, qty, rate, total, maal} */}
                            <Form.List name="oneunit" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex style={{ width: '100%' }} justify={'space-around'} align={'center'}>
                                                <div style={{ borderRadius: '10px', border: '1px solid green' }}>
                                                    <h3 style={{ padding: '10px' }}>Kaata Parchi {name + 1} </h3>
                                                    <div
                                                        key={key}
                                                    >
                                                        <Flex gap="middle" align="start" vertical>

                                                            <Flex style={{
                                                                width: '100%',
                                                                height: 60,
                                                            }} justify={'space-around'} align={'center'}>
                                                                <Form.Item style={{ width: '20%' }} name="Unloading Date" label="Unloading Date">
                                                                    <Input placeholder='Unloading Date' type='date'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="Khaali Gadi Wajan" label="Khaali Gadi wajan">
                                                                    <Input placeholder='Weight' type='number'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="Bhari Gaadi Wajan" label="Bhari Gaadi Wajan">
                                                                    <Input placeholder='Weight' type='number'></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '20%' }} name="Maal Wajan" label="Maal Ka Wajan">
                                                                    <Input placeholder='weight' type='number'></Input>
                                                                </Form.Item>
                                                            </Flex>

                                                            <Flex style={{
                                                                width: '100%',
                                                                height: 60,
                                                            }} justify={'space-around'} align={'center'}>
                                                                <Form.Item style={{ width: '30%' }} name="Ghaata Allowed" label="Ghaate Allowed">
                                                                    <Input placeholder='input' ></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '30%' }} name="Ghaata Actual" label="Ghaate Actual">
                                                                    <Input placeholder='input' ></Input>
                                                                </Form.Item>

                                                                <Form.Item style={{ width: '30%' }} name="Remarks" label="Remarks">
                                                                    <Input placeholder='remarks' ></Input>
                                                                </Form.Item>

                                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                                            </Flex>
                                                        </Flex>



                                                    </div>
                                                </div>
                                            </Flex>
                                        ))}
                                        <Form.Item style={{ margin: 'auto' }}>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add new Kaata Parchi
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Flex>
                    </Form>
                </div>
            </>,
        },
        {
            key: '5',
            label: 'First Payment Details',
            children: <>
                <div>
                    <h3>Trip se kya mila</h3>
                    <Form name='Trip se kya mila'
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{
                                width: '100%',
                                height: 30,
                            }} justify={'space-around'} align={'center'}>
                                <h3>{'Party Name'}</h3>
                                <h4>Amount</h4>
                                <h4>Date</h4>
                                <h4>Bank</h4>
                                <h4>Remarks</h4>

                            </Flex>

                            {/* Pohch */}
                            <Flex style={{
                                width: '100%',
                                height: 30,
                            }} justify={'space-around'} align={'center'}>
                                <h4>Pohch</h4>
                                <Form.Item>
                                    <Input placeholder='amount' type='number' />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='date' type='date' />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        showSearch
                                        placeholder="Bank"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='remarks' />
                                </Form.Item>

                            </Flex>

                            {/* Cash */}
                            <Flex style={{
                                width: '100%',
                                height: 30,
                            }} justify={'space-around'} align={'center'}>
                                <h4>Cash</h4>
                                <Form.Item>
                                    <Input placeholder='amount' type='number' />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='date' type='date' />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        showSearch
                                        placeholder="Bank"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='remarks' />
                                </Form.Item>

                            </Flex>

                            {/* Cheque */}
                            <Flex style={{
                                width: '100%',
                                height: 30,
                            }} justify={'space-around'} align={'center'}>
                                <h4>Cheque</h4>
                                <Form.Item>
                                    <Input placeholder='amount' type='number' />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='date' type='date' />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        showSearch
                                        placeholder="Bank"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='remarks' />
                                </Form.Item>

                            </Flex>

                            {/* Online */}
                            <Flex style={{
                                width: '100%',
                                height: 30,
                            }} justify={'space-around'} align={'center'}>
                                <h4>Online</h4>
                                <Form.Item>
                                    <Input placeholder='amount' type='number' />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='date' type='date' />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        showSearch
                                        placeholder="Bank"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={[
                                            {
                                                value: 'ABC',
                                                label: 'ABC',
                                            },
                                            {
                                                value: 'XYZ',
                                                label: 'XYZ',
                                            },
                                            {
                                                value: 'PQR',
                                                label: 'PQR',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder='remarks' />
                                </Form.Item>

                            </Flex>
                        </Flex>
                    </Form>

                    <h3>Bhada Dalega Kaun</h3>
                    <Form name='Bhada Dalega Kaun'
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            maxWidth: 1200,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Flex gap="middle" align="start" vertical>
                            <Flex style={{
                                width: '100%',
                                height: 60,
                            }} justify={'space-around'} align={'center'}>
                                <Form.Item>
                                    <Radio.Group
                                        options={[{ label: 'Party', value: 'Party' },
                                        { label: 'Transporter', value: 'Transporter' },
                                        { label: 'UV Logistics', value: 'UvLogs' },
                                        { label: 'Naveen Kaka', value: 'NaveenKaka' }
                                        ]}
                                        // onChange={onChange4}
                                        // value={'Party'}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                            </Flex>
                        </Flex>
                    </Form>
                </div>
            </>,
        }
    ];

    return (
        <>

            <Input style={{ width: "20%", marginLeft: '40px' }} type='date' />
            <div style={{ width: "100%", marginLeft: '20px' }}>
                <Table dataSource={dataSource} columns={columns} expandable={{
                    expandedRowRender: (record) => <Collapse accordion items={items} />,
                    rowExpandable: (record) => true,
                }} />
            </div>
            <Button style={{ marginLeft: "50px" }} onClick={() => setToggle(!toggle)}>Add New Details</Button>
            <div className={styles.addNewDetails}>
                {toggle &&
                    <Collapse accordion items={items} />
                }
            </div>
        </>
    )
}
