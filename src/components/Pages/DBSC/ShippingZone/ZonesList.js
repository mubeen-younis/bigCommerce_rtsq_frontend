import { Button, Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import AddRate from '../ShippingRate/AddRate'

const ZonesList = ({ profileId, editZone, shippingZones }) => {
	const dispatch = useDispatch()
	const { shippingProfiles, dbscBigComZones } = useSelector(state => state)

	const formatZoneRegions = useCallback(
		(regionIdsArr = []) => {
			const regions = regionIdsArr ? JSON.parse(regionIdsArr) : []
			return dbscBigComZones
				?.filter(zone => regions.includes(zone.id.toString()))
				?.map(zone => zone.name)
				?.join(', ')
		},
		[dbscBigComZones]
	)

	return shippingZones
		? shippingZones?.map(zone => (
				<Row gutter={30} className='mb-2' key={zone.id}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={5}>{zone?.zone_name}</Title>
					</Col>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}>
						<p>{formatZoneRegions(zone?.selected_region)}</p>
					</Col>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}
						style={{ textAlign: 'right' }}>
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
								editZone(zone)
							}}>
							Edit
						</Button>
						<Button
							type='link'
							onClick={() => {
								dispatch(
									setConfirmModalData(
										'zone',
										true,
										'delete_dbsc_zone',
										zone.id,
										types.DELETE_DBSC_ZONE
									)
								)
							}}>
							Delete
						</Button>
					</Col>

					{/* Shipping Rates */}
					<AddRate
						rates={shippingProfiles?.rates?.[zone.id] ?? []}
						zoneId={zone.id}
					/>
				</Row>
		  ))
		: null
}

export default memo(ZonesList)
