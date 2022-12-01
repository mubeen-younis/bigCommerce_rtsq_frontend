import React from 'react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Typography, Checkbox } from 'antd'
import { hanldeChecksDisability } from './Pages/Day&Ross/QuoteSettingsComponent'

const { Title } = Typography,
	RAD_ADDON = 'RAD'

const LiftGateDelivery = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
	showLiftGatePickup = false,
	sameDayApi = false,
}) => {
	const dispatch = useDispatch()
	const { installedAddons } = useSelector(state => state)

	const setActiveMenu = useCallback(
		() =>
			dispatch({
				type: 'SET_ACTIVE_MENU',
				payload: '99',
			}),
		[dispatch]
	)

	const isRadInstalled =
		installedAddons?.find(add => add.short_code === RAD_ADDON) ?? false

	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Lift gate settings</Title>
			</Col>
			{showLiftGatePickup && (
				<>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>
							Always include lift gate pick up
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='liftGatePickup'
								value={true}
								checked={quoteSettingsState.liftGatePickup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										liftGatePickup: e.target.checked,
									})
								}></Checkbox>
						</Form.Item>
					</Col>
				</>
			)}

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always quote lift gate delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='always_lift_gate_delivery'
						value={true}
						checked={quoteSettingsState.alwaysLiftGateDelivery}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								alwaysLiftGateDelivery:
									!quoteSettingsState.alwaysLiftGateDelivery,
								offerLiftGateDelivery: false,
								autoDetectedResidentialAddressesLfg: false,
								always_two_man_delivery: false,
								offer_two_man_delivery: false,
								offer_appointment_delivery: false,
								always_appointment_delivery: false,
							})
						}
						disabled={hanldeChecksDisability(
							quoteSettingsState,
							sameDayApi
						)}></Checkbox>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Offer lift gate delivery as an option
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='offer_lift_gate_delivery'
						checked={quoteSettingsState.offerLiftGateDelivery}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								offerLiftGateDelivery:
									!quoteSettingsState.offerLiftGateDelivery,
								alwaysLiftGateDelivery: false,
								always_two_man_delivery: false,
								offer_two_man_delivery: false,
								offer_appointment_delivery: false,
								always_appointment_delivery: false,
							})
						}
						disabled={hanldeChecksDisability(
							quoteSettingsState,
							sameDayApi
						)}
					/>
				</Form.Item>
			</Col>

			{!sameDayApi && (
				<>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>
							Always include lift gate delivery when a residential
							address is detected
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='auto_detected_residential_addresses_lfg'
								checked={
									quoteSettingsState.autoDetectedResidentialAddressesLfg
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddressesLfg:
											!quoteSettingsState.autoDetectedResidentialAddressesLfg,
										alwaysLiftGateDelivery: false,
										always_two_man_delivery: false,
										offer_two_man_delivery: false,
										offer_appointment_delivery: false,
										always_appointment_delivery: false,
									})
								}
								disabled={
									!radStatus ||
									!quoteSettingsState.autoDetectedResidentialAddresses
								}
							/>
							{!isRadInstalled && (
								<label
									className={'ml-4'}
									style={{ marginLeft: '10px' }}>
									Click{' '}
									<Link to='/' onClick={setActiveMenu}>
										here
									</Link>{' '}
									to add the Residential Address Detection add-on.
								</label>
							)}
						</Form.Item>
					</Col>
				</>
			)}
		</Row>
	)
}

export default LiftGateDelivery
