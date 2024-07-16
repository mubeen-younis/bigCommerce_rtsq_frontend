import React from 'react'
import { Row, Col, Form, Typography, Radio, Checkbox } from 'antd'

const { Title } = Typography

const UpsLandedCostApiSettings = ({
	quoteSettingsState,
	setQuoteSettingsState,
	isUpsNewAPI,
}) => {
	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
				<Title level={4}>International Quote Settings</Title>
			</Col>
			<Col className='gutter-row mb-1'  xs={12} sm={12} md={12} lg={12} xl={18}>
				{!isUpsNewAPI && (
                	<span>
						<i><b>(Requires a connection to UPS's New API)</b></i>
					</span>
                )}
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
						disabled = {!isUpsNewAPI}
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
						disabled = {!isUpsNewAPI}
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
