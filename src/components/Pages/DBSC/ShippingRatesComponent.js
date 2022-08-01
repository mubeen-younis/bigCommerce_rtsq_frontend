import { Button, Col, Row, Space, Typography } from 'antd'
import React, { useState, useCallback } from 'react'
import AddProfile from './ShippingProfile/AddProfile'
import ShippingProfile from './ShippingProfile/ShippingProfile'

const { Title } = Typography

const ShippingRatesComponent = () => {
	const [addProfileModal, setAddProfileModal] = useState()

	const toggleAddProfileModal = useCallback(
		(open = false) => setAddProfileModal(open),
		[]
	)

	return (
		<>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={4}>Shipping Profiles </Title>
				</Col>
				<Col
					className='gutter-row'
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={12}
					style={{ textAlign: 'right' }}>
					<Button type='link' onClick={() => toggleAddProfileModal(true)}>
						Create new profile
					</Button>
				</Col>
			</Row>

			<ShippingProfile />
			{addProfileModal && (
				<AddProfile
					visible={addProfileModal}
					toggleAddProfileModal={toggleAddProfileModal}
				/>
			)}
		</>
	)
}

export default ShippingRatesComponent
