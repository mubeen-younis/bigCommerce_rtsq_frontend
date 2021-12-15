import React, {Fragment, useState} from 'react';
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
    Tooltip,
    Radio
} from 'antd';

const { Option } = Select;
const { Title } = Typography;
function handleChange(value) {
  console.log(`selected ${value}`);
}

function QuoteSettingsComponent(){
    const [visible1, setVisibleWarehouse] = useState(false);
    const [value, setValue] = useState(1);
    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };
    return(
        <Fragment>
            <Form
            layout="vertical"
            name="quote_settings_info"
            className="form-wrp"
            size={"large"}
            onFinish={onFinish}
            >
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Label As</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="label_as"
                            rules={[{ required: true, message: 'Label Required' }]}
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>what the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.</div>
                    </Col>
                </Row>
                <Row gutter={30} align="middle" className={"mb-4"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Quote service options</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Select All</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="select_all"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>Enable in-store pick up</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="fedex_freight_economy"></Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                        <label className={"text-gray"}>FedEx Freight Priority</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="fedex_freight_priority"></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Radio.Group onChange={onChange} value={value} className={"w-100 mb-4"}>
                            <Row gutter={30} align="middle">
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Title level={4}>Delivery Estimate options</Title>
                                </Col>
                                
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                                    <label className={"text-gray"}>Don't display delivery estimates</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                                    <Form.Item className={"mb-0"}>
                                        <Radio value={1}></Radio>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                                    <label className={"text-gray"}>Display estimated number of days</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                                    <Form.Item className={"mb-0"}>
                                        <Radio value={2}></Radio>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
                                    <label className={"text-gray"}>Display estimated delivery date</label>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
                                    <Form.Item className={"mb-0"}>
                                        <Radio value={3}></Radio>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-4"}>
                    <Col className="gutter-row mb-3" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Cut Off Time & Ship Date Offset</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Order Cut Off Time</label>
                    </Col>
                    <Col className="gutter-row mb-3" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="order_cut_off_time"
                            rules={[{ required: true, message: 'Order Cut Off Time Required' }]}
                        >
                            <Input />
                        </Form.Item>
                        <div className={"text-gray"}>
                            Enter the cut off time (e.g. 2:00) for orders. Orders placed after this time will be quoted as shipping the next business day.
                            <a href={""} className={"stnd-plan text-danger"}>Standard plan required</a>
                        </div>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Fulfillment Offset Days</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item
                            className={"mb-0"}
                            name="fulfillment_offset_days"
                            rules={[{ required: true, message: 'Fulfillment Offset Days Required' }]}
                        >
                            <Input />
                            
                        </Form.Item>
                        <div className={"text-gray"}>
                            The number of day the ship date nneds to be moved to allow for the processing of the order.
                            <a href={""} className={"stnd-plan text-danger"}>Standard plan required</a>
                        </div>
                    </Col>
                </Row>
                <Row gutter={30} align="middle" className={"mb-4"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Residential address settings</Title>
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
                        <Title level={4}>Hold at terminal</Title>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item className={"mb-0"}>
                            <Checkbox name="auto_detected_residential_addresses">Offer hold at terminal as an option <a href="" className="stnd-plan text-danger">Standard plan required</a></Checkbox>
                        </Form.Item>
                        <Form.Item
                            className={"mb-0"}
                            name="terminal"
                            rules={[{ required: true, message: 'Terminal Required' }]}
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>Adjust the prin of the Hold At Terminal option. Enter an amount, e.g. 3.75, or a percentage, e.g. 5%. Leave blank to use the price returned by the carrier.</div>
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
                            rules={[{ required: true, message: 'Weight of Handling Unit Required' }]}
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>what the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.</div>
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
                            rules={[{ required: true, message: 'Maximun Weight per Handling Unit Required' }]}
                        >
                            <Input />                            
                        </Form.Item>
                        <div className={"text-gray"}>what the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.</div>
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
                            rules={[{ required: true, message: 'Handling Free / Markup Required' }]}
                        >
                            <Input />
                        </Form.Item>
                        <div className={"text-gray"}>what the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.</div>
                    </Col>
                </Row>
                <Row gutter={30} className={"mb-3"}>
                    <Col className="gutter-row mt-1" xs={24} sm={24} md={24} lg={24} xl={6}>
                        <label className={"text-gray"}>Dsicounts</label>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Row gutter={30}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Radio.Group onChange={onChange} value={value} className={"w-100"}>
                                    <Row gutter={30}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item className={"mb-0"}>
                                                <Radio value={8}>
                                                    My account has negotiated LTL rates
                                                    <Tooltip placement="top" title={"Tootip Content"}>
                                                        <Button className={"text-gray"} type="link">[?]</Button>
                                                    </Tooltip>
                                                </Radio>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={30}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item className={"mb-0"}>
                                                <Radio value={9}>
                                                    My account has negotiated LTL rates
                                                    <Tooltip placement="top" title={"Tootip Content"}>
                                                        <Button className={"text-gray"} type="link">[?]</Button>
                                                    </Tooltip>
                                                </Radio>
                                            </Form.Item>
                                            <Form.Item
                                                className={"mb-0"}
                                                name="enter_amount"
                                                rules={[{ required: true, message: 'Amount Required' }]}
                                            >
                                                <Input placeholder={"enter your amount"} />
                                            </Form.Item>
                                            <div className={"text-gray"}>Incentive discount percentage</div>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                            </Col>
                        </Row>
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

export default QuoteSettingsComponent;