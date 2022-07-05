import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const [rates, setRates] = useState(0)
	const dispatch = useDispatch()
	const { connectionSettings, token, carrierId } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {
		if (connectionSettings) setRates(connectionSettings?.yrc_rates ?? 0)
	}, [connectionSettings])

	const onFinish = values => {
		values = {
			...values,
			testType,
			carrierId,
			installed_carrier_id: carrierId,
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
				<b>Note!</b> You must have a freight enabled TQL account to use this
				application. If you do not have one, fill this form to{' '}
				<a href='https://register.tql.com/' target='_blank' rel='noreferrer'>
					register online
				</a>.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Client ID'
					name='clientId'
					rules={[{ required: true, message: 'Client ID' }]}>
					<Input placeholder='Client ID' />
				</Form.Item>
				<Form.Item
					label='Username'
					name='traxUsername'
					rules={[{ required: true, message: 'Username' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					label='Password'
					name='traxPassword'
					rules={[{ required: true, message: 'Password' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>
				<Form.Item
					label='Subscription Key'
					name='subscriptionKey'
					rules={[{ required: true, message: 'Subscription Key' }]}>
					<Input type='text' placeholder='Subscription Key' />
				</Form.Item>

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
