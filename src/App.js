import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Layout, message, Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './App.css'
import './responsive.css'
import SideMenu from './partials/SideMenu'
import { connect } from 'react-redux'

import { getLocations } from './Actions/Warehouse'
import {
	getInstalledCarriers,
	getInstalledAddons,
	getAllCarriers,
	getAllAddons,
} from './Actions/EnitureStore'
import { getPlans } from './Actions/Plans'
import { getRadPlans } from './Actions/RAD'
import { getSbsPlans } from './Actions/SBS'
import RendorCarrier from './components/RendorCarrier'
import RendorAddon from './components/RenderAddon'
import ShippingCarriersComponent from './components/Pages/ShippingCarriersComponent'
import PlansComponent from './components/Plans/PlansComponent'
import { setStore, getCurrentPlanInfo } from './Actions/Action'

const { Header, Content } = Layout

function App(props) {
	const {
		token,
		setToken,
		locations,
		getAllCarriers,
		carriers,
		getAllAddons,
		addons,
		getInstalledCarriers,
		installedCarriers,
		getInstalledAddons,
		installedAddons,
		alertMessageType,
		alertMessage,
		showAlertMessage,
		confirmModalAction,
		getRADPlans,
		getSbsPlans,
		currentPlan,
		getStorePlans,
		setStoreData,
	} = props

	const urlParams = new URLSearchParams(window.location.search)

	useEffect(() => {
		const store =
			urlParams.get('store') !== (undefined || null)
				? urlParams.get('store')
				: localStorage.getItem('store')

		if (token === (undefined || null) && store !== undefined && store !== null) {
			setToken(store)
			setStoreData(store)
			currentPlan(store)
		}

		getRADPlans(store)
		getSbsPlans(store)
		locations(store)
		getAllCarriers(store)
		getAllAddons(store)
		getInstalledCarriers(store)
		getInstalledAddons(store)
		getStorePlans()

		// eslint-disable-next-line
	}, [])

	message.config({
		maxCount: 1,
	})

	const showMessageNotice = () => {
		if (alertMessageType === 'success') {
			message.success(alertMessage)
		} else if (alertMessageType === 'error') {
			message.error(alertMessage)
		} else if (alertMessageType === 'warning') {
			message.warning(alertMessage)
		} else if (alertMessageType === 'loading') {
			message.loading('Loading. Please wait...')
		}
	}

	if (showAlertMessage) {
		showMessageNotice()
	}

	const confirmModal = (ok, cancel) => {
		confirmModalAction(ok, cancel)
	}

	if (token === null || token === undefined) {
		return <h1>Invalid store.</h1>
	}

	if (alertMessageType === 'Token Mismatch') {
		return <h2 text='danger'>Invalid Token! Contact your administrator.</h2>
	}

	if (
		installedCarriers === undefined ||
		installedAddons === undefined ||
		carriers === undefined ||
		addons === undefined
	) {
		const antIcon = (
			<LoadingOutlined
				style={{
					fontSize: 60,
					marginTop: '400px',
				}}
			/>
		)

		return <Spin indicator={antIcon} />
	}

	return (
		<Router>
			<Layout>
				<SideMenu />

				<Layout>
					<Header className={'top-header'} style={{ padding: 0 }} />
					<Content className={'body-content'}>
						<Switch>
							<Route
								exact
								path='/'
								component={ShippingCarriersComponent}
							/>
							<Route exact path='/plans' component={PlansComponent} />
							<Route
								exact
								path='/addon/:addon_id'
								component={RendorAddon}
							/>
							<Route
								exact
								path='/:carrier_id'
								component={RendorCarrier}
							/>
						</Switch>

						<Modal
							title={confirmModal !== null ? confirmModal.title : ''}
							visible={confirmModal !== null ? confirmModal.on : false}
							onOk={() => confirmModal(true, false)}
							onCancel={() => confirmModal(false, true)}
							okText='Confirm'
							cancelText='Cancel'>
							<p>{confirmModal !== null ? confirmModal.body : ''}</p>
						</Modal>
					</Content>
				</Layout>
			</Layout>
		</Router>
	)
}

const mapStateToProps = state => {
	return {
		store: state.store,
		alertMessage: state.alertMessage,
		alertMessageType: state.alertMessageType,
		showAlertMessage: state.showAlertMessage,
		token: state.token,
		confirmModal: state.confirmModal,
		plansInfo: state.PlansInfo,
		currentPlan: state.currentPlan,
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		carriers: state.carriers,
		addons: state.addons,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		locations: token => dispatch(getLocations(token)),
		getAllCarriers: store => dispatch(getAllCarriers({ store })),
		getAllAddons: store => dispatch(getAllAddons({ store })),
		getInstalledCarriers: store => dispatch(getInstalledCarriers({ store })),
		getInstalledAddons: store => dispatch(getInstalledAddons({ store })),
		getRADPlans: token => dispatch(getRadPlans(token)),
		getSbsPlans: token => dispatch(getSbsPlans(token)),
		getStorePlans: () => dispatch(getPlans()),
		setToken: token => {
			localStorage.setItem('store', token)
			dispatch({ type: 'TOKEN', payload: token })
		},
		setStoreData: store_token => dispatch(setStore(store_token)),
		currentPlan: store_token => dispatch(getCurrentPlanInfo(store_token)),
		confirmModalAction: (ok, cancel) =>
			dispatch({
				type: 'CONFIRM_MODAL',
				payload: {
					on: false,
					ok: ok,
					cancel: cancel,
					title: '',
					body: '',
				},
			}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
