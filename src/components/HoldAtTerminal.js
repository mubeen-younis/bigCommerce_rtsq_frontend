import React from 'react'
import { Row, Col, Form, Typography, Checkbox, Input } from 'antd'
import {handlingFeeMarkup,} from './../Utilities/numberValidation'
const { Title } = Typography

const HoldAtTerminal = ({ quoteSettingsState, handleChange }) => {
	return (
		<Row gutter={30} className={'mb-3'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Hold At Terminal</Title>
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
					Offer Hold At Terminal as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='hold_at_terminal'
						checked={quoteSettingsState.hold_at_terminal}
						onChange={e =>
							handleChange('hold_at_terminal', e.target.checked)
						}
					/>
				</Form.Item>
			</Col>

			<Col
				className='gutter-row'
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
				<Form.Item className={'mb-0'}>
					<Input
						value={quoteSettingsState.hold_at_terminal_price}
						onChange={e =>
							handleChange('hold_at_terminal_price', e.target.value)
						}
						onKeyDown={handlingFeeMarkup}
						maxLength={7}
						disabled={!quoteSettingsState.hold_at_terminal}
					/>
				</Form.Item>
				<label className={'text-gray'}>
					Adjust the price of the Hold At Terminal option. Enter an amount,
					e.g. 3.75, or a percentage, e.g. 5%. Leave blank to use the price
					returned by the carrier.
				</label>
			</Col>
		</Row>
	)
}

export default HoldAtTerminal
