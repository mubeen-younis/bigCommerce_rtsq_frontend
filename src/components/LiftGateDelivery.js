import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Typography, Checkbox } from 'antd'

const { Title } = Typography

const LiftGateDelivery = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
}) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Lift gate settings</Title>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always quote lift gate delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='always_lift_gate_delivery'
						value={true}
						checked={quoteSettingsState.alwaysLiftGateDelivery}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								alwaysLiftGateDelivery:
									!quoteSettingsState.alwaysLiftGateDelivery,
								offerLiftGateDelivery: false,
								autoDetectedResidentialAddressesLfg: false,
							})
						}></Checkbox>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Offer lift gate delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='offer_lift_gate_delivery'
						checked={quoteSettingsState.offerLiftGateDelivery}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								offerLiftGateDelivery:
									!quoteSettingsState.offerLiftGateDelivery,
								alwaysLiftGateDelivery: false,
							})
						}></Checkbox>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always include lift gate delivery when a residential address is
					detected
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='auto_detected_residential_addresses_lfg'
						checked={
							quoteSettingsState.autoDetectedResidentialAddressesLfg
						}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								autoDetectedResidentialAddressesLfg:
									!quoteSettingsState.autoDetectedResidentialAddressesLfg,
								alwaysLiftGateDelivery: false,
							})
						}
						disabled={!radStatus}></Checkbox>
					{!radStatus && (
						<label className={'ml-4'} style={{ marginLeft: '10px' }}>
							Click <Link to='/'>here</Link> to add the Residential
							Address Detection add-on.
						</label>
					)}
				</Form.Item>
			</Col>
		</Row>
	)
}

export default LiftGateDelivery
