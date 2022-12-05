import React, { useCallback, useEffect } from 'react'
import { Layout, Menu, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
const { Sider } = Layout
const { Title } = Typography

function SideMenu(props) {
	const dispatch = useDispatch()
	const { currentPlan } = useSelector(state => state)
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
		else if (name.includes('warehouses')) setActiveMenu('101')
		else if (name.includes('shipping_groups')) setActiveMenu('106')
		else if (name.includes('rad_settings')) setActiveMenu('108')
		else if (name.includes('fdo')) setActiveMenu('102')
		else if (name.includes('av')) setActiveMenu('103')
		else if (name.includes('importcsv')) setActiveMenu('104')
		else if (name.includes('orders')) setActiveMenu('107')
		else if (name.includes('user_guide')) setActiveMenu('105')
		else if (name.includes('addon'))
			setActiveMenu('addon-' + name.substring(name.lastIndexOf('/') + 1))
		else setActiveMenu(name.substring(name.lastIndexOf('/') + 1))
	}, [setActiveMenu])

	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			onBreakpoint={broken => {}}
			onCollapse={(collapsed, type) => {}}
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
				{currentPlan?.plan_id && (
					<Menu.Item
						key='99'
						warnkey='99'
						onClick={() => setActiveMenu('99')}>
						<Link to='/'>Dashboard</Link>
					</Menu.Item>
				)}

				<Menu.Item
					key='100'
					warnkey='100'
					onClick={() => setActiveMenu('100')}>
					<Link to='/plans'>Plans</Link>
				</Menu.Item>
				{currentPlan?.plan_id && (
					<>
						<Menu.Item
							key='101'
							warnkey='101'
							onClick={() => setActiveMenu('101')}>
							<Link to='/warehouses'>Warehouses</Link>
						</Menu.Item>

						<Menu.Item
							key='106'
							warnkey={106}
							onClick={() => setActiveMenu('106')}>
							<Link to={`/shipping_groups`}>Shipping Groups</Link>
						</Menu.Item>

						<Menu.Item
							key='108'
							warnkey={108}
							onClick={() => setActiveMenu('108')}>
							<Link to={`/rad_settings`}>Address Type Settings</Link>
						</Menu.Item>

						<Menu.Item
							key='102'
							warnkey={102}
							onClick={() => setActiveMenu('102')}>
							<Link to={`/fdo`}>FreightDesk Online</Link>
						</Menu.Item>

						<Menu.Item
							key='103'
							warnkey={103}
							onClick={() => setActiveMenu('103')}>
							<Link to={`/av`}>Address Validation</Link>
						</Menu.Item>

						<Menu.Item
							key='104'
							warnkey={104}
							onClick={() => setActiveMenu('104')}>
							<Link to={`/importcsv`}>Import CSV</Link>
						</Menu.Item>

						<Menu.Item
							key='107'
							warnkey={107}
							onClick={() => setActiveMenu('107')}>
							<Link to={`/orders`}>Orders</Link>
						</Menu.Item>

						<Menu.Item
							key='105'
							warnkey={105}
							onClick={() => setActiveMenu('105')}>
							<Link to={`/user_guide`}>User Guide</Link>
						</Menu.Item>

						<Title className={'carriers-name'} level={5}>
							LTL Freight Providers
						</Title>

						{props?.installedCarriers
							?.filter(car => car.carrier_type === 1)
							.every(carr => carr.is_enabled === 0) ? (
							<Menu.Item>No Carrier is Installed/Enabled</Menu.Item>
						) : null}

						{props?.installedCarriers?.map(carrier =>
							carrier.is_enabled && carrier.carrier_type === 1 ? (
								<Menu.Item
									key={carrier.id.toString()}
									warnkey={carrier.id.toString()}
									active='true'
									onClick={() =>
										setActiveMenu(carrier.id.toString())
									}>
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

						{props?.installedCarriers?.map(carrier =>
							carrier.is_enabled && carrier.carrier_type === 2 ? (
								<Menu.Item
									key={carrier.id.toString()}
									warnkey={carrier.id.toString()}
									onClick={() =>
										setActiveMenu(carrier.id.toString())
									}
									active='true'>
									<Link to={`/${carrier.id}`}>{carrier.name}</Link>
								</Menu.Item>
							) : null
						)}

						<Title className={'carriers-name'} level={5}>
							Add-ons
						</Title>

						{props?.installedAddons?.every(
							add => add.is_enabled === 0
						) ? (
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
									<Link to={`/addon/${addon.id}`}>
										{addon.name}
									</Link>
								</Menu.Item>
							) : null
						)}
					</>
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
