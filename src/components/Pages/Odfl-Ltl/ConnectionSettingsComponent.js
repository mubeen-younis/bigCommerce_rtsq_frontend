import React, { Fragment, useState } from 'react';
import { Form, Input, Button, Space, Skeleton, Radio } from 'antd';
import { connect } from 'react-redux';

import { postData } from '../../../Actions/Action';

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	});

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type });
	};

	const onFinish = values => {
		values.testType = connectionState.testType;
		values.installed_carrier_id = props.carrierId;
		values.carrierId = props.carrierId;

		props.postData(values, props.token);
	};

	if (props.connectionSettings === null || props.connectionSettings === undefined) {
		return <Skeleton active />;
	}else{
		if(Object.keys(props.connectionSettings)?.length === 0){
			props.connectionSettings.access_level = 'pro'
		}
	}
	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have an Old Dominion Freight Lines account to use this application. if you don't have one, contact Old Dominion Freight Lines at 800-235-5569, or email{' '}
				<a
					href='mailto:customer.service@odfl.com'
				    target='_blank'
					rel='noreferrer'>
					customer.service@odfl.com
				</a>{' '} 
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}
			>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: props.isInstalling ? !connectionState.testType : false, message: 'Nickname' }]}
                >
					<Input placeholder='e.g., ODFL' />
				</Form.Item>
				<Form.Item
					label='Account Number'
					name='customer_number'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Account Number' }]}
				>
					<Input placeholder='Account Number' />
				</Form.Item>

                <Form.Item
                    label='Username'
                    name='username'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Username' }]}
                >
					<Input placeholder='Username' />
				</Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Password' }]}
                >
					<Input type='text' placeholder='Password' />
				</Form.Item>

                <Form.Item
                    className='mb-1'
                    label='Billing Postal Code'
                    name='billing_postal_Code'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Billing Postal Code' }]}
                >
					<Input placeholder='Billing Postal Code' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-odfl-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your ODFL account credentials?
					</a>
				</div>

				<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
					<Space>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`test`}
							onClick={() => handleTypeChange(true)}
						>
							Test Connection
						</Button>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`save`}
							onClick={() => handleTypeChange(false)}
						>
							Save Settings
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		connectionSettings: state.connectionSettings,
		skeleton_loading: state.skeleton_loading,
		token: state.token,
		carrierId: state.carrierId,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(data, 'GET_CONNECTION_SETTINGS', 'submit_connection_settings', token)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionSettingsComponent);
