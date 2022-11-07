import React, { useCallback } from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'

const { Title } = Typography

export const premiumFreightServices = {
	deliver_to_threshold: false,
	deliver_to_room_of_choice: false,
	deliver_and_packaging_removal: false,
	deliver_to_threshold_two_man: false,
	deliver_to_room_of_choice_two_man: false,
	deliver_and_packaging_removal_two_man: false,
}

const PremiumFreightServices = ({ quoteSettingsState, setQuoteSettingsState }) => {
	const selectService = useCallback(
		e => {
			const { name, checked } = e.target

			setQuoteSettingsState({
				...quoteSettingsState,
				alwaysLiftGateDelivery: false,
				offerLiftGateDelivery: false,
				carrier_services: {
					...quoteSettingsState?.carrier_services,
					ground_service: false,
					am_service: false,
					urgent_pac: false,
					us_next_pm: false,
					us_2nd_day: false,
					us_ground: false,
				},
				...premiumFreightServices,
				[name]: checked,
			})
		},
		[quoteSettingsState, setQuoteSettingsState]
	)

	const handleChecksSelection = useCallback(() => {
		const services = [
			'ground_service',
			'am_service',
			'urgent_pac',
			'us_next_pm',
			'us_2nd_day',
			'us_ground',
		]

		return services.some(srvc => quoteSettingsState?.carrier_services[srvc])
	}, [quoteSettingsState?.carrier_services])

	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Premium Freight Services</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Deliver to threshold</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_to_threshold'
						checked={quoteSettingsState.deliver_to_threshold}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Deliver to room of choice</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_to_room_of_choice'
						checked={quoteSettingsState.deliver_to_room_of_choice}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Deliver & packaging removal</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_and_packaging_removal'
						checked={quoteSettingsState.deliver_and_packaging_removal}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>Deliver to threshold - 2 man</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_to_threshold_two_man'
						checked={quoteSettingsState.deliver_to_threshold_two_man}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Deliver to room of choice - 2 man
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_to_room_of_choice_two_man'
						checked={
							quoteSettingsState.deliver_to_room_of_choice_two_man
						}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Deliver & packaging removal - 2 man
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='deliver_and_packaging_removal_two_man'
						checked={
							quoteSettingsState.deliver_and_packaging_removal_two_man
						}
						onChange={e => selectService(e)}
						disabled={handleChecksSelection()}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default PremiumFreightServices
