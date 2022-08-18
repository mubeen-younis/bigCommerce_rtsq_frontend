import React, { Fragment, useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, Table, Button, Space, Skeleton, Input } from 'antd'

import { postData } from '../Actions/Action'
import { getServices, getAddTabSettings } from '../Actions/Carriers'

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
	const [title, setTitle] = useState('')

	const dispatch = useDispatch()
	const { installedCarriers } = useSelector(state => state)

	const {
		getAddTabSettings,
		services,
		getServices,
		token,
		carrierId,
		postData,
		carriersSettings,
		filteredServices,
	} = props

	useEffect(() => {
		getCarrierServices()
		getAddTabSettings(token, carrierId)

		// if (!carriersSettings) {
		// }
		// eslint-disable-next-line
	}, [carrierId, token, state.selectedRowKeys])

	useEffect(() => {
		const title = installedCarriers?.find(carrier => +carrier.id === +carrierId)
		setTitle(title.name === 'FreightQuote CHR' ? 'C.H. Robinson' : title.name)
	}, [carrierId, installedCarriers])

	const getCarrierServices = () => {
		//getServices(token, carrierId, '')
		if (!services) {
			getServices(token, carrierId, '')
		}

		if (services !== null && services !== undefined) {
			setState({ ...state, loading: false })
		}
	}

	const saveCarriers = () => {
		if (
			state.selectedRowKeys.length === 0 &&
			rowSelection?.selectedRowKeys?.length === 0
		) {
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
				services:
					state.selectedRowKeys?.length === 0
						? rowSelection?.selectedRowKeys
						: state.selectedRowKeys,
				carrierId: carrierId,
			}

			postData(data, 'SAVE_CARRIER_TAB_SETTINGS', 'submit_carriers', token)
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

	const onSelect = (record, selected, selectedRows, nativeEvent) => {
		if (filteredServices && carriersSettings !== null) {
			setState(prevState => ({
				...prevState,
				selectedRowKeys: [...carriersSettings, selected ? record.key : null],
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
			selectedRowKeys: [...selectedRowKeys, ...carriersSettings],
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
				<strong>Note!</strong> Identifies which carriers are included in the
				quote response, not what is displayed in the shopping cart. Identify
				what displays in the shopping cart in the Quote Settings. For
				example, you may include quote responses from all carriers, but
				select to only show the cheapest three in the shopping cart.
			</div>
			<p>
				Not all carriers service all origin and destination points. If a
				carrier doesn't service the ship to address, it is automatically
				omitted from the quote response. Consider conferring with your{' '}
				{title} representative if you'd like to narrow the number of carrier
				responses.
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
			{services ? (
				<>
					<Table
						className='custom-table'
						rowSelection={rowSelection}
						columns={columns}
						dataSource={filteredServices ?? services}
						total={filteredServices?.length ?? services.length}
						pagination={{
							showSizeChanger: title !== 'TQL',
							pageSize: title !== 'TQL' ? 10 : 30,
							hideOnSinglePage: title === 'TQL',
						}}
					/>
					<Form.Item style={styles}>
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
				</>
			) : (
				<Skeleton active />
			)}
		</Fragment>
	)
}

const styles = {
	textAlign: 'right',
	marginBottom: '0',
	marginTop: '15px',
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
		getServices: (token, id, type) => dispatch(getServices(token, id, type)),
		getAddTabSettings: (token, carrierId) =>
			dispatch(getAddTabSettings(token, carrierId)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CarriersComponent)
