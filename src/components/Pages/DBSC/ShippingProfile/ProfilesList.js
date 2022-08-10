import { Button, Card, Col, Row, Space, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import ShippingFrom from '../ShippingOrigin/ShippingFrom'

const { Title } = Typography

const ProfilesList = () => {
	const { shippingProfiles } = useSelector(state => state)

	console.log('shippingProfiles', shippingProfiles.store_profiles)

	return (
		<Space direction='vertical' size='large' className='w-100'>
			{shippingProfiles?.store_profiles?.map(pf => (
				<Card key={pf.p_nickname}>
					<Row gutter={30} className='mb-1'>
						<Col
							className='gutter-row'
							xs={12}
							sm={12}
							md={12}
							lg={12}
							xl={12}>
							<Title level={4}>{pf?.p_nickname}</Title>
						</Col>
						<Col
							className='gutter-row'
							xs={12}
							sm={12}
							md={12}
							lg={12}
							xl={12}
							style={{ textAlign: 'right' }}>
							<Button type='link' onClick={() => {}}>
								Edit
							</Button>
							{!pf?.is_general_profile && (
								<Button type='link' onClick={() => {}}>
									Delete
								</Button>
							)}
						</Col>
					</Row>

					<Row gutter={30}>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							{pf?.shipping_classes &&
								JSON.parse(pf?.shipping_classes)?.map(cls => (
									<p key={pf?.id}>{cls}</p>
								))}
						</Col>
					</Row>

					<ShippingFrom
						origins={shippingProfiles?.origins[pf.id]}
						profileId={pf.id}
					/>
				</Card>
			))}

			{/* <ConfirmDeleteModal /> */}
		</Space>
	)
}

export default memo(ProfilesList)
