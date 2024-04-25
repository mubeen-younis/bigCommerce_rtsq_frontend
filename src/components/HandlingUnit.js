import React from 'react'
import { Row, Col, Form, Input } from 'antd'
import { handlingFeeMarkup } from '../Utilities/numberValidation'
import EnableLogs from './EnableLogs'
import StaffNoteSettings from './StaffNoteSettings'

const HandlingUnit = ({ quoteSettingsState, handleChange, setQuoteSettingsState }) => {
	return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Weight of Handling Unit</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'} name='weight_of_handling_unit'>
						<Input
							maxLength='7'
							//pattern='[0-9.?(0-9){2}?]+%?$'
							onKeyDown={handlingFeeMarkup}
							value={quoteSettingsState.weight_of_handling_unit}
							onChange={e =>
								handleChange(
									'weight_of_handling_unit',
									e.target.value
								)
							}
							type='number'
							min='0'
							step='0.001'
							max='20000'
							pattern='[0-9.?(0-9){2}?]+%?$'
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Enter in pounds the weight of your pallet, skid, crate, or
						other types of handling unit. Leave blank to disable.
					</div>
				</Col>
			</Row>

			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>
						Maximum Weight per Handling Unit
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item
						className={'mb-0'}
						name='max_weight_per_handling_unit'>
						<Input
							maxLength='7'
							//pattern='[0-9.?(0-9){2}?]+%?$'
							onKeyDown={handlingFeeMarkup}
							value={quoteSettingsState.max_weight_per_handling_unit}
							onChange={e =>
								handleChange(
									'max_weight_per_handling_unit',
									e.target.value
								)
							}
							type='number'
							min='0'
							step='0.001'
							max='20000'
							pattern='[0-9.?(0-9){2}?]+%?$'
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Enter in pounds the maximum weight that can be placed on the
						handling unit. Leave blank to disable.
					</div>
				</Col>
			</Row>

			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Handling Fee / Markup</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'} name='handling_free_markup'>
						<Input
							maxLength='7'
							//pattern='[0-9.?(0-9){2}?]+%?$'
							onKeyDown={handlingFeeMarkup}
							value={quoteSettingsState.handling_free_markup}
							onChange={e =>
								handleChange('handling_free_markup', e.target.value)
							}
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Amount excluding tax. Enter an amount, e.g 3.75, or a
						percentage, e.g, 5%. Leave blank to disable.
					</div>
				</Col>
			</Row>
			<EnableLogs 
				quoteSettingsState={quoteSettingsState} 
				setQuoteSettingsState={setQuoteSettingsState}
			/>

			<StaffNoteSettings
				quoteSettingsState={quoteSettingsState}
				handleChange={handleChange}
			/>
		</>
	)
}

export default HandlingUnit
