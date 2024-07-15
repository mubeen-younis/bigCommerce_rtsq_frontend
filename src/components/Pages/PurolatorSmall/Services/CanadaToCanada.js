import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { blockSpecialChar, handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography

const LabelAs = () => (
	<Col className='gutter-row mb-2' xs={14} sm={14} md={14} lg={14} xl={14}>
	  <label className={'text-gray'}>
		Service name displays by default. Enter an alternative if you prefer
		something different.
	  </label>
	</Col>
);

const CanadaToCanada = ({
	quoteSettingsState,
	checkAll,
	allCheckHandler,
	onCheck,
	onChange,
}) => {
	return (
		<Col span={12}>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col
					className='gutter-row middle'
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={12}>
					<Title level={5} style={{ textAlign: 'center' }}>
						Canada to Canada
					</Title>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Select All</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							checked={checkAll}
							onChange={allCheckHandler}></Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Express</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_express'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_express
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_express_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Express'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							name='purolator_express_markup'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express_markup
							}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Express 9 AM</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_express_9AM'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_express_9AM
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_express_9AM_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express_9AM_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Express 9 AM'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express9_a_m_markup
							}
							name='purolator_express9_a_m_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Express 10:30 AM</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_express_10__30AM'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_express_10__30AM
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_express_10__30AM_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express_10__30AM_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Express 10:30 AM'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.purolator_express10_30_a_m_markup
							}
							name='purolator_express10_30_a_m_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Ground</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_ground'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_ground
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_ground_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Ground'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground_markup
							}
							name='purolator_ground_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Ground 09:00 AM</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_ground_9AM'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_ground_9AM
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_ground_9AM_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground_9AM_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Ground 09:00 AM'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							//maxLength='7'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground9_a_m_markup
							}
							//pattern='[0-9.?(0-9){2}?]+%?$'
							name='purolator_ground9_a_m_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>Purolator Ground 10:30 AM</label>
				</Col>
				<Col span={12}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='purolator_ground_10__30AM'
							checked={
								quoteSettingsState?.carrier_services
									?.purolator_ground_10__30AM
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='purolator_ground_10__30AM_label'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground_10__30AM_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='Purolator Ground 10:30 AM'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
				<Col span={14}>
					<Form.Item className={'mb-0'}>
						<Input
							//maxLength='7'
							value={
								quoteSettingsState?.carrier_services
									?.purolator_ground10_30_a_m_markup
							}
							//pattern='[0-9.?(0-9){2}?]+%?$'
							name='purolator_ground10_30_a_m_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>
		</Col>
	)
}

export default CanadaToCanada
