import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const { Sider } = Layout;
const { Title } = Typography;

function SideMenu(props) {
	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			onBreakpoint={(broken) => {
				// console.log(broken);
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

				{props.installedCarriers &&
				!props.installedCarriers.every((carr) => carr.is_enabled) ? (
					<Menu.Item>No Carrier is Enabled</Menu.Item>
				) : null}

				{props.installedCarriers && props.installedCarriers.length === 0 ? (
					<Menu.Item>No Carrier Installed</Menu.Item>
				) : null}

				{props.installedCarriers
					? props.installedCarriers.map((carrier) =>
							carrier.is_enabled ? (
								<Menu.Item key={carrier.name}>
									<Link to={`/${carrier.id}`}>{carrier.name}</Link>
								</Menu.Item>
							) : null
					  )
					: null}

				<Title className={'carriers-name'} level={6}>
					Installed Addons
				</Title>
				{props.installedAddons && props.installedAddons.length === 0 ? (
					<Menu.Item>No Addon Installed</Menu.Item>
				) : null}

				{props.installedAddons &&
				!props.installedAddons.every((add) => add.is_enabled) ? (
					<Menu.Item>No Addon is Enabled</Menu.Item>
				) : null}

				{props.installedAddons
					? props.installedAddons.map((addon) =>
							addon.is_enabled ? (
								<Menu.Item key={addon.name}>
									<Link to={`/addon/${addon.id}`}>{addon.name}</Link>
								</Menu.Item>
							) : null
					  )
					: null}
			</Menu>
		</Sider>
	);
}

const mapStateToProps = (state) => {
	return {
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		enitureCarriers: state.enitureCarriers,
	};
};

export default connect(mapStateToProps, null)(SideMenu);
