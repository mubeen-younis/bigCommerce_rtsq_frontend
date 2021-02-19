import React, { useEffect } from "react";
import { Layout, message, Modal } from "antd";
import "./App.css";
import "./responsive.css";
import SideMenu from "./partials/SideMenu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
  getLocations,
  /* setStore, */ getAllCarriers,
  getPlansInfo,
} from "./Actions/Action";
import RendorCarrier from "./components/RendorCarrier";
import ShippingCarriersComponent from "./components/Pages/ShippingCarriersComponent";
import AutoDetectResidentialComponennt from "./components/AutoDetectResidentialComponennt";

const { Header, Content } = Layout;

function App(props) {
	const urlParams = new URLSearchParams(window.location.search);
	useEffect(() => {
		const store = urlParams.get('store') !== (undefined || null) ? urlParams.get('store') : localStorage.getItem('store');
		console.log('store ', store)
		if (props.token === (undefined || null) && store !== undefined) {
			props.setToken(store);
		}
		props.locations(store);
		props.getAllCarriers(store);
	}, [props]);

  message.config({
    maxCount: 1,
  });

  const showMessageNotice = () => {
    if (props.alertMessageType === "success") {
      message.success(props.alertMessage);
    } else if (props.alertMessageType === "error") {
      message.error(props.alertMessage);
    } else if (props.alertMessageType === "warning") {
      message.warning(props.alertMessage);
    } else if (props.alertMessageType === "loading") {
      message.loading("Loading. Please wait...");
    }
  };

  if (props.showAlertMessage) {
    showMessageNotice();
  }

	const confirmModal = (ok, cancel) => {
		props.confirmModalAction(ok, cancel);
	};
	console.log('props ', props)
	if (props.token === null || props.token === undefined) {
		return (
			<>
				<p>Invalid store.</p>
			</>
		);
	}

  return (
    <>
      <Router>
        <Layout>
          <SideMenu />

          <Layout>
            <Header className={"top-header"} style={{ padding: 0 }} />
            <Content className={"body-content"}>
              <Switch>
                <Route exact path="/" component={ShippingCarriersComponent} />
                <Route
                  exact
                  path="/ard"
                  component={AutoDetectResidentialComponennt}
                />
                <Route exact path="/:carrier_id" component={RendorCarrier} />
              </Switch>

              <Modal
                title={
                  props.confirmModal !== null ? props.confirmModal.title : ""
                }
                visible={
                  props.confirmModal !== null ? props.confirmModal.on : false
                }
                onOk={() => confirmModal(true, false)}
                onCancel={() => confirmModal(false, true)}
                okText="Confirm"
                cancelText="Cancel"
              >
                <p>
                  {props.confirmModal !== null ? props.confirmModal.body : ""}
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
		getAllCarriers: (store) => dispatch(getAllCarriers({ store: store })),
		setToken: (token) => {
			localStorage.setItem('store', token)
			dispatch({ type: 'TOKEN', payload: token })
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
