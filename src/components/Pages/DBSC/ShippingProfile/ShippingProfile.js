import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useSelector } from 'react-redux'
import AddOrigin from '../ShippingOrigin/AddOrigin'

const ShippingProfile = () => {
	const { shippingProfiles } = useSelector(state => state)

	return (
		<Space direction='vertical' size='large' className='w-100'>
			{shippingProfiles?.map(pf => (
				<Card key={pf.id}>
					<Row gutter={30} className='mb-2'>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Title level={4}>{pf?.p_nickname}</Title>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							{JSON.parse(pf?.shipping_classes)?.map(cls => (
								<p key={pf?.id}>{cls}</p>
							))}
						</Col>
					</Row>

					{/* Shipping Origin */}
					<AddOrigin profileId={pf.id} />
				</Card>
			))}
		</Space>
	)
}

export default ShippingProfile
