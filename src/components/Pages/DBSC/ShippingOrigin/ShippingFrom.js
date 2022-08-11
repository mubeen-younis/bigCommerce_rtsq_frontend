import { Button, Card, Col, Row, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import OriginsList from './OriginsList'

const { Title } = Typography

const ShippingFrom = ({
	profileId,
	editOrigin,
	setIsOpen,
	origins,
	setOriginId,
}) => {
	const { shippingProfiles } = useSelector(state => state)

	if (!origins || !origins.length) {
		return (
			<Card>
				<Row gutter={30} className='mb-2'>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}>
						<Title level={4}>Shipping from</Title>
					</Col>

					<Col
						className='gutter-row mb-2'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}
						style={{ textAlign: 'right' }}>
						<Button
							type='link'
							onClick={() => {
								setIsOpen(true)
								setOriginId(null)
							}}>
							Add shipping origin
						</Button>
					</Col>
				</Row>
			</Card>
		)
	}

	return origins && origins.length
		? origins.map(origin => (
				<Card key={origin.id} className='mb-2'>
					<Row gutter={30} className='mb-2'>
						<Col
							className='gutter-row'
							xs={12}
							sm={12}
							md={12}
							lg={12}
							xl={12}>
							<Title level={4}>Shipping from</Title>
						</Col>

						<Col
							className='gutter-row mb-2'
							xs={12}
							sm={12}
							md={12}
							lg={12}
							xl={12}
							style={{ textAlign: 'right' }}>
							<Button
								type='link'
								onClick={() => {
									setIsOpen(true)
									setOriginId(origin.id)
								}}>
								Add shipping origin
							</Button>
						</Col>
					</Row>

					<OriginsList
						profileId={profileId}
						editOrigin={editOrigin}
						shippingOrigins={shippingProfiles?.origin?.[origin.id] ?? []}
						originId={origin.id}
					/>
				</Card>
		  ))
		: null
}

export default memo(ShippingFrom)
