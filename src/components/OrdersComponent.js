import React, { Fragment, useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getAllOrders, submitOrderSettings, getOrderDetail } from '../Actions/Order'
import {
	Table,
	Button,
	Space,
	Form,
	Drawer,
	Col,
	Row,
	Select,
	Skeleton,
	Input,
	Card,
} from 'antd'
import { blockInvalidChar } from '../Utilities/numberValidation'
import { isFireFox } from '../Utilities/browserName'
import axios from 'axios'
import Title from 'antd/lib/typography/Title'

const { Option } = Select
let aloneItem = 0,
	weightBasedItem = 0

function OrderSettingsComponent(props) {
	const [loading, setLoading] = useState(true)
	const [loadOrder, setLoadOrder] = useState(false)
	const [sortOrderCust, setSortOrderCus] = useState(true)
	const [lastPageNo, setLastPageNo] = useState(1)
	const [countSorting, setCountSorting] = useState(0)
	const [state, setState] = useState({
		filteredInfo: null,
		sortedInfo: null,
		selectedRowKeys: [],
		visible: false,
	})
	const [selectedOrderDetail, setselectedOrderDetail] = useState({
		date: null,
		price: null,
	})
	const { ordersPagination } = useSelector(state => state)
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 50,
		total: ordersPagination?.total,
		search: null,
		isSearched: 0,
		status: null,
	})
	const dispatch = useDispatch()

	useEffect(() => {
		if (!props.orders || props.orders === null || props.orders === undefined) {
			//props.getAllOrders(props.token);
			dispatch(
				getAllOrders(
					props.token,
					pagination.current,
					pagination.pageSize,
					sortOrderCust,
					setLoading,
					pagination?.search,
					pagination?.status
				)
			)
		}
		if (props.orders !== null && props.orders !== undefined) {
			setLoading(false)
			setPagination({
				...pagination,
				total: ordersPagination?.total,
				isSearched: pagination.isSearched + 1,
			})
		}

		if (countSorting > 0) {
			setLoading(true)
			setCountSorting(0)
			dispatch(
				getAllOrders(
					props.token,
					pagination.current,
					pagination.pageSize,
					sortOrderCust,
					setLoading,
					pagination.search,
					pagination.status
				)
			)
		}
		// eslint-disable-next-line
	}, [ordersPagination, sortOrderCust])

	const showOrderDetails = async (order_id, order) => {
		setselectedOrderDetail({
			...selectedOrderDetail,
			...order,
			order_id,
		})
		setState({
			...state,
			visible: true,
		})

		try {
			const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_order_widget`,
				config = {
					headers: {
						authorization: `Bearer ${props.token}`,
					},
					params: {
						order_id,
					},
				}
			setLoadOrder(true)

			const { data } = await axios.get(url, config)
			if (!data.error) {
				dispatch({
					type: 'GET_ORDER_WIDGET',
					payload: data?.data,
				})
				setLoadOrder(false)
			}
		} catch (err) {
			if (err.response.data && err.response.data.error) {
				dispatch({
					type: 'GET_ORDER_WIDGET',
					payload: err.response.data.data,
				})
			}
			setLoadOrder(false)
		}
		// props.getOrderDetail(id, setselectedOrderDetail, setLoadOrder, props.token)
	}

	const onClose = () => {
		setState({
			...state,
			visible: false,
		})
	}

	const handleChange = (pagination, filters, sorter) => {
		setLoading(true)
		setPagination({
			...pagination,
			current: pagination.current,
			pageSize: pagination.pageSize,
		})

		let PaginationPerpage = (ordersPagination?.perpage * 10) / 10
		if (pagination?.pageSize !== PaginationPerpage) {
			setLoading(true)
			//dispatch(getAllOrders(props.token, pagination.current, pagination.pageSize, sortOrderCust, setLoading, pagination.search,  pagination.status))
			const meta = {
				...ordersPagination,
				perpage: pagination?.pageSize,
			}
			dispatch({
				type: 'GET_ORDERS',
				payload: null,
			})
			dispatch({
				type: 'ORDERS_PAGINATION',
				payload: meta,
			})
		} else {
			if (pagination?.current !== lastPageNo) {
				setLastPageNo(pagination?.current)
				dispatch(
					getAllOrders(
						props.token,
						pagination.current,
						pagination.pageSize,
						sortOrderCust,
						setLoading,
						pagination.search,
						pagination.status
					)
				)
			} else {
				setSortOrderCus(!sortOrderCust)
			}
		}

		setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		})
	}

	// const onSelectChange = selectedRowKeys => {
	// 	setState({ ...state, selectedRowKeys })
	// }
	// const { selectedRowKeys } = state
	// const rowSelection = {
	// 	selectedRowKeys,
	// 	onChange: onSelectChange,
	// }

	const orderSearch = () => {
		setLoading(true)
		dispatch(
			getAllOrders(
				props.token,
				pagination.current,
				pagination.pageSize,
				sortOrderCust,
				setLoading,
				pagination.search,
				pagination.status
			)
		)
	}

	const resetOrders = e => {
		let value
		const re = /^[0-9\b]+$/
		if (e.target.value === '' || re.test(e.target.value)) {
			value = e.target.value
		} else {
			return false
		}
		setPagination({
			...pagination,
			search: value,
		})
		if (value.length === 0 && pagination.isSearched != null) {
			setLoading(true)
			dispatch(
				getAllOrders(
					props.token,
					pagination.current,
					pagination.pageSize,
					sortOrderCust,
					setLoading,
					'',
					pagination.status
				)
			)
		}
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter' && pagination.search) {
			orderSearch()
		} else {
			blockInvalidChar(event)
		}
	}

	const filterByOrderStatus = status => {
		setLoading(true)
		setPagination({
			...pagination,
			status: status,
			current: 1,
		})
		dispatch(
			getAllOrders(
				props.token,
				1,
				pagination.pageSize,
				sortOrderCust,
				setLoading,
				pagination.search,
				status
			)
		)
	}

	// let { sortedInfo, filteredInfo } = state;
	// sortedInfo = sortedInfo || {};
	// filteredInfo = filteredInfo || {};

	const sortOrders = (a, b) => {
		let allOrders = props.filteredOrders ?? props.orders
		let lastOrder = allOrders[allOrders.length - 1]
		let checkId = isFireFox() ? b?.id : a?.id
		if (lastOrder?.id === checkId) {
			setCountSorting(countSorting + 1)
			//setSortOrderCus(!sortOrderCust);
			//orderSearch()
		}
	}

	const columns = [
		{
			title: 'Order Id',
			dataIndex: 'id',
			key: 'id',
			sorter: sortOrders,
			sortOrder: false,
			//sortOrder: false,
			/*sorter: (a, b) => a.id - b.id,
			sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
			ellipsis: true,*/
			ellipsis: true,
		},
		{
			title: 'Customer Name',
			dataIndex: 'customer',
			key: 'customer',
		},
		{
			title: 'Date Created',
			dataIndex: 'date_created',
			key: 'date_created',
		},
		{
			title: 'Items',
			dataIndex: 'items_total',
			key: 'items_total',
			/*sorter: (a, b) => a.items_total - b.items_total,
			sortOrder: sortedInfo.columnKey === 'items_total' && sortedInfo.order,
			ellipsis: true,*/
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
		},

		{
			title: 'Price',
			dataIndex: 'total_inc_tax',
			key: 'total_inc_tax',
			/*sorter: (a, b) => +a.total_inc_tax.substring(1) - +b.total_inc_tax.substring(1),
			sortOrder: sortedInfo.columnKey === 'total_inc_tax' && sortedInfo.order,
			ellipsis: true,*/
		},
		{
			title: 'Action',
			dataIndex: 'id',
			key: 'id',
			render: (id, record) => (
				<Space size='middle'>
					<Button
						onClick={() => {
							aloneItem = 0
							weightBasedItem = 0
							showOrderDetails(id, record)
						}}>
						Shipping Detail
					</Button>
				</Space>
			),
		},
	]

	const repeatItemAlone = (bin, showShipOwnTitle, isPalletWidget = false) => {
		let data = [<br />]
		aloneItem = isPalletWidget && aloneItem === 0 ? 0 : aloneItem

		for (let i = 0; i < bin?.quantity; i++) {
			data.push(
				<div>
					{showShipOwnTitle === 1 && aloneItem === 0 && (
						<h3
							style={{
								textAlign: 'center',
								marginTop: '15px',
								width: '100%',
							}}
							className='alone-title'>
							These items were quoted as shipping as their own{' '}
							{isPalletWidget ? 'pallet' : 'package'}.
						</h3>
					)}
					<Col
						span={6}
						style={{
							textAlign: 'center',
							float: 'left',
							marginTop: '10px',
							paddingLeft: '0px',
							paddingRight: '0px',
						}}>
						<h4>{bin?.items[0]?.['product_name'] ?? ''}</h4>
						<span style={{ width: '100%', float: 'left' }}>
							{bin?.d}
							{bin?.w}
							{bin?.h}
						</span>
						<img src={bin?.image_complete} alt={bin?.image_complete} />
					</Col>
					{(showShipOwnTitle = '')}
				</div>
			)
		}

		aloneItem = 1

		return (
			<>
				<div style={{ clear: 'both' }}>
					<div style={{ width: '100%' }}> </div>
					{data}
				</div>
			</>
		)
	}

	const showWeightBasedItem = (bin, showShipOwnTitle) => {
		let data = [<br />]

		for (let i = 0; i < bin?.quantity; i++) {
			data.push(
				<div>
					{showShipOwnTitle === 1 && weightBasedItem === 0 && (
						<h3
							style={{
								textAlign: 'center',
								marginTop: '15px',
								width: '100%',
							}}
							className='weight-title'>
							These items were quoted as weight based.
						</h3>
					)}
					<Col
						span={6}
						style={{
							textAlign: 'center',
							float: 'left',
							marginTop: '10px',
							paddingLeft: '0px',
							paddingRight: '0px',
						}}>
						<span style={{ width: '100%', float: 'left' }}>
							{bin?.weight}
						</span>
						<img src={bin?.image_complete} alt={bin?.image_complete} />
					</Col>
					{(showShipOwnTitle = '')}
				</div>
			)
		}

		weightBasedItem = 1
		return (
			<div style={{ clear: 'both' }}>
				<div style={{ width: '100%' }}> </div>
				{data}
			</div>
		)
	}

	const countItems = (shipment) => {
		let totalItems = 0
		{shipment?.line_items.map(item => (
			totalItems +=item.quantity
		))}
		return totalItems
	}

	const countBoxes = (widget, isPalletWidget = false) => {
		let countBoxes = 0

		if (isPalletWidget) {
			widget?.pallet?.forEach(
				pallet =>
					pallet?.type !== 'item' &&
					pallet?.type !== 'weight_based' &&
					++countBoxes
			)
		} else {
			widget?.sbs?.forEach(
				bin =>
					bin?.type !== 'item' &&
					bin?.type !== 'weight_based' &&
					++countBoxes
			)
		}

		return countBoxes
	}

	const widgetData = (widget, isPalletWidget = false) => {
		let showShipOwnTitle = 0
		let numBoxes = countBoxes(widget, isPalletWidget)
		const types = ['item', 'weight_based']
		const sbs = isPalletWidget ? widget?.pallet ?? [] : widget?.sbs ?? []

		return sbs?.map((bin, count) => {
			const type = bin?.type ?? ''
			showShipOwnTitle = 0

			if (type === types[0]) {
				return repeatItemAlone(bin, ++showShipOwnTitle, isPalletWidget)
			} else if (type === types[1] && !isPalletWidget) {
				return showWeightBasedItem(bin, ++showShipOwnTitle)
			} else {
				return (
					<Row gutter={24}>
						<Col span={24}>
							<Row gutter={24} className={'mt-4'}>
								<Col span={8} style={{ marginTop: '33px' }}>
									<strong>
										{isPalletWidget ? 'Pallet' : 'Box'}{' '}
										{count + 1} of {numBoxes}
										<br /> Number of items:{' '}
										{bin?.number_of_items} <br />
										{bin?.nickname}
									</strong>
								</Col>
								<Col span={16}>
									<span>
										{bin?.d}
										{bin?.w}
										{bin?.h}
									</span>
									<br />
									<img
										src={bin?.image_complete}
										alt={bin?.image_complete}
									/>
									<br />
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={24}>
								<Col span={24}>
									<strong>Steps:</strong>
								</Col>
								{widget?.sbs?.type !== 'item'
									? bin?.items.map(box => (
											<>
												<Col
													span={6}
													style={{ textAlign: 'center' }}>
													<img
														src={box?.image_sbs}
														style={{ margin: '5px' }}
														alt={box?.image_sbs}
													/>
													<br />
													<span>
														{box?.product_name} <br />{' '}
														{box?.d + ' x '}
														{box?.w + ' x '}
														{box?.h}
													</span>
													<br />
												</Col>
											</>
									  ))
									: ''}
							</Row>
						</Col>
					</Row>
				)
			}
		})
	}

	if (loading) {
		return <Skeleton active />
	}

	return (
		<Fragment>
			<Row gutter={24} className='mb-3'>
				<Col span={8}>
					<Input
						placeholder='Search by order id'
						className='col-8'
						type='number'
						pattern='[0-9]*'
						defaultValue={props.searched_order}
						value={pagination.search ?? props.searched_order}
						onKeyDown={handleKeyDown}
						onChange={resetOrders}
						size='medium'
					/>
				</Col>
				<Col span={4} style={{ paddingLeft: '0px' }}>
					<Button onClick={orderSearch} type='primary' size='medium'>
						Search
					</Button>
				</Col>
				<Col span={5}>
					<h3
						style={{ padding: '3px 0px', textAlign: 'right' }}
						className={'text-right'}>
						Filter by order status
					</h3>
				</Col>
				<Col span={7} style={{ paddingLeft: '0px' }}>
					<Select
						placeholder='Filter by order status'
						onChange={val => filterByOrderStatus(val)}
						size='medium'
						style={{ width: '100%' }}
						value={pagination?.status ?? ''}
						defaultValue={''}>
						<Option value=''>All</Option>
						<Option value='7'>Awaiting Payment</Option>
						<Option value='8'>Awaiting Pickup</Option>
						<Option value='9'>Awaiting Shipment</Option>
						<Option value='10'>Completed</Option>
						<Option value='11'>Awaiting Fulfillment</Option>
						<Option value='12'>Manual Verification Required</Option>
						<Option value='13'>Disputed</Option>
						<Option value='14'>Partially Refunded</Option>
						<Option value='0'>Incomplete</Option>
						<Option value='1'>Pending</Option>
						<Option value='2'>Shipped</Option>
						<Option value='3'>Partially Shipped</Option>
						<Option value='4'>Refunded</Option>
						<Option value='5'>Cancelled</Option>
						<Option value='6'>Declined</Option>
					</Select>
				</Col>
			</Row>
			<Table
				className='custom-table'
				//rowSelection={rowSelection}
				columns={columns}
				dataSource={props.filteredOrders ?? props.orders}
				//dataSource={addKeysToList(props.filteredOrders ?? props.orders, 1)}
				onChange={handleChange}
				pagination={pagination}
				showSorterTooltip={{ title: '' }}
			/>

			{/* ================ */}
			<Drawer
				title={`Additional Order Details ${
					!loadOrder ? ' (' + selectedOrderDetail?.id + ')' : ''
				}`}
				width={720}
				onClose={onClose}
				visible={state.visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right',
						}}></div>
				}>
				{loadOrder ? (
					<Skeleton active />
				) : (
					<Form
						layout='vertical'
						hideRequiredMark
						initialValues={selectedOrderDetail}>
						<Row gutter={24} className='mb-3 float-left'>
							{!props?.orderwidget || !props?.orderwidget?.widget ? (
								<Fragment>
									<Title
										level={3}
										style={{
											width: '100%',
											textAlign: 'center',
										}}>
										No order details found
									</Title>
								</Fragment>
							) : (
								props?.orderwidget?.widget?.map((widget, key) => (
									<Fragment>
										<Button
											type='primary'
											className={'mt-2 mb-2'}
											block>
											{' '}
											Shipment {key + 1}{' '}
										</Button>

										<Col span={12}>
											<div span={12}>
												<h3>Origin and Services</h3>
												<ul>
													<li>
														{(
															widget.locationtype + ''
														).trim().length
															? `${widget.locationtype}: `
															: ''}
														{widget?.address}
													</li>
													<li>
														{widget?.shipping_method}:{' '}
														{widget?.shipping_rate}
													</li>
													{widget?.accessories.map(
														access => (
															<li>{access}</li>
														)
													)}
												</ul>
											</div>
										</Col>
										<Col span={12}>
											<div>
												<h3>Items</h3>
												<ul>
													{widget?.items.map(item => (
														<li>{item}</li>
													))}
												</ul>
											</div>
										</Col>
										<Col span={24}>{widgetData(widget)}</Col>
										<Col span={24}>
											{widgetData(widget, true)}
										</Col>
									</Fragment>
								))
							)}
						</Row>
						<Row gutter={24} className='mb-3 float-left'>
							{props?.orderwidget?.fdoShipments && props?.orderwidget?.fdoShipments?.length > 0 ? (
								<Fragment>
									<Button
										type='primary'
										className={'mt-2 mb-2'}
										block>
										{' '}
										Shipment Details in Freightdesk.Online
									</Button>
									{props?.orderwidget?.fdoShipments?.map((shipment, key) => (
										<Col span={12} className='float-left mb-1'>
											<Card 
												className='mb-0' 
												style={{ backgroundColor: 'hsl(0deg 12.87% 88.25%)', borderRadius: "10px", height: '100%' }} 
												bodyStyle={{padding: "10px"}}
											>
												<span> <b> {('Shipment #' + (key + 1)) }</b> <br/>{countItems(shipment) == 1 ? (countItems(shipment) + ' item @') : (countItems(shipment) + ' items @')} {(shipment?.shipment_date)} </span> <br/> 
												{shipment?.line_items.map(item => (
														<>{item.quantity} X {item.product_name} <br/> </>
													))}
												<span> Shipping method: {shipment?.shipping_method}</span> <br/>
												<span> Tracking # {shipment?.tracking_number}</span>
												
											</Card>
										</Col>
									))}
								</Fragment>
							) : null }
						</Row>
					</Form>
				)}
			</Drawer>
			{/* ================ */}
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		orders: state.orders,
		token: state.token,
		dropships: state.dropships,
		filteredOrders: state.filteredOrders,
		orderwidget: state.orderwidget,
		searched_order: state.searched_order,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		//getAllOrders: token => dispatch(getAllOrders(token)),
		getOrderDetail: (id, setselectedOrderDetail, setLoadOrder, token) =>
			dispatch(
				getOrderDetail(id, setselectedOrderDetail, setLoadOrder, token)
			),
		submitOrderSettings: (data, token, visibility) =>
			dispatch(submitOrderSettings(data, token, visibility)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSettingsComponent)
