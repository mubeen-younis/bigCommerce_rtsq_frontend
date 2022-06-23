import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from 'antd'
import CarriersComponent from '../components/CarriersComponent'
import ProductSettingsComponent from '../components/ProductSettingsComponent'
import UserGuideComponent from '../components/Pages/UserGuideComponent'
import ImportCsvComponent from '../components/Pages/ImportCsvComponent'
import BoxSizesComponent from '../components/Pages/BoxSizesComponent'
import OrdersComponent from '../components/OrdersComponent'
import PlanStatusHeading from '../partials/PlanStatusHeading'
import GTZCarriersComponent from '../components/Pages/GlobalTranz/Ltl/CarriersComponent'
import useLoadComponent from '../hooks/useLoadComponent'
import ShippingGroup from '../components/Pages/ShippingGroup'
// import AlertMessage from "../Utilities/AlertMessage";
// import BoxSizesComponent from '../components/Pages/BoxSizesComponent';

const { TabPane } = Tabs

function TabsLayout() {
	const { installedCarriers, carrierId } = useSelector(state => state)
	const [component, setComponent] = useState(0)
	const [tab, setTab] = useState('1')
	const dispatch = useDispatch()

	useEffect(() => {
		if (localStorage.getItem('tab')) setTab(localStorage.getItem('tab'))

		return () => localStorage.removeItem('tab')
	}, [tab])

	useEffect(() => {
		const loadComponent = () => {
			const slugs = [
				'ltl-quotes',
				'small-package',
				'ups-ltl',
				'ups-small',
				'fedex-ltl',
				'fedex-small',
				'gtz-ltl',
				'xpo-ltl',
				'rl-ltl',
				'unishippers-small',
				'yrc-ltl',
				'freightquote-ltl',
				'odfl-ltl',
			]

			for (const ic of installedCarriers) {
				if (+ic.id === +carrierId) {
					const isFedexSmallCarrier = ic.slug === 'fedex-small'

					dispatch({
						type: 'SET_FEDEX_SMALL_CARRIER',
						payload: isFedexSmallCarrier,
					})

					setComponent(slugs.indexOf(ic.slug))
					break
				}
			}
		}

		loadComponent()
	}, [carrierId, dispatch, installedCarriers])

	const handleActiveTab = useCallback((key = '') => {
		localStorage.setItem('tab', key)
		setTab(key)
	}, [])

	return (
		<Fragment>
			{/*planInfo && !planInfo.isExpired && (
				<div className='note-bx'>
					You are currently on <strong>{plans[planInfo.plan_type]}</strong> Plan.
					{planInfo.plan_type === 0 ? '' : `The plan renews on ${planInfo.expiry_date}.`}
				</div>
			)}

			{planInfo && planInfo.isExpired && (
				<div className='note-bx'>
					Error! Connection failed due to license expired. Please upgrage/renew your
					license from eniture.com dashboard.
				</div>
			)*/}
			<PlanStatusHeading />

			<Tabs
				className={'tabs-wrp'}
				onChange={handleActiveTab}
				// activeKey={tab}
				type='card'>
				<TabPane tab='Connection Settings' key='1'>
					{useLoadComponent(component)[0]}
				</TabPane>
				{[0, 11].includes(component) && (
					<TabPane tab='Carriers' key='2'>
						<CarriersComponent />
					</TabPane>
				)}
				{[6].includes(component) && (
					<TabPane tab='Carriers' key='2'>
						<GTZCarriersComponent />
					</TabPane>
				)}
				<TabPane tab='Shipping Groups' key='4'>
					<ShippingGroup />
				</TabPane>
				<TabPane tab='Quote Settings' key='5'>
					{useLoadComponent(component)[1]}
				</TabPane>
				<TabPane tab='Product Settings' key='6'>
					<ProductSettingsComponent />
				</TabPane>
				<TabPane tab='Orders' key='7'>
					<OrdersComponent />
				</TabPane>

				{[1, 3, 5, 9].includes(component) && (
					<TabPane tab='Box Sizes' key='8'>
						<BoxSizesComponent />
					</TabPane>
				)}
				<TabPane tab='Import CSV' key='9'>
					<ImportCsvComponent />
				</TabPane>
				<TabPane tab='User Guide' key='12'>
					<UserGuideComponent />
				</TabPane>
			</Tabs>
		</Fragment>
	)
}

export default TabsLayout
