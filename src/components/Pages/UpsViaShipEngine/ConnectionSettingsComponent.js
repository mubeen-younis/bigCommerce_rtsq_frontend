import React, { Fragment, useState } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
	const { connectionSettings, token, carrierId } = useSelector(state => state)

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
				<strong>Note!</strong> The plugin doesn't require a Carrier ID or ShipEngine API Key to return shipping quotes. 
        However, you may find that inputting your account's Carrier ID and ShipEngine API Key results in less expensive shipping quotes. 
        Follow the instructions in the User Guide to locate your Carrier ID and ShipEngine API Key.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Carrier ID'
					name='shipengine_carrier_id'
					rules={[{ required: false, message: 'Business ID' }]}>
					<Input placeholder='Carrier ID' maxLength={100}/>
				</Form.Item>
        		<Form.Item
					label='ShipEngine API Key'
					name='shipengine_api_key'
					rules={[{ required: false, message: 'ShipEngine API Key' }]}>
					<Input placeholder='ShipEngine API Key' maxLength={100}/>
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
