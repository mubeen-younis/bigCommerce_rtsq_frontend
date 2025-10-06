import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { connect, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const { connectionSettings } = useSelector(
		state => state
	)


	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values = { ...connectionSettings, ...values }
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
				<strong>Note!</strong> You must have a UPS Landed Cost Quote account to
				use this application. If you do not have one, click{' '}
				<a
					href='https://www.ups.com/lasso/login'
					target='_blank'
					rel='noreferrer'>
					here
				</a>{' '}
				to access the new account request form.
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
					rules={[{ required: false, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., UPS Landed Cost' />
				</Form.Item>
				<Form.Item
					label='Account Number'
					name='account_number'
					rules={[{ required: false, message: 'Account Number is required' }]}>
					<Input placeholder='Account Number' maxLength={20} />
				</Form.Item>
				<Form.Item
					label='Client ID'
					name='clientId'
					rules={[{ required: true, message: 'Client ID is required.' }]}
				>
					<Input placeholder='Client ID' maxLength={100} />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='Client Secret'
					name='clientSecret'
					rules={[{ required: true, message: 'Client Secret is required.' }]}
				>
					<Input placeholder='Client Secret' maxLength={100} />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-ups-api-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your UPS Landed Cost Quote Client ID and Client Secret?
					</a>
				</div>

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
