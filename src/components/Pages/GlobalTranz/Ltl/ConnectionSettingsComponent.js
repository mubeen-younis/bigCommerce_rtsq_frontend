import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Select } from 'antd'
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
}

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [apiType, setApiType] = useState('GTZ')
	const [state, setState] = useState({
		global_tranz: initialValues,
		cerasis: initialValues,
		promo_code: '',
	})
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const { fdoCouponInfo, fdoCouponCarrierInfo, token } = useSelector(
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
			setApiType(props.connectionSettings?.api_type || 'GTZ')
			setState({
				global_tranz: {
					...initialValues,
					...props.connectionSettings?.global_tranz,
				},
				cerasis: { ...initialValues, ...props.connectionSettings?.cerasis },
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

		if (fdoCouponCarrierInfo)
			values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false

		props.postData(values, props.token)
	}

	const updateFormFields = useCallback(
		apiType => {
			const data =
				apiType === 'GTZ'
					? props?.connectionSettings?.global_tranz ?? {}
					: props?.connectionSettings?.cerasis ?? {}

			form.setFieldsValue({
				customer_id: data?.customer_id || '',
				user_name: data?.user_name || '',
				password: data?.password || '',
				access_key: data?.access_key || '',
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
				: { ...state.cerasis, promo_code: state.promo_code },
		[apiType, state.cerasis, state.global_tranz, state.promo_code]
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
				<div className={'note-bx'}>
					<strong>Note!</strong> You must have a GlobalTranz account to use
					this application. If you do not have one contact GlobalTranz at
					866-275-1407.
				</div>
				<PromoCodeNote carrierName='GlobalTranz' />

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
							value={apiType}
							onChange={type => {
								setApiType(type)
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
					) : (
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
					)}
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
