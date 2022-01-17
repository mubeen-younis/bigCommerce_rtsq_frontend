import React from 'react'
import { Row, Col, Checkbox, Input, Typography, Form } from 'antd'
import { handlingFeeMarkup } from '../../../Utilities/numberValidation'

const { Title } = Typography

const Services = ({
	quoteSettingsState,
	checkAll,
	allCheckHandler,
	onChange,
	onCheck,
}) => {
	return (
		<>
			<Row gutter={24} align='middle' className={'mb-4'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>WWE Services</Title>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-black'}>
						The services selected will display in the cart if they are
						available for the origin and destination addresses, and if
						the WWE Small Package Quotes API has been enabled for the
						corresponding shipping zone.
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>Select All Services</label>
				</Col>
				<Col className='gutter-row' sm={12} md={12} lg={12} xl={18}>
					<Form.Item className='mb-0 ml-5'>
						<Checkbox
							name='select_all'
							value={true}
							checked={checkAll}
							onChange={allCheckHandler}></Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS Ground</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_ground'
							value={true}
							checked={
								quoteSettingsState?.carrier_services?.ups_ground
									? true
									: null
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							name={'ups_ground_markup'}
							value={
								quoteSettingsState?.carrier_services
									?.ups_ground_markup
							}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS 3 Day Select</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_3_day_select'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_3_day_select
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.ups_3_day_select_markup
							}
							name={'ups_3_day_select_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS 2nd Day Air</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_2nd_day_air'
							value={true}
							checked={
								quoteSettingsState?.carrier_services?.ups_2nd_day_air
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_markup
							}
							name={'ups_2nd_day_air_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS 2nd Day Air A.M.</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_2nd_day_air_am'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_am
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_am_markup
							}
							name={'ups_2nd_day_air_am_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS 2nd Day Air Saver</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_2nd_day_air_saver'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_saver
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_saver_markup
							}
							name={'ups_2nd_day_air_saver_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS Next Day Air Saver</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_next_day_air_saver'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_saver
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_saver_markup
							}
							name={'ups_next_day_air_saver_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS Next Day Air</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_next_day_air'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							//maxLength='7'
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_markup
							}
							//pattern='[0-9.?(0-9){2}?]+%?$'
							name={'ups_next_day_air_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
					<label className={'text-gray'}>UPS Next Day Air Early</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='ups_next_day_air_early'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_early
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<Form.Item className={'mb-0'}>
						<Input
							//maxLength='7'
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_early_markup
							}
							//pattern='[0-9.?(0-9){2}?]+%?$'
							name={'ups_next_day_air_early_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.0 or percentage 5%)
					</label>
				</Col>
			</Row>
		</>
	)
}

export default Services
