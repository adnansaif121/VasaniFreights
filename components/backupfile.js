// {/* <Form name="Driver | Diesel | Km | Milometer | Avg Details"
//                                         style={{
//                                             maxWidth: 1200,
//                                         }}
//                                         initialValues={{
//                                             remember: true,
//                                         }}
//                                         autoComplete="off"
//                                         form={form1}
//                                         disabled={!driverDetailsEditFlag}
//                                     >
//                                         <Flex gap="middle" align="start" vertical>


//                                             <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//                                                 <table style={{ border: '1px solid black', width: '100%' }}>
//                                                     <tbody>
//                                                         <tr style={{ border: '1px solid black' }}>
//                                                             <th>*</th>
//                                                             <th style={{ width: '20%' }}>Name</th>
//                                                             <th>Contact</th>
//                                                             <th>License Date</th>
//                                                             <th>Cash</th>
//                                                             <th>View</th>
//                                                         </tr>
//                                                         <tr style={{ border: '1px solid black' }}>
//                                                             <th>Driver 1</th>
//                                                             {/* Name */}
//                                                             <td >
//                                                                 <Select
//                                                                     style={{ width: '100%' }}
//                                                                     showSearch
//                                                                     placeholder="Driver"
//                                                                     optionFilterProp="children"
//                                                                     value={driver1 !== null ? driver1.value : null}
//                                                                     onChange={(value, option) => {
//                                                                         console.log(driver1);
//                                                                         if (driver1 !== null && driver1.label !== undefined) {
//                                                                             let __driverList = _driverList;
//                                                                             // Enable Last selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === driver1.label) {
//                                                                                     __driverList[i].disabled = false;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             // Disable Currently Selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }

//                                                                             set_DriverList([...__driverList]);
//                                                                         }
//                                                                         else {
//                                                                             let __driverList = _driverList;
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             set_DriverList([...__driverList]);

//                                                                         }
//                                                                         setDriver1(option);
//                                                                         console.log(option);
//                                                                     }}
//                                                                     // onSearch={onSearch}
//                                                                     filterOption={filterOption}
//                                                                     options={driverList}
//                                                                 // dropdownRender={(menu) => (
//                                                                 //     <>
//                                                                 //         {menu}
//                                                                 //         <Divider
//                                                                 //             style={{
//                                                                 //                 margin: '8px 0',
//                                                                 //             }}
//                                                                 //         />
//                                                                 //         <Space
//                                                                 //             style={{
//                                                                 //                 padding: '0 8px 4px',
//                                                                 //             }}
//                                                                 //         >
//                                                                 //             <Input
//                                                                 //                 placeholder="Please enter item"
//                                                                 //                 value={newDriverName}
//                                                                 //                 onChange={(e) => setNewDriverName(e.target.value)}
//                                                                 //                 onKeyDown={(e) => e.stopPropagation()}
//                                                                 //             />
//                                                                 //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

//                                                                 //             </Button>
//                                                                 //         </Space>
//                                                                 //     </>
//                                                                 // )}
//                                                                 />
//                                                             </td>
//                                                             {/* Contact */}
//                                                             <td>
//                                                                 <Input value={driver1 !== null ? driver1.Contact : null} placeholder='contact' onChange={(e) => {
//                                                                     let obj = driver1;
//                                                                     obj.Contact = e.target.value;
//                                                                     setDriver1(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* License Date */}
//                                                             <td>
//                                                                 <Input value={driver1 !== null ? driver1.LicenseDate : null} placeholder='License Date' type='date' onChange={(e) => {
//                                                                     let obj = driver1;
//                                                                     obj.LicenseDate = e.target.value;
//                                                                     setDriver1(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* Trip Cash */}
//                                                             <td>
//                                                                 <Input value={driver1 !== null ? driver1.TripCash : null} onChange={(e) => {
//                                                                     let _obj = driver1;
//                                                                     _obj.TripCash = e.target.value;
//                                                                     setDriver1(_obj);
//                                                                 }} placeholder='Trip Cash' type='number' />
//                                                             </td>
//                                                             {/* View */}
//                                                             <td>
//                                                                 <Tooltip placement="top" title={'Driver Image'} >
//                                                                     <Button style={{ marginBottom: '22px' }}>View</Button>
//                                                                 </Tooltip>
//                                                             </td>
//                                                         </tr>

//                                                         <tr>
//                                                             <th>Driver 2</th>
//                                                             {/* Name */}
//                                                             <td>
//                                                                 <Select
//                                                                     style={{ width: '100%' }}
//                                                                     showSearch
//                                                                     placeholder="Driver"
//                                                                     optionFilterProp="children"
//                                                                     value={driver2 !== null ? driver2.value : null}
//                                                                     onChange={(value, option) => {
//                                                                         if (driver2 !== null && driver2.label !== undefined) {
//                                                                             let __driverList = _driverList;
//                                                                             // Enable Last selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === driver2.label) {
//                                                                                     __driverList[i].disabled = false;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             // Disable Currently Selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }

//                                                                             set_DriverList([...__driverList]);
//                                                                         }
//                                                                         else {
//                                                                             let __driverList = _driverList;
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             set_DriverList([...__driverList]);

//                                                                         }
//                                                                         setDriver2(option);
//                                                                         console.log(option);
//                                                                     }}
//                                                                     // onSearch={onSearch}
//                                                                     filterOption={filterOption}
//                                                                     options={driverList}
//                                                                 // dropdownRender={(menu) => (
//                                                                 //     <>
//                                                                 //         {menu}
//                                                                 //         <Divider
//                                                                 //             style={{
//                                                                 //                 margin: '8px 0',
//                                                                 //             }}
//                                                                 //         />
//                                                                 //         <Space
//                                                                 //             style={{
//                                                                 //                 padding: '0 8px 4px',
//                                                                 //             }}
//                                                                 //         >
//                                                                 //             {/* <Input
//                                                                 //                 placeholder="Please enter item"
//                                                                 //                 value={newDriverName}
//                                                                 //                 onChange={(e) => setNewDriverName(e.target.value)}
//                                                                 //                 onKeyDown={(e) => e.stopPropagation()}
//                                                                 //             />
//                                                                 //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}> */}

//                                                                 //             {/* </Button> */}

//                                                                 //             <Button onClick={()=>setIsModalOpen(true)}>Add New</Button>
//                                                                 //         </Space>
//                                                                 //     </>
//                                                                 // )}
//                                                                 />
//                                                             </td>
//                                                             {/* Contact */}
//                                                             <td>
//                                                                 <Input value={driver2 !== null ? driver2.Contact : null} placeholder='contact' onChange={(e) => {
//                                                                     let obj = driver2;
//                                                                     driver2.Contact = e.target.value;
//                                                                     setDriver2(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* License Date */}
//                                                             <td>
//                                                                 <Input value={driver2 !== null ? driver2.LicenseDate : null} placeholder='License Date' type='date' onChange={(e) => {
//                                                                     let obj = driver2;
//                                                                     driver2.LicenseDate = e.target.value;
//                                                                     setDriver2(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* Trip Cash */}
//                                                             <td>
//                                                                 <Input value={driver2 !== null ? driver2.TripCash : null} onChange={(e) => {
//                                                                     let _obj = driver2;
//                                                                     _obj.TripCash = e.target.value;
//                                                                     setDriver2(_obj);
//                                                                 }} placeholder='Trip Cash' type='number' />
//                                                             </td>
//                                                             {/* View */}
//                                                             <td>
//                                                                 <Tooltip placement="top" title={'Driver Image'} >
//                                                                     <Button style={{ marginBottom: '22px' }}>View</Button>
//                                                                 </Tooltip>
//                                                             </td>
//                                                         </tr>

//                                                         <tr>
//                                                             <th>Conductor</th>
//                                                             {/* Name */}
//                                                             <td >
//                                                                 <Select
//                                                                     style={{ width: '100%' }}
//                                                                     showSearch
//                                                                     placeholder="Driver"
//                                                                     optionFilterProp="children"
//                                                                     value={conductor !== null ? conductor.value : null}
//                                                                     onChange={(value, option) => {
//                                                                         if (conductor !== null && conductor.label !== undefined) {
//                                                                             let __driverList = _driverList;
//                                                                             // Enable Last selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === conductor.label) {
//                                                                                     __driverList[i].disabled = false;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             // Disable Currently Selected Option:
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }

//                                                                             set_DriverList([...__driverList]);
//                                                                         }
//                                                                         else {
//                                                                             let __driverList = _driverList;
//                                                                             for (let i = 0; i < __driverList.length; i++) {
//                                                                                 if (__driverList[i].label === value) {
//                                                                                     __driverList[i].disabled = true;
//                                                                                     break;
//                                                                                 }
//                                                                             }
//                                                                             set_DriverList([...__driverList]);

//                                                                         }
//                                                                         setConductor(option);
//                                                                         console.log(option);
//                                                                     }}
//                                                                     // onSearch={onSearch}
//                                                                     filterOption={filterOption}
//                                                                     options={driverList}
//                                                                 // dropdownRender={(menu) => (
//                                                                 //     <>
//                                                                 //         {menu}
//                                                                 //         <Divider
//                                                                 //             style={{
//                                                                 //                 margin: '8px 0',
//                                                                 //             }}
//                                                                 //         />
//                                                                 //         <Space
//                                                                 //             style={{
//                                                                 //                 padding: '0 8px 4px',
//                                                                 //             }}
//                                                                 //         >
//                                                                 //             <Input
//                                                                 //                 placeholder="Please enter item"
//                                                                 //                 value={newDriverName}
//                                                                 //                 onChange={(e) => setNewDriverName(e.target.value)}
//                                                                 //                 onKeyDown={(e) => e.stopPropagation()}
//                                                                 //             />
//                                                                 //             <Button type="text" icon={<PlusOutlined />} onClick={(e) => addNewDriver(e)}>

//                                                                 //             </Button>
//                                                                 //         </Space>
//                                                                 //     </>
//                                                                 // )}
//                                                                 />
//                                                             </td>
//                                                             {/* Contact */}
//                                                             <td>
//                                                                 <Input value={conductor !== null ? conductor.Contact : null} placeholder='contact' onChange={(e) => {
//                                                                     let obj = conductor;
//                                                                     obj.Contact = e.target.value;
//                                                                     setConductor(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* License Date */}
//                                                             <td>
//                                                                 <Input value={conductor !== null ? conductor.LicenseDate : null} placeholder='License Date' type='date' onChange={(e) => {
//                                                                     let obj = conductor;
//                                                                     obj.LicenseDate = e.target.value;
//                                                                     setConductor(obj);
//                                                                 }} />
//                                                             </td>
//                                                             {/* Trip Cash */}
//                                                             <td>
//                                                                 <Input value={conductor !== null ? conductor.TripCash : null} onChange={(e) => {
//                                                                     let _obj = conductor;
//                                                                     _obj.TripCash = e.target.value;
//                                                                     setConductor(_obj);
//                                                                 }} placeholder='Trip Cash' type='number' />
//                                                             </td>
//                                                             {/* View */}
//                                                             <td>
//                                                                 <Tooltip placement="top" title={'Driver Image'} >
//                                                                     <Button style={{ marginBottom: '22px' }}>View</Button>
//                                                                 </Tooltip>
//                                                             </td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </table>
//                                             </div>

//                                             {/* KM */}
//                                             <Flex style={{
//                                                 width: '100%',
//                                                 height: 60,
//                                             }} justify={'space-around'} align={'center'}>
//                                                 <Form.Item style={{ width: '20%' }} label="Jana KM">
//                                                     <Input value={janaKm} onChange={(e) => { setJanaKm(e.target.value) }} placeholder='Jana KM' type='number'></Input>
//                                                 </Form.Item>

//                                                 <Form.Item style={{ width: '20%' }} label="Aana KM">
//                                                     <Input value={aanaKm} onChange={(e) => { setAanaKm(e.target.value) }} placeholder='Aana KM' type='number'></Input>
//                                                 </Form.Item>

//                                                 <Form.Item style={{ width: '20%' }} name="Trip KM" label="Trip KM">
//                                                     {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))} onChange={(e) => { setTripKm(e.target.value) }} placeholder='Trip KM' type='number'></Input> */}
//                                                     {Math.abs(parseInt(janaKm) - parseInt(aanaKm))}
//                                                 </Form.Item>
//                                                 <Form.Item style={{ width: '20%' }} label="Milometer">
//                                                     <Input value={milometer} onChange={(e) => { setMilometer(e.target.value) }} placeholder='Milometer'></Input>
//                                                 </Form.Item>
//                                             </Flex>

//                                             {/* Diesel */}
//                                             <Flex style={{
//                                                 width: '100%',
//                                                 height: 60,
//                                             }} justify={'space-around'} align={'center'}>
//                                                 <Form.Item style={{ width: '20%' }} label="Diesel">
//                                                     <Input value={dieselQty} onChange={(e) => setDieselQty(e.target.value)} placeholder='Diesel' type='number'></Input>
//                                                 </Form.Item>

//                                                 <Form.Item style={{ width: '20%' }} label="Pump Name">
//                                                     <Select
//                                                         showSearch
//                                                         placeholder="Pump Name"
//                                                         optionFilterProp="children"
//                                                         onChange={(e) => { setPumpName(e) }}
//                                                         value={pumpName}
//                                                         // onSearch={onSearch}
//                                                         filterOption={filterOption}
//                                                         options={[
//                                                             {
//                                                                 value: 'ABC',
//                                                                 label: 'ABC',
//                                                             },
//                                                             {
//                                                                 value: 'XYZ',
//                                                                 label: 'XYZ',
//                                                             },
//                                                             {
//                                                                 value: 'PQR',
//                                                                 label: 'PQR',
//                                                             },
//                                                         ]}
//                                                     />
//                                                 </Form.Item>

//                                                 <Form.Item style={{ width: '20%' }} name="Average" label="Average">
//                                                     {(Math.abs(parseInt(janaKm) - parseInt(aanaKm)) / ((parseInt(dieselQty) || 1) + (parseInt(midwayDiesel) || 0))).toFixed(2) || 0}
//                                                     {/* <Input value={Math.abs(parseInt(janaKm) - parseInt(aanaKm))/((parseInt(dieselQty)||0) + (parseInt(midwayDiesel)||0))} onChange={(e) => { setAverage(e.target.value) }} placeholder='Average' type='number'></Input> */}
//                                                 </Form.Item>

//                                                 <Form.Item style={{ width: '20%' }} label="Midway Diesel">
//                                                     <Input value={midwayDiesel} onChange={(e) => setMidwayDiesel(e.target.value)} placeholder='Midway Diesel'></Input>
//                                                 </Form.Item>
//                                             </Flex>
//                                         </Flex>
//                                         <Button type="primary" onClick={handleSave}>Save</Button>
//                                     </Form> */}