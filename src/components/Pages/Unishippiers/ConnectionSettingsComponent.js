import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})

	useEffect(() => {}, [props.connectionSettings])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
		console.log(connectionState)
	}

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
	}

	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have a Unishippers (unishippers.com)
				account to use this application. If you don’t have one, contact
				Unishippers at 1-800-999-8721 and ask to be contacted by a sales
				person from the office serving your area or{' '}
				<a
					href='https://eniture.com/request-worldwide-express-account-number/'
					target='_blank'
					rel='noreferrer'>
					click here
				</a>{' '}
				to access the online new account request form.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Unishippers Customer Number'
					name='unishippers_customer_number'
					rules={[
						{ required: true, message: 'Unishippers Customer Number' },
					]}>
					<Input placeholder='Unishippers Customer Number' />
				</Form.Item>
				<Form.Item
					label='UPS Account Number'
					name='ups_account_number'
					rules={[{ required: true, message: 'UPS Account Number' }]}>
					<Input placeholder='UPS Account Number' />
				</Form.Item>
				<Form.Item
					label='Username'
					name='username'
					rules={[{ required: true, message: 'Username' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					label='Password'
					name='password'
					rules={[{ required: true, message: 'Password' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>
				<Form.Item
					label='Request Key'
					name='request_key'
					// rules={[{ required: true, message: 'Request Key' }]}
				>
					<Input placeholder='Request Key' />
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
