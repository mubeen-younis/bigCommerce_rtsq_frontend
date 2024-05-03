import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Select, Row, Col } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import types from '../../../Stores/types'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
	const { connectionSettings, token, carrierId } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {
		if (connectionSettings) {
			dispatch({
				type: types.SET_DAYROSS_API_TYPE,
				payload: connectionSettings?.api_type ?? 'general_freight',
			})
		}
	}, [connectionSettings, dispatch])

	const onFinish = values => {
		values = {
			...values,
			testType,
			carrierId,
			installed_carrier_id: carrierId,
			sender_country_code:
				values?.api_type === 'general_freight' ? 'US' : 'CA',
		}

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
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have a shipping account with Day &
				Ross to use this application. If you do not please contact Day & Ross
				at 866-329-7677 or{' '}
				<a
					href='mailto:custservice@dayandrossinc.ca'
					target='_blank'
					rel='noreferrer'>
					custservice@dayandrossinc.ca
				</a>{' '}
				. Once you have received please make sure to do step number 2.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
				onFinish={onFinish}>
				<Form.Item label='Which API Will You Connect To?' name='api_type'>
					<Select
						defaultValue='general_freight'
						options={[
							{ label: 'General Freight', value: 'general_freight' },
							{ label: 'Sameday', value: 'sameday' },
						]}
						onChange={opt =>
							dispatch({
								type: types.SET_DAYROSS_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>
				<Form.Item
					label='Billing Account Number'
					name='billing_account_number'
					rules={[{ required: true, message: 'Billing Account Number' }]}>
					<Input placeholder='Billing Account Number' />
				</Form.Item>
				<Form.Item
					label='Account Number for shipments to USA'
					name='account_number'>
					<Input placeholder='Account Number for shipments to USA' />
				</Form.Item>
				<Form.Item
					label='Email'
					name='email'
					rules={[{ required: true, message: 'Email' }]}>
					<Input placeholder='Email' />
				</Form.Item>
				<Form.Item
					style={{ marginBottom: '10px' }}
					label='Password'
					name='password'
					rules={[{ required: true, message: 'Password' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-day-ross-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your Day & Ross API credentials?
					</a>
				</div>

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
