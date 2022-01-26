import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from 'antd'

import ConnectionSettingsComponentUpsLtl from '../components/Pages/UpsLtl/ConnectionSettingsComponent'

import QuoteSettingsComponentWwe from '../components/Pages/WweLtl/QuoteSettingsComponentWwe'
import QuoteSettingsComponentWweSmall from '../components/Pages/WweSmall/QuoteSettingsComponentWweSmall'
import QuoteSettingsComponentUpsLtl from '../components/Pages/UpsLtl/QuoteSettingsComponentWwe'
import QuoteSettingsComponentUpsSmall from '../components/Pages/UpsSmall/QuoteSettingsComponent'
import QuoteSettingsComponentFedexltl from '../components/Pages/Fedex/Ltl/QuoteSettingsComponentWwe'
import QuoteSettingsComponentFedexSmall from '../components/Pages/Fedex/Small/QuoteSettingsComponent'
import QuoteSettingsComponentGtzLtl from '../components/Pages/GlobalTranz/Ltl/QuoteSettingsComponent'
import QuoteSettingsComponentXpoLtl from '../components/Pages/XPO/Ltl/QuoteSettingsComponentWwe'
import QuoteSettingsComponentRLLtl from '../components/Pages/R+LLtl/QuoteSettingsComponentWwe'
import QuoteSettingsComponentUnishippers from '../components/Pages/Unishippiers/QuoteSettingsComponent'
// import BoxSizesComponent from '../components/Pages/BoxSizesComponent';
import CarriersComponent from '../components/CarriersComponent'
import ProductSettingsComponent from '../components/ProductSettingsComponent'
import WarehouseComponent from '../components/Pages/WarehouseComponent'
import UserGuideComponent from '../components/Pages/UserGuideComponent'
import ImportCsvComponent from '../components/Pages/ImportCsvComponent'
import ConnectionSettingsComponentWweltl from '../components/Pages/WweLtl/ConnectionSettingsComponent'
import ConnectionSettingsComponentWweSmall from '../components/Pages/WweSmall/ConnectionSettingsComponentWweSmall'
import ConnectionSettingsComponentUpsSmall from '../components/Pages/UpsSmall/ConnectionSettingsComponent'
import ConnectionSettingsComponentFedexLtl from '../components/Pages/Fedex/Ltl/ConnectionSettingsComponent'
import ConnectionSettingsComponentFedexSmall from '../components/Pages/Fedex/Small/ConnectionSettingsComponent'
import ConnectionSettingsComponentGtzLtl from '../components/Pages/GlobalTranz/Ltl/ConnectionSettingsComponent'
import ConnectionSettingsComponentXpoLtl from '../components/Pages/XPO/Ltl/ConnectionSettingsComponent'
import ConnectioSettingsComponentRLLTl from '../components/Pages/R+LLtl/ConnectionSettingsComponent'
import ConnectionSettingsComponentUnishippers from '../components/Pages/Unishippiers/ConnectionSettingsComponent'
import BoxSizesComponent from '../components/Pages/BoxSizesComponent'
import OrdersComponent from '../components/OrdersComponent'
// import AlertMessage from "../Utilities/AlertMessage";
import PlanStatusHeading from '../partials/PlanStatusHeading'
import GTZCarriersComponent from '../components/Pages/GlobalTranz/Ltl/CarriersComponent'

const { TabPane } = Tabs
function callback(key) {
	// console.log(key);
}

function TabsLayout() {
	const { installedCarriers, carrierId } = useSelector(state => state)
	const [component, setComponent] = useState(0)
	const dispatch = useDispatch()
	// const plans = {
	// 	0: 'Trial',
	// 	1: 'Basic',
	// 	2: 'Standard',
	// 	3: 'Advanced',
	// }
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
				'unishippers',
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

			<Tabs className={'tabs-wrp'} onChange={callback} type='card'>
				<TabPane tab='Connection Settings' key='1'>
					{component === 0 && <ConnectionSettingsComponentWweltl />}
					{component === 1 && <ConnectionSettingsComponentWweSmall />}
					{component === 2 && <ConnectionSettingsComponentUpsLtl />}
					{component === 3 && <ConnectionSettingsComponentUpsSmall />}
					{component === 4 && <ConnectionSettingsComponentFedexLtl />}
					{component === 5 && (
						<ConnectionSettingsComponentFedexSmall />
					)}
					{component === 6 && <ConnectionSettingsComponentGtzLtl />}
					{component === 7 && <ConnectionSettingsComponentXpoLtl />}
					{component === 8 && <ConnectioSettingsComponentRLLTl />}
					{component === 9 && <ConnectionSettingsComponentUnishippers />}
				</TabPane>
				{[0].includes(component) && (
					<TabPane tab='Carriers' key='2'>
						<CarriersComponent />
					</TabPane>
				)}
				{[6].includes(component) && (
					<TabPane tab='Carriers' key='2'>
						<GTZCarriersComponent />
					</TabPane>
				)}
				<TabPane tab='Warehouses' key='3'>
					<WarehouseComponent />
				</TabPane>
				<TabPane tab='Quote Settings' key='4'>
					{component === 0 && <QuoteSettingsComponentWwe />}
					{component === 1 && <QuoteSettingsComponentWweSmall />}
					{component === 2 && <QuoteSettingsComponentUpsLtl />}
					{component === 3 && <QuoteSettingsComponentUpsSmall />}
					{component === 4 && <QuoteSettingsComponentFedexltl />}
					{/* {component === 5 && <QuoteSettingsComponentFedexSmall />} */}
					{component === 5 && <QuoteSettingsComponentUnishippers />}
					{component === 6 && <QuoteSettingsComponentGtzLtl />}
					{component === 7 && <QuoteSettingsComponentXpoLtl />}
					{component === 8 && <QuoteSettingsComponentRLLtl />}
				</TabPane>
				<TabPane tab='Product Settings' key='5'>
					<ProductSettingsComponent />
				</TabPane>
				<TabPane tab='Orders' key='6'>
					<OrdersComponent />
				</TabPane>

				{/* <TabPane tab="Import CSV" key="6">
                    <AlertMessage />
                    <ImportCsvComponent />
                </TabPane>*/}
				{(component === 1 || component === 3 || component === 5) && (
					<TabPane tab='Box Sizes' key='7'>
						<BoxSizesComponent />
					</TabPane>
				)}
				<TabPane tab='Import CSV' key='8'>
					<ImportCsvComponent />
				</TabPane>
				<TabPane tab='User Guide' key='9'>
					<UserGuideComponent />
				</TabPane>
			</Tabs>
		</Fragment>
	)
}

export default TabsLayout
