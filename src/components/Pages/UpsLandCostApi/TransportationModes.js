import React from 'react'
import { Row, Col, Form, Select } from 'antd'

const { Option } = Select

const TransportationModes = ({
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
					<label className={'text-gray'}>Transportation Modes</label>
				</Col>
				<Col span={18}>
				<div id='type_dropdown'>
					<Form.Item>
						<Select
							name='TransportationModes'
							value={quoteSettingsState?.TransportationModes ?? ''}
							onChange={(value) => {
								setQuoteSettingsState(prevState => ({
									...prevState,
									TransportationModes: value,
								}))
							}}
							getPopupContainer={() =>
								document.getElementById('type_dropdown')
							  }
						>
							<Option value=''>Select mode</Option>
							<Option value='INT_AIR'>INT AIR</Option>
							<Option value='INT_OCEAN'>INT OCEAN</Option>
							<Option value='INT_RAIL'>INT RAIL</Option>
							<Option value='INT_TRUCK'>INT TRUCK</Option>
							<Option value='DOM_AIR'>DOM AIR</Option>
							<Option value='DOM_OCEAN'>DOM OCEAN</Option>
							<Option value='DOM_RAIL'>DOM RAIL</Option>
							<Option value='DOM_TRUCK'>DOM TRUCK</Option>
						</Select>
					</Form.Item>
				</div>
				</Col>
			</Row>
		</>
	)
}

export default TransportationModes
