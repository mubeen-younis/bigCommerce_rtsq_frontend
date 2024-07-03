import React from 'react'
import { Row, Col, Form, Select } from 'antd'

const { Option } = Select

const CurrencyAndComodityCode = ({
	quoteSettingsState,
	setQuoteSettingsState,
}) => {
	return (
		<>
			<Row gutter={30} className={'mb-2'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Currency & Commodities Currency Code</label>
				</Col>
				<Col span={18}>
					<Form.Item>
						<Select
							name='currencyCode'
							value={quoteSettingsState?.currencyCode}
							onChange={(value) => {
								setQuoteSettingsState(prevState => ({
									...prevState,
									currencyCode: value,
								}))
							}}
						>
							<Option value='USD'>USD</Option>
							<Option value='CAD'>CAD</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

export default CurrencyAndComodityCode
