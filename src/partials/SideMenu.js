import React from 'react';
import { Layout, Menu, Typography } from 'antd';
const { SubMenu } = Menu;
const { Sider } = Layout;
const { Title } = Typography;

function SideMenu(){
    return(
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className={"sidemenu"}
      >
        <h4 className={"app-logo"}>Eniture Shipping</h4>
        <Menu mode="inline" defaultSelectedKeys={['2']} defaultOpenKeys={['sub1']}>
          <Title className={"carriers-name"} level={6}>Carriers</Title>
          {/* <SubMenu key="sub1" title="Carrier 1">
            <Menu.Item key="2">FedEx LTL Freight Quotes</Menu.Item>
            <Menu.Item key="3">WWE LTL Freight Quotes</Menu.Item>
            <Menu.Item key="4">UPS LTL Freight Quotes</Menu.Item>
          </SubMenu>
           */}
          <Menu.Item key="9">WWE LTL Freight Quotes</Menu.Item>
        </Menu>
      </Sider>
    );
}

export default SideMenu;