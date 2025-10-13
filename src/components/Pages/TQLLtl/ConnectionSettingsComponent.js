import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
    const { connectionSettings, token, carrierId, isInstalling } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

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
				</a>
				.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
				onFinish={onFinish}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    required={true}
                    rules={[{ required: !testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., TQL' />
				</Form.Item>
				<Form.Item
					label='Client ID'
					name='clientId'
                    required={true}
                    rules={[{ required: testType, message: 'Client ID is required' }]}>
					<Input placeholder='Client ID' />
				</Form.Item>
				<Form.Item
					label='Client Secret'
					name='clientSecret'
                    // required={true}
                    // rules={[{ required: testType, message: 'Client Secret is required' }]}
					>
					<Input placeholder='Client Secret' />
				</Form.Item>
				<Form.Item
					label='Username'
					name='traxUsername'
                    required={true}
                    rules={[{ required: testType, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					label='Password'
					name='traxPassword'
                    required={true}
                    rules={[{ required: testType, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='Subscription Key'
					name='subscriptionKey'
                    required={true}
                    rules={[{ required: testType, message: 'Subscription Key is required' }]}>
					<Input type='text' placeholder='Subscription Key' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-tql-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your TQL API credentials?
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
