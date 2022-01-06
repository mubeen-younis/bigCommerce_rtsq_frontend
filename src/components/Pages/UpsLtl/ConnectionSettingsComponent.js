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
				<strong>Note!</strong> You must have an LTL freight enabled UPS account to use
				this application. If you do not have one, call 800-333-7400, or{' '}
				<a href='https://www.ups.com/lasso/login' target='_blank' rel='noreferrer'>
					register online
				</a>{' '}
				.
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
					label='Account Number'
					name='account_number'
					rules={[{ required: true, message: 'Account Number' }]}
				>
					<Input placeholder='Account Number' />
				</Form.Item>

				<Form.Item
					label='Username'
					name='username'
					rules={[{ required: true, message: 'Username' }]}
				>
					<Input placeholder='Username' />
				</Form.Item>

				<Form.Item
					label='Password'
					name='password'
					rules={[{ required: true, message: 'Password' }]}
				>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<Form.Item
					label='UPS API Access Key'
					name='ups_api_access_key'
					rules={[{ required: true, message: 'UPS API Access Key' }]}
				>
					<Input placeholder='UPS API Access Key' />
				</Form.Item>

				<Form.Item
					name='access_level'
					label='Access Level'
					rules={[{ required: true, message: 'Access Level' }]}
				>
					<Radio.Group>
						<Radio value='test'>Testing</Radio>
						<Radio value='pro'>Production</Radio>
					</Radio.Group>
				</Form.Item>

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
