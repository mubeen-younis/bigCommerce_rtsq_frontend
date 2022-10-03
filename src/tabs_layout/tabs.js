import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs } from 'antd'
import CarriersComponent from '../components/CarriersComponent'
import ProductSettingsComponent from '../components/ProductSettingsComponent'
import BoxSizesComponent from '../components/Pages/BoxSizesComponent'
import PlanStatusHeading from '../partials/PlanStatusHeading'
import GTZCarriersComponent from '../components/Pages/GlobalTranz/Ltl/CarriersComponent'
import useLoadComponent from '../hooks/useLoadComponent'
import ShippingRatesComponent from '../components/Pages/DBSC/ShippingRatesComponent'
import ShippingClassesComponent from '../components/Pages/DBSC/ShippingClassesComponent'
import OtherSettings from '../components/Pages/DBSC/OtherSettings'
import PalletBoxSizesComponent from '../components/PalletPackaging/PalletBoxSizesComponent'

const { TabPane } = Tabs

function TabsLayout() {
	const { installedCarriers, carrierId } = useSelector(state => state)
	const [component, setComponent] = useState(0)
	const [tab, setTab] = useState('1')
	const [carrierSlug, setCarrierSlug] = useState('')
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
				'estes-ltl',
				'dayross-ltl',
				'odfl-ltl',
				'saia-ltl',
				'abf-ltl',
				'southeastern-ltl',
				'usps-small',
				'tql-ltl',
				'echo-ltl',
				'daylight-ltl',
				'purolator-small',
				'freightquote-chr-ltl',
				'dbsc',
			]

			for (const ic of installedCarriers) {
				if (+ic.id === +carrierId) {
					const isFedexSmallCarrier = ic.slug === 'fedex-small'
					const isUspsSmallCarrier = ic.slug === 'usps-small'

					dispatch({
						type: 'SET_FEDEX_SMALL_CARRIER',
						payload: isUspsSmallCarrier ? false : isFedexSmallCarrier,
					})
					dispatch({
						type: 'SET_USPS_SMALL_CARRIER',
						payload: isFedexSmallCarrier ? false : isUspsSmallCarrier,
					})

					setComponent(slugs.indexOf(ic.slug))
					setCarrierSlug(ic.slug)
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

	const [connSettingsComponent, quoteSettingsComponent] =
		useLoadComponent(component)

	const showTab = useCallback(
		(type = 0) =>
			installedCarriers
				? installedCarriers
						?.filter(ic => +ic.carrier_type === type)
						?.map(carr => carr.slug)
						.includes(carrierSlug)
				: false,
		[carrierSlug, installedCarriers]
	)

	return (
		<Fragment>
			<PlanStatusHeading />

			<Tabs className={'tabs-wrp'} onChange={handleActiveTab} type='card'>
				{carrierSlug !== 'usps-small' && carrierSlug !== 'dbsc' && (
					<TabPane tab='Connection Settings' key='1'>
						{connSettingsComponent}
					</TabPane>
				)}
				{[
					'ltl-quotes',
					'freightquote-ltl',
					'tql-ltl',
					'echo-ltl',
					'freightquote-chr-ltl',
				].includes(carrierSlug) && (
					<TabPane tab='Carriers' key='2'>
						<CarriersComponent />
					</TabPane>
				)}
				{['gtz-ltl'].includes(carrierSlug) && (
					<TabPane tab='Carriers' key='2'>
						<GTZCarriersComponent />
					</TabPane>
				)}
				{['dbsc'].includes(carrierSlug) && (
					<>
						<TabPane tab='Shipping Rates' key='9'>
							<ShippingRatesComponent />
						</TabPane>
						<TabPane tab='Other Settings' key='10'>
							<OtherSettings />
						</TabPane>
						<TabPane tab='Shipping Classes' key='11'>
							<ShippingClassesComponent />
						</TabPane>
					</>
				)}

				{!['dbsc'].includes(carrierSlug) && (
					<TabPane tab='Quote Settings' key='5'>
						{quoteSettingsComponent}
					</TabPane>
				)}
				<TabPane tab='Product Settings' key='6'>
					<ProductSettingsComponent />
				</TabPane>

				{showTab(2) && (
					<TabPane tab='Box Sizes' key='8'>
						<BoxSizesComponent />
					</TabPane>
				)}
				{showTab(1) && (
					<TabPane tab='Pallets' key='12'>
						<PalletBoxSizesComponent />
					</TabPane>
				)}
			</Tabs>
		</Fragment>
	)
}

export default TabsLayout
