import React, { Fragment, useCallback, useState, useEffect } from 'react'
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

	useEffect(() => {
		if (props.connectionSettings) {
			// Reset form fields when connectionSettings changes
			form.setFieldsValue(props.connectionSettings)
		}
	}, [props.connectionSettings, form])

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
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    required={true}
                    rules={[{ required: !connectionState.testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., Southeastern LTL' />
				</Form.Item>
				<Form.Item
					label='Customer Account Number'
					name='customer_account_number'
                    required={true}
                    rules={[{ required: connectionState.testType, message: 'Customer Account Number is required' }]}>
					<Input placeholder='Customer Account Number' />
				</Form.Item>

                <Form.Item
                    label='Username'
                    name='username'
                    required={true}
                    rules={[{ required: connectionState.testType, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    required={true}
                    rules={[{ required: connectionState.testType, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<Row gutter={30}>
					<Col span={12}>
                        <Form.Item
							label='Customer Address'
							name='customer_name'
                            required={true}
                            rules={[{ required: connectionState.testType, message: 'Customer Name is required' }]}>
							<Input type='text' placeholder='Customer Name' />
						</Form.Item>
					</Col>
					<Col span={12}>
                        <Form.Item
							style={{ marginTop: '2em' }}
							name='customer_street_address'
                            required={true}
							rules={[
								{
                                    required: connectionState.testType,
									message: 'Customer Street Address is required',
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
                            required={true}
                            rules={[{ required: connectionState.testType, message: 'Customer City is required' }]}>
							<Input type='text' placeholder='Customer City' />
						</Form.Item>
					</Col>

					<Col span={12}>
                        <Form.Item
							name='customer_state'
                            required={true}
                            rules={[{ required: connectionState.testType, message: 'Customer State is required' }]}>
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
                            required={true}
                            rules={[
                                { required: connectionState.testType, message: 'Customer Zip Code is required' },
                            ]}>
							<Input type='text' placeholder='Customer Zip Code' />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					className='mb-1'
					label='Third Party Account Number'
					name='third_party_account_number'
                    required={thirdPartyCheck}
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

				<div>
					<a
						href='https://eniture.com/bigcommerce-sefl-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your SEFL account credentials?
					</a>
				</div>

				<Form.Item
					className='mt-1'
					name='access_level'
					label='Access Level'
                    required={true}
					rules={[{ required: connectionState.testType, message: 'Access Level is required' }]}>
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
        isInstalling: state.isInstalling,
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
