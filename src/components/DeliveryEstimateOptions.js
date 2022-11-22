import React from 'react'
import { Row, Col, Form, Typography, Radio, Checkbox } from 'antd'

const { Title } = Typography

const DeliveryEstimateOptions = ({
	quoteSettingsState,
	setQuoteSettingsState,
	saturdayDelivery = false,
}) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Delivery estimate options</Title>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Don't display delivery estimates
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='delivery_estimate_options'
						value={true}
						checked={quoteSettingsState?.delivery_estimate_options === 1}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								delivery_estimate_options: 1,
							})
						}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Display estimated number of days
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='delivery_estimate_options'
						checked={quoteSettingsState?.delivery_estimate_options === 2}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								delivery_estimate_options: 2,
							})
						}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Display estimated delivery date
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='delivery_estimate_options'
						checked={quoteSettingsState.delivery_estimate_options === 3}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								delivery_estimate_options: 3,
							})
						}
					/>
				</Form.Item>
			</Col>

			{saturdayDelivery && (
				<>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>
							Display Saturday delivery
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='saturday_delivery'
								checked={quoteSettingsState.saturday_delivery}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										saturday_delivery: e.target.checked,
									})
								}
							/>
						</Form.Item>
					</Col>
				</>
			)}
		</Row>
	)
}

export default DeliveryEstimateOptions
