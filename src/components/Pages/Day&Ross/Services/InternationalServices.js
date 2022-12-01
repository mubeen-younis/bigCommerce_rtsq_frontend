import React, { useCallback } from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'
import { hanldeChecksDisability } from '../QuoteSettingsComponent'
import { premiumFreightServices } from './PremiumFreightServices'

const { Title } = Typography

const international_services = ['US Next PM', 'US 2nd Day', 'US Ground']

const InternationalServices = ({
	quoteSettingsState,
	setQuoteSettingsState,
	sameDayApi,
}) => {
	const selectAllServices = useCallback(
		e => {
			setQuoteSettingsState(prevState => ({
				...prevState,
				...premiumFreightServices,
				select_all_international_services: e.target.checked,
				carrier_services: {
					...prevState?.carrier_services,
					us_next_pm: e.target.checked,
					us_2nd_day: e.target.checked,
					us_ground: e.target.checked,
				},
			}))
		},
		[setQuoteSettingsState]
	)

	const makeSrvcIndex = useCallback(
		(srvcName = '') => srvcName.toLowerCase().trim().replaceAll(' ', '_'),
		[]
	)

	const handleServiceCheckAndValue = useCallback(
		(e, type = '') => {
			const checkType = 'input'
			const key =
				type === checkType ? e.target.name + '_makrup' : e.target.name
			const value = type === checkType ? e.target.value : e.target.checked

			let toggleSelectAllCheck =
				quoteSettingsState?.select_all_international_services ?? false

			if (type !== checkType) {
				const servicesChecked = international_services
					.filter(ds => makeSrvcIndex(ds) !== e.target.name)
					.every(
						srvc =>
							quoteSettingsState.carrier_services[makeSrvcIndex(srvc)]
					)

				if (servicesChecked && value) toggleSelectAllCheck = true
				else toggleSelectAllCheck = false
			}

			setQuoteSettingsState(prevState => ({
				...prevState,
				select_all_international_services: toggleSelectAllCheck,
				carrier_services: {
					...prevState?.carrier_services,
					[key]: value,
				},
			}))
		},
		[
			makeSrvcIndex,
			quoteSettingsState.carrier_services,
			quoteSettingsState?.select_all_international_services,
			setQuoteSettingsState,
		]
	)

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
					<label className='text-gray'>Select All Services</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							checked={
								quoteSettingsState?.select_all_international_services
							}
							onChange={selectAllServices}
							disabled={hanldeChecksDisability(
								quoteSettingsState,
								sameDayApi
							)}
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
								name={makeSrvcIndex(is)}
								checked={
									quoteSettingsState?.carrier_services?.[
										makeSrvcIndex(is)
									]
								}
								onChange={e => handleServiceCheckAndValue(e)}
								disabled={hanldeChecksDisability(
									quoteSettingsState,
									sameDayApi
								)}
							/>
						</Form.Item>
					</Col>

					<Col span={14}>
						<Form.Item className={'mb-0'}>
							<Input
								name={makeSrvcIndex(is) + '_markup'}
								value={
									quoteSettingsState?.carrier_services?.[
										makeSrvcIndex(is) + '_markup'
									]
								}
								onChange={e =>
									handleServiceCheckAndValue(e, 'input')
								}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
								disabled={hanldeChecksDisability(
									quoteSettingsState,
									sameDayApi
								)}
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
						<label className='text-gray'>
							Markup (e.g Currency 1.00 or percentage 5%)
						</label>
					</Col>
				</Row>
			))}
		</Col>
	)
}

export default InternationalServices
