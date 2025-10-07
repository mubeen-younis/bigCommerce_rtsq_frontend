import React, { Fragment, useState, useEffect } from 'react';
import { Form, Input, Button, Space, Skeleton, Radio, Select } from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';

import { postData } from '../../../Actions/Action';
import types from '../../../Stores/types';
import { useConnectionSettings } from '../../../hooks/useConnectionSettings';

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	});
	const [form] = Form.useForm();
	const dispatch = useDispatch()
    const { connectionSettings, token, UpsLtlApiType, isInstalling } = useSelector(state => state)
	const { submitConnectionSettings } = useConnectionSettings()

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
        // Validation is handled via dynamic rules below based on testType
    };

	const onFinish = values => {
		values = { ... props.connectionSettings, ...values, api_type: UpsLtlApiType}
		values.testType = connectionState.testType;
		values.installed_carrier_id = props.carrierId;
		values.carrierId = props.carrierId;

		submitConnectionSettings(values, props.postData);
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
				form={form}
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={{... props.connectionSettings,
				rates_my_freight_based: props.connectionSettings?.rates_my_freight_based ?? 0
				}}
				onFinish={onFinish}
			>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: !connectionState.testType, message: 'Nickname is required' }]}
                >
					<Input placeholder='e.g., UPS LTL' />
				</Form.Item>
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

				{ UpsLtlApiType == 'new_api' ? (
					<>

                    <Form.Item
                        label='Client ID'
                        name='clientId'
                        rules={[{ required: connectionState.testType, message: 'Client ID is required' }]}
                    >
						<Input placeholder='Client ID' maxLength={100}/>
					</Form.Item>

                    <Form.Item
                        className='mb-1'
                        label='Client Secret'
                        name='clientSecret'
                        rules={[{ required: connectionState.testType, message: 'Client Secret is required' }]}
                    >
						<Input placeholder='Client Secret' maxLength={100}/>
					</Form.Item>

					<div>
						<a
							href='https://eniture.com/bigcommerce-tforce-api-connection-instructions/'
							target='_blank'
							rel='noreferrer'
						>
							How to obtain your TForce Client ID and Client Secret?
						</a>
					</div>

                    <Form.Item
                        className='mt-1'
                        label='Username'
                        name='username'
                        rules={[{ required: connectionState.testType, message: 'Username is required' }]}
                    >
						<Input placeholder='Username' maxLength={100}/>
					</Form.Item>

                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[{ required: connectionState.testType, message: 'Password is required' }]}
                    >
						<Input type='text' placeholder='Password' maxLength={100}/>
					</Form.Item>

					</>
				) : (
					<>

                <Form.Item
                    label='Account Number'
                    name='account_number'
                    rules={[{ required: connectionState.testType, message: 'Account Number is required' }]}
                >
					<Input placeholder='Account Number' />
				</Form.Item>

                <Form.Item
                    label='Username'
                    name='username'
                    rules={[{ required: connectionState.testType, message: 'Username is required' }]}
                >
					<Input placeholder='Username' maxLength={100}/>
				</Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[{ required: connectionState.testType, message: 'Password is required' }]}
                >
					<Input type='text' placeholder='Password' maxLength={100}/>
				</Form.Item>

                <Form.Item
                    label='API Access Key'
                    name='ups_api_access_key'
                    rules={[{ required: connectionState.testType, message: 'API Access Key is required' }]}
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
