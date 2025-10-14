import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Checkbox, Typography, Card, Select, Skeleton, Modal } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
	getPalletsPlans,
	changePlan,
	changeAddonSuspendStatus,
} from '../../Actions/Pallets'
import { changeAddonStatus } from '../../Actions/EnitureStore'
import { useCallback } from 'react'
import PalletBoxSizesComponent from './PalletBoxSizesComponent'

const { Title } = Typography
const { Option } = Select

function AutoDetectResidentialComponent(props) {
	console.log("aaaaaaa", props);
	const [suspend, setSuspend] = useState(false)
	const [cancelSubsriptionVisible, SetCancelSubsriptionVisible] = useState(false)
	const [newPlan, SetNewPlan] = useState({})
	const dispatch = useDispatch()
	const { token, palletPlans, store, installedAddons } = useSelector(state => state)

	// Find the Pallet Packaging addon to get its current status
	const palletAddon = installedAddons?.find(addon => addon.name?.trim() === 'Pallet Packaging')
	const [isAddonEnabled, setIsAddonEnabled] = useState(palletAddon?.is_enabled || false)

	useEffect(() => {
		if (!palletPlans) dispatch(getPalletsPlans(token))
	}, [token, dispatch, palletPlans])

	// Update addon enabled state when installedAddons changes
	useEffect(() => {
		const updatedPalletAddon = installedAddons?.find(addon => addon.name?.trim() === 'Pallet Packaging')
		setIsAddonEnabled(updatedPalletAddon?.is_enabled || false)
	}, [installedAddons])

	const changePalletPlan = useCallback(() => {
		dispatch(changePlan(token, newPlan?.id, SetCancelSubsriptionVisible))
	}, [dispatch, newPlan?.id, token])

	const chanePlanAction = useCallback(
		plan_value => {
			if (plan_value === 'disable' || plan_value === 15 || plan_value === 23) {
				dispatch(changePlan(token, plan_value, SetCancelSubsriptionVisible))
			} else {
				const plan = palletPlans
					? palletPlans?.allPalletPackages?.find(
							({ id }) => id === plan_value
					  )
					: []

				SetNewPlan(plan)
				SetCancelSubsriptionVisible(true)
			}
		},
		[dispatch, token, palletPlans]
	)

	const changePalletAddonSuspendStatus = useCallback(
		value => {
			let action = value ? 3 : 1
			dispatch(
				changeAddonSuspendStatus(
					palletPlans ? palletPlans?.currentPackage?.package_id : null,
					token,
					action
				)
			)
		},
		[dispatch, token, palletPlans]
	)

	const handleAddonToggle = (checked) => {
		// Send the actual Pallet Packaging addon ID
		if (palletAddon?.id) {
			dispatch(changeAddonStatus(palletAddon.id, token))
		}
		// Don't set local state - let Redux store update drive the UI
	}

	if (!palletPlans) return <Skeleton active />

	return (
		<Fragment>
			<Row gutter={24} justify='center'>
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={22}>
					<Title level={3}>
						Pallets
					</Title>
				</Col>
			</Row>

			<Modal
				title='Note!'
				visible={cancelSubsriptionVisible}
				onCancel={() => SetCancelSubsriptionVisible(false)}
				centered
				onOk={changePalletPlan}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				You have elected to enable the Pallet Packaging feature. By
				confirming this election you will be charged for the{' '}
				{Intl.NumberFormat('en-US').format(newPlan?.htis)}/mo ($
				{newPlan?.cost}.00) plan. To ensure service continuity the plan will
				automatically renew each month, or when the plan is depleted,
				whichever comes first. You can change which plan is put into effect
				on the next renewal date by updating the selection on this page at
				anytime.
			</Modal>

			<Row gutter={24} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={22}>
					<Card style={{ width: '100%' }}>
						<p>
							The Pallet Size feature calculates the optimal packaging solution based on 
							your standard Pallet size. The solution is available graphically to assist 
							order fulfillment. The next subscription begins when the current one expires 
							or is depleted, which ever comes first. Refer to the{' '}
							<a
								href='https://eniture.com/bigcommerce-real-time-shipping-quotes/#pallet-packaging'
								target='_blank'
								rel='noreferrer'>
								{' '}
								User's Guide
							</a>{' '}
							for more detailed information.
						</p>

						<label>
							<strong>Auto-renew</strong>
						</label>
						<Select
							value={
								!props?.palletPlans?.currentPackage || props?.palletPlans?.currentPackage === null
									? 'disable'
									: props?.palletPlans?.currentPackage?.status === 0
									? 'disable'
									: props?.palletPlans?.currentPackage
											?.package_to_be_charge_status === 1
									? props?.palletPlans?.currentPackage
											?.to_be_charge_package_id
									: props?.palletPlans?.currentPackage
											?.package_to_be_charge_status === 'Trial'
									? props?.palletPlans?.currentPackage
											?.to_be_charge_package_id
									: props?.palletPlans?.currentPackage
											?.package_to_be_charge_status === 'Development Plan'
									? props?.palletPlans?.currentPackage
											?.to_be_charge_package_id
									: typeof props?.palletPlans?.currentPackage?.package_to_be_charge_status === 'number'
									? props?.palletPlans?.currentPackage?.package_to_be_charge_status
									: 'disable'
							}
							style={{ width: '100%', marginBottom: '20px' }}
							onChange={chanePlanAction}
							name='plan_value'>
							<Option key='disable' value='disable'>
								Disable (default)
							</Option>
							{props?.palletPlans?.allPalletPackages?.length > 0
								? props?.palletPlans?.allPalletPackages?.map(
										plan => (
											<>
											
												{plan.cost !== 0
													? <Option key={plan.id} value={plan.id} disabled={store.plan_level === 'Sandbox Store11'}>
														{Intl.NumberFormat('en-US').format(
															plan.htis)}/mo (${
															plan.cost
													  	})
													  </Option>
													: (plan.name == 'Development Plan' && store.plan_level == 'Sandbox Store11')
                          							? <Option key={plan.id} value={plan.id}>
                            							{Intl.NumberFormat('en-US').format(
                              								plan.htis)}/5 years {plan.name} (${
                              								plan.cost
                            							})
                            							</Option>
                          							: (plan.name == 'Trial' && store.plan_level != 'Sandbox Store11')
                          							? <Option key={plan.id} value={plan.id} disabled={store.plan_level === 'Sandbox Store11'}>
                              							{Intl.NumberFormat('en-US').format(
															plan.htis)}/15 days (${plan.cost
														}) - Trial
														</Option>
                          							: null
												}
											
											</>
										)
								  	)
								: null}
						</Select>

						{props?.palletPlans?.currentPackage === null ? (
							<p>
								<strong>
									You have not activated any plan. Select plan from
									dropdown.
								</strong>
							</p>
						) : (
							<Fragment>
								{props?.palletPlans?.currentPackage
									?.current_package_name === null ? (
									<h1 className='mb-2'>
										<b>No plan is activated.</b>
									</h1>
								) : props?.palletPlans?.currentPackage?.status ===
								  0 ? (
									<h1 className='mb-2'>
										<b>Your current subscription is expired.</b>
									</h1>
								) : (
									<Fragment>
										<label>
											<strong>Current plan</strong>
										</label>

										<div
											style={{
												width: '100%',
												marginBottom: '20px',
											}}>
											<p style={{ marginBottom: '0' }}>
												$
												{
													props?.palletPlans
														?.currentPackage
														?.current_package_cost
												}
												/
												{
													props?.palletPlans
														?.currentPackage
														?.current_package_period
												}
											</p>
											<p style={{ marginBottom: '0' }}>
												Start date:{' '}
												{new Date(
													props?.palletPlans?.currentPackage?.subscription_time
												)
													.toDateString()
													.substring(4)}{' '}
											</p>
											<p style={{ marginBottom: '0' }}>
												End date:{' '}
												{new Date(
													props?.palletPlans?.currentPackage?.expiry_time
												)
													.toDateString()
													.substring(4)}
											</p>
										</div>

										<label>
											<strong>Current usage</strong>
										</label>

										<div
											style={{
												width: '100%',
												marginBottom: '20px',
											}}>
											<p style={{ marginBottom: '0' }}>
												{Intl.NumberFormat('en-US').format(
													props?.palletPlans
														?.currentPackage
														?.consumed_hits
												)}
												/
												{Intl.NumberFormat('en-US').format(
													props?.palletPlans
														?.currentPackage
														?.total_allowed_hits
												)}{' '}
												{
													props?.palletPlans
														?.currentPackage
														?.consumed_hits_in_per
												}
												%{' '}
											</p>
										</div>
										<div
											style={{
												width: '100%',
												marginBottom: '20px',
											}}>
											<Checkbox
												onChange={e => {
													changePalletAddonSuspendStatus(
														e.target.checked
													)
													setSuspend(e.target.checked)
												}}
												checked={
													suspend ||
													props?.palletPlans
														?.currentPackage?.status ===
														3
												}
												defaultValue={
													props?.palletPlans
														?.currentPackage?.status
												}>
												Suspend use
											</Checkbox>
										</div>
									</Fragment>
								)}
							</Fragment>
						)}
					</Card>
				</Col>
			</Row>

			<Row gutter={24} justify='center' className='mb-3'>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={22}>
					<PalletBoxSizesComponent />
				</Col>
			</Row>
		</Fragment>
	)
}

const mapStateToProps = state => ({
	token: state.token,
	palletPlans: state.palletPlans,
})

export default connect(mapStateToProps)(AutoDetectResidentialComponent)
