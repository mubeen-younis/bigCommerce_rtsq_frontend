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
import { getGoogleResponse } from "../../Actions/Warehouse";

const { Option } = Select;
const { Title } = Typography;
function handleChange(value) {
  console.log(`selected ${value}`);
}

function WarehouseComponent(props){
    const [visible1, setVisibleWarehouse] = useState(false);
    const [locationType, setLocationType] = useState();
    const [visible2, setVisibledropship] = useState(false);

    const [locationDetail, setLocationDetail] = useState({
        enable_instore: false,
        enable_ld: false,
    })

    const onFinish = values => {
        console.log('Received values of form: ', values);
        values.location_type = locationType;
        props.postData(values, 'GET_LOCATIONS', 'save_location')
    };

    const getGoogleLocation = (zip_code) => {
        if (zip_code.length > 4) {
            props.getGoogleResponse(zip_code)
            if (props.alertMessageType !== 'loading' && !props.showAlertMessage) {
                setLocationDetail({
                    ...locationDetail,
                    city: props.googleLocationResponse.city[0],
                    state: props.googleLocationResponse.state,
                    country: props.googleLocationResponse.country,
                })   
            }
        }
    }

    const openLocationModal = (location_type) => {
        setLocationDetail({})
        setLocationType(location_type);
        setVisibleWarehouse(true);
    }

    const deleteLocation = (data) => {
        console.log(data)
        if (data.type === 2) {
            props.confirmModalAction(true, 'Delete Dropship', 'Are you sure you want to delete this dropship?')
        }
    }

    const editLocation = (data) => {
        let additional = JSON.parse(data.additionals)
        setLocationDetail({
            id: data.id,
            city: data.city,
            state: data.state,
            country: data.country,
            nickname: data.nickname,
            zip_code: data.zip_code,
            enable_instore: additional.enable_instore ?? false,
            instore_miles: additional.instore_miles ?? null,
            instore_zipcodes: additional.instore_zipcodes ?? null,
            instock_description: additional.instock_description ?? null,
            enable_ld: additional.enable_ld ?? false,
            ld_miles: additional.ld_miles ?? null,
            ld_zipcodes: additional.ld_zipcodes ?? null,
            ld_description: additional.ld_description ?? null,
            ld_fee: additional.ld_fee ?? null,
            ld_enable_supress: additional.ld_enable_supress ?? false,
        })
        setVisibleWarehouse(true)
    }

    const data = [
        
    ];
      
    const columns = [
        {
            key: 'state',
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
                <Button onClick={() => editLocation(text)}>Edit</Button>
                <Button onClick={() => deleteLocation(text)} className={"btn-danger"}>Delete</Button>
            </Space>
            ),
        }
    ];
    return(
        <Fragment>
            <Space direction="vertical" size={"large"} className={"w-100"}>
                {/* <Row gutter={30}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Shipment Origins</Title>
                        <p>How will your shipment origins be indentified?</p>
                        <Select defaultValue="warehouse" size={"large"} style={{ width: '100%' }} onChange={handleChange}>
                            <Option value="warehouse">Warehouse</Option>
                            <Option value="dropship_location">Dropship Location</Option>
                        </Select>
                    </Col>
                </Row> */}
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
                        initialValues={locationDetail}
                        onFinish={onFinish}
                        >
                            <Row gutter={30}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Nickname"
                                        name="nickname"
                                        rules={[{ required: false, message: 'Nickname' }]}
                                    >
                                        <Input placeholder="Nickname" />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        className={"mb-2"}
                                        label="Zip Code"
                                        name="zip_code"
                                        rules={[{ required: true, message: 'Zip Code' }]}
                                    >
                                        <Input 
                                            placeholder="Zip Code"
                                            onChange={(e) => getGoogleLocation(e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
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
                                    <Form.Item name="enable_instore" className={"mb-0"}>
                                        <Checkbox name="enable_instore" checked={locationDetail.enable_instore}></Checkbox>
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
                                        name="instore_miles"
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
                                        name="instore_zipcodes"
                                        rules={[{ required: false, message: 'Costal Code Required' }]}
                                    >
                                        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} />
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
                                        name="instock_description"
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
                                    <Form.Item name="enable_ld" className={"mb-0"}>
                                        <Checkbox name="enable_ld" checked={locationDetail.enable_ld}></Checkbox>
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
                                        name="ld_miles"
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
                                        name="ld_zipcodes"
                                        rules={[{ required: false, message: 'Costal Code Required' }]}
                                    >
                                        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} />
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
                                        name="ld_description"
                                        rules={[{ required: false, message: 'Checkout Description Required' }]}
                                    >
                                        <Input placeholder="Local delivery" />
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
                                        name="ld_fee"
                                        rules={[{ required: false, message: 'Local delivery fee Required' }]}
                                    >
                                        <Input />
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
                                    <Form.Item name="ld_enable_supress" className={"mb-0"}>
                                        <Checkbox name="ld_enable_supress" ></Checkbox>
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
                        <Title level={4}>Warehouses <Button type="primary" onClick={() => openLocationModal(1)}>Add</Button></Title>
                        <p>Warehouses that inventory all products not otherwise indentified as drop shipped items. The warehouse with lowest shipping cost to the destination is used for quoting purpose.</p>
                        <Table className={"custom-table"} dataSource={props.warehouse} columns={columns} />
                    </Col>
                </Row>
            </Space>
            <Space direction="vertical" size={"large"} className={"w-100"}>
                <Row gutter={30}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Drop Ships <Button type="primary" onClick={() => openLocationModal(2)}>Add</Button></Title>
                        <p>Location that inventory specific items that are drop shipped to the destination. Use the product's settings page to identify it as a drop shipped and it associated drop ship location. Orders that includes drop shipped items will display a single figure for the shipping rate estimate that is equal to the sum of the cheapest option of each shipment required to fullfil the order.</p>
                        <Table className={"custom-table"} dataSource={props.dropships} columns={columns} />
                    </Col>
                </Row>
            </Space>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        warehouse: state.warehouse,
        dropships: state.dropships,
        googleLocationResponse: state.googleLocationResponse,
        showAlertMessage: state.showAlertMessage,
        alertMessageType: state.alertMessageType,
        confirmModal: state.confirmModal
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data, type, url) => dispatch(postData(data, type, url)),
        getGoogleResponse: (data) => dispatch(getGoogleResponse(data)),

        confirmModalAction: (on, title, body) => dispatch({type: 'CONFIRM_MODAL', payload: {
            on: on,
            title: title,
            body: body
        }})
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(WarehouseComponent);