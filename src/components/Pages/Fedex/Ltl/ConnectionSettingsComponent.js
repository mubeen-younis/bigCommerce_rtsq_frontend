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
} from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [form] = Form.useForm()
	const [accountType, setAccountType] = useState('shipper')

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
					label='Billing Account Number'
					name='account_number'
					rules={[{ required: true, message: 'Billing Account Number' }]}>
					<Input placeholder='Billing Account Number' />
				</Form.Item>

				<Form.Item
					label='Meter Number'
					name='meter_number'
					rules={[{ required: true, message: 'Meter Number' }]}>
					<Input placeholder='Meter Number' />
				</Form.Item>

				<Form.Item
					label='Password'
					name='password'
					rules={[{ required: true, message: 'Password' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<Form.Item
					label='Authentication Key'
					name='api_access_key'
					rules={[{ required: true, message: 'Authentication Key' }]}>
					<Input placeholder='Authentication Key' />
				</Form.Item>

				<Form.Item
					label='Shipper Account Number'
					name='shipping_account_number'
					rules={[
						{
							required: accountType === 'shipper',
							message: 'Shipper Account Number',
						},
					]}>
					<Input type='text' placeholder='Shipper Account Number' />
				</Form.Item>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							label='Billing Address'
							name='billing_address'
							rules={[{ required: true, message: 'Billing Address' }]}>
							<Input type='text' placeholder='Billing Address' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='City'
							style={{ marginTop: '2em' }}
							name='billing_city'
							rules={[{ required: true, message: 'City' }]}>
							<Input type='text' placeholder='City' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='State e.g.CA'
							name='billing_state'
							rules={[{ required: true, message: 'State' }]}>
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
							rules={[{ required: true, message: 'Zip Code' }]}>
							<Input type='text' placeholder='Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='Country'
							name='billing_country'
							rules={[{ required: true, message: 'Country' }]}>
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
								{ required: true, message: 'Shipping Address' },
							]}>
							<Input type='text' placeholder='Shipping Address' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							// label='City'
							style={{ marginTop: '2em' }}
							name='physical_city'
							rules={[{ required: true, message: 'City' }]}>
							<Input type='text' placeholder='City' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='State e.g.CA'
							name='physical_state'
							rules={[{ required: true, message: 'State' }]}>
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
							rules={[{ required: true, message: 'Zip Code' }]}>
							<Input type='text' placeholder='Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							// label='Country'
							name='physical_country'
							rules={[{ required: true, message: 'Country' }]}>
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
							message: 'Third Party Account Number',
						},
					]}>
					<Input type='text' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-fedex-freight-api-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your FedEx Freight API authentication credentials?
					</a>
				</div>

				<Form.Item
					className='mb-0'
					name='account_type'
					rules={[{ required: true, message: 'Account Type' }]}>
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
