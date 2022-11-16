import React from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'

const { Title } = Typography

const TwoManDelivery = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Two man delivery settings</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className='text-gray'>Always quote two man delivery</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className='mb-0'>
					<Checkbox
						checked={quoteSettingsState.always_two_man_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								always_two_man_delivery: e.target.checked,
								offer_two_man_delivery: false,
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
				<label className='text-gray'>
					Offer two man delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className='mb-0'>
					<Checkbox
						checked={quoteSettingsState.offer_two_man_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								offer_two_man_delivery: e.target.checked,
								always_two_man_delivery: false,
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

export default TwoManDelivery
