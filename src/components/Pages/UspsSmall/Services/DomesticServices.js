import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography

const Markup = () => (
	<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
		<label className={'text-gray'}>
			Markup (e.g Currency 1.00 or percentage 5%)
		</label>
	</Col>
)

const DomesticServices = ({
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
						US Domestic Services
					</Title>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>
						All Domestic Service Levels
					</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							checked={checkAll}
							onChange={allCheckHandler}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>USPS First Class Mail</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='usps_first_class_mail'
							checked={
								quoteSettingsState?.carrier_services
									?.usps_first_class_mail
							}
							onChange={onCheck}
						/>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='usps_first_class_mail_markup'
							value={
								quoteSettingsState?.carrier_services
									?.usps_first_class_mail_markup
							}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Markup />
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>USPS Priority Mail Express</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='usps_priority_mail_express'
							checked={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail_express
							}
							onChange={onCheck}
						/>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail_express_markup
							}
							name='usps_priority_mail_express_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Markup />
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>USPS Priority Mail</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='usps_priority_mail'
							checked={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail
							}
							onChange={onCheck}
						/>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail_markup
							}
							name={'usps_priority_mail_markup'}
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Markup />
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>
						USPS Priority Mail Flat Rate*
					</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='usps_priority_mail_flat_rate'
							checked={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail_flat_rate
							}
							onChange={onCheck}
						/>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.usps_priority_mail_flat_rate_markup
							}
							name='usps_priority_mail_flat_rate_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Markup />
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>USPS Retail Ground</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='usps_retail_ground'
							checked={
								quoteSettingsState?.carrier_services
									?.usps_retail_ground
							}
							onChange={onCheck}
						/>
					</Form.Item>
				</Col>
				<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							value={
								quoteSettingsState?.carrier_services
									?.usps_retail_ground_markup
							}
							name='usps_retail_ground_markup'
							onChange={onChange}
							onKeyDown={handlingFeeMarkup}
							maxLength='7'
							type='text'
						/>
					</Form.Item>
				</Col>

				<Markup />
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={24}>
					<p>
						<i>
							* Flat Rate services require the Standard Box Sizes
							feature.
						</i>
					</p>
				</Col>
			</Row>
		</Col>
	)
}

export default DomesticServices
