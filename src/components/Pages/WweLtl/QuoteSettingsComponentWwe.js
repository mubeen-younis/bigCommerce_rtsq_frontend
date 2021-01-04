import React, {Fragment, useState, useEffect} from 'react';
import { 
    Select,
    Typography,
    Row,
    Col,
    Space,
    Button,
    Form,
    Input,
    Checkbox,
    Radio,
    Skeleton
} from 'antd';

import { connect } from "react-redux";
import { postData, getQuoteSettings } from "../../../Actions/Action";

const { Option } = Select;
const { Title } = Typography;

function QuoteSettingsComponentWwe(props){
    const [visible1, setVisibleWarehouse] = useState(false);
    const [value, setValue] = useState(1);
    const [loading, setLoading] = useState(true);
    const onChange = e => {
        setValue(e.target.value);
    };

    useEffect(() => {
        getQuoteSettings()
    })
    const [ratingMethod, setRatingMethod] = useState(1)

    const getQuoteSettings = () => {
        console.log('props.quoteSettings ', props.quoteSettings)
        if (props.quoteSettings === null || props.quoteSettings === undefined) {
            props.getSettings()
        }
          
        if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
            setLoading(false)
            let ratingMethodInit = props.quoteSettings.method !== undefined ? props.quoteSettings.method : 1;
            setRatingMethod(ratingMethodInit)
        }
    }
    
    const onFinish = data => {
        //data.method = ratingMethod
        props.postData(data)
    };
    
    if (loading && (props.quoteSettings === undefined || props.quoteSettings === null )) {
        return (
            <>
                <Skeleton active />
            </>
        )
    }

    return(
        <Fragment>
            <Form
            layout="vertical"
            name="quote_settings_info"
            className="form-wrp"
            size={"large"}
            onFinish={onFinish}
            initialValues={props.quoteSettings}
            >
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Rating Method</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="method"
                        >
                    
                            <Select defaultValue={props.quoteSettings.method !== undefined ? props.quoteSettings.method : 1 } name="method" size={"large"} style={{ width: '100%' }} onChange={(value) => setRatingMethod(value)}>
                                <Option value={1}>Cheapest</Option>
                                <Option value={2}>Cheapest Options</Option>
                                <Option value={3}>Average</Option>
                            </Select>
                        </Form.Item>
                        <div className={"text-gray"}>Display a least expensive option.</div>
                    </Col>
                </Row>
                {
                    ratingMethod == 2 || ratingMethod == 3 ?
                    <Row gutter={30} className={"mb-3"}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                            <label className={"text-gray"}>Number Of Options</label>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                            <Form.Item
                                className={"mb-0"}
                                name="number_of_options"
                            >
                                <Select name="number_of_options" defaultValue="1" size={"large"} style={{ width: '100%' }}>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                    <Option value="5">5</Option>
                                    <Option value="6">6</Option>
                                    <Option value="7">7</Option>
                                    <Option value="8">8</Option>
                                    <Option value="9">9</Option>
                                    <Option value="10">10</Option>
                                </Select>
                            </Form.Item>
                            <div className={"text-gray"}>Number of options to display in the shopping cart.</div>
                        </Col>
                    </Row>
                    : null
                }
                {
                    ratingMethod == 1 || ratingMethod == 3 ?
                    <Row gutter={30} className={"mb-3"}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                            <label className={"text-gray"}>Label as</label>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                            <Form.Item
                                className={"mb-0"}
                                name="label_as"
                            >
                                <Input name="label_as" defaultValue={props.quoteSettings.label_as} />
                            </Form.Item>
                            <div className={"text-gray"}>what the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.</div>
                        </Col>
                    </Row>
                    : null
                }
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Show Delivery Estimate</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="show_delivery_estimate" value={0}>Show Delivery Estimate With Shipping Services.</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30} align="middle" className={"mb-4"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Residential address settings</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Always residential pick up</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="residential_pickup"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Always quote residential delivery</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="residential_delivery"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Automatically detected residential addresses</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="auto_detected_residential_addresses"><a href="" className="stnd-plan text-danger">Standard plan required</a></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30} align="middle" className={"mb-4"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Lift gate settings</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Always include lift gate pick up</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="lift_gate_pick_up"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Always quote lift gate delivery</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="residential_delivery"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Offer lift gate delivery as an option</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="auto_detected_residential_addresses"><a href="" className="stnd-plan text-danger">Standard plan required</a></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Always include lift gate delivery when a residential address is detected</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="auto_detected_residential_addresses"><a href="" className="stnd-plan text-danger">Standard plan required</a></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Insurance Category</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="insurance_category"
                        >
                            <Select defaultValue="Insurance Category" size={"large"} style={{ width: '100%' }}>
                                <Option value="insurance_category">Category 1</Option>
                                <Option value="insurance_category">Category 2</Option>
                            </Select>
                        </Form.Item>
                        <div className={"text-gray"}><a href="" className="stnd-plan text-danger">Standard plan required</a></div>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Weight of Handling Unit</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="Weight_of_handling_unit"
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>Enter in pounds the weight of your pallet, skid, crate or other type of handling units, Leave blank to disable. </div>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Maximun Weight per Handling Unit</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="max_weight_per_handling_unit"
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>Enter in pounds the maximum weight that can be placed on the handling unit. Leave blank to disable.</div>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Handling Free / Markup</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="handling_free_markup"
                        >
                            <Input />
                        </Form.Item>
                        <div className={"text-gray"}>Amount excluding tax. Enter an amount e.g 3.75, or a percentage, e.g, 5%. Leave blank to disable.</div>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Do not return rate if the shipping address appears to be a post office box</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="return_rates"><a href="" className="stnd-plan text-danger">Standard plan required</a></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col className="gutter-row mt-1" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <Title level={4}>Quote Details</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Row gutter={30}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Radio.Group onChange={onChange} value={value} className={"w-100"}>
                                    <Row gutter={30}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item className={"mb-0"}>
                                                <Radio value={11}>Write the quote details to the Additional Detail widget</Radio>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={30}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item className={"mb-0"}>
                                                <Radio value={13}>Write the quote details to the More Action {">"} Shipping quote details page</Radio>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={30} className={"mt-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                            <Space>
                                <Button type="primary" size={"large"} htmlType="submit">Save Settings</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
}



const mapStateToProps = (state) => {
    return {
      quoteSettings: state.quoteSettings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data) => dispatch(postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings')),
        getSettings: () => dispatch(getQuoteSettings())
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(QuoteSettingsComponentWwe);