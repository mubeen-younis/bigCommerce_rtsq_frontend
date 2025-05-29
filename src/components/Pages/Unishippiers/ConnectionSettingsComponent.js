import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Select, } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getFDOCouponCarrierInfo } from '../../../Actions/FDOActions'
import types from '../../../Stores/types'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
	const {
		connectionSettings,
		token,
		carrierId,
		fdoCouponInfo,
		fdoCouponCarrierInfo,
		uniShipperSmallApiType
	} = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {
		dispatch(
			getFDOCouponCarrierInfo(
				token,
				'unishippers-small',
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
				type: types.SET_UNISHIPPER_API_TYPE,
				payload: connectionSettings?.api_type ?? 'new_api',
			})
		}
	}, [connectionSettings, dispatch])

	const onFinish = values => {
		values = {
			...values,
			testType,
			carrierId,
			installed_carrier_id: carrierId,
		}
		values = { ...connectionSettings, ...values, api_type: uniShipperSmallApiType }

		if (fdoCouponCarrierInfo)
			values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false

		dispatch(
			postData(
				values,
				'GET_CONNECTION_SETTINGS',
				'submit_connection_settings',
				token
			)
		)
	}

	if (!connectionSettings) return <Skeleton active />

	return (
		<Fragment>
			{uniShipperSmallApiType === 'new_api' ? (
				<>
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
				</>
			) : (
				<>
					<div className={'note-bx'}>
						<strong>Note!</strong> You must have a Unishippers (unishippers.com)
						account to use this application. If you don’t have one, contact
						Unishippers at 1-800-999-8721 and ask to be contacted by a sales
						person from the office serving your area or{' '}
						<a
							href='https://www.unishippers.com/request-shipping-consultation'
							target='_blank'
							rel='noreferrer'>
							click here
						</a>{' '}
						to access the online new account request form.
					</div>
				</>
			)}

			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
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
								type: types.SET_UNISHIPPER_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>
				{uniShipperSmallApiType == 'new_api' ? (
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
								href='https://eniture.com/bigcommerce-unishippers-api-connection-instructions/'
								target='_blank'
								rel='noreferrer'
							>
								How to obtain your Unishippers Client ID and Client Secret?
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
						<Form.Item label='Request Key' name='request_key' className='mb-1'>
							<Input placeholder='Request Key' />
						</Form.Item>
					</>
				)}

				{uniShipperSmallApiType != 'new_api' && (
					<div>
						<a
							href='https://eniture.com/bigcommerce-unishippers-api-connection-instructions/'
							target='_blank'
							rel='noreferrer'
						>
							How to obtain your Unishippers API credentials?
						</a>
					</div>
				)}
<<<<<<< HEAD

				<PromoCodeField />

			

=======
>>>>>>> da4805e4c13ad9d242335824ab20f0bd537eb1fc
				<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
					<Space>
						<Button
							type='primary'
							size='large'
							htmlType='submit'
							name='test'
							onClick={() => handleTypeChange(true)}>
							Test Connection
						</Button>
						<Button
							type='primary'
							size='large'
							htmlType='submit'
							name='save'
							onClick={() => handleTypeChange(false)}>
							Save Settings
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Fragment>
	)
}

export default ConnectionSettingsComponent
