import { Button, Form, Input, Skeleton, Space } from 'antd'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent() {
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
				<strong>Note!</strong> You must have a freight enabled Echo Global
				Logistics account to use this application. If you do not have one,{' '}
				<a href='https://www.echo.com/' target='_blank' rel='noreferrer'>
					register online
				</a>
				.{' '}
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
                    rules={[{ required: isInstalling ? !testType : false, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., Echo' />
				</Form.Item>
				<Form.Item
					label='Account Number'
					name='account_number'
                    rules={[{ required: isInstalling ? testType : true, message: 'Account Number is required' }]}>
					<Input placeholder='Account Number' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='API Key'
					name='api_key'
                    rules={[{ required: isInstalling ? testType : true, message: 'API Key is required' }]}>
					<Input placeholder='API Key' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-echo-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your Echo web services API key?
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
