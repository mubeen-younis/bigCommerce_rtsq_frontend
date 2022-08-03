import { Skeleton, Table } from 'antd'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const RatesList = ({ zoneId }) => {
	const dispatch = useDispatch()
	const { shippingRates } = useSelector(state => state)

	const columns = [
		{
			title: 'Display as',
			dataIndex: 'display_as',
			key: 'display_as',
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
			dataIndex: 'address',
			key: 'address',
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
					record.minimum_shipping_quote
				).toFixed(2)}`,
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
		},
	]

	const filterRatesData = useCallback(() => {
		const rates = shippingRates?.filter(rate => rate.dbsc_zone_id === zoneId)
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
		/>
	)
}

export default RatesList
