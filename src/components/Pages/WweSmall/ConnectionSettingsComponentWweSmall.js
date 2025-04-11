import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Select, Checkbox } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import PromoCodeNote from '../../PromoCodeNote'
import PromoCodeField from '../../PromoCodeField'
import { getFDOCouponCarrierInfo } from '../../../Actions/FDOActions'
import types from '../../../Stores/types'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const { fdoCouponInfo, fdoCouponCarrierInfo, token } = useSelector(
		state => state
	)
	const dispatch = useDispatch()
	const { connectionSettings, WweSmallApiType } = useSelector(state => state)

	useEffect(() => {
		dispatch(
			getFDOCouponCarrierInfo(
				token,
				'small-package',
				fdoCouponInfo ? fdoCouponInfo?.code ?? '' : ''
			)
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, token])

	useEffect(() => {
		if (connectionSettings) {
			if (!(connectionSettings?.api_type) && (connectionSettings?.carrierId)) {
				connectionSettings['api_type'] = 'legacy_api'
			}

			dispatch({
				type: types.SET_WWE_SMALL_API_TYPE,
				payload: connectionSettings?.api_type ?? 'new_api',
			})
		}
	}, [connectionSettings, dispatch])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values = { ...connectionSettings, ...values, api_type: WweSmallApiType }
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
					href='https://wwex.com/our-technology/e-commerce-solutions'
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
				<Form.Item label='Which API Will You Connect To?' name='api_type'>
					<Select
						defaultValue={!connectionSettings?.api_type && connectionSettings?.carrierId ? 'legacy_api' : 'new_api'}
						options={[
							{ label: 'Legacy API', value: 'legacy_api' },
							{ label: 'New API', value: 'new_api' },
						]}
						onChange={opt =>
							dispatch({
								type: types.SET_WWE_SMALL_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>
				{WweSmallApiType == 'new_api' ? (
					<>
						<Form.Item
							label='Client ID'
							name='clientId'
							rules={[{ required: true, message: 'Client ID' }]}
						>
							<Input placeholder='Client ID' maxLength={100} />
						</Form.Item>
						<Form.Item
							className='mb-1'
							label='Client Secret'
							name='clientSecret'
							rules={[{ required: true, message: 'Client Secret' }]}
						>
							<Input placeholder='Client Secret' maxLength={100} />
						</Form.Item>

						<div>
							<a
								href='https://eniture.com/bigcommerce-worldwide-express-api-connection-instructions/'
								target='_blank'
								rel='noreferrer'
							>
								How to obtain your Worldwide Express Client ID and Client Secret?
							</a>
						</div>

						<Form.Item
							className='mt-1'
							label='Username'
							name='new_api_username'
							rules={[{ required: false, message: 'Username' }]}>
							<Input placeholder='Username' />
						</Form.Item>
						<Form.Item
							label='Password'
							name='new_api_password'
							rules={[{ required: false, message: 'Password' }]}>
							<Input type='text' placeholder='Password' />
						</Form.Item>
					</>
				) : (
					<>
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
							className='mb-1'
							label='Authentication Key'
							name='authentication_key'
							rules={[{ required: true, message: 'Authentication Key' }]}>
							<Input placeholder='Authentication Key' />
						</Form.Item>
					</>
				)}

				{WweSmallApiType != 'new_api' && (
					<div>
						<a
							href='https://eniture.com/bigcommerce-worldwide-express-api-connection-instructions/'
							target='_blank'
							rel='noreferrer'
						>
							How to obtain your Worldwide Express API credentials?
						</a>
					</div>
				)}

				<PromoCodeField />

				<Form.Item
					name="requiresNmfc"
					valuePropName="checked" // Ensures it works properly as a boolean
				>
					<Checkbox>My account requires NMFC numbers</Checkbox>
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
