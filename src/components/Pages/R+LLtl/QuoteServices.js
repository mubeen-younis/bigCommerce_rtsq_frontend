import React from 'react'
import { Row, Col, Checkbox, Form, Typography } from 'antd'

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
						name='select_all_services'
						checked={quoteSettingsState.select_all_services}
						onChange={(e) => {
							selectAllQuoteOptions(e.target.checked)
						}}></Checkbox>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Standard Service</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='standard_service'
						checked={quoteSettingsState.standard_service}
						onChange={(e) => {
							handleChange('standard_service', e.target.checked)
							toggleOptions(e.target.checked, [
								'guaranteed_pm',
								'guaranteed_am',
								'guaranteed_hourly_window',
							])
						}}></Checkbox>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Guaranteed PM</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='guaranteed_pm'
						checked={quoteSettingsState.guaranteed_pm}
						onChange={(e) => {
							handleChange('guaranteed_pm', e.target.checked)
							toggleOptions(e.target.checked, [
								'standard_service',
								'guaranteed_am',
								'guaranteed_hourly_window',
							])
						}}></Checkbox>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Guaranteed AM</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='guaranteed_am'
						checked={quoteSettingsState.guaranteed_am}
						onChange={(e) => {
							handleChange('guaranteed_am', e.target.checked)
							toggleOptions(e.target.checked, [
								'standard_service',
								'guaranteed_pm',
								'guaranteed_hourly_window',
							])
						}}></Checkbox>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Guaranteed Hourly Window</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='guaranteed_hourly_window'
						checked={quoteSettingsState.guaranteed_hourly_window}
						onChange={(e) => {
							handleChange(
								'guaranteed_hourly_window',
								e.target.checked
							)
							toggleOptions(e.target.checked, [
								'standard_service',
								'guaranteed_pm',
								'guaranteed_am',
							])
						}}></Checkbox>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default QuoteServices
