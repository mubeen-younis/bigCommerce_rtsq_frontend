import React, {useEffect} from 'react';
import { Layout, Menu } from 'antd';
import './App.css';
import SideMenu from './partials/SideMenu';
import { BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";
import { connect } from "react-redux";
import { getLocations } from "./Actions/Action";
import RendorCarrier from "./components/RendorCarrier";


const { Header, Content} = Layout;

function App(props) {

  useEffect(() =>{
    props.locations()
  })

  return (
    <>
      <Router>
        <Layout>
        <SideMenu />
        <Layout>
          <Header className={"top-header"} style={{ padding: 0 }} />
          <Content className={"body-content"}>
            <Switch>
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

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    locations: () => dispatch(getLocations()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
