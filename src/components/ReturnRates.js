import { Checkbox, Col, Form, Row } from 'antd'
import React from 'react'

const ReturnRates = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<Row gutter={30} align='middle' className='mb-2'>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className='text-gray'>
					Don't return rates if the ship-to address appears to be a post
					office box
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className='mb-0'>
					<Checkbox
						name='return_rates'
						checked={quoteSettingsState?.return_rates}
						onChange={e =>
							setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								return_rates: e.target.checked,
							}))
						}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default ReturnRates
