import React, {Fragment, useState, useEffect} from 'react';
import { Form, Input, Button, Space, Skeleton} from 'antd';
import { connect } from "react-redux";
import { postData, getConnectionSettings } from "../../../Actions/Action";

function ConnectionSettingsComponent(props){

    const [connectionState, setConnectionState] = useState({
        testType: false,
        skeleton_loading: true
    })
    useEffect(()=> {
        if (props.connectionSettings == null) {
            props.getConnectionSettings()    
        }
    })
    const handleTypeChange = (type) =>{
        setConnectionState({...connectionState, testType: type})
    }
    const onFinish = values => {
        values.testType = connectionState.testType
        values.installed_carrier_id = props.carrierId;
        props.postData(values, props.token)
    };
    console.log('props', props)
    if (props.skeleton_loading && props.connectionSettings === null) {
        return (
            <>
                <Skeleton active />
            </>
        )
    }

    return(
        <Fragment>
            {console.log('props 1', props)}
            {console.log(props.connectionSettings)}
            <div className={"note-bx"}>
                <strong>Note!</strong> You must have a World Wide Express account to use this application. If you do not have one, click here to access the new account request form.
            </div>
            <Form
            layout="vertical"
            name="connection_settings"
            className="connection-settings"
            size={"large"}
            initialValues={props.connectionSettings}
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
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item
                    label="Authentication Key"
                    name="authentication_key"
                    rules={[{ required: true, message: 'Authentication Key' }]}
                >
                    <Input placeholder="Authentication Key" />
                </Form.Item>
                <Form.Item
                    label="License Key"
                    name="license_key"
                    rules={[{ required: true, message: 'License Key' }]}
                >
                    <Input placeholder="License Key" />
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
        connectionSettings: state.connectionSettings,
        skeleton_loading: state.skeleton_loading,
        token: state.token
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data, token) => dispatch(postData(data, 'GET_CONNECTION_SETTINGS', 'submit_connection_settings', token)),
        getConnectionSettings: () => dispatch(getConnectionSettings())
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(ConnectionSettingsComponent);