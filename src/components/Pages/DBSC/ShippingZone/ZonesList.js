import { Col, Row, Skeleton } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddRate from '../ShippingRate/AddRate'

const ZonesList = ({ profileId }) => {
	const dispatch = useDispatch()
	const { shippingZones } = useSelector(state => state)

	if (!shippingZones) return <Skeleton active />

	return (
		<>
			{shippingZones?.map(zone =>
				zone.profile_id === profileId ? (
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
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<p>
								{JSON.parse(zone?.selected_region)?.join(', ')},
								8388, 83838, 89383
							</p>
						</Col>

						{/* Shipping Rates */}
						<AddRate zoneId={zone.id} />
					</Row>
				) : null
			)}
		</>
	)
}

export default ZonesList
