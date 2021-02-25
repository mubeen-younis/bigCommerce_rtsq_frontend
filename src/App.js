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
	const {
		token,
		setToken,
		getPlansInfo,
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
	} = props;

	const urlParams = new URLSearchParams(window.location.search);
	useEffect(() => {
		const store =
			urlParams.get('store') !== (undefined || null)
				? urlParams.get('store')
				: localStorage.getItem('store');

		console.log('store ', store);

		if (token === (undefined || null) && store !== undefined) {
			setToken(store);
		}

		getPlansInfo(store);
		locations(store);
		getAllCarriers(store);
		getAllAddons(store);
		getInstalledCarriers(store);
		getInstalledAddons(store);

		// eslint-disable-next-line
	}, []);

	message.config({
		maxCount: 1,
	});

	const showMessageNotice = () => {
		if (alertMessageType === 'success') {
			message.success(alertMessage);
		} else if (alertMessageType === 'error') {
			message.error(alertMessage);
		} else if (alertMessageType === 'warning') {
			message.warning(alertMessage);
		} else if (alertMessageType === 'loading') {
			message.loading('Loading. Please wait...');
		}
	};

	if (showAlertMessage) {
		showMessageNotice();
	}

	const confirmModal = (ok, cancel) => {
		confirmModalAction(ok, cancel);
	};

	if (token === null || token === undefined) {
		return <p>Invalid store.</p>;
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
		);
		return <Spin indicator={antIcon} />;
	}

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
								title={confirmModal !== null ? confirmModal.title : ''}
								visible={confirmModal !== null ? confirmModal.on : false}
								onOk={() => confirmModal(true, false)}
								onCancel={() => confirmModal(false, true)}
								okText='Confirm'
								cancelText='Cancel'
							>
								<p>{confirmModal !== null ? confirmModal.body : ''}</p>
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
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		carriers: state.carriers,
		addons: state.addons,
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
