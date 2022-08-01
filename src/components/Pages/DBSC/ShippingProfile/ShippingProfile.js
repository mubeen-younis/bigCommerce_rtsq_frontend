import { Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import AddOrigin from '../ShippingOrigin/AddOrigin'

const ShippingProfile = () => {
	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Card>
				<Row gutter={30} className='mb-2'>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Profile 1</Title>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<p>TCS</p>
					</Col>
				</Row>

				{/* Shipping Origin */}
				<AddOrigin />
			</Card>
		</Space>
	)
}

export default ShippingProfile
