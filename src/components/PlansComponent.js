import React, { useEffect } from 'react'
import { Row, Col, Button, Skeleton } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getPlans } from '../Actions/Plans'

function PlansComponent() {
	const dispatch = useDispatch()
	const plans = useSelector(state => state.plans)
	useEffect(() => {
		if (!plans) {
			dispatch(getPlans())
		}
	}, [dispatch, plans])

	return plans ? (
		<Row gutter={40}>
			{plans.map((plan, i) => (
				<Col className='gutter-row mb-3' xs={24} sm={24} md={12} lg={12} xl={8} key={i}>
					<div className={'pricing-box'}>
						<div className='pricing-header'>
							{plan.status === 1 && (
								<h2>
									<div>{plan.name}</div>
									<small>This is your current plan:</small>
								</h2>
							)}
							{/* <Button className={'btn-plane'} size={'large'} type='default'>
								${plan.price} / month
                            </Button> */}

							<Button size={'large'} type='primary' className='mt-2'>
								${plan.price} / month
							</Button>
						</div>
						<ul>
							{plan.terms.split('.').map(term => (
								<li key={term}>{term}</li>
							))}
						</ul>
					</div>
				</Col>
			))}
		</Row>
	) : (
		<Skeleton />
	)
}

export default PlansComponent
