import React, { useEffect } from 'react'
import { Layout, Menu, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
const { Sider } = Layout
const { Title } = Typography

function SideMenu(props) {
	useEffect(() => {}, [props.activeMenu])

	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			onBreakpoint={broken => {
				// console.log(broken);
			}}
			onCollapse={(collapsed, type) => {
				console.log(collapsed, type)
			}}
			className={'sidemenu'}
			width={240}
		>
			<h4
				className={'app-logo'}
				style={{ display: 'block', fontSize: 18, float: 'left' }}
			>
				Real-time Shipping Quotes
			</h4>
			<Menu mode='inline' defaultSelectedKeys={'99'}>
				<Menu.Item key='99'>
					<Link to={`/`}>Dashboard</Link>
				</Menu.Item>

				<Menu.Item key='100'>
					<Link to={`/plans`}>Plans</Link>
				</Menu.Item>

				<Title className={'carriers-name'} level={6}>
					LTL Freight Providers
				</Title>

				{props.installedCarriers &&
				props.installedCarriers.filter(car => car.carrier_type === 1).every(carr => carr.is_enabled === 0) ? (
					<Menu.Item>No Carrier is Installed/Enabled</Menu.Item>
				) : null}

				{/*props.installedCarriers && props.installedCarriers.length === 0 ? (
					<Menu.Item>No Carrier Installed</Menu.Item>
				) : null*/}

				{props.installedCarriers
					? props.installedCarriers.map(carrier =>
							carrier.is_enabled && carrier.carrier_type === 1 ? (
								<Menu.Item key={carrier.id.toString()} active={true}>
									<Link to={`/${carrier.id}`}>{carrier.name}</Link>
								</Menu.Item>
							) : null
					  )
					: null}

				<Title className={'carriers-name'} level={6}>
					Parcel & Postal Providers
				</Title>

				{props.installedCarriers &&
				props.installedCarriers.filter(car => car.carrier_type === 2).every(
					carr => carr.is_enabled === 0
				) ? (
					<Menu.Item>No Carrier is Installed/Enabled</Menu.Item>
				) : null}

				{/*props.installedCarriers && props.installedCarriers.length === 0 ? (
					<Menu.Item>No Carrier Installed</Menu.Item>
				) : null*/}

				{props.installedCarriers
					? props.installedCarriers.map(carrier =>
							carrier.is_enabled && carrier.carrier_type === 2 ? (
								<Menu.Item key={carrier.id.toString()} active={true}>
									<Link to={`/${carrier.id}`}>{carrier.name}</Link>
								</Menu.Item>
							) : null
					  )
					: null}

				<Title className={'carriers-name'} level={6}>
					Add-ons
				</Title>
				{/*props.installedAddons && props.installedAddons.length === 0 ? (
					<Menu.Item>No Addon Installed</Menu.Item>
				) : null*/}

				{props.installedAddons &&
				props.installedAddons.every(add => add.is_enabled === 0) ? (
					<Menu.Item>No Add-on is Installed/Enabled</Menu.Item>
				) : null}

				{props.installedAddons
					? props.installedAddons.map(addon =>
							addon.is_enabled ? (
								<Menu.Item key={addon.name}>
									<Link to={`/addon/${addon.id}`}>{addon.name}</Link>
								</Menu.Item>
							) : null
					  )
					: null}
			</Menu>
		</Sider>
	)
}

const mapStateToProps = state => {
	return {
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		enitureCarriers: state.enitureCarriers,
		activeMenu: state.activeMenu,
		carrierId: state.carrierId,
	}
}

export default connect(mapStateToProps, null)(SideMenu)
