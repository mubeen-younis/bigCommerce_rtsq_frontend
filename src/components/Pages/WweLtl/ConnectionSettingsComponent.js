import React, {Fragment, useState} from 'react';
import { Form, Input, Button, Space} from 'antd';
import { connect } from "react-redux";
import { postData } from "../../../Actions/Action";

function ConnectionSettingsComponent(props){
    const [connectionState, setConnectionState] = useState({
        testType: false
    })
    const handleTypeChange = (type) =>{
        setConnectionState({...connectionState, testType: type})
    }
    const onFinish = values => {
        values.testType = connectionState.testType
        props.postData(values)
    };
    return(
        <Fragment>
            <div className={"note-bx"}>
                <strong>Note!</strong> You must have a World Wide Express account to use this application. If you do not have one, click here to access the new account request form.
            </div>
            <Form
            layout="vertical"
            name="connection_settings"
            className="connection-settings"
            size={"large"}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            >
                <Form.Item
                    label="Account Number"
                    name="account_number"
                    rules={[{ required: true, message: 'Account Number' }]}
                >
                    <Input placeholder="Account Number" />
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Username' }]}
                >
                    <Input placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input type="password" placeholder="Password"/>
                </Form.Item>
                <Form.Item
                    label="Authentication Key"
                    name="authentication_key"
                    rules={[{ required: true, message: 'Authentication Key' }]}
                >
                    <Input placeholder="Authentication Key" />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                    <Space>
                        <Button type="primary" size={"large"} htmlType="submit" name={`test`} onClick={() => handleTypeChange(true)}>Test Connection</Button>
                        <Button type="primary" size={"large"} htmlType="submit" name={`save`} onClick={() => handleTypeChange(false)}>Save Settings</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Fragment>
    );
}


const mapStateToProps = (state) => {
    return {
        connectionSettings: state.connectionSettings
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data) => dispatch(postData(data, 'GET_CONNECTION_SETTINGS', 'submit_connection_settings'))
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(ConnectionSettingsComponent);