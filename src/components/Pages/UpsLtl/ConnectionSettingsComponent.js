import React, { Fragment, useState, useEffect } from 'react';
import { Form, Input, Button, Space, Skeleton, Radio, Select } from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';

import { postData } from '../../../Actions/Action';
import types from '../../../Stores/types';

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	});
	const dispatch = useDispatch()
	const { connectionSettings, token, UpsLtlApiType } = useSelector(state => state)

	useEffect(() => {
		if (connectionSettings) {
			if(!(connectionSettings?.api_type) && (connectionSettings?.carrierId)){
				connectionSettings['api_type'] = 'legacy_api'
			}
			dispatch({
				type: types.SET_UPS_LTL_API_TYPE,
				payload: connectionSettings?.api_type ?? 'new_api',
			})
		}
	}, [connectionSettings, dispatch])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type });
	};

	const onFinish = values => {
		values = { ... props.connectionSettings, ...values, api_type: UpsLtlApiType}
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
				<strong>Note!</strong> You must have an LTL freight enabled TForce account to use
				this application. If you do not have one, call 800-333-7400, or{' '}
				<a href='https://www.ups.com/lasso/login' target='_blank' rel='noreferrer'>
					register 
				</a> online.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={{... props.connectionSettings, 
				rates_my_freight_based: props.connectionSettings?.rates_my_freight_based ?? 0
				}}
				onFinish={onFinish}
			>
				<Form.Item label='Which API Will You Connect To?' name='api_type'>
					<Select
						defaultValue={!connectionSettings?.api_type && connectionSettings?.carrierId ? 'legacy_api' : 'new_api'}
						options={[
							{ label: 'Legacy API', value: 'legacy_api' },
							{ label: 'New API', value: 'new_api' },
						]}
						onChange={opt =>
							dispatch({
								type: types.SET_UPS_LTL_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>


				<Form.Item
					label='Username'
					name='username'
					rules={[{ required: UpsLtlApiType == 'new_api' ? false : true, message: 'Username is required' }]}
				>
					<Input placeholder='Username' />
				</Form.Item>

				<Form.Item
					label='Password'
					name='password'
					rules={[{ required: UpsLtlApiType == 'new_api' ? false : true, message: 'Password is required' }]}
				>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				{ UpsLtlApiType == 'new_api' ? (
					<>

					<Form.Item
						label='Client ID'
						name='clientId'
						rules={[{ required: true, message: 'Client ID is required' }]}
					>
						<Input placeholder='Client ID' maxLength={100}/>
					</Form.Item>

					<Form.Item
						label='Client Secret'
						name='clientSecret'
						rules={[{ required: true, message: 'Client Secret is required' }]}
					>
						<Input placeholder='Client Secret' maxLength={100}/>
					</Form.Item>

					</>
				) : (
					<>

				<Form.Item
					label='Account Number'
					name='account_number'
					rules={[{ required:false, message: 'Account Number' }]}
				>
					<Input placeholder='Account Number' />
				</Form.Item>

				<Form.Item
					label='API Access Key'
					name='ups_api_access_key'
					rules={[{ required: true, message: 'API Access Key is required' }]}
				>
					<Input placeholder='API Access Key' />
				</Form.Item>

				{/* Remove the "Access Level" setting mentioned in Ticket#1846800919
				<Form.Item
					name='access_level'
					label='Access Level'
					rules={[{ required: true, message: 'Access Level' }]}
				>
					<Radio.Group>
						<Radio value='test'>Testing</Radio>
						<Radio value='pro'>Production</Radio>
					</Radio.Group>
				</Form.Item> */}
				</>)}

				<Form.Item
					name='rates_my_freight_based'
					label='TForce rates my freight based on weight and... '
					rules={[{ required: false, message: 'TForce rates my freight based on weight' }]}
				>
					<Radio.Group>
						<Radio value={0}>Freight class</Radio>
						<Radio value={1}>Dimensions</Radio>
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
