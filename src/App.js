import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Layout, message, Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './App.css'
import './responsive.css'
import SideMenu from './partials/SideMenu'
import { connect, useDispatch, useSelector } from 'react-redux'
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
import { getShippingGroups } from './Actions/ShippingGroupsActions'
import WarehouseComponent from './components/Pages/WarehouseComponent'
import FDOComponent from './components/Pages/FDOComponent'
import AVComponent from './components/Pages/AVComponent'
import { getFDOCouponInfo } from './Actions/FDOActions'
import ImportCsvComponent from './components/Pages/ImportCsvComponent'
import UserGuideComponent from './components/Pages/UserGuideComponent'

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
    getShippingGroups,
  } = props

  const dispatch = useDispatch()
<<<<<<< HEAD
  const cPlan = useSelector((state) => state.currentPlan)
=======
>>>>>>> 33066e9458da0adde44b10dd63cc9defa986c9ee

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const fetchAppData = (token = '') => {
      setStoreData(token)
      currentPlan(token)
      getRADPlans(token)
      getSbsPlans(token)
      locations(token)
      getAllCarriers(token)
      getAllAddons(token)
      getInstalledCarriers(token)
      getInstalledAddons(token)
      getStorePlans()
      getShippingGroups(token)
      dispatch(getFDOCouponInfo(token))
    }

    const devEnv = process?.env?.NODE_ENV === 'development'
    if (devEnv) {
      const localToken =
        urlParams.get('store') ?? localStorage.getItem('store') ?? null

      setToken(localToken)
      fetchAppData(localToken)
    } else {
      const prodToken = urlParams.get('store') ?? null

      dispatch({ type: 'TOKEN', payload: prodToken })
      fetchAppData(prodToken)
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
  ])

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
<<<<<<< HEAD
  console.log('vc', cPlan)
  return (
    <Router>
      <Layout>
        <SideMenu />

        <Layout>
          <Header className={'top-header'} style={{ padding: 0 }} />
          <Content className={'body-content'}>
            <Switch>
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
              <Route path='/user_guide' component={UserGuideComponent} />
              <Route path='/av' component={AVComponent} />
              <Route path='/warehouses' component={WarehouseComponent} />
              <Route path='/addon/:addon_id' component={RendorAddon} />
              <Route path='/:carrier_id' component={RendorCarrier} />
            </Switch>

=======

  return (
    <Router>
      <Layout>
        <SideMenu />

        <Layout>
          <Header className={'top-header'} style={{ padding: 0 }} />
          <Content className={'body-content'}>
            <Switch>
              <Route exact path='/' component={ShippingCarriersComponent} />
              <Route exact path='/plans' component={PlansComponent} />
              <Route path='/fdo' component={FDOComponent} />
              <Route path='/av' component={AVComponent} />
              <Route path='/warehouses' component={WarehouseComponent} />
              <Route path='/addon/:addon_id' component={RendorAddon} />
              <Route path='/:carrier_id' component={RendorCarrier} />
            </Switch>

>>>>>>> 33066e9458da0adde44b10dd63cc9defa986c9ee
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
  )
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    locations: (token) => dispatch(getLocations(token)),
    getAllCarriers: (store) => dispatch(getAllCarriers({ store })),
    getAllAddons: (store) => dispatch(getAllAddons({ store })),
    getInstalledCarriers: (store) => dispatch(getInstalledCarriers({ store })),
    getInstalledAddons: (store) => dispatch(getInstalledAddons({ store })),
    getRADPlans: (token) => dispatch(getRadPlans(token)),
    getSbsPlans: (token) => dispatch(getSbsPlans(token)),
    getStorePlans: () => dispatch(getPlans()),
    getShippingGroups: (token) => dispatch(getShippingGroups(token)),
    setToken: (token) => {
      localStorage.setItem('store', token)
      dispatch({ type: 'TOKEN', payload: token })
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
