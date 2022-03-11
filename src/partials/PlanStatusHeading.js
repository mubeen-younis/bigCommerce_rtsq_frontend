import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

function PlanStatusHeading() {
	const { currentPlan } = useSelector(state => state)

	const trailPlanCheck =
		currentPlan?.status === 2
			? 'Your trial plan is expired. Please subscribe to a paid plan otherwise your quoting will not work.'
			: `You are currently on the Trial plan. ${
					currentPlan?.status === 1 &&
					`It will expire on ${currentPlan?.ends_at}`
			  }.`

	return (
		<Fragment>
			{currentPlan?.is_expired ? (
				<div className='note-bx'>
				Your current plan has been expired. Please renew your Plan.
				</div>
			) : currentPlan?.status === 3 ? (
				<div className='note-bx'>Your plan has been expired</div>
			) : currentPlan?.plan_id === 0 ? (
				<div className='note-bx'>
					You don't have an active plan. On the Plans page, choose the
					Trial plan or one of the paid plans to get started.
				</div>
			) : currentPlan?.plan_id === 1 ? (
				<div className='note-bx'>{trailPlanCheck}</div>
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
			) : null}
		</Fragment>
	)
}

export default PlanStatusHeading
