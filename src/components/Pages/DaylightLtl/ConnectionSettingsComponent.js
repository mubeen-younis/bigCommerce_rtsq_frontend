import React, { Fragment, useState } from 'react'
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
				<strong>Note!</strong> You must have a DayLight LTL Freight account
				to use this application.
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
					<Input placeholder='e.g., Daylight LTL' />
				</Form.Item>
                <Form.Item
                    label='Username'
                    name='username'
                    required={true}
                    rules={[{ required: testType, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					label='Password'
					name='password'
                    required={true}
                    rules={[{ required: testType, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

                <Form.Item
                    className='mb-1'
                    label='Account Number'
                    name='account_number'
                    required={true}
                    rules={[{ required: testType, message: 'Account Number is required' }]}>
					<Input placeholder='Account Number' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-daylight-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your Daylight Transport account credentials?
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
