import React from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'


const { Title } = Typography

const InsideDeliverySettings = ({ quoteSettingsState, setQuoteSettingsState }) => {

	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Inside delivery settings</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always quote inside delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='always_inside_delivery'
						checked={quoteSettingsState.always_inside_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								always_inside_delivery: e.target.checked,
								offer_inside_delivery: false,
							})
						}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
                    Offer inside delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='offer_inside_delivery'
						checked={quoteSettingsState.offer_inside_delivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								offer_inside_delivery: e.target.checked,
								always_inside_delivery: false,
							})
						}
					/>
				</Form.Item>
			</Col>

		</Row>
	)
}

export default InsideDeliverySettings