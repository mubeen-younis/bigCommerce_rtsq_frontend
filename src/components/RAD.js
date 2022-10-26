import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Typography, Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const { Title } = Typography
const RAD_ADDON = 'RAD'

const RAD = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
	carrier,
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
	const isRadInstalled = installedAddons?.find(add => add.short_code === RAD_ADDON)
		? true
		: false

	const isRADDisabled = useCallback(() => {
		let isDisabled = false

		if (sameDayApi) {
			if (
				quoteSettingsState?.deliver_to_threshold ||
				quoteSettingsState?.deliver_to_room_of_choice
			) {
				isDisabled = false
			} else {
				isDisabled = true
			}
		}

		return isDisabled
	}, [quoteSettingsState, sameDayApi])

	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Residential address settings</Title>
			</Col>

			{carrier && (
				<>
					<Col
						className='gutter-row'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>
							Always include residential pick up
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
								name='residentialPickup'
								checked={quoteSettingsState.residentialPickup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										residentialPickup: e.target.checked,
									})
								}
							/>
						</Form.Item>
					</Col>
				</>
			)}

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Always quote residential delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='alwaysResidentialDelivery'
						checked={quoteSettingsState.alwaysResidentialDelivery}
						onChange={e =>
							setQuoteSettingsState({
								...quoteSettingsState,
								alwaysResidentialDelivery: e.target.checked,
								autoDetectedResidentialAddresses: false,
								offer_limited_access_delivery: false,
							})
						}
						disabled={isRADDisabled()}
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
							Auto-detect residential addresses
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
								name='autoDetectedResidentialAddresses'
								checked={
									quoteSettingsState.autoDetectedResidentialAddresses
								}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddresses:
											e.target.checked,
										alwaysResidentialDelivery: false,
									})
								}
								disabled={!radStatus}
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

export default RAD
