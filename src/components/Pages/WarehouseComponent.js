import React, {Fragment, useState} from 'react';
import { 
    Select,
    Typography,
    Row,
    Col,
    Space,
    Button,
    Modal,
    Form,
    Input,
    Checkbox,
    Table,
    Tooltip
} from 'antd';

import { connect } from "react-redux";
import { postData } from "../../Actions/Action";

const { Option } = Select;
const { Title } = Typography;
function handleChange(value) {
  console.log(`selected ${value}`);
}

function WarehouseComponent(props){
    const [visible1, setVisibleWarehouse] = useState(false);
    const [visible2, setVisibledropship] = useState(false);
    const onFinish = values => {
        console.log('Received values of form: ', values);
        props.postData(values, 'GET_LOCATIONS', 'submit_location')
    };

    const deleteLocation = (id) => {}

    const editLocation = (id) => {
        setVisibleWarehouse(true)
    }

    const data = [
        
    ];
      
    const columns = [
        {
            key: 'key',
            title: 'City',
            dataIndex: 'city',
        },
        {
            key: 'state',
            title: 'State',
            dataIndex: 'state',
        },
        {
            key: 'zip',
            title: 'Zip',
            dataIndex: 'zip',
        },
        {
            key: 'zip',
            title: 'Country',
            dataIndex: 'country',
        },
        {
            key: 'zip',
            title: 'Action',
            render: (text, record) => (
            <Space size="middle">
                <Button onClick={() => editLocation(1)}>Edit</Button>
                <Button onClick={() => deleteLocation(1)} className={"btn-danger"}>Delete</Button>
            </Space>
            ),
        }
    ];
    return(
        <Fragment>
            <Space direction="vertical" size={"large"} className={"w-100"}>
                <Row gutter={30}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Shipment Origins</Title>
                        <p>How will your shipment origins be indentified?</p>
                        <Select defaultValue="warehouse" size={"large"} style={{ width: '100%' }} onChange={handleChange}>
                            <Option value="warehouse">Warehouse</Option>
                            <Option value="dropship_location">Dropship Location</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Modal
                        title={<Title className={"mb-0"} level={4}>Add Warehouse Info</Title>}
                        centered
                        visible={visible1}
                        onCancel={() => setVisibleWarehouse(false)}
                        footer={null}
                        width={800}
                    >
                        <Form
                        layout="vertical"
                        name="add_warehouse_info"
                        className="form-wrp"
                        size={"large"}
                        onFinish={onFinish}
                        >
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="City"
                                        name="city"
                                        rules={[{ required: false, message: 'City' }]}
                                    >
                                        <Input placeholder="City" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="State"
                                        name="state"
                                        rules={[{ required: false, message: 'State' }]}
                                    >
                                        <Input placeholder="State" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Zip Code"
                                        name="zipcode"
                                        rules={[{ required: false, message: 'Zip Code' }]}
                                    >
                                        <Input placeholder="Zip Code" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Country"
                                        name="country"
                                        rules={[{ required: false, message: 'Country' }]}
                                    >
                                        <Input placeholder="Country" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Title level={4}>In-store pick up</Title>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Enable in-store pick up</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_in_store_pick_up" className={"mb-0"}>
                                        <Checkbox name="enable_in_store_pick_up" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if address is within (miles):</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_postal_email"
                                        rules={[{ required: false, message: 'Email Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if postal code matches:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_postal_code"
                                        rules={[{ required: false, message: 'Costal Code Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Checkout description:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_checkout_description"
                                        rules={[{ required: false, message: 'Checkout Description Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Title level={4}>Local Delivery</Title>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Enable local delivery</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_enable_local_delivery" className={"mb-0"}>
                                        <Checkbox name="enable_local_delivery" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if address is within (miles):</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_postal_email"
                                        rules={[{ required: false, message: 'Email Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if postal code matches:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_postal_code"
                                        rules={[{ required: false, message: 'Costal Code Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Checkout description:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_checkout_description"
                                        rules={[{ required: false, message: 'Checkout Description Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Local delivery fee</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_free"
                                        rules={[{ required: false, message: 'Local delivery fee Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>
                                        Suppress other rates  
                                        <Tooltip placement="top" title={"This setting only suppresses rate that would otherwise be returned by this app."}>
                                            <Button className={"text-gray"} type="link">[?]</Button>
                                        </Tooltip>
                                    </label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_enable_local_delivery" className={"mb-0"}>
                                        <Checkbox name="enable_local_delivery" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mt-3"}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                                        <Space>
                                            <Button type="link" size={"large"} onClick={() => setVisibleWarehouse(false)}>Cancel</Button>
                                            <Button type="primary" size={"large"} htmlType="submit">Save</Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Warehouses <Button type="primary" onClick={() => setVisibleWarehouse(true)}>Add</Button></Title>
                        <p>Warehouses that inventory all products not otherwise indentified as drop shipped items. The warehouse with lowest shipping cost to the destination is used for quoting purpose.</p>
                        <Table className={"custom-table"} dataSource={data} columns={columns} />
                    </Col>
                </Row>
            </Space>
            <Space direction="vertical" size={"large"} className={"w-100"}>
                <Row gutter={30}>
                    <Modal
                        title={<Title className={"mb-0"} level={4}>Add Drop Ships Info</Title>}
                        centered
                        visible={visible2}
                        onCancel={() => setVisibledropship(false)}
                        footer={null}
                        width={800}
                    >
                        <Form
                        layout="vertical"
                        name="add_dropship_info"
                        className="form-wrp"
                        size={"large"}
                        onFinish={onFinish}
                        >
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="City"
                                        name="city"
                                        rules={[{ required: true, message: 'City' }]}
                                    >
                                        <Input placeholder="City" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="State"
                                        name="state"
                                        rules={[{ required: true, message: 'State' }]}
                                    >
                                        <Input placeholder="State" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Zip Code"
                                        name="zipcode"
                                        rules={[{ required: true, message: 'Zip Code' }]}
                                    >
                                        <Input placeholder="Zip Code" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Country"
                                        name="country"
                                        rules={[{ required: true, message: 'Country' }]}
                                    >
                                        <Input placeholder="Country" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Title level={4}>In-store pick up</Title>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Enable in-store pick up</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_in_store_pick_up" className={"mb-0"}>
                                        <Checkbox name="enable_in_store_pick_up" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if address is within (miles):</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_postal_email"
                                        rules={[{ required: true, message: 'Email Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if postal code matches:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_postal_code"
                                        rules={[{ required: true, message: 'Costal Code Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Checkout description:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="in_stock_checkout_description"
                                        rules={[{ required: true, message: 'Checkout Description Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Title level={4}>Local Delivery</Title>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Enable local delivery</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_enable_local_delivery" className={"mb-0"}>
                                        <Checkbox name="enable_local_delivery" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if address is within (miles):</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_postal_email"
                                        rules={[{ required: true, message: 'Email Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Offer if postal code matches:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_postal_code"
                                        rules={[{ required: true, message: 'Costal Code Required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Checkout description:</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_checkout_description"
                                        rules={[{ required: true, message: 'Checkout Description Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mb-2"}>
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>Local delivery fee</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item
                                        className={"mb-0"}
                                        name="local_delivery_free"
                                        rules={[{ required: true, message: 'Local delivery fee Required' }]}
                                    >
                                        <Input placeholder="In-stock pick up" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <label className={"text-gray"}>
                                        Suppress other rates  
                                        <Tooltip placement="top" title={"This setting only suppresses rate that would otherwise be returned by this app."}>
                                            <Button className={"text-gray"} type="link">[?]</Button>
                                        </Tooltip>
                                    </label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={16} md={16} lg={16} xl={16}>
                                    <Form.Item name="enable_enable_local_delivery" className={"mb-0"}>
                                        <Checkbox name="enable_local_delivery" checked="checked"></Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30} align="middle" className={"mt-3"}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                                        <Space>
                                            <Button type="link" size={"large"} onClick={() => setVisibledropship(false)}>Cancel</Button>
                                            <Button type="primary" size={"large"} htmlType="submit">Save</Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Drop Ships <Button type="primary" onClick={() => setVisibledropship(true)}>Add</Button></Title>
                        <p>Location that inventory specific items that are drop shipped to the destination. Use the product's settings page to identify it as a drop shipped and it associated drop ship location. Orders that includes drop shipped items will display a single figure for the shipping rate estimate that is equal to the sum of the cheapest option of each shipment required to fullfil the order.</p>
                        <Table className={"custom-table"} dataSource={data} columns={columns} />
                    </Col>
                </Row>
            </Space>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        locations: state.locations
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data, type, url) => dispatch(postData(data, type, url))
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(WarehouseComponent);