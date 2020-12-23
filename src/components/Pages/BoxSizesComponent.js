import React, {Fragment, useState} from 'react';
import { 
    Select,
    Typography,
    Row,
    Col,
    Space,
    Button,
    Form,
    Checkbox,
    Input,
    Table,
    Divider,
    Modal
} from 'antd';

const { Option } = Select;
const { Title } = Typography;

function BoxSizesComponent(){
    const [visible, setVisibleAddBox] = useState(false);
    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };
    const data = [
        {
            key: '1',
            nickname: 'XYZ',
            length: '32',
            width: '15',
            maxWeight: '25',
            avilable: 'Yes'
        },
        {
            key: '2',
            nickname: 'XYZ',
            length: '32',
            width: '15',
            maxWeight: '25',
            avilable: 'Yes'
        },
        {
            key: '3',
            nickname: 'XYZ',
            length: '32',
            width: '15',
            maxWeight: '25',
            avilable: 'Yes'
        },
        {
            key: '4',
            nickname: 'XYZ',
            length: '32',
            width: '15',
            maxWeight: '25',
            avilable: 'Yes'
        }
    ];
      
    const columns = [
        {
            key: 'key',
            title: 'Nickname',
            dataIndex: 'nickname',
        },
        {
            key: 'length',
            title: 'Length(in)',
            dataIndex: 'length',
        },
        {
            key: 'zwidthip',
            title: 'Width(in)',
            dataIndex: 'width',
        },
        {
            key: 'maxWeight',
            title: 'Max Weight (LBS)',
            dataIndex: 'maxWeight',
        },
        {
            key: 'avilable',
            title: 'Available',
            dataIndex: 'avilable',
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (text, record) => (
            <Space size="middle">
                <a href="#">Edit</a>
                <a href="#" className={"btn-danger"}>Delete</a>
            </Space>
            ),
        }
    ];
    return(
        <Fragment>            
            <Row gutter={30} justify="center" className={"mb-3"}>
                <Col className="gutter-row" xs={24} sm={18} md={16} lg={18} xl={18}>
                    <div className={"content-box box-shadow"}>
                        <Form.Item
                            className={"mb-2"}
                            name="city"
                        >
                            <Checkbox onChange={onChange}>Enable</Checkbox>
                        </Form.Item>
                        <p>Current usage: $0.00 / $60.00     (0.00%)</p>
                        <Row gutter={10} align="middle" justify="center">
                            <Col className="gutter-row" xs={24} sm={4} md={4} lg={4} xl={4}>
                                Crapped amount: $ 
                            </Col>
                            <Col className="gutter-row" xs={24} sm={5} md={5} lg={5} xl={5}>
                                <Form.Item
                                    className={"mb-0"}
                                    name="crapped_amount"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={15} md={15} lg={15} xl={15}>
                                Cost: 3 cent per calculation
                            </Col>
                        </Row>
                        <Row gutter={10} align="middle" justify="center">
                            <Col className="gutter-row mt-3" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                                    <Space>
                                        <Button style={{ width: '100px'}} type="primary" htmlType="submit">Save</Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={10} align="middle" justify="center">
                            <Col className="gutter-row" style={{ textAlign: 'right', marginBottom: '0' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button style={{ width: '100px'}} type="primary" onClick={() => setVisibleAddBox(true)}>Add</Button>
                                <Modal
                                    title={<Title className={"mb-0"} level={4}>Add Boxe Sizes</Title>}
                                    centered
                                    visible={visible}
                                    onCancel={() => setVisibleAddBox(false)}
                                    footer={null}
                                    width={800}
                                >
                                    <Form
                                    layout="vertical"
                                    name="add_boxe_sizes"
                                    className="form-wrp"
                                    size={"large"}
                                    onFinish={onFinish}
                                    >
                                        <Row gutter={30}>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item
                                                    className={"mb-2"}
                                                    label="Nickname"
                                                    name="nickname"
                                                    rules={[{ required: true, message: 'Nickname Required' }]}
                                                >
                                                    <Input placeholder="Nickname" />
                                                </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item
                                                    className={"mb-2"}
                                                    label="Length (in)"
                                                    name="length"
                                                    rules={[{ required: true, message: 'Length Required' }]}
                                                >
                                                    <Input placeholder="Length (in)" />
                                                </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item
                                                    className={"mb-2"}
                                                    label="Width (in)"
                                                    name="width"
                                                    rules={[{ required: true, message: 'Width Required' }]}
                                                >
                                                    <Input placeholder="Width (in)" />
                                                </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item
                                                    className={"mb-2"}
                                                    label="Height (in)"
                                                    name="height"
                                                    rules={[{ required: true, message: 'Height Required' }]}
                                                >
                                                    <Input placeholder="Height (in)" />
                                                </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item
                                                    className={"mb-2"}
                                                    label="Max Weight (LBS)"
                                                    name="max_weight"
                                                    rules={[{ required: true, message: 'Max Weight (LBS)' }]}
                                                >
                                                    <Input placeholder="Max Weight Required" />
                                                </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item name="is_remember" value={"test"}>
                                                    <Checkbox>Is Available</Checkbox>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={30} align="middle" className={"mt-3"}>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                                                    <Space>
                                                        <Button type="link" onClick={() => setVisibleAddBox(false)}>Cancel</Button>
                                                        <Button type="primary" htmlType="submit">Save</Button>
                                                    </Space>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Modal>
                            </Col>
                        </Row>
                        <Table className={"custom-table mt-3"} dataSource={data} columns={columns} />
                        <Title level={5}>Items that ship as multiple packages</Title>
                        <p>Integer ut diam urna. Donec placerat, est non porttitor tincidunt, velit sem pharetra lorem, eget lacinia nulla mauris sit amet sapien. Vestibulum tincidunt auctor sapien et convallis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae</p>
                    </div>
                </Col>
            </Row>            
        </Fragment>
    );
}

export default BoxSizesComponent;