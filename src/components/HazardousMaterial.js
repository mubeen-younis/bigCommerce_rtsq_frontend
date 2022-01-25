import React from 'react'
import { Row, Col, Form, Input, Checkbox, Typography } from 'antd'
import { handleKeyDownDecimalNumber } from '../Utilities/numberValidation'

const { Title } = Typography

const HazardousMaterial = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Hazardous material settings</Title>
				</Col>

				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						Only quote ground service for hazardous materials shipments
					</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-3'}>
						<Checkbox
							name={'ground_service_for_hazardous_material'}
							value={true}
							checked={
								quoteSettingsState?.ground_service_for_hazardous_material
							}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									ground_service_for_hazardous_material:
										!quoteSettingsState?.ground_service_for_hazardous_material,
								})
							}></Checkbox>
					</Form.Item>
				</Col>

				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={12}
					md={12}
					lg={6}
					xl={6}>
					<label className={'text-gray'}>
						Ground Hazardous Material Fee
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
					<Form.Item className={'mb-0'}>
						<Input
							name={'ground_hazardous_material_fee'}
							maxLength='7'
							value={quoteSettingsState?.ground_hazardous_material_fee}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									ground_hazardous_material_fee: e.target.value,
								})
							}
							onKeyDown={e => handleKeyDownDecimalNumber(e, 7, 2)}
							type='number'
							min='0'
							step='0.01'
							//pattern='[0-9.?(0-9){2}?]+%?$'
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Enter an amount, e.g 20. or Leave blank to disable.
						{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
					</div>
				</Col>
			</Row>

			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={12}
					md={12}
					lg={6}
					xl={6}>
					<label className={'text-gray'}>Air Hazardous Material Fee</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
					<Form.Item className={'mb-0'}>
						<Input
							type='number'
							name={'air_hazardous_material_fee'}
							value={quoteSettingsState?.air_hazardous_material_fee}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									air_hazardous_material_fee: e.target.value,
								})
							}
							onKeyDown={e => handleKeyDownDecimalNumber(e, 7, 2)}
							min='0'
							step='0.01'
							//pattern='[0-9.?(0-9){2}?]+%?$'
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Enter an amount, e.g 20. or Leave blank to disable.
						{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
					</div>
				</Col>
			</Row>
		</>
	)
}

export default HazardousMaterial
