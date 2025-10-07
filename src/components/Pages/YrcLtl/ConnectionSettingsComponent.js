import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const [rates, setRates] = useState(0)
	const dispatch = useDispatch()
    const { connectionSettings, token, carrierId, isInstalling } = useSelector(state => state)

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
			yrc_rates: rates,
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
				<strong>Note!</strong> You must have a YRC account to use this
				application. If you don't have one, contact YRC at 1-800-610-6500.
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
                    rules={[{ required: !testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., YRC National' />
				</Form.Item>
				<Form.Item
					label='Business ID'
					name='business_id'
                    rules={[{ required: testType, message: 'Business ID is required' }]}>
					<Input placeholder='Business ID' />
				</Form.Item>
				<Form.Item
					label='Username'
					name='username'
                    rules={[{ required: testType, message: 'Username is required' }]}>
					<Input placeholder='Username' />
				</Form.Item>
				<Form.Item
					label='Password'
					name='password'
                    rules={[{ required: testType, message: 'Password is required' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<Row gutter={30} className='mb-1'>
					<Col xl={8} lg={12} md={12} sm={16} xs={16}>
						<label htmlFor=''>
							YRC rates my freight based on weight and...
						</label>
					</Col>
					<Col xl={16} lg={12} md={12} sm={8} xs={8}>
						<Radio
							value='freight_class'
							onChange={() => setRates(0)}
							checked={rates === 0}>
							Freight class
						</Radio>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col xl={8} lg={12} md={12} sm={16} xs={16}>
						<label htmlFor=''> </label>
					</Col>
					<Col xl={16} lg={12} md={12} sm={8} xs={8} className='mb-3'>
						<Radio
							value='dimensions'
							onChange={() => setRates(1)}
							checked={rates === 1}>
							Dimensions
						</Radio>
					</Col>
				</Row>

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
