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
                    Offer inside delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='insideDelivery'
						checked={quoteSettingsState.insideDelivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								insideDelivery: e.target.checked,
							})
						}
					/>
				</Form.Item>
			</Col>

		</Row>
	)
}

export default InsideDeliverySettings