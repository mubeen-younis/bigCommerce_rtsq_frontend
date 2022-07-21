import React, { Fragment, useCallback, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio } from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [form] = Form.useForm()
	const [thirdPartyCheck, setThirdPartyCheck] = useState(false)

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
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
	} else {
		if (Object.keys(props.connectionSettings)?.length === 0) {
			props.connectionSettings.access_level = 'pro'
		}
	}
	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have an Southeastern LTL Freight
				account to use this application. If you do not have one, contact
				Southeastern LTL Freight.
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
					label='Customer Account Number'
					name='customer_account_number'
					rules={[{ required: true, message: 'Customer Account Number' }]}>
					<Input placeholder='Customer Account Number' />
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

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							label='Customer Address'
							name='customer_name'
							rules={[{ required: true, message: 'Customer Name' }]}>
							<Input type='text' placeholder='Customer Name' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							style={{ marginTop: '2em' }}
							name='customer_street_address'
							rules={[
								{
									required: true,
									message: 'Customer Street Address',
								},
							]}>
							<Input
								type='text'
								placeholder='Customer Street Address'
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							name='customer_city'
							rules={[{ required: true, message: 'Customer City' }]}>
							<Input type='text' placeholder='Customer City' />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name='customer_state'
							rules={[{ required: true, message: 'Customer State' }]}>
							<Input
								type='text'
								placeholder='Customer State e.g. LA'
								maxLength={2}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col span={12}>
						<Form.Item
							name='customer_zip_code'
							rules={[
								{ required: true, message: 'Customer Zip Code' },
							]}>
							<Input type='text' placeholder='Customer Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					label='Third Party Account Number'
					name='third_party_account_number'
					rules={[
						{
							required: thirdPartyCheck,
							message: thirdPartyCheck
								? 'Third Party Account Number'
								: '',
						},
					]}>
					<Input type='text' />
				</Form.Item>

				<Form.Item
					name='access_level'
					label='Access Level'
					rules={[{ required: true, message: 'Access Level' }]}>
					<Radio.Group>
						<Radio
							value='Shipper'
							onChange={() => setThirdPartyCheck(false)}>
							Shipper
						</Radio>
						<Radio
							value='third_party_account_number'
							onChange={() => setThirdPartyCheck(true)}>
							Third Party Account Number
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
