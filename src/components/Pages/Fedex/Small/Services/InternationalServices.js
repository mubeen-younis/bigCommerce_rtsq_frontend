import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../../Utilities/numberValidation'

const { Title } = Typography
export const international_services = [
	'International Distribution Freight',
	'International Economy',
	'International Economy Distribution',
	'International Economy Freight',
	'International First',
	'International Priority',
	'International Priority Distribution',
	'International Priority Freight',
	'International Priority Overnight',
	'International Standard Overnight',
	'International Ground',
]

const InternationalServices = ({
	quoteSettingsState,
	allCheckHandler,
	internationalcheckAll,
	setInternationalCheckAll,
	onCheck,
	onChange,
}) => {
	return (
		<>
			<Col span={10}>
				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={5} style={{ textAlign: 'center' }}>
							International Services
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
								checked={internationalcheckAll}
								onChange={e =>
									allCheckHandler(
										setInternationalCheckAll,
										e.target.checked,
										international_services,
										''
									)
								}></Checkbox>
						</Form.Item>
					</Col>
				</Row>

				{international_services.map(is => (
					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col span={20}>
							<label className={'text-gray'}>{is}</label>
						</Col>
						<Col span={4}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name={is
										.toLowerCase()
										.trim()
										.replaceAll(' ', '_')}
									value={true}
									checked={
										quoteSettingsState?.carrier_services?.[
											is
												.toLowerCase()
												.trim()
												.replaceAll(' ', '_')
										]
									}
									onChange={onCheck}
								/>
							</Form.Item>
						</Col>
						<Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
							<Form.Item className={'mb-0'}>
								<Input
									//maxLength='7'
									value={
										quoteSettingsState?.carrier_services?.[
											is
												.toLowerCase()
												.trim()
												.replaceAll(' ', '_') + '_markup'
										]
									}
									//pattern='[0-9.?(0-9){2}?]+%?$'
									name={
										is
											.toLowerCase()
											.trim()
											.replaceAll(' ', '_') + '_markup'
									}
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
								Markup (e.g Currency 1.0 or percentage 5%)
							</label>
						</Col>
					</Row>
				))}
			</Col>
		</>
	)
}

export default InternationalServices
