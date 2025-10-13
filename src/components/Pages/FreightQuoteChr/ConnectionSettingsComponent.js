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
				<strong>Note!</strong> You must have an account with C.H. Robinson to
				use this application. If you don't have one, use{' '}
				<a
					href='https://www.chrobinson.com/en-us/contact/connect-with-an-expert/'
					target='_blank'
					rel='noreferrer'>
					this link
				</a>{' '}
				to connect to an expert.
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
					<Input type='text' placeholder='e.g., C.H. Robinson' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='Customer Code'
					name='customer_code'
                    required={true}
                    rules={[{ required: testType, message: 'Customer Code is required' }]}>
					<Input type='text' placeholder='Customer Code' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-ch-robinson-connection/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your C.H. Robinson Customer Code?
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
