import React, { useCallback, useEffect } from 'react'
import { Layout, Menu, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
const { Sider } = Layout
const { Title } = Typography

function SideMenu(props) {
	const dispatch = useDispatch()

	const setActiveMenu = useCallback(
		menuId => {
			dispatch({
				type: 'SET_ACTIVE_MENU',
				payload: menuId + '',
			})
		},
		[dispatch]
	)

	useEffect(() => {
		const name = window.location.pathname
		if (name.match(/\/$/)) setActiveMenu('99')
		else if (name.includes('plans')) setActiveMenu('100')
		else if (name.includes('fdo')) setActiveMenu('101')
		else if (name.includes('av')) setActiveMenu('102')
		else if (name.includes('addon'))
			setActiveMenu('addon-' + name.substring(name.lastIndexOf('/') + 1))
		else setActiveMenu(name.substring(name.lastIndexOf('/') + 1))
	}, [props.activeMenu, setActiveMenu])

	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			onBreakpoint={broken => {
				// console.log(broken);
			}}
			onCollapse={(collapsed, type) => {
				// console.log(collapsed, type)
			}}
			className={'sidemenu'}
			width={240}>
			<h4
				className={'app-logo'}
				style={{ display: 'block', fontSize: 18, float: 'left' }}>
				Real-time Shipping Quotes
			</h4>
			<Menu
				mode='inline'
				defaultSelectedKeys={'99'}
				selectedKeys={props.activeMenu}>
				<Menu.Item key='99' warnkey={99} onClick={() => setActiveMenu('99')}>
					<Link to={`/`}>Dashboard</Link>
				</Menu.Item>

				<Menu.Item
					key='100'
					warnkey={100}
					onClick={() => setActiveMenu('100')}>
					<Link to={`/plans`}>Plans</Link>
				</Menu.Item>

				<Menu.Item
					key='101'
					warnkey={101}
					onClick={() => setActiveMenu('101')}>
					<Link to={`/fdo`}>FreightDesk Online</Link>
				</Menu.Item>

				<Menu.Item
					key='102'
					warnkey={102}
					onClick={() => setActiveMenu('102')}>
					<Link to={`/av`}>Address Validation</Link>
				</Menu.Item>

				<Title className={'carriers-name'} level={5}>
					LTL Freight Providers
				</Title>

				{props?.installedCarriers
					?.filter(car => car.carrier_type === 1)
					.every(carr => carr.is_enabled === 0) ? (
					<Menu.Item>No Carrier is Installed/Enabled</Menu.Item>
				) : null}

				{/*props.installedCarriers && props.installedCarriers.length === 0 ? (
					<Menu.Item>No Carrier Installed</Menu.Item>
				) : null*/}

				{props?.installedCarriers?.map(carrier =>
					carrier.is_enabled && carrier.carrier_type === 1 ? (
						<Menu.Item
							key={carrier.id.toString()}
							warnkey={carrier.id.toString()}
							active='true'
							onClick={() => setActiveMenu(carrier.id.toString())}>
							<Link to={`/${carrier.id}`}>{carrier.name}</Link>
						</Menu.Item>
					) : null
				)}

				<Title className={'carriers-name'} level={5}>
					Parcel & Postal Providers
				</Title>

				{props?.installedCarriers
					?.filter(car => car.carrier_type === 2)
					.every(carr => carr.is_enabled === 0) ? (
					<Menu.Item>No Carrier is Installed/Enabled</Menu.Item>
				) : null}

				{/*props.installedCarriers && props.installedCarriers.length === 0 ? (
					<Menu.Item>No Carrier Installed</Menu.Item>
				) : null*/}

				{props?.installedCarriers?.map(carrier =>
					carrier.is_enabled && carrier.carrier_type === 2 ? (
						<Menu.Item
							key={carrier.id.toString()}
							warnkey={carrier.id.toString()}
							onClick={() => setActiveMenu(carrier.id.toString())}
							active='true'>
							<Link to={`/${carrier.id}`}>{carrier.name}</Link>
						</Menu.Item>
					) : null
				)}

				<Title className={'carriers-name'} level={5}>
					Add-ons
				</Title>
				{/*props.installedAddons && props.installedAddons.length === 0 ? (
					<Menu.Item>No Addon Installed</Menu.Item>
				) : null*/}

				{props?.installedAddons?.every(add => add.is_enabled === 0) ? (
					<Menu.Item>No Add-on is Installed/Enabled</Menu.Item>
				) : null}

				{props?.installedAddons?.map(addon =>
					addon.is_enabled ? (
						<Menu.Item
							key={'addon-' + addon.id.toString()}
							warnkey={'addon-' + addon.id.toString()}
							onClick={() =>
								setActiveMenu('addon-' + addon.id.toString())
							}>
							<Link to={`/addon/${addon.id}`}>{addon.name}</Link>
						</Menu.Item>
					) : null
				)}
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
