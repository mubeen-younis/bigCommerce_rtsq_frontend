import React from 'react';
import { Layout, Menu } from 'antd';
import './App.css';
import SideMenu from './partials/SideMenu';
import TabsLayout from './tabs_layout/tabs';
import { BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";
import { connect } from "react-redux";


const { Header, Content} = Layout;

function App() {
  return (
    <>
      <Router>
        <Layout>
        <SideMenu />
        <Layout>
          <Header className={"top-header"} style={{ padding: 0 }} />
          <Content className={"body-content"}>
            <TabsLayout />
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
