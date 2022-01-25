import React from 'react'
import { Row, Col, Form, Checkbox, Typography } from 'antd'

const { Title } = Typography

const QuoteServices = ({
	quoteSettingsState,
	selectAllQuoteOptions,
	handleChange,
	toggleOptions,
}) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Quote Service Options</Title>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Select All</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='fedex_select_all'
						checked={quoteSettingsState.fedex_select_all}
						onChange={(e) => {
							selectAllQuoteOptions(e.target.checked)
						}}></Checkbox>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Fedex Freight Economy</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='offer_lift_gate_delivery'
						checked={quoteSettingsState.fedex_freight_economy}
						onChange={(e) => {
							handleChange('fedex_freight_economy', e.target.checked)
							toggleOptions(e.target.checked, 'fedex_freight_priority')
						}}></Checkbox>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Fedex Freight Priority</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='fedex_freight_priority'
						checked={quoteSettingsState.fedex_freight_priority}
						onChange={(e) => {
							handleChange('fedex_freight_priority', e.target.checked)
							toggleOptions(e.target.checked, 'fedex_freight_economy')
						}}></Checkbox>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default QuoteServices
