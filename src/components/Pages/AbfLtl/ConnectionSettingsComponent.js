import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
	const [rates, setRates] = useState('ShipAff')
	const { connectionSettings, token, carrierId } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {
		if (connectionSettings)
			setRates(connectionSettings?.request_freight_quotes ?? 'ShipAff')
	}, [connectionSettings])

	const onFinish = values => {
		values = {
			...values,
			testType,
			carrierId,
			installed_carrier_id: carrierId,
			request_freight_quotes: rates,
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
				<strong>Note!</strong> You must have a ABF Freight account to use
				this application. If you do not have one, contact ABF Freight at
				800-610-5544.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size='large'
				initialValues={connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='ID'
					name='business_id'
					rules={[{ required: true, message: 'Business ID' }]}>
					<Input placeholder='Business ID' />
				</Form.Item>
				<Row gutter={30} className='mb-1'>
					<Col xl={16} lg={12} md={12} sm={8} xs={8}>
						<Radio
							onChange={() => setRates('ShipAff')}
							defaultChecked
							checked={rates === 'ShipAff'}>
							Request LTL freight quotes as the shipper
						</Radio>
					</Col>
				</Row>
				<Row gutter={30} className='mb-1'>
					<Col xl={16} lg={12} md={12} sm={8} xs={8}>
						<Radio
							onChange={() => setRates('TPBPay')}
							checked={rates === 'TPBPay'}>
							Request LTL freight quotes as a 3rd party
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
