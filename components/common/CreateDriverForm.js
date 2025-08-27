import {Select, Upload, Modal, Button, Form, Input, Row, Col } from "antd";
import {InboxOutlined} from "@ant-design/icons";
const CreateDriverForm = ({isDriverModalOpen, handleDriverOk, handleDriverCancel, driverForm, driverModal, setDriverModal}) => {
    return (
         <Modal title="Create Driver" open={isDriverModalOpen} onOk={handleDriverOk} onCancel={handleDriverCancel}
                        footer={[
                            <Button key="back" onClick={handleDriverCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleDriverOk}>
                                Submit
                            </Button>
                        ]}
                    >
                        <Form name="DriverForm" layout="vertical" form={driverForm}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter user name',
                                            },
                                        ]}
                                    >
                                        <Input onChange={(e) => {
                                            setDriverModal({
                                                ...driverModal,
                                                label: e.target.value,
                                                value: e.target.value,
                                            });
                                        }} placeholder="Please enter user name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="DriverLocation"
                                        label="Driver Location"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter url',
                                            },
                                        ]}
                                    >
                                        <Input
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Driver Location"
                                            onChange={(e) => {
                                                setDriverModal({
                                                    ...driverModal,
                                                    location: e.target.value,
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="LicenseDate"
                                        label="License Date"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select an owner',
                                            },
                                        ]}
                                    >
                                        <Input
                                            style={{
                                                width: '100%',
                                            }}
                                            type='date'
                                            placeholder="License Date"
                                            onChange={(e) => {
                                                setDriverModal({
                                                    ...driverModal,
                                                    LicenseDate: e.target.value,
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
        
                                <Col span={8}>
                                    <Form.Item
                                        label="License type"
                                        name="License type"
                                    >
                                        <Select
                                            placeholder="License type"
                                            optionFilterProp="children"
                                            onChange={(value) => {
                                                setDriverModal({
                                                    ...driverModal,
                                                    LicenseType: value,
                                                });
                                            }}
                                            options={[
                                                {
                                                    value: 'Heavy Vehicle',
                                                    label: 'Heavy Vehicle',
                                                },
                                                {
                                                    value: 'Light Vehicle',
                                                    label: 'Light Vehicle',
                                                }
                                            ]}
                                        />
                                    </Form.Item>
        
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="ContactNumber"
                                        label="Contact Number"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Provide Contact Number',
                                            },
                                        ]}
                                    >
                                        <Input
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Contact Number"
                                            onChange={(e) => {
                                                setDriverModal({
                                                    ...driverModal,
                                                    Contact: e.target.value,
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
        
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="description"
                                        label="Description"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'please enter url description',
                                            },
                                        ]}
                                    >
                                        <Input.TextArea rows={4} placeholder="please enter url description" onChange={(e) => {
        
                                            setDriverModal({
                                                ...driverModal,
                                                description: e.target.value,
                                            });
                                        }} />
                                    </Form.Item>
                                </Col>
                            </Row>
        
                            {/* // Add this inside your Driver Modal Form, you can place it after the Contact Number Form.Item */}
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="licenseDocument"
                                        label="Driver's License Document"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please upload driver license document',
                                            },
                                        ]}
                                    >
                                        <Upload.Dragger
                                            name="licenseDocument"
                                            accept="image/*,.pdf"
                                            multiple={false}
                                            beforeUpload={(file) => {
                                                // Check file size (example: max 5MB)
                                                const isLt5M = file.size / 1024 / 1024 < 5;
                                                if (!isLt5M) {
                                                    message.error('Image must be smaller than 5MB!');
                                                    return Upload.LIST_IGNORE;
                                                }
        
                                                // Handle the file
                                                const reader = new FileReader();
                                                reader.readAsDataURL(file);
                                                reader.onload = () => {
                                                    setDriverModal({
                                                        ...driverModal,
                                                        licenseDocument: reader.result, // stores base64 string
                                                    });
                                                };
        
                                                // Prevent default upload
                                                return false;
                                            }}
                                            onRemove={() => {
                                                setDriverModal({
                                                    ...driverModal,
                                                    licenseDocument: null,
                                                });
                                            }}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">
                                                Support for a single image upload. Please upload drivers license document.
                                            </p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
    )
};

export default CreateDriverForm;