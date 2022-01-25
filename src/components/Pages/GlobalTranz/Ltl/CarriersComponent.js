import React, {
	Fragment,
	useEffect,
	useState,
	useRef,
	useCallback,
} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
	Form,
	Table,
	Button,
	Space,
	Skeleton,
	Input,
	Col,
	Row,
	Checkbox,
} from 'antd'
import axios from 'axios'
import { postData } from '../../../../Actions/Action'
import { getServices, getAddTabSettings } from '../../../../Actions/Carriers'

const columns = [
	{
		title: 'Sr#',
		dataIndex: 'sr_no',
	},
	{
		title: 'Name',
		dataIndex: 'carrier_name',
	},
	{
		title: 'Logo',
		dataIndex: 'carrier_logo',
	},
]

const CarriersComponent = props => {
	const [state, setState] = useState({
		selectedRowKeys: [], // Check here to configure the default column
		loading: true,
		carrierServices: true,
	})
	const searchRef = useRef('')
	const dispatch = useDispatch()
	const { carrier_type, gtzCarriers } = useSelector(state => state)

	const {
		services,
		getServices,
		token,
		carrierId,
		postData,
		carriersSettings,
		filteredServices,
	} = props

	useEffect(() => {
		setState({
			...state,
			selectedRowKeys: [],
		})

		getCarrierServices()

		if (!carriersSettings) {
			dispatch(getAddTabSettings(token, carrierId, carrier_type))
		}

		if (carriersSettings) {
			setState(prevState => ({
				...prevState,
				selectedRowKeys: gtzCarriers[carrier_type] ?? [],
			}))
		}

		// eslint-disable-next-line
	}, [carrierId, token, carrier_type, dispatch, carriersSettings])

	const getCarrierServices = useCallback(() => {
		if (!services) {
			getServices(token, carrierId, carrier_type)
		}

		if (services !== null && services !== undefined) {
			setState({ ...state, loading: false })
		}
	}, [carrierId, carrier_type, getServices, services, state, token])

	const saveCarriers = () => {
		if (state.selectedRowKeys.length === 0) {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: 'Error! Please select at least one carrier.',
					alertMessageType: 'error',
				},
			})
		} else {
			const data = {
				services: {
					...gtzCarriers,
					[carrier_type]: state.selectedRowKeys,
				},
				carrierId: carrierId,
			}

			postData(
				data,
				'SAVE_CARRIER_TAB_SETTINGS',
				'submit_carriers',
				token
			)

			dispatch({
				type: 'SET_GTZ_CARRIERS',
				payload: data.services,
			})

			setTimeout(() => {
				dispatch({
					type: 'SAVE_CARRIER_TAB_SETTINGS',
					payload: data.services[carrier_type],
				})
			}, 2000)
		}
	}

	const onSelectChange = selectedRowKeys => {
		// if (filteredServices) {
		// 	setFilteredKeys(selectedRowKeys)
		// }

		setState({
			...state,
			selectedRowKeys,
			carrierServices: false,
		})
	}

	const refreshCarriers = useCallback(async () => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		dispatch({
			type: 'GET_SERVICES',
			payload: [],
		})

		try {
			const { data } = await axios.post(
				'syncGTZCerasisProviders',
				{},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)

			if (!data.error) {
				if (data.data.length > 0) {
					let carrierServices = []

					data.data.map((value, index) =>
						carrierServices.push({
							key: value.speed_freight_carrierName,
							sr_no: index + 1,
							carrier_name: value.speed_freight_carrierSCAC,
							carrier_logo: (
								<img
									style={{ height: '40px' }}
									src={value.carrier_logo}
									alt={value.speed_freight_carrierName}
								/>
							),
						})
					)

					dispatch({
						type: 'GET_SERVICES',
						payload: carrierServices,
					})
				}
			}

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessageType: data.error ? 'error' : 'success',
					alertMessage: data.message,
				},
			})
		} catch (err) {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
					alertMessageType: 'error',
				},
			})
		}
	}, [dispatch, token])

	const onSelect = (record, selected, selectedRows, nativeEvent) => {
		if (filteredServices && carriersSettings !== null) {
			setState(prevState => ({
				...prevState,
				selectedRowKeys: [
					...carriersSettings,
					selected ? record.key : null,
				],
			}))
		} else {
			setState({
				...state,
				selectedRowKeys: selectedRows,
				carrierServices: false,
			})
		}
	}

	const { selectedRowKeys } = state
	let rowSelection = {}

	if (
		carriersSettings &&
		state.selectedRowKeys.length === 0 &&
		state.carrierServices
	) {
		rowSelection = {
			selectedRowKeys: carriersSettings,
			onChange: onSelectChange,
			onSelect,
			preserveSelectedRowKeys: true,
		}
	} else if (Object.keys(rowSelection).length === 0) {
		rowSelection = {
			selectedRowKeys,
			onChange: onSelectChange,
			onSelect,
			preserveSelectedRowKeys: true,
		}
	}

	if (state.loading && services === undefined) {
		return (
			<Fragment>
				<Skeleton active />
			</Fragment>
		)
	}

	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> Identifies which carriers are included in
				the quote response, not what is displayed in the shopping cart.
				Identify what displays in the shopping cart in the Quote
				Settings. For example, you may include quote responses from all
				carriers, but elect to only show the cheapest three in the
				shopping cart.
			</div>
			<p>
				Not all carriers service all origin and destination points. If a
				carrier doesn't service the ship to address, it is automatically
				omitted from the quote response. Consider conferring with your{' '}
				{carrier_type === 'GTZ' ? 'GlobalTranz' : 'Cerasis'} Account
				Team representative if you'd like to narrow the number of
				carrier responses.
			</p>
			<Input
				placeholder='Search carriers'
				size='large'
				className='my-5'
				onChange={e => {
					const value = e.target.value.trim()

					dispatch({
						type: 'FILTER_CARRIERS',
						payload: value,
					})
				}}
				ref={searchRef}
			/>
			<br />
			<br />
			{carrier_type === 'CRS' && (
				<Row gutter={24} className='mb-3'>
					<Col span={12}>
						{/*}
						<span>Automatically enable new carriers </span>

						<Checkbox
							checked={false}
							onChange={e => e}
							style={{ marginLeft: '1em' }}
						/>

						<span style={{ marginLeft: '1em' }}>(date)</span> {*/}
					</Col>

					<Col span={12} style={{ textAlign: 'right' }}>
						<Button onClick={refreshCarriers} type='primary'>
							Refresh Carriers
						</Button>
					</Col>
				</Row>
			)}

			
			{services ? 
				<>
					<Table
					className='custom-table'
					rowSelection={rowSelection}
					columns={columns}
					dataSource={filteredServices ?? services}
					total={50}
					// showSizeChanger={true}
					pagination={false}
					sortOrder='ascend'
					/>
					<Form.Item
					style={{
					textAlign: 'right',
					marginTop: '20px',
					marginBottom: '0',
					}}>
						<Space>
							<Button
								type='primary'
								size={'large'}
								htmlType='submit'
								name={`test`}
								onClick={saveCarriers}>
								Save Settings
							</Button>
						</Space>
					</Form.Item>
				</> :
			<Skeleton active />
			}
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		services: state.services,
		carriersSettings: state.carriersSettings,
		token: state.token,
		carrierId: state.carrierId,
		filteredServices: state.filteredServices,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, type, url, token) =>
			dispatch(postData(data, type, url, token)),
		getServices: (token, id, type) =>
			dispatch(getServices(token, id, type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CarriersComponent)
