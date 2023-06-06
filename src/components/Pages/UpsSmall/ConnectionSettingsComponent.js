import React, { Fragment, useEffect, useState } from 'react'
import {
	Form,
	Input,
	Button,
	Space,
	Skeleton,
	Select,
	Row,
	Col,
	Typography,
} from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'

import { postData } from '../../../Actions/Action'
import types from '../../../Stores/types'
const { Option } = Select
const { Title } = Typography

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [component /* setComponent */] = useState(1)
	const dispatch = useDispatch()
	const { connectionSettings, token, UpsSmallApiType } = useSelector(state => state)

	useEffect(() => {
		if (connectionSettings) {
			dispatch({
				type: types.SET_UPS_SMALL_API_TYPE,
				payload: connectionSettings?.api_type ?? 'legacy_api',
			})
		}
	}, [connectionSettings, dispatch])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values = { ... props.connectionSettings, ...values, api_type: UpsSmallApiType}
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
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
				<div className={'note-bx'}>
					<strong>Note! </strong>
					{+component === 1 ? (
						<span>
							You must have a UPS Small account to use this
							application. If you do not have one contact UPS at
							800-742-5877 or{' '}
							<a
								href='https://www.ups.com/lasso/login'
								target='_blank'
								rel='noreferrer'>
								register online
							</a>
							.
						</span>
					) : (
						<span>
							You must have a UPS account or be using UPS through
							Shopify Shipping to use this app.
						</span>
					)}
				</div>

				{+component === 1 ? (
					<>
						<Form.Item label='Which API Will You Connect To?' name='api_type'>
							<Select
								defaultValue='legacy_api'
								options={[
									{ label: 'Legacy API', value: 'legacy_api' },
									{ label: 'New API', value: 'new_api' },
								]}
								onChange={opt =>
									dispatch({
										type: types.SET_UPS_SMALL_API_TYPE,
										payload: opt,
									})
								}
							/>
						</Form.Item>

						{ UpsSmallApiType == 'new_api' ? (
						<>
							<Form.Item
								label='Client ID'
								name='clientId'
								rules={[{ required: true, message: 'Client ID' }]}
							>
								<Input placeholder='Client ID' maxLength={100}/>
							</Form.Item>

							<Form.Item
								label='Client Secret'
								name='clientSecret'
								rules={[{ required: true, message: 'Client Secret' }]}
							>
								<Input placeholder='Client Secret' maxLength={100}/>
							</Form.Item>

							<Form.Item
								label='Account Number'
								name='new_api_account_number'
								rules={[{ required:true, message: 'Account Number' }]}
							>
								<Input placeholder='Account Number' maxLength={8}/>
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
								label='API Access Key '
								name='ups_api_access_key'
								rules={[{ required: true, message: 'API Access Key' }]}>
								<Input placeholder='API Access Key' />
							</Form.Item>
						</>
						)}
					</>
				) : (
					<>
						<>
							<Form.Item label='Shopify Plan' name='shopify_plan'>
								<Select defaultValue='basic'>
									<Option value='basic'>Basic</Option>
									<Option value='shopify'>Shopify</Option>
									<Option value='advanced'>Advanced</Option>
								</Select>
							</Form.Item>

							<Row gutter={30}>
								<Col span={6}>
									<Title level={5}>Domestic Services:</Title>
								</Col>
								<Col span={6}></Col>
								<Col span={6}>
									<Title level={5}>International Services:</Title>{' '}
								</Col>
								<Col span={6}></Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>Next Day Air discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
								<Col span={6}>Worldwide Express discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>Next Day Air Saver discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
								<Col span={6}>Worldwide Saver discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>2nd Day Air discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
								<Col span={6}>World Expedited discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>3 Day Select discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
								<Col span={6}>Standard to Canada discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>3 Day Select minimum ($)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
								<Col span={6}>Standard to Canada minimum ($)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>Ground discount (%)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
							<br />
							<Row gutter={30}>
								<Col span={6}>Ground minimum ($)</Col>
								<Col span={6}>
									<Input type='number' min={1} />
								</Col>
							</Row>
						</>
					</>
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
