import React from 'react'
import { Row, Col, Form, Typography, Radio } from 'antd'

const { Title } = Typography

const QuoteDetails = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<Row gutter={30}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Quote Details</Title>
			</Col>

			<Col
				className='gutter-row'
				// style={{ paddingTop: '11px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
				<Form.Item>
					<Radio
						checked={quoteSettingsState.quote_details === 1}
						onChange={e =>
							setQuoteSettingsState(prevState => ({
								...prevState,
								quote_details: 1,
							}))
						}>
						Write the quote details to the Additional Details widget
					</Radio>
				</Form.Item>
			</Col>

			<Col
				className='gutter-row'
				// style={{ paddingTop: '11px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col
				className='gutter-row'
				style={{ marginTop: '-10px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={18}>
				<Form.Item>
					<Radio
						checked={quoteSettingsState.quote_details === 2}
						onChange={e =>
							setQuoteSettingsState(prevState => ({
								...prevState,
								quote_details: 2,
							}))
						}>
						Write the quote details to the More Actions {'>'} Shipping
						quote details page
					</Radio>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default QuoteDetails
