import { Modal, Button, Form, Input, Row, Col } from "antd";
const CreatePartyForm = ({isModalOpen, handleOk, handleCancel, createPartyForm, partyModal, setPartyModal}) => {
    return (
        <Modal title="Create Party" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Submit
                    </Button>
                ]}       
                      
            >
                <Form layout="vertical" form={createPartyForm}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                // name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter user name',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => {
                                    let obj = partyModal;
                                    obj.label = e.target.value;
                                    obj.value = e.target.value;
                                    setPartyModal(obj);
                                }} placeholder="Please enter user name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                // name="Party Location"
                                label="Party Location"
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
                                    placeholder="Party Location"
                                    onChange={(e) => {
                                        let obj = partyModal;
                                        obj.location = e.target.value;
                                        setPartyModal(obj);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                // name="Address"
                                label="Address"
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
                                    placeholder="Party Address"
                                    onChange={(e) => {
                                        let obj = partyModal;
                                        obj.address = e.target.value;
                                        setPartyModal(obj);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                // name="ContactNumber"
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
                                        let obj = partyModal;
                                        obj.contact = e.target.value;
                                        setPartyModal(obj);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                // name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="please enter url description" onChange={(e) => {
                                    let obj = partyModal;
                                    obj.description = e.target.value;
                                    setPartyModal(obj);
                                }} />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
    )
}

export default CreatePartyForm;