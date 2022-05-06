import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import PromoCodeNote from '../../PromoCodeNote'
import PromoCodeField from '../../PromoCodeField'
import { getFDOCouponCarrierInfo } from '../../../Actions/FDOActions'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const { fdoCouponInfo, fdoCouponCarrierInfo, token } = useSelector(
		state => state
	)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			getFDOCouponCarrierInfo(
				token,
				'small-package',
				fdoCouponInfo ? fdoCouponInfo?.code ?? '' : ''
			)
		)
	}, [dispatch, token])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId

		if (fdoCouponCarrierInfo)
			values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false

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
				<strong>Note!</strong> You must have a Worldwide Express account to
				use this application. If you do not have one, click{' '}
				<a
					href='https://eniture.com/request-worldwide-express-account-number/'
					target='_blank'
					rel='noreferrer'>
					here
				</a>{' '}
				to access the new account request form.
			</div>
			<PromoCodeNote carrierName='Worldwide Express Small' />

			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Account Number'
					name='account_number'
					rules={[{ required: true, message: 'Account Number' }]}>
					<Input placeholder='Account Number' />
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
					label='Authentication Key'
					name='authentication_key'
					rules={[{ required: true, message: 'Authentication Key' }]}>
					<Input placeholder='Authentication Key' />
				</Form.Item>
				<PromoCodeField />

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
