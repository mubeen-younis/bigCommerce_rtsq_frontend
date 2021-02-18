import React, { useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getInstalledCarriers } from '../Actions/EnitureStore';
import { connect } from 'react-redux';
// const { SubMenu } = Menu;
const { Sider } = Layout;
const { Title } = Typography;

function SideMenu(props) {
	useEffect(() => {
		if (
			props.installedCarriers === null ||
			props.installedCarriers === undefined
		) {
			props.getInstalledCarriers();
		}
	}, [props]);

	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			onBreakpoint={(broken) => {
				console.log(broken);
			}}
			onCollapse={(collapsed, type) => {
				console.log(collapsed, type);
			}}
			className={'sidemenu'}
		>
			<h4 className={'app-logo'}>Eniture Shipping</h4>
			<Menu mode='inline' defaultSelectedKeys={['1']}>
				<Menu.Item key='1'>
					<Link to={`/`}>Eniture App Store</Link>
				</Menu.Item>
				<Title className={'carriers-name'} level={6}>
					Installed Carriers
				</Title>

				{props.installedCarriers
					? props.installedCarriers.map((carrier, key) => (
							<Menu.Item key={key}>
								<Link to={`/${carrier.id}`}>{carrier.name}</Link>
							</Menu.Item>
					  ))
					: null}

				{/* <SubMenu key="sub1" title="Carrier 1">
            <Menu.Item key="2">FedEx LTL Freight Quotes</Menu.Item>
            <Menu.Item key="3">WWE LTL Freight Quotes</Menu.Item>
            <Menu.Item key="4">UPS LTL Freight Quotes</Menu.Item>
          </SubMenu>
           */}
				{/* <Menu.Item key='2'>
					<Link to={`/1`}>WWE LTL Freight Quotes</Link>
				</Menu.Item> */}

				<Title className={'carriers-name'} level={6}>
					Installed Addons
				</Title>
				<Menu.Item key='3'>
					<Link to={`/ard`}>Auto Detect Residential</Link>
				</Menu.Item>
			</Menu>
		</Sider>
	);
}

const mapStateToProps = (state) => {
	return {
		installedCarriers: state.installedCarriers,
		enitureCarriers: state.enitureCarriers,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getInstalledCarriers: () => dispatch(getInstalledCarriers()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
