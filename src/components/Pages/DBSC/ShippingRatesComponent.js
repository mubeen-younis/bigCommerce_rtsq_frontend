import { Button, Col, Row, Space, Typography } from 'antd'
import React, { useState, useCallback } from 'react'
import AddProfile from './AddProfile'
import ShippingProfile from './ShippingProfile'

const { Title } = Typography

const ShippingRatesComponent = () => {
	const [addProfileModal, setAddProfileModal] = useState()

	const toggleAddProfileModal = useCallback(
		(open = false) => setAddProfileModal(open),
		[]
	)

	return (
		<>
			<Row gutter={30}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={20} xl={20}>
					<Title level={4}>Shipping Profiles </Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={4} xl={4}>
					<Button
						type='primary'
						onClick={() => {
							toggleAddProfileModal(true)
						}}>
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
