import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Checkbox, Typography, Card, Select, Skeleton, Modal, Form, Radio } from 'antd'
import { connect, useDispatch } from 'react-redux'
// import { useParams } from 'react-router-dom'
import { getSbsPlans, changePlan, changeAddonSuspendStatus, changeBinsPackagingMode } from '../Actions/SBS'
import BoxSizesComponent from '../components/Pages/BoxSizesComponent'

const { Title } = Typography
const { Option } = Select

function AutoDetectResidentialComponent(props) {
	// const { addon_id } = useParams()
	const [suspend, setSuspend] = useState(false)
	const [cancelSubsriptionVisible, SetCancelSubsriptionVisible] = useState(false)
	const [newPlan, SetNewPlan] = useState(0)
	const dispatch = useDispatch()
	const { sbsPlans, getSbsPlans, token } = props

	useEffect(() => {
		if (!sbsPlans) {
			getSbsPlans(token)
		}

		/*props.installedAddons.forEach(ia =>
			ia.id === +addon_id ? setSuspend(ia.is_suspend) : null
		);*/
	}, [getSbsPlans, sbsPlans, token])

	const changePlan = () => {
		props.changePlan(props.token, newPlan?.id, SetCancelSubsriptionVisible)
	}

	const chanePlanAction = plan_value => {
		if (plan_value === 'disable' || plan_value === 1) {
			props.changePlan(props.token, plan_value, SetCancelSubsriptionVisible)
		} else {
			SetNewPlan(
				props?.sbsPlans?.allSbsPackages.find(({ id }) => id === plan_value)
			)
			SetCancelSubsriptionVisible(true)
		}
	}

	if (!props.sbsPlans) {
		return <Skeleton active />
	}

	// let value = 'disable'

	// if (
	// 	+props?.sbsPlans?.current_plan?.status?.nextSubcribedPackage
	// 		?.nextToBeChargedStatus === 1
	// ) {
	// 	value =
	// 		props.sbsPlans.current_plan.status.nextSubcribedPackage
	// 			.nextSubscriptionSCAC
	// } else if (
	// 	+props?.sbsPlans?.status?.nextSubcribedPackage?.nextToBeChargedStatus === 1
	// ) {
	// 	value = props.sbsPlans.status.nextSubcribedPackage.nextSubscriptionSCAC
	// }

	// const plan =
	// 	props?.sbsPlans?.current_plan?.status ?? props?.sbsPlans?.status ?? null
	if (
		props?.sbsPlans?.currentPackage?.status === null ||
		props?.sbsPlans?.currentPackage?.status === 3
	) {
		//setSuspend(true)
	}

	const changeAddonStatus = value => {
		//setSuspend(value)
		let action = value ? 3 : 1
		dispatch(
			changeAddonSuspendStatus(
				props?.sbsPlans?.currentPackage?.package_id,
				props.token,
				action
			)
		)
	}

	const binsPackagingMode = value => {
		dispatch(
			changeBinsPackagingMode(
				props.token,
				value
			)
		)
		dispatch({
			type: 'SBS_PLANS',
			payload: {...sbsPlans, binPackMode : value},
		});
	}
	
	return (
		<Fragment>
			<Row gutter={24}>
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={3} style={{ textAlign: 'center' }}>
						Standard Box Sizes
					</Title>
				</Col>
			</Row>
			<Modal
				title='Note!'
				visible={cancelSubsriptionVisible}
				onCancel={() => SetCancelSubsriptionVisible(false)}
				centered
				onOk={() => changePlan()}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				You have elected to enable the {/*newPlan?.name*/} Box Sizes feature.
				By confirming this election you will be charged for the{' '}
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
							The Box Sizes feature calculates the optimal packaging
							solution based on your standard box sizes. The solution
							is available graphically to assist order fulfillment. The
							next subscription begins when the current one expires or
							is depleted, which ever comes first. Refer to the{' '}
							<a
								href='https://eniture.com/bigcommerce-real-time-shipping-quotes/#documentation'
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
							defaultValue={
								props?.sbsPlans?.currentPackage === null
									? 'Select Plan'
									: props?.sbsPlans?.currentPackage
											?.package_to_be_charge_status === 1
									? props?.sbsPlans?.currentPackage
											?.to_be_charge_package_id
									: props?.sbsPlans?.currentPackage?.status === 0
									? null
									: props?.sbsPlans?.currentPackage
											?.package_to_be_charge_status === 'Trial'
									? '100/15 days ($0)'
									: props?.sbsPlans?.currentPackage
											?.package_to_be_charge_status
							}
							style={{ width: '100%', marginBottom: '20px' }}
							onChange={chanePlanAction}
							name='plan_value'>
							{props?.sbsPlans?.currentPackage !== null &&
							props?.sbsPlans?.currentPackage?.current_package_name !==
								'Trial' &&
							props?.sbsPlans?.currentPackage?.status !== 0 ? (
								<Option key='disable' value='disable'>
									Disable
								</Option>
							) : null}
							{props?.sbsPlans?.allSbsPackages?.length > 0
								? props?.sbsPlans?.allSbsPackages?.map(plan => (
										<Option key={plan.id} value={plan.id}>
											{plan.cost !== 0
												? `${Intl.NumberFormat(
														'en-US'
												  ).format(plan.htis)}/mo ($${
														plan.cost
												  })`
												: `${Intl.NumberFormat(
														'en-US'
												  ).format(plan.htis)}/15 days ($${
														plan.cost
												  })`}
										</Option>
								  ))
								: null}
						</Select>

						{props?.sbsPlans?.currentPackage === null ? (
							<p>
								<strong>
									You have not activated any plan. Select plan from
									dropdown.
								</strong>
							</p>
						) : (
							<Fragment>
								{props?.sbsPlans?.currentPackage
									?.current_package_name === null ? (
									<h1 className='mb-2'>
										<b>No plan is activated.</b>
									</h1>
								) : props?.sbsPlans?.currentPackage?.status === 0 ? (
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
												{/*props?.sbsPlans?.currentPackage?.current_package_name*/}{' '}
												$
												{
													props?.sbsPlans?.currentPackage
														?.current_package_cost
												}
												/
												{
													props?.sbsPlans?.currentPackage
														?.current_package_period
												}
											</p>
											<p style={{ marginBottom: '0' }}>
												Start date:{' '}
												{new Date(
													props?.sbsPlans?.currentPackage?.subscription_time
												)
													.toDateString()
													.substring(4)}{' '}
											</p>
											<p style={{ marginBottom: '0' }}>
												End date:{' '}
												{new Date(
													props?.sbsPlans?.currentPackage?.expiry_time
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
													props?.sbsPlans?.currentPackage
														?.consumed_hits
												)}
												/
												{Intl.NumberFormat('en-US').format(
													props?.sbsPlans?.currentPackage
														?.total_allowed_hits
												)}{' '}
												{
													props?.sbsPlans?.currentPackage
														?.consumed_hits_in_per
												}
												%{' '}
												{/*+props?.sbsPlans?.currentPackage?.last_update_time.replace(/[-: ]/g, '') === 0 */}
											</p>
										</div>
										<div
											style={{
												width: '100%',
												marginBottom: '20px',
											}}>
											<Checkbox
												onChange={e => {
													changeAddonStatus(
														e.target.checked
													)
													setSuspend(e.target.checked)
													//props.changeAddonSuspendStatus(props?.sbsPlans?.currentPackage?.package_id, props.token);
												}}
												checked={
													suspend ||
													props?.sbsPlans?.currentPackage
														?.status === 3
												}
												defaultValue={
													props?.sbsPlans?.currentPackage
														?.status
												}>
												Suspend Use
											</Checkbox>
										</div>
										<label>
											<strong>Optimize your packaging</strong>
										</label>
										<Form.Item className={'mb-0'}>
											<Radio
												onChange={e => {
													binsPackagingMode(
														e.target.value = 0
													)
												}}
												checked={
													props?.sbsPlans?.binPackMode === 0
												}
											>
												Space utilization in the package 
											</Radio>
										</Form.Item>
										<Form.Item className={'mb-0'}>
											<Radio
												onChange={e => {
													binsPackagingMode(
														e.target.value = 1
													)
												}}
												checked={
													props?.sbsPlans?.binPackMode === 1
												}
											>
												By number of packages
											</Radio>
										</Form.Item>
									</Fragment>
								)}
							</Fragment>
						)}
					</Card>
				</Col>
			</Row>

			<Row gutter={24} justify='center' className='mb-3'>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={22}>
					<BoxSizesComponent />
				</Col>
			</Row>
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		token: state.token,
		sbsPlans: state.sbsPlans,
		installedAddons: state.installedAddons,
		alertMessage: state.alertMessageType,
		addonSettings: state.addonSettings,
		SetCancelSubsriptionVisible: state.SetCancelSubsriptionVisible,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getSbsPlans: token => dispatch(getSbsPlans(token)),
		changePlan: (token, plan_package, SetCancelSubsriptionVisible) =>
			dispatch(changePlan(token, plan_package, SetCancelSubsriptionVisible)),
		/*changeAddonSuspendStatus: (addon_id, token,SetCancelSubsriptionVisible ) =>
			dispatch(changeAddonSuspendStatus(addon_id, token, SetCancelSubsriptionVisible)),*/
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AutoDetectResidentialComponent)
