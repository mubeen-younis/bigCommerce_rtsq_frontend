import React from 'react'
import { Row, Col, Form, Checkbox, Typography } from 'antd'

const { Title } = Typography

const NotifyBeforeDelivery = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Notify before delivery settings</Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Always quote notify before delivery
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.always_quote_notify || false}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									always_quote_notify: e.target.checked,
									offer_notify_as_option: false,
								})
							}></Checkbox>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Offer notify before delivery as an option.
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.offer_notify_as_option || false}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									offer_notify_as_option: e.target.checked,
									always_quote_notify: false,
								})
							}></Checkbox>
					</Form.Item>
				</Col>
        </Row>
	)
}

export default NotifyBeforeDelivery
