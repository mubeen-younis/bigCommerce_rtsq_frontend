import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ZonesList = () => {
	const dispatch = useDispatch()
	const { shippingZones } = useSelector(state => state)

	return (
		<>
			{shippingZones?.map(zone => (
				<>
					<Row gutter={30} className='mb-2'>
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
							<p>Africa, Algeria, 8388, 83838, 89383</p>
						</Col>
					</Row>
				</>
			))}
		</>
	)
}

export default ZonesList
