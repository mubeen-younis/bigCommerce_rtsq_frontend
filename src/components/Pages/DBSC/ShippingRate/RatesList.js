import { Button, Table } from 'antd'
import React, { useCallback } from 'react'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'

const RatesList = ({ zoneId, editRate, shippingRates }) => {
	const dispatch = useDispatch()

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
				`${
					record.minimum_distance
						? record.minimum_distance + ' km'
						: 0 + ' mi'
				} - ${
					record.maximum_distance ? record.maximum_distance + ' km' : ' up'
				}`,
		},
		{
			title: 'Weight',
			dataIndex: 'weight',
			key: 'weight',
			render: (text, record) =>
				`${
					record.minimum_weight
						? record.minimum_weight + ' lbs'
						: 0 + ' lbs'
				} - ${
					record.maximum_weight ? record.maximum_weight + ' lbs' : ' up'
				}`,
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
				`${
					record.minimum_length ? record.minimum_length + ' in' : 0 + ' in'
				} - ${
					record.maximum_length ? record.maximum_length + ' in' : ' up'
				}`,
		},
		{
			title: 'Quote',
			dataIndex: 'quote',
			key: 'quote',
			render: (text, record) =>
				`${Number(record.minimum_shipping_quote).toFixed(2)} - ${
					record.maximum_shipping_quote
						? Number(record.maximum_shipping_quote).toFixed(2)
						: ' up'
				}`,
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
							dispatch({
								type: 'ALERT_MESSAGE',
								payload: {
									showAlertMessage: false,
									alertMessageType: '',
								},
							})
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
		},
	]

	const filterRatesData = useCallback(
		() =>
			shippingRates?.map(rate => ({
				...rate,
				key: rate.display_as,
			})),
		[shippingRates]
	)

	// if (!shippingRates) return <Skeleton active />

	return (
		<Table
			dataSource={filterRatesData()}
			columns={columns}
			size='large'
			className='custom-table mb-0'
			pagination={false}
			style={{ marginBottom: '0' }}
		/>
	)
}

export default memo(RatesList)
