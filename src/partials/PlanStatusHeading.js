import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

function PlanStatusHeading() {
	const { currentPlan, store } = useSelector(state => state)

	const trailPlanCheck =
		currentPlan?.status === 2
			? 'Your trial plan has been expired. Please activate your paid plan.'
			: `You are currently on the Trial plan. ${
					currentPlan?.status === 1 &&
					`It will expire on ${currentPlan?.ends_at}`
			  }.`

	const devPlanCheck =
		currentPlan?.status === 2
			? 'Your development plan has been expired. Please activate your paid plan.'
			: (currentPlan?.plan_id === 5 && store?.plan_level != 'Sandbox Store') ? 'You are now on live store. Please activate your paid plan.'
			: `You are currently on the Development plan. ${
					currentPlan?.status === 1 &&
					`It will expire on ${currentPlan?.ends_at}`
			  }.`

	return (
		<Fragment>
			{(currentPlan?.is_expired && store?.plan_level != 'Sandbox Store') ? (
				<div className='note-bx'>
				Your current {currentPlan?.name} plan has expired. Please renew your plan.
				</div>
			) : (currentPlan?.status === 3 && store?.plan_level != 'Sandbox Store') ? (
				<div className='note-bx'>Your current {currentPlan?.name} plan has expired. Please renew your plan.</div>
			) : ((currentPlan?.plan_id === 0 || currentPlan == null) && store?.plan_level == 'Sandbox Store') ? (
				<div className='note-bx'>
					You are currently on a Sandbox Store. To get started with your store, please choose a Development Plan.
				</div>
			) : currentPlan?.plan_id === 0 ? (
				<div className='note-bx'>
					You don't have an active plan. On the Plans page, choose the
					Trial plan or one of the paid plans to get started.
				</div>
			) : null}
			{/* currentPlan?.plan_id === 1 ? (
				<div className='note-bx'>{trailPlanCheck}</div>
			) : currentPlan?.plan_id === 5 ? (
				<div className='note-bx'>{devPlanCheck}</div>
			) : currentPlan?.plan_id === 2 ? (
				<div className='note-bx'>
					You are currently on the Basic plan.
					{currentPlan?.status === 2
						? ' Subscription will be cancelled automatically at the end of the period on ' +
						  currentPlan?.ends_at +
						  '.'
						: ' It will auto-renew on ' + currentPlan?.ends_at + '.'}
				</div>
			) : currentPlan?.plan_id === 3 ? (
				<div className='note-bx'>
					You are currently on the Standard plan.
					{currentPlan?.status === 2
						? ' Subscription will be cancelled automatically at the end of the period on ' +
						  currentPlan?.ends_at +
						  '.'
						: ' It will auto-renew on ' + currentPlan.ends_at + '.'}
				</div>
			) : currentPlan?.plan_id === 4 ? (
				<div className='note-bx'>
					You are currently on the Advanced plan.
					{currentPlan?.status === 2
						? ' Subscription will be cancelled automatically at the end of the period on ' +
						  currentPlan?.ends_at +
						  '.'
						: ' It will auto-renew on ' + currentPlan?.ends_at + '.'}
				</div>
			) : null} */}
		</Fragment>
	)
}

export default PlanStatusHeading
