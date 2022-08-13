import React, { useCallback } from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography

const international_services = [
	'USPS Priority Mail International Express',
	'USPS Priority Mail International',
	'USPS Priority Mail International Flat Rate Box*',
	'USPS First-Class Package International Service',
]

const InternationalServices = ({
	quoteSettingsState,
	internationalcheckAll,
	internationalAllCheckHandler,
	onChange,
	onCheck,
}) => {
	const makeServiceIndex = useCallback((srvc_name = '', markup = false) => {
		let name = srvc_name ?? ''
		name =
			name
				.trim()
				.toLowerCase()
				.replaceAll(' ', '_')
				.replace('-', '_')
				.replace('*', '') + (markup ? '_markup' : '')

		return name
	}, [])

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
					<label className={'text-gray'}>Select All Services</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							checked={internationalcheckAll}
							onChange={e =>
								internationalAllCheckHandler(e.target.checked)
							}
						/>
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
								name={makeServiceIndex(is)}
								checked={
									quoteSettingsState?.carrier_services?.[
										makeServiceIndex(is)
									]
								}
								onChange={onCheck}
							/>
						</Form.Item>
					</Col>
					<Col span={14}>
						<Form.Item className={'mb-0'}>
							<Input
								value={
									quoteSettingsState?.carrier_services?.[
										makeServiceIndex(is, true)
									]
								}
								name={makeServiceIndex(is, true)}
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
	)
}

export default InternationalServices
