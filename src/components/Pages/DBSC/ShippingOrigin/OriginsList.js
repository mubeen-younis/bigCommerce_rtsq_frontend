import { Col, Skeleton } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

const OriginsList = ({ profileId }) => {
	const { shippingOrigins } = useSelector(state => state)

	if (!shippingOrigins) return <Skeleton active />

	return (
		<>
			{shippingOrigins?.map(org =>
				org.profile_id === profileId ? (
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<p className='mb-0'>{org?.ori_nickname}</p>
						<p>
							{org?.street_address} , {org?.city}{' '}
							{org?.state_or_province} {org?.postal_code} ,
							{org?.country}
						</p>
					</Col>
				) : null
			)}
		</>
	)
}

export default OriginsList
