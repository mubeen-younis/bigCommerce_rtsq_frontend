import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography

const international_services = [
	'Purolator Express International',
	'Purolator Express International 12:00',
]

const InternationalServices = ({
	quoteSettingsState,
	internationalcheckAll,
	internationalAllCheckHandler,
	onChange,
	onCheck,
}) => {
	return (
		<Col span={12}>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={5} style={{ textAlign: 'center' }}>
						International Services
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
							value={true}
							checked={internationalcheckAll}
							onChange={e =>
								internationalAllCheckHandler(e.target.checked)
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>
			{international_services.map(is => (
				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col span={12}>
						<label className={'text-gray'}>{is}</label>
					</Col>
					<Col span={12}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name={is.toLowerCase().trim().replaceAll(' ', '_').replaceAll(':', '_')}
								value={true}
								checked={
									quoteSettingsState?.carrier_services?.[
										is.toLowerCase().trim().replaceAll(' ', '_').replaceAll(':', '_')
									]
								}
								onChange={onCheck}></Checkbox>
						</Form.Item>
					</Col>
					<Col span={14}>
						<Form.Item className={'mb-0'}>
							<Input
								//maxLength='7'
								value={
									quoteSettingsState?.carrier_services?.[
										is
											.toLowerCase()
											.trim()
											.replaceAll(' ', '_')
											.replaceAll(':', '_') + '_markup'
									]
								}
								//pattern='[0-9.?(0-9){2}?]+%?$'
								name={
									is.toLowerCase().trim().replaceAll(' ', '_').replaceAll(':', '_') +
									'_markup'
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
							Markup (e.g Currency 1.00 or percentage 5%)
						</label>
					</Col>
				</Row>
			))}
		</Col>
	)
}

export default InternationalServices
