import React from 'react';
import { Layout } from 'antd';
import './App.css';
import SideMenu from './partials/SideMenu';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { connect } from "react-redux";
import { getLocations, setStore } from "./Actions/Action";
import RendorCarrier from "./components/RendorCarrier";
import ShippingCarriersComponent from './components/Pages/ShippingCarriersComponent';


const { Header, Content} = Layout;

function App(props) {

  const urlParams = new URLSearchParams(window.location.search);
  const store = urlParams.get('store') !== (undefined || null) ? urlParams.get('store') : localStorage.getItem('store');
  console.log('store ', store)
  if (store === null || store === undefined) {
    return (
      <>
        <p>Invalid store.</p>
      </>
    );
  }

  props.locations()
  props.setStore(store)

  return (
    <>
      <Router>
        <Layout>
        <SideMenu />
        <Layout>
          <Header className={"top-header"} style={{ padding: 0 }} />
          <Content className={"body-content"}>
            <Switch>
              <Route exact path={`/`} component={ShippingCarriersComponent} />
              <Route path="/:carrier_id">
                <RendorCarrier />
              </Route>
            </Switch>
            
          </Content>
        </Layout>
      </Layout>
    </Router>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    store: state.store
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    locations: () => dispatch(getLocations()),
    setStore: (store) => dispatch(setStore(store))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
