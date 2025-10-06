import React, { Fragment, useCallback, useEffect, useState } from 'react'
import {
	Form,
	Input,
	Button,
	Space,
	Skeleton,
	Row,
	Col,
	Checkbox,
	Radio,
	Select,
} from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'

import { postData } from '../../../../Actions/Action'
import types from '../../../../Stores/types'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [form] = Form.useForm()
	const [accountType, setAccountType] = useState('shipper')
	const dispatch = useDispatch()
    const { connectionSettings, token, FedexLTLApiType, isInstalling } = useSelector(state => state)
	const url = 'https://eniture.com/bigcommerce-fedex-freight-api-connection-instructions/'

	useEffect(() => {
		if (connectionSettings) {
			if(!(connectionSettings?.api_type) && (connectionSettings?.carrierId)){
				connectionSettings['api_type'] = 'legacy_api'
			}
			dispatch({
				type: types.SET_FEDEX_LTL_API_TYPE,
				payload: connectionSettings?.api_type ?? 'new_api',
			})
		}
	}, [connectionSettings, dispatch])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	useEffect(() => {
		form.validateFields()
	}, [accountType, form])

	const copyBillingAdressValues = useCallback(
		copy => {
			const fields = [
				'billing_address',
				'billing_city',
				'billing_state',
				'billing_zip',
				'billing_country',
			]

			if (copy) {
				const copiedValues = form.getFieldsValue(fields)

				form.setFieldsValue({
					physical_address: copiedValues[fields[0]],
					physical_city: copiedValues[fields[1]],
					physical_state: copiedValues[fields[2]],
					physical_zip: copiedValues[fields[3]],
					physical_country: copiedValues[fields[4]],
				})
			} else {
				form.setFieldsValue({
					physical_address: '',
					physical_city: '',
					physical_state: '',
					physical_zip: '',
					physical_country: '',
				})
			}
		},
		[form]
	)

	const onFinish = values => {
		values = { ... props.connectionSettings, ...values, api_type: FedexLTLApiType}
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId
		values.account_type = accountType

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
				<strong>Note!</strong> You must have a freight enabled Fedex account
				to use this application. If you do not have one, contact Fedex at
				800-463-3339 or{' '}
				<a
					href='http://www.fedex.com/us/oadr/'
					target='_blank'
					rel='noreferrer'>
					register online
				</a>
				.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				form={form}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: isInstalling ? !connectionState.testType : false, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., FedEx LTL' />
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
								type: types.SET_FEDEX_LTL_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>

				{ FedexLTLApiType == 'new_api' ? (
					<>
                        <Form.Item
                            label='API Key'
                            name='clientId'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'API Key is required' }]}
                        >
							<Input placeholder='API Key' maxLength={100} />
						</Form.Item>

                        <Form.Item
                            className='mb-0'
                            label='Secret Key'
                            name='clientSecret'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Secret Key is required' }]}
                        >
							<Input placeholder='Secret Key' maxLength={100} />
						</Form.Item>

						<div className='mb-1'>
							<a
								href={url}
								target='_blank'
								rel='noreferrer'
							>
								How to obtain your FedEx Freight API Key and Secret Key?
							</a>
						</div>
					</>
				) : (
					<>
                        <Form.Item
                            label='Billing Account Number'
                            name='account_number'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Billing Account Number is required' }]}> 
							<Input placeholder='Billing Account Number' maxLength={50} />
						</Form.Item>

                        <Form.Item
                            label='Meter Number'
                            name='meter_number'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Meter Number is required' }]}> 
							<Input placeholder='Meter Number' maxLength={50} />
						</Form.Item>

                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Password is required' }]}> 
							<Input type='text' placeholder='Password' maxLength={100} />
						</Form.Item>

                        <Form.Item
                            label='Authentication Key'
                            name='api_access_key'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Authentication Key is required' }]}> 
							<Input placeholder='Authentication Key' />
						</Form.Item>
					</>
				)}

				<Form.Item
					label='Shipper Account Number'
					name='shipping_account_number'
					rules={[
						{
							required: accountType === 'shipper',
							message: 'Shipper Account Number is required',
						},
					]}>
					<Input type='text' placeholder='Shipper Account Number' maxLength={50} />
				</Form.Item>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							label='Billing Address'
							name='billing_address'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Billing Address is required' }]}>
							<Input type='text' placeholder='Billing Address' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='City'
							style={{ marginTop: '2em' }}
							name='billing_city'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'City is required' }]}>
							<Input type='text' placeholder='City' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='State e.g.CA'
							name='billing_state'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'State is required' }]}>
							<Input
								type='text'
								placeholder='State e.g. CA'
								maxLength={2}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='Zip Code'
							name='billing_zip'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Zip Code is required' }]}>
							<Input type='text' placeholder='Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='Country'
							name='billing_country'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Country is required' }]}>
							<Input
								type='text'
								placeholder='Country e.g. US'
								maxLength={2}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='remember'>
					<Checkbox
						onChange={e => copyBillingAdressValues(e.target.checked)}>
						Copy billing address to physical address.
					</Checkbox>
				</Form.Item>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							label='Physical Address'
							name='physical_address'
							rules={[
								{ required: isInstalling ? connectionState.testType : true, message: 'Shipping Address is required' },
							]}>
							<Input type='text' placeholder='Shipping Address' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='City'
							style={{ marginTop: '2em' }}
							name='physical_city'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'City is required' }]}>
							<Input type='text' placeholder='City' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='State e.g.CA'
							name='physical_state'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'State is required' }]}>
							<Input
								type='text'
								placeholder='State e.g. CA'
								maxLength={2}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='Zip Code'
							name='physical_zip'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Zip Code is required' }]}>
							<Input type='text' placeholder='Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='Country'
							name='physical_country'
							rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Country is required' }]}>
							<Input
								type='text'
								placeholder='Country e.g. US'
								maxLength={2}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					className='mb-1'
					label='Third Party Account Number'
					name='third_party_account'
					rules={[
						{
							required: accountType === 'thirdParty',
							message: 'Third Party Account Number is required',
						},
					]}>
					<Input type='text' />
				</Form.Item>

				{FedexLTLApiType == 'new_api' ? (
					null
				) : (
					<div>
						<a
							href={url}
							target='_blank'
							rel='noreferrer'
						>
							How to obtain your FedEx Freight API authentication credentials?
						</a>
					</div>
				)}

				<Form.Item
					className='mb-0'
					name='account_type'
					rules={[{ required: false, message: 'Account Type is required' }]}>
					<Radio.Group defaultValue={accountType}>
						<Radio
							value='shipper'
							onClick={() => {
								setAccountType('shipper')
								form.validateFields()
							}}>
							Test Shipper Account Number
						</Radio>
						<Radio
							value='thirdParty'
							onClick={() => {
								setAccountType('thirdParty')
								form.validateFields(['thirdParty'])
							}}>
							Test Third Party Account Number
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
							loading={false}
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
