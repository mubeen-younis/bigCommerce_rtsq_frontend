import React from 'react'
import { Row, Col, Form, Select, Input } from 'antd'
import { LableAsLimit, handleKeyDownDecimalNumber, handlingFeeMarkup, numberFieldLimit } from '../../../Utilities/numberValidation'
import Title from 'antd/lib/typography/Title'

const { Option } = Select

const PalletRates = ({
	connectionSettings,
	quoteSettingsState,
	handleChange,
}) => {
	return (
		<>
			<Row gutter={30} className={'mb-2'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Pallet Rates</Title>
				</Col>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>I have pallet rates for the following pallet size</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'}>
					<div id='type_dropdown'>
					    <Select
						getPopupContainer={() =>
							document.getElementById('type_dropdown')
						  }
							defaultValue={
								quoteSettingsState &&
								quoteSettingsState?.pallet_code !== undefined
								? quoteSettingsState?.pallet_code
								: 'No Pallet Selected'
							}
							size={'large'}
							style={{ width: '100%' }}
							value={
								connectionSettings?.pallets?.length !== 0
								? quoteSettingsState?.pallet_code
								: 'No Pallet Selected'
							}
							onChange={value =>
								handleChange('pallet_code', value)
							}>
							{connectionSettings?.pallets
								? connectionSettings?.pallets?.map(value => (
								<Option
								value={value.Code}
								key={value.Code}
								>{`${value.Description}`}
								</Option>
								))
							: 'No Pallet Selected'}
						</Select>
					</div>
						
				</Form.Item>
					<div className={'text-gray'}>
						Please verify your API credentials,if pallets are not listed.
					</div>
				</Col>
			</Row>
			<Row gutter={30} className={'mb-2'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Maximum Weight per Pallet</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState
									? quoteSettingsState?.pallet_weight
									: ''
							}
							onChange={e =>
								handleChange('pallet_weight', e.target.value)
							}
							type='number'
							min={0}
							onKeyDown={handlingFeeMarkup}
						/>
					</Form.Item>
					<div className={'text-gray'}>
						Enter in pounds the maximum weight that can be placed on the Pallet.
					</div>
				</Col>
			</Row>
		</>
	)
}

export default PalletRates
