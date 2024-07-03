import React from 'react'
import { Row, Col, Form, Select } from 'antd'

const { Option } = Select

const ShipmentType = ({
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
					<label className={'text-gray'}>Shipment Type</label>
				</Col>
				<Col span={18}>
				<div id='type_dropdown'>
					<Form.Item>
						<Select
							name='ShipmentType'
							value={quoteSettingsState?.ShipmentType ?? 'SALE'}
							onChange={(value) => {
								setQuoteSettingsState(prevState => ({
									...prevState,
									ShipmentType: value,
								}))
							}}
							getPopupContainer={() =>
								document.getElementById('type_dropdown')
							  }
						>
							<Option value='SALE'>SALE</Option>
							<Option value='GIFT'>GIFT</Option>
							<Option value='COMMERCIAL'>COMMERCIAL</Option>
							<Option value='SAMPLE'>SAMPLE</Option>
							<Option value='REPAIR'>REPAIR</Option>
							<Option value='RETURN'>RETURN</Option>
							<Option value='OTHER'>OTHER</Option>
						</Select>
					</Form.Item>
				</div>
				</Col>
			</Row>
		</>
	)
}

export default ShipmentType
