import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Radio } from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [accessType, setAccessType] = useState(0)

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	useEffect(() => {
		if (props.connectionSettings && accessType === 0) {
			setAccessType(props?.connectionSettings?.access_level === 'pro' ? 2 : 1)
		}
		// eslint-disable-next-line
	}, [props.connectionSettings])

	const onFinish = values => {
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId

		props.postData(values, props.token)
	}

	if (
		props.connectionSettings === null ||
		props.connectionSettings === undefined
	) {
		return <Skeleton active />
	} else {
		if (Object.keys(props.connectionSettings)?.length === 0) {
			props.connectionSettings.access_level = 'pro'
		}
	}
	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have an XPO account to use this
				application. If you do not have one, contact XPO at 800-755-2728, or{' '}
				<a
					href='https://ltl.xpo.com/webapp/membership_app/membershipSignupCompanySearch.do'
					target='_blank'
					rel='noreferrer'>
					Create an LTLXPO.com Account
				</a>
				.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: props.isInstalling ? !connectionState.testType : false, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., XPO' />
				</Form.Item>
				<Form.Item
					label='Pickup/Delivery Account Number'
					name='delivery_account_number'
					rules={[
                        {
                            required: props.isInstalling ? connectionState.testType : true,
                            message: 'Pickup/Delivery Account Number is required',
                        },
					]}>
					<Input placeholder='Pickup/Delivery Account Number' />
				</Form.Item>

                <Form.Item
                    label='Username'
                    name='username'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[{ required: props.isInstalling ? connectionState.testType : true, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

                <Form.Item
                    label='Pickup/Delivery Postal Code'
                    name='delivery_postal_code'
                    rules={[
                        {
                            required: props.isInstalling ? connectionState.testType : true,
                            message: 'Pickup/Delivery Postal Code is required',
                        },
                    ]}>
					<Input placeholder='Pickup/Delivery Postal Code' />
				</Form.Item>

                <Form.Item
                    label='Bill To Account Number '
                    name='bill_to_account_number'
                    rules={[
                        {
                            required: accessType === 2,
                            message: 'Bill To Account Number is required',
                        },
                    ]}>
					<Input placeholder='Bill To Account Number ' />
				</Form.Item>

				<Form.Item label='API Key' name='api_key' className='mb-1'>
					<Input placeholder='API Key' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-xpo-logistics/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your XPO Logistics API key?
					</a>
				</div>

				<Form.Item
					name='access_level'
					// label='Access Level'
					rules={[{ required: false, message: 'Access Level is required' }]}>
					<Radio.Group>
						<Radio onChange={() => setAccessType(1)} value='test'>
							Test Account Number
						</Radio>
						<Radio onChange={() => setAccessType(2)} value='pro'>
							Test Bill To Account Number
						</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
					<Space>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`test`}
							onClick={() => handleTypeChange(true)}>
							Test Connection
						</Button>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`save`}
							onClick={() => handleTypeChange(false)}>
							Save Settings
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		connectionSettings: state.connectionSettings,
		skeleton_loading: state.skeleton_loading,
		token: state.token,
		carrierId: state.carrierId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(
					data,
					'GET_CONNECTION_SETTINGS',
					'submit_connection_settings',
					token
				)
			),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectionSettingsComponent)
