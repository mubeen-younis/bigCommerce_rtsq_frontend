import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Select, Checkbox } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import PromoCodeNote from '../../../PromoCodeNote'
import PromoCodeField from '../../../PromoCodeField'
import { getFDOCouponCarrierInfo } from '../../../../Actions/FDOActions'

const { Option } = Select

const initialValues = {
	customer_id: '',
	user_name: '',
	password: '',
	access_key: '',
	clientId: '',
	clientSecret: '',
}

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [apiType, setApiType] = useState('GTZ')
	const [isNewApi, setIsNewApi] = useState('')
	const [state, setState] = useState({
		global_tranz: initialValues,
		cerasis: initialValues,
		gtz_new_api: initialValues,
		promo_code: '',
	})
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const { fdoCouponInfo, fdoCouponCarrierInfo, token, carrier_type, carrierId } = useSelector(
		state => state
	)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		if (
			props.connectionSettings &&
			props.connectionSettings !== null &&
			typeof props.connectionSettings === 'object' &&
			Object.keys(props.connectionSettings).length > 1
		) {

			if (props.connectionSettings?.carrierId !== carrierId) {
				props.connectionSettings.api_type = 'NEWAPI'
				setIsNewApi(true)
			}

			props.connectionSettings?.api_type == 'NEWAPI' ? setApiType('NEWAPI') : props.connectionSettings?.api_type == 'CRS' ? setApiType('CRS') : setApiType('GTZ')
			setState({
				global_tranz: {
					...initialValues,
					...props.connectionSettings?.global_tranz,
				},
				cerasis: { ...initialValues, ...props.connectionSettings?.cerasis },
				gtz_new_api: { ...initialValues, ...props.connectionSettings?.gtz_new_api },
				promo_code: props?.connectionSettings?.promo_code || '',
			})
			setConnectionState(prevState => ({
				...prevState,
				skeleton_loading: false,
			}))

			dispatch({
				type: 'SET_CARRIER_TYPE',
				payload: props.connectionSettings?.api_type || 'GTZ',
			})
		}

		setMounted(true)
	}, [dispatch, props.connectionSettings])

	useEffect(() => {
		dispatch(
			getFDOCouponCarrierInfo(
				token,
				'gtz-ltl',
				fdoCouponInfo ? fdoCouponInfo?.code ?? '' : ''
			)
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, token])

	const handleStateChange = useCallback((e, index) => {
		setState(prevState => ({
			...prevState,
			[index]: {
				...prevState[index],
				[e.target.name]: e.target.value,
			},
		}))
	}, [])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values = {
			testType: connectionState.testType,
			installed_carrier_id: props.carrierId,
			carrierId: props.carrierId,
			api_type: apiType,
			...state,
			...values,
		}
		values['api_type'] = isNewApi === 'NEWAPI' ? 'NEWAPI' : apiType

		if (fdoCouponCarrierInfo)
			values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false

		props.postData(values, props.token)
	}

	const updateFormFields = useCallback(
		apiType => {
			const data =
				apiType === 'GTZ'
					? props?.connectionSettings?.global_tranz ?? {}
					: apiType === 'CRS' ? props?.connectionSettings?.cerasis ?? {}
						: props?.connectionSettings?.gtz_new_api ?? {}

			form.setFieldsValue({
				customer_id: data?.customer_id || '',
				user_name: data?.user_name || '',
				password: data?.password || '',
				access_key: data?.access_key || '',
				clientId: data?.clientId || '',
				clientSecret: data?.clientSecret || '',
			})
		},
		[
			form,
			props?.connectionSettings?.cerasis,
			props?.connectionSettings?.global_tranz,
		]
	)

	const populateInitialValues = useCallback(
		() =>
			apiType === 'GTZ'
				? { ...state.global_tranz, promo_code: state.promo_code }
				: apiType === 'CRS' ? { ...state.cerasis, promo_code: state.promo_code }
					: { ...state.gtz_new_api, promo_code: state.promo_code },
		[apiType, state.cerasis, state.global_tranz, state.gtz_new_api, state.promo_code]
	)

	if (
		props.connectionSettings === null ||
		props.connectionSettings === undefined ||
		!mounted
	) {
		return <Skeleton active />
	} else {
		if (Object.keys(props.connectionSettings)?.length === 0) {
			props.connectionSettings.access_level = 'pro'
		}
	}

	return (
		!connectionState.skeleton_loading && (
			<Fragment>
				{carrier_type === 'NEWAPI' ? (
					<>
						<div className={'note-bx'}>
							<strong>Note!</strong> You must have a Worldwide Express account to
							use this application. If you do not have one, click{' '}
							<a href='https://wwex.com/our-technology/e-commerce-solutions'
								target='_blank'
								rel='noreferrer'>
								here
							</a>{' '}
							to access the new account request form.
						</div>
						<PromoCodeNote carrierName='Worldwide Express LTL' />
					</>
				) : (
					<>
						<div className={'note-bx'}>
							<strong>Note!</strong> You must have a GlobalTranz account to use
							this application. If you do not have one contact GlobalTranz at
							866-275-1407 or{' '}
							<a href='https://www.globaltranz.com/contact/request-a-quote/'
								target='_blank'
								rel='noreferrer'>
								register
							</a>{' '}online.
						</div>
						<PromoCodeNote carrierName='GlobalTranz' />
					</>
				)}

				<Form
					layout='vertical'
					name='connection_settings'
					className='connection-settings'
					size={'large'}
					onFinish={onFinish}
					initialValues={populateInitialValues()}
					form={form}>
					<Form.Item
						label='Which API Will You Connect To?'
						name='api_type'>
						<Select
							defaultValue={apiType}
							name='api_type'
							value={apiType}
							onChange={type => {
								setApiType(type)
								setIsNewApi(type)
								dispatch({
									type: 'SET_CARRIER_TYPE',
									payload: type,
								})

								dispatch({
									type: 'GET_SERVICES',
									payload: null,
								})
								dispatch({
									type: 'SAVE_CARRIER_TAB_SETTINGS',
									payload: null,
								})
								updateFormFields(type)
							}}>
							<Option value='GTZ'>GlobalTranz</Option>
							<Option value='CRS'>Cerasis</Option>
							<Option value='NEWAPI'>New API</Option>
						</Select>
					</Form.Item>

					{apiType === 'GTZ' ? (
						<>
							<Form.Item
								label='Customer ID'
								name='customer_id'
								rules={[{ required: true, message: 'Customer ID' }]}
								requiredMark>
								<Input
									name='customer_id'
									placeholder='Customer ID'
									//value={state.global_tranz.customer_id}
									onChange={e =>
										handleStateChange(e, 'global_tranz')
									}
								//required
								/>
							</Form.Item>

							<Form.Item
								label='Username'
								// name='gtz_user_name'
								name='user_name'
								rules={[{ required: true, message: 'Username' }]}
								requiredMark>
								<Input
									name='user_name'
									placeholder='Username'
									//value={state.global_tranz.user_name}
									onChange={e =>
										handleStateChange(e, 'global_tranz')
									}
								/>
							</Form.Item>

							<Form.Item
								label='Password'
								name='password'
								// name='gtz_password'
								rules={[{ required: true, message: 'Password' }]}
								requiredMark>
								<Input
									name='password'
									type='text'
									placeholder='Password'
									//value={state.global_tranz.password}
									onChange={e =>
										handleStateChange(e, 'global_tranz')
									}
								/>
							</Form.Item>

							<Form.Item
								className='mb-1'
								label='Access Key'
								name='access_key'
								// name='gtz_access_key'
								rules={[{ required: true, message: 'Access Key' }]}
								requiredMark>
								<Input
									name='access_key'
									placeholder='Access Key'
									//value={state.global_tranz.access_key}
									onChange={e =>
										handleStateChange(e, 'global_tranz')
									}
								/>
							</Form.Item>
						</>
					) : apiType === 'CRS' ? (
						<>
							<Form.Item
								label='Shipper ID'
								name='customer_id'
								// name='cerasis_customer_id'
								rules={[{ required: true, message: 'Shipper ID' }]}
								requiredMark>
								<Input
									name='customer_id'
									placeholder='Shipper ID'
									//value={state.cerasis.customer_id}
									onChange={e => handleStateChange(e, 'cerasis')}
								/>
							</Form.Item>

							<Form.Item
								label='Username'
								// name='cerasis_user_name'
								name='user_name'
								rules={[{ required: true, message: 'Username' }]}
								requiredMark>
								<Input
									name='user_name'
									placeholder='Username'
									//value={state.cerasis.user_name}
									onChange={e => handleStateChange(e, 'cerasis')}
								/>
							</Form.Item>

							<Form.Item
								label='Password'
								name='password'
								// name='cerasis_password'
								rules={[{ required: true, message: 'Password' }]}
								requiredMark>
								<Input
									name='password'
									type='text'
									placeholder='Password'
									//value={state.cerasis.password}
									onChange={e => handleStateChange(e, 'cerasis')}
								/>
							</Form.Item>

							<Form.Item
								className='mb-1'
								label='Access Key'
								name='access_key'
								// name='cerasis_access_key'
								rules={[{ required: true, message: 'Access Key' }]}
								requiredMark>
								<Input
									name='access_key'
									placeholder='Access Key'
									//value={state.cerasis.access_key}
									onChange={e => handleStateChange(e, 'cerasis')}
								/>
							</Form.Item>
						</>
					) : (
						<>
							<Form.Item
								label='Client ID'
								name='clientId'
								rules={[{ required: true, message: 'Client ID' }]}
							>
								<Input
									placeholder='Client ID'
									maxLength={100}
									name='clientId'
									onChange={e => handleStateChange(e, 'gtz_new_api')}

								/>
							</Form.Item>
							<Form.Item
								className='mb-1'
								label='Client Secret'
								name='clientSecret'
								rules={[{ required: true, message: 'Client Secret' }]}
							>
								<Input
									placeholder='Client Secret'
									maxLength={100}
									name='clientSecret'
									onChange={e => handleStateChange(e, 'gtz_new_api')}

								/>
							</Form.Item>

							<div>
								<a
									href='https://eniture.com/bigcommerce-globaltranz-connection/'
									target='_blank'
									rel='noreferrer'
								>
									How to obtain your GlobalTranz Client ID and Client Secret?
								</a>
							</div>

							<Form.Item
								className='mt-1'
								label='Username'
								name='user_name'
								rules={[{ required: false, message: 'Username' }]}>
								<Input
									placeholder='Username'
									name='user_name'
									onChange={e => handleStateChange(e, 'gtz_new_api')}

								/>
							</Form.Item>
							<Form.Item
								label='Password'
								name='password'
								rules={[{ required: false, message: 'Password' }]}>
								<Input
									type='text'
									placeholder='Password'
									name='password'
									onChange={e => handleStateChange(e, 'gtz_new_api')}
								/>
							</Form.Item>
						</>
					)}

					{apiType != 'NEWAPI' && (
						<div>
							<a
								href='https://eniture.com/bigcommerce-globaltranz-connection/'
								target='_blank'
								rel='noreferrer'
							>
								How to obtain your GlobalTranz API Credentials?
							</a>
						</div>
					)}

					<PromoCodeField />

					{apiType === 'NEWAPI' && (
						<Form.Item
							name="requiresNmfc"
							valuePropName="checked" // Ensures it works properly as a boolean
						>
							<Checkbox>My account requires NMFC numbers</Checkbox>
						</Form.Item>
					)}

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
