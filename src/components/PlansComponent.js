import React from 'react';
import { Row, Col, Button } from 'antd';

function PlansComponent(){
    return(
        <Row gutter={40}>
            <Col className="gutter-row mb-3" xs={24} sm={24} md={12} lg={12} xl={8}>
                <div className={"pricing-box"}>
                    <div className="pricing-header">
                        <h2>
                            <div>Basic</div>
                            <small>This is your current plan:</small>
                        </h2>
                        <Button className={"btn-plane"} size={"large"}>$20 / month</Button>
                    </div>
                    <ul>
                        <li>Indicates whether your button's action is of normal or destructive nature.</li>
                        <li>Pass in an Icon component to display to the left of the text.</li>
                        <li>Used to determine if component is in a loading state.</li>
                        <li>Determines which style of button to display.</li>
                        <li>Controls whether onClose is called when clicking outside of the modal.</li>
                        <li>Sets visible text that describes the content of the modal.</li>
                        <li>Function that will be called on close events.</li>
                        <li>Pass in a description to display in the fieldset. Will render nothing if not the correct type.</li>
                        <li>Sets visible text that describes the content of the modal.</li>
                        <li>Function that will be called on close events.</li>
                        <li>Pass in a description to display in the fieldset. Will render nothing if not the correct type.</li>
                        <li>Used to determine if component is in a loading state.</li>
                        <li>Determines which style of button to display.</li>
                        <li>Controls whether onClose is called when clicking outside of the modal.</li>
                        <li>Sets visible text that describes the content of the modal.</li>
                    </ul>
                </div>
            </Col>
            <Col className="gutter-row mb-3" xs={24} sm={24} md={12} lg={12} xl={8}>
                <div className={"pricing-box"}>
                    <div className="pricing-header">
                        <h2>
                            <div>Standared</div>
                        </h2>
                        <Button type="primary" size={"large"}>$20 / month</Button>
                    </div>
                    <ul>
                        <li>Indicates whether your button's action is of normal or destructive nature.</li>
                        <li>Pass in an Icon component to display to the left of the text.</li>
                        <li>Used to determine if component is in a loading state.</li>
                        <li>Determines which style of button to display.</li>
                        <li>Controls whether onClose is called when clicking outside of the modal.</li>
                        <li>Sets visible text that describes the content of the modal.</li>
                        <li>Function that will be called on close events.</li>
                        <li>Pass in a description to display in the fieldset. Will render nothing if not the correct type.</li>
                    </ul>
                </div>
            </Col>
            <Col className="gutter-row mb-3" xs={24} sm={24} md={24} lg={24} xl={8}>
                <div className={"pricing-box"}>
                    <div className="pricing-header">
                        <h2>
                            <div>Advance</div>
                        </h2>
                        <Button type="primary" size={"large"}>$20 / month</Button>
                    </div>
                    <ul>
                        <li>Indicates whether your button's action is of normal or destructive nature.</li>
                        <li>Pass in an Icon component to display to the left of the text.</li>
                        <li>Used to determine if component is in a loading state.</li>
                        <li>Determines which style of button to display.</li>
                    </ul>
                </div>
            </Col>
        </Row>
    );
}

export default PlansComponent;