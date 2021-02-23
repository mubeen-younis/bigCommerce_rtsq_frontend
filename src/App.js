import React, { useEffect } from 'react';
import { Layout, message, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './App.css';
import './responsive.css';
import SideMenu from './partials/SideMenu';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import {
	getLocations,
	/* setStore, */ getAllCarriers,
	getAllAddons,
	getPlansInfo,
} from './Actions/Action';
import {
	getInstalledCarriers,
	getInstalledAddons,
} from './Actions/EnitureStore';
import RendorCarrier from './components/RendorCarrier';
import ShippingCarriersComponent from './components/Pages/ShippingCarriersComponent';
import AutoDetectResidentialComponennt from './components/AutoDetectResidentialComponennt';

const { Header, Content } = Layout;

function App(props) {
	const urlParams = new URLSearchParams(window.location.search);
	useEffect(() => {
		const store =
			urlParams.get('store') !== (undefined || null)
				? urlParams.get('store')
				: localStorage.getItem('store');
		console.log('store ', store);
		if (props.token === (undefined || null) && store !== undefined) {
			props.setToken(store);
		}

		/* props.locations(store);
		props.getAllCarriers(store); */
		props.getPlansInfo(store);

		if (
			props.warehouse === null ||
			props.warehouse === undefined ||
			props.dropships === undefined ||
			props.dropships === undefined
		) {
			props.locations(store);
		}

		if (props.carriers === null || props.carriers === undefined) {
			props.getAllCarriers(store);
		}

		if (props.addons === null || props.addons === undefined) {
			props.getAllAddons(store);
		}

		if (
			props.installedCarriers === null ||
			props.installedCarriers === undefined
		) {
			props.getInstalledCarriers(store);
		}

		if (props.installedAddons === null || props.installedAddons === undefined) {
			props.getInstalledAddons(store);
		}
	}, [props]);

	message.config({
		maxCount: 1,
	});

	const showMessageNotice = () => {
		if (props.alertMessageType === 'success') {
			message.success(props.alertMessage);
		} else if (props.alertMessageType === 'error') {
			message.error(props.alertMessage);
		} else if (props.alertMessageType === 'warning') {
			message.warning(props.alertMessage);
		} else if (props.alertMessageType === 'loading') {
			message.loading('Loading. Please wait...');
		}
	};

	if (props.showAlertMessage) {
		showMessageNotice();
	}

	const confirmModal = (ok, cancel) => {
		props.confirmModalAction(ok, cancel);
	};
	console.log('props ', props);
	if (props.token === null || props.token === undefined) {
		return (
			<>
				<p>Invalid store.</p>
			</>
		);
	}

	/* if (
		props.installedAddons === undefined ||
		props.installedCarriers === undefined ||
		props.warehouse === undefined ||
		props.dropships === undefined ||
		props.carriers === undefined ||
		props.addons === undefined
	) {
		const antIcon = (
			<LoadingOutlined
				style={{
					fontSize: 60,
					marginTop: '400px',
				}}
			/>
		);
		return <Spin indicator={antIcon} />;
	} */

	return (
		<>
			<Router>
				<Layout>
					<SideMenu />

					<Layout>
						<Header className={'top-header'} style={{ padding: 0 }} />
						<Content className={'body-content'}>
							<Switch>
								<Route exact path='/' component={ShippingCarriersComponent} />
								<Route
									exact
									path='/addon/:addon_id'
									component={AutoDetectResidentialComponennt}
								/>
								<Route exact path='/:carrier_id' component={RendorCarrier} />
							</Switch>

							<Modal
								title={
									props.confirmModal !== null ? props.confirmModal.title : ''
								}
								visible={
									props.confirmModal !== null ? props.confirmModal.on : false
								}
								onOk={() => confirmModal(true, false)}
								onCancel={() => confirmModal(false, true)}
								okText='Confirm'
								cancelText='Cancel'
							>
								<p>
									{props.confirmModal !== null ? props.confirmModal.body : ''}
								</p>
							</Modal>
						</Content>
					</Layout>
				</Layout>
			</Router>
		</>
	);
}

const mapStateToProps = (state) => {
	return {
		store: state.store,
		alertMessage: state.alertMessage,
		alertMessageType: state.alertMessageType,
		showAlertMessage: state.showAlertMessage,
		token: state.token,
		confirmModal: state.confirmModal,
		plansInfo: state.PlansInfo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		locations: (token) => dispatch(getLocations(token)),
		getAllCarriers: (store) => dispatch(getAllCarriers({ store })),
		getAllAddons: (store) => dispatch(getAllAddons({ store })),
		getInstalledCarriers: (store) => dispatch(getInstalledCarriers({ store })),
		getInstalledAddons: (store) => dispatch(getInstalledAddons({ store })),
		getPlansInfo: (store) => dispatch(getPlansInfo({ store: store })),
		setToken: (token) => {
			localStorage.setItem('store', token);
			dispatch({ type: 'TOKEN', payload: token });
		},
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
