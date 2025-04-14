import React, { useEffect, useState } from 'react';
import process from "process"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Layout, message, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './App.css';
import './responsive.css';
import SideMenu from './partials/SideMenu';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getLocations } from './Actions/Warehouse';
import {
  getInstalledCarriers,
  getInstalledAddons,
  getAllCarriers,
  getAllAddons,
} from './Actions/EnitureStore';
import { getPlans } from './Actions/Plans';
import { getRadPlans, getRADSettings } from './Actions/RAD';
import { getSbsPlans } from './Actions/SBS';
import { getPalletsPlans } from './Actions/Pallets';
import RendorCarrier from './components/RendorCarrier';
import RendorAddon from './components/RenderAddon';
import ShippingCarriersComponent from './components/Pages/ShippingCarriersComponent';
import PlansComponent from './components/Plans/PlansComponent';
import { setStore, getCurrentPlanInfo } from './Actions/Action';
import { getShippingGroups } from './Actions/ShippingGroupsActions';
import WarehouseComponent from './components/Pages/WarehouseComponent';
import FDOComponent from './components/Pages/FDOComponent';
import AVComponent from './components/Pages/AVComponent';
import { getFDOCouponInfo } from './Actions/FDOActions';
import ImportCsvComponent from './components/Pages/ImportCsvComponent';
import UserGuideComponent from './components/Pages/UserGuideComponent';
import AppLogs from './components/Pages/AppLogs';
import { getDbscData } from './Actions/DbscActions';
import types from './Stores/types';
import OrdersComponent from './components/OrdersComponent';
import ShippingGroupsComponent from './components/Pages/ShippingGroup';
import ShippingRulesComponent from './components/Pages/ShippingRule';
import RADSettings from './components/Pages/RADSettings';
import CompareRates from './components/Pages/CompareRates';
import ProductSettingsComponent from './components/ProductSettingsComponent';
import PaymentsTabComponent from './components/Pages/PaymentTabComponent';
import { getCSVDownloadLink } from './Actions/ImportCsv';
import { getBrands, getCategories } from './Actions/ShippingRulesActions';

const { Header, Content } = Layout;

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
    getPalletsPlans,
    currentPlan,
    getStorePlans,
    setStoreData,
    getShippingGroups,
  } = props;

  const [logsRoute, setLogsRoute] = useState(false);
  const dispatch = useDispatch();
  const cPlan = useSelector((state) => state.currentPlan);
  const pathName = window.location.pathname;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const fetchAppData = (token = '') => {
      setStoreData(token);
      currentPlan(token);
      getRADPlans(token);
      getSbsPlans(token);
      getPalletsPlans(token);
      locations(token);
      getAllCarriers(token);
      getAllAddons(token);
      getInstalledCarriers(token);
      getInstalledAddons(token);
      getStorePlans();
      getShippingGroups(token);
      dispatch(getFDOCouponInfo(token));
      dispatch(
        getDbscData('get_shipping_classes', types.GET_DBSC_CLASSES, token)
      );
      dispatch(getRADSettings(token));
      dispatch(getCSVDownloadLink(token, false));
      dispatch(getBrands(token));
      dispatch(getCategories(token));
    };

    const devEnv = process?.env?.NODE_ENV === 'development';
    if (devEnv) {
      const localToken =
        urlParams.get('store') ?? localStorage.getItem('store') ?? null;
      setToken(localToken);
      if (!pathName.includes('app_logs')) {
        fetchAppData(localToken);
      }
    } else {
      const prodToken = urlParams.get('store') ?? null;
      dispatch({ type: 'TOKEN', payload: prodToken });
      fetchAppData(prodToken);
    }
  }, [
    currentPlan,
    dispatch,
    getAllAddons,
    getAllCarriers,
    getInstalledAddons,
    getInstalledCarriers,
    getRADPlans,
    getSbsPlans,
    getShippingGroups,
    getStorePlans,
    locations,
    setStoreData,
    setToken,
  ]);

  useEffect(() => {
    if (pathName.includes('app_logs')) {
      setLogsRoute(true);
    }
  }, [window.location.pathname]);

  message.config({
    maxCount: 1,
  });

  if (pathName.includes('app_logs')) {
    return <AppLogs />;
  }
  if (alertMessageType === 'Token Mismatch') {
    return <h2 text='danger'>Invalid Token! Contact your administrator.</h2>;
  }

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
    return <h1>Invalid store.</h1>;
  }

  if (alertMessageType === 'Token Mismatch') {
    return <h2 text='danger'>Invalid Token! Contact your administrator.</h2>;
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
    <Router>
      <Layout>
        {!logsRoute && <SideMenu />}

        <Layout>
          <Header className={'top-header'} style={{ padding: 0 }} />
          <Content className={'body-content'}>
            <Switch>
              <Route path='/app_logs' component={AppLogs} />
              <Route exact path='/'>
                {cPlan?.plan_id ? (
                  <ShippingCarriersComponent />
                ) : (
                  <Redirect to='/plans' />
                )}
              </Route>
              <Route exact path='/plans' component={PlansComponent} />
              <Route path='/fdo' component={FDOComponent} />
              <Route path='/importcsv' component={ImportCsvComponent} />
              <Route
                path='/shipping_groups'
                component={ShippingGroupsComponent}
              />
              <Route
                path='/shipping_rules'
                component={ShippingRulesComponent}
              />
              <Route path='/rad_settings' component={RADSettings} />
              <Route
                path='/product_settings'
                component={ProductSettingsComponent}
              />
              <Route path='/orders' component={OrdersComponent} />
              <Route path='/compare_rates' component={CompareRates} />
              <Route path='/user_guide' component={UserGuideComponent} />
              <Route path='/av' component={AVComponent} />
              <Route path='/warehouses' component={WarehouseComponent} />
              <Route path='/payments' component={PaymentsTabComponent} />
              <Route path='/addon/:addon_id' component={RendorAddon} />
              <Route path='/:carrier_id' component={RendorCarrier} />
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
    currentPlan: state.currentPlan,
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
    getRADPlans: (token) => dispatch(getRadPlans(token)),
    getSbsPlans: (token) => dispatch(getSbsPlans(token)),
    getPalletsPlans: (token) => dispatch(getPalletsPlans(token)),
    getStorePlans: () => dispatch(getPlans()),
    getShippingGroups: (token) => dispatch(getShippingGroups(token)),
    setToken: (token) => {
      localStorage.setItem('store', token);
      dispatch({ type: 'TOKEN', payload: token });
    },
    setStoreData: (store_token) => dispatch(setStore(store_token)),
    currentPlan: (store_token) => dispatch(getCurrentPlanInfo(store_token)),
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
