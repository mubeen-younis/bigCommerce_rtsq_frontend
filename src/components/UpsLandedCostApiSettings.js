import React from 'react'
import { Row, Col, Form, Typography, Radio, Checkbox } from 'antd'

const { Title } = Typography

const UpsLandedCostApiSettings = ({
	quoteSettingsState,
	setQuoteSettingsState,
}) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>International Quote Settings</Title>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Quote transportation only
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='isUpsLandedCost'
						value={true}
						checked={quoteSettingsState?.isUpsLandedCost === 0}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								isUpsLandedCost: 0,
							})
						}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Quote landed cost (transportation + duties + taxes)
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='isUpsLandedCost'
						checked={quoteSettingsState?.isUpsLandedCost === 1}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								isUpsLandedCost: 1,
							})
						}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default UpsLandedCostApiSettings
