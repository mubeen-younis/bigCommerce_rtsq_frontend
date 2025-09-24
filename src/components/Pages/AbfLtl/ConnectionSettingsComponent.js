import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [testType, setTestType] = useState(false)
	const dispatch = useDispatch()
	const [rates, setRates] = useState('ShipAff')
	const [ratesAccount, setRatesAccount] = useState('0')
    const { connectionSettings, token, carrierId, isInstalling } = useSelector(state => state)

	const handleTypeChange = type => setTestType(type)

	useEffect(() => {
		if (connectionSettings)
			setRates(connectionSettings?.request_freight_quotes ?? 'ShipAff')
			setRatesAccount(connectionSettings?.weight_base_account ?? '0')
	}, [connectionSettings])

	const onFinish = values => {
		values = {
			...values,
			testType,
			carrierId,
			installed_carrier_id: carrierId,
			request_freight_quotes: rates,
			weight_base_account:ratesAccount,
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
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: isInstalling ? !testType : false, message: 'Nickname' }]}> 
					<Input placeholder='e.g., Warehouse ABF' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='ID'
					name='business_id'
                    rules={[{ required: isInstalling ? testType : true, message: 'Business ID' }]}> 
					<Input placeholder='Business ID' />
				</Form.Item>	

				<div>
					<a
						href='https://eniture.com/bigcommerce-abf-freight-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your ABF Freight API ID?
					</a>
				</div>

				<Row gutter={30} className='mb-1 mt-2'>
					<Col
						className='gutter-row mb-1'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<label>Request LTL freight quotes as</label>
					</Col>
					<Col xl={24} lg={24} md={24} sm={24} xs={24} className={'mb-1'}>
						<Radio
							onChange={() => setRates('ShipAff')}
							defaultChecked
							checked={rates === 'ShipAff'}>
							shipper
						</Radio>
					</Col>
					<Col xl={24} lg={24} md={24} sm={24} xs={24}>
						<Radio
							onChange={() => setRates('TPBPay')}
							checked={rates === 'TPBPay'}>
							3rd party
						</Radio>
					</Col>
				</Row>

				<Row gutter={30} className='mb-1 mt-2'>
					<Col
						className='gutter-row mb-1'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<label>ABF rates my freight on weight,</label>
					</Col>
					<Col xl={24} lg={24} md={24} sm={24} xs={24} className={'mb-1'}>
						<Radio
							onChange={() => setRatesAccount('0')}
							defaultChecked
							checked={ratesAccount === '0'}>
							and freight class.
						</Radio>
					</Col>
					<Col xl={24} lg={24} md={24} sm={24} xs={24}>
						<Radio
							onChange={() => setRatesAccount('1')}
							checked={ratesAccount === '1'}>
							freight class, and dimensions.
						</Radio>
					</Col>
				</Row>

				{ratesAccount === '1' && (
					<div>
						<p className='text-danger'>Use of the Pallets feature will be required for your account.</p>
					</div>
				)} 
				
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
