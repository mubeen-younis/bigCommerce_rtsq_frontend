import React from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'

const { Title } = Typography

const AppointmentDelivery = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Appointment delivery settings</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always quote appointment delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						checked={quoteSettingsState.always_appointment_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								always_appointment_delivery: e.target.checked,
								offer_appointment_delivery: false,
							})
						}
						disabled={
							quoteSettingsState?.alwaysLiftGateDelivery ||
							quoteSettingsState?.offerLiftGateDelivery
						}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Offer appointment delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						checked={quoteSettingsState.offer_appointment_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								offer_appointment_delivery: e.target.checked,
								always_appointment_delivery: false,
							})
						}
						disabled={
							quoteSettingsState?.alwaysLiftGateDelivery ||
							quoteSettingsState?.offerLiftGateDelivery
						}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default AppointmentDelivery
