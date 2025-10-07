import React, { Fragment, useState } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
    const { connectionSettings, token, carrierId, isInstalling } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)
	const [formData, setFormData] = useState({});

	const handleFormChange = (changedValues, allValues) => {
	  // Update the form data whenever it changes
	  setFormData(allValues);
	};

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
				onFinish={onFinish}
				onValuesChange={handleFormChange}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: !testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., UPS via ShipEngine' maxLength={100}/>
				</Form.Item>
				<Form.Item
					label='Carrier ID'
					name='shipengine_carrier_id'
					rules={[{ required: formData?.shipengine_api_key != '' && formData?.shipengine_api_key != null, message: 'Carrier ID is required' }]}>
					<Input placeholder='Carrier ID' maxLength={100}/>
				</Form.Item>
        		<Form.Item
					className='mb-1'
					label='ShipEngine API Key'
					name='shipengine_api_key'
					rules={[{ required: formData?.shipengine_carrier_id != '' && formData?.shipengine_carrier_id != null, message: 'ShipEngine API Key is required' }]}>
					<Input placeholder='ShipEngine API Key' maxLength={100}/>
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-shipengine-ups-api-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your ShipEngine Carrier ID and API Key?
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
