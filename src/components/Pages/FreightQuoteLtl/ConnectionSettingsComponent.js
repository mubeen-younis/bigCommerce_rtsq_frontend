import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

const initialState = {
	username: '',
	password: '',
}

function ConnectionSettingsComponent() {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
    const { connectionSettings, token, carrierId, isInstalling } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {}, [connectionSettings])

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
				<strong>Note!</strong> You must have a freight enabled FreightQuote
				account to use this application. If you do not have one, fill this
				form to{' '}
				<a
					href='https://b2b.freightquote.com/signup.aspx'
					target='_blank'
					rel='noreferrer'>
					click here
				</a>{' '}
				register online.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings ?? initialState}
				autoComplete='off'
				scrollToFirstError
				role='form'
				onFinish={onFinish}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    required={true}
                    rules={[{ required: !testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., FreightQuote' />
				</Form.Item>
				<Form.Item
					label='Username'
					name='username'
                    required={true}
                    rules={[{ required: testType, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='Password'
					name='password'
                    required={true}
                    rules={[{ required: testType, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-freightquote-connection/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your FreightQuote.com account credentials?
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
