import { Button, Popover, Skeleton, Table } from 'antd'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'

const RatesList = ({ zoneId, editRate }) => {
	const dispatch = useDispatch()
	const { shippingRates } = useSelector(state => state)

	const columns = [
		{
			title: 'Display as',
			dataIndex: 'display_as',
			key: 'display_as',
			render: (text, record) => (
				<>
					<p>{record.display_as}</p>
					<p>{record.description}</p>
				</>
			),
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate',
			render: text => <span>${Number(text).toFixed(2)} / Item</span>,
		},
		{
			title: 'Distance measured by',
			dataIndex: 'distance_measured_by',
			key: 'distance_measured_by',
		},
		{
			title: 'Distance',
			dataIndex: 'distance',
			key: 'distance',
			render: (text, record) =>
				`${record.minimum_distance} km - ${record.maximum_distance} km`,
		},
		{
			title: 'Weight',
			dataIndex: 'weight',
			key: 'weight',
			render: (text, record) =>
				`${record.minimum_weight} lbs - ${record.maximum_weight} lbs`,
		},
		{
			title: 'And / Or',
			dataIndex: 'and_or',
			key: 'and_or',
		},
		{
			title: 'Length',
			dataIndex: 'address',
			key: 'address',
			render: (text, record) =>
				`${record.minimum_length} in - ${record.maximum_length} in`,
		},
		{
			title: 'Quote',
			dataIndex: 'quote',
			key: 'quote',
			render: (text, record) =>
				`${Number(record.minimum_shipping_quote).toFixed(2)} - ${Number(
					record.maximum_shipping_quote
				).toFixed(2)}`,
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => (
				<>
					<Button
						type='link'
						onClick={() => {
							editRate(record)
						}}>
						Edit
					</Button>
					<Button
						type='link'
						onClick={() => {
							dispatch(
								setConfirmModalData(
									'rate',
									true,
									'delete_dbsc_rates',
									record.id,
									types.DELETE_DBSC_RATE
								)
							)
						}}>
						Delete
					</Button>
				</>
			),
			// render: (text, record) => (
			// 	<Popover
			// 		content={
			// 			<>
			// 				<div>
			// 					<Button type='link'>Edit</Button>
			// 				</div>
			// 				<div>
			// 					<Button type='link'>Delete</Button>
			// 				</div>
			// 			</>
			// 		}
			// 		title=''
			// 		trigger='click'
			// 		visible={true}
			// 		onVisibleChange={() => {}}>
			// 		<Button type='link'>...</Button>
			// 	</Popover>
			// ),
		},
	]

	const filterRatesData = useCallback(() => {
		const rates = shippingRates
			?.filter(rate => rate.dbsc_zone_id === zoneId)
			?.map(rate => ({
				...rate,
				key: rate.display_as,
			}))
		return rates
	}, [shippingRates])

	if (!shippingRates) return <Skeleton active />

	return (
		<Table
			dataSource={filterRatesData()}
			columns={columns}
			size='large'
			className='custom-table'
			pagination={false}
			style={{ marginBottom: '0' }}
		/>
	)
}

export default RatesList
