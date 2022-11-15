import React from 'react'
import { Row, Col, Typography, Checkbox, Input, Form } from 'antd'
import { handlingFeeMarkup } from '../../../../../Utilities/numberValidation'

const { Title } = Typography
export const domestic_services = [
	'Ground Home Delivery',
	'Date Certain Home Delivery',
	'Evening Home Delivery',
	'Appointment Home Delivery',
	'Ground',
	'Express Saver',
	'2 Day',
	'2 Day AM',
	'Priority Overnight',
	'First Overnight',
	'Standard Overnight',
	'Smart Post',
]

const DomesticServices = ({
	quoteSettingsState,
	checkAll,
	setCheckAll,
	allCheckHandler,
	onChange,
	onCheck,
}) => {
	return (
		<Col span={8}>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col
					className='gutter-row middle'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={5} style={{ textAlign: 'center' }}>
						Domestic Services
					</Title>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Select All Services</label>
				</Col>
				<Col span={4}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							value={true}
							checked={checkAll}
							onChange={e =>
								allCheckHandler(
									setCheckAll,
									e.target.checked,
									domestic_services,
									'fedex_'
								)
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Home Delivery</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_ground_home_delivery'
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_ground_home_delivery
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							name={'fedex_ground_home_delivery_markup'}
							value={
								quoteSettingsState?.carrier_services
									?.fedex_ground_home_delivery_markup
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
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			{}<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Date Certain Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_date_certain_home_delivery'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_date_certain_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_date_certain_home_delivery_markup
										}
										name={'fedex_date_certain_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<label className={'text-gray'}>
									Markup (e.g Currency 1.00 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Evening Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_evening_home_delivery'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_evening_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_evening_home_delivery_markup
										}
										name={'fedex_evening_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<label className={'text-gray'}>
									Markup (e.g Currency 1.00 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Appointment Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_appointment_home_delivery'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_appointment_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_appointment_home_delivery_markup
										}
										name={'fedex_appointment_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<label className={'text-gray'}>
									Markup (e.g Currency 1.00 or percentage 5%)
								</label>
							</Col>
						</Row> {}

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Ground</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_ground'
							checked={
								quoteSettingsState?.carrier_services?.fedex_ground
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_ground_markup
							}
							name={'fedex_ground_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Express Saver</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_express_saver'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_express_saver
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							//maxLength='7'
							value={
								quoteSettingsState?.carrier_services
									?.fedex_express_saver_markup
							}
							//pattern='[0-9.?(0-9){2}?]+%?$'
							name={'fedex_express_saver_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>2 Day</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_2_day'
							value={true}
							checked={
								quoteSettingsState?.carrier_services?.fedex_2_day
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={22} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_2_day_markup
							}
							name={'fedex_2_day_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>2 Day AM</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_2_day_am'
							checked={
								quoteSettingsState?.carrier_services?.fedex_2_day_am
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_2_day_am_markup
							}
							name={'fedex_2_day_am_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Standard Overnight</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_standard_overnight'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_standard_overnight
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_standard_overnight_markup
							}
							name={'fedex_standard_overnight_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>Priority Overnight</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_priority_overnight'
							value={true}
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_priority_overnight
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_priority_overnight_markup
							}
							name={'fedex_priority_overnight_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>First Overnight</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_first_overnight'
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_first_overnight
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_first_overnight_markup
							}
							name={'fedex_first_overnight_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={20}>
					<label className={'text-gray'}>SmartPost</label>
				</Col>
				<Col span={4}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='fedex_smart_post'
							checked={
								quoteSettingsState?.carrier_services
									?.fedex_smart_post
							}
							onChange={onCheck}></Checkbox>
					</Form.Item>
				</Col>
				<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item className={'mb-0'}>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.fedex_smart_post_markup
							}
							name={'fedex_smart_post_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-gray'}>
						Markup (e.g Currency 1.00 or percentage 5%)
					</label>
				</Col>
			</Row>
		</Col>
	)
}

export default DomesticServices
