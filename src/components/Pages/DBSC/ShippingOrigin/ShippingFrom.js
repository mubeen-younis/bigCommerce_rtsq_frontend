import { Button, Col, Row, Typography } from 'antd'
import React, { memo } from 'react'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import OriginsList from './OriginsList'

const { Title } = Typography

const ShippingFrom = ({ profileId, editOrigin, setIsOpen }) => {
	return (
		<Row gutter={30} className='mb-2'>
			<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
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
						setConfirmModalData(
							'Add',
							true,
							'',
							null,
							types.ADD_DBSC_ORIGIN,
							'ORIGIN'
						)
					}}>
					Add shipping origin
				</Button>
			</Col>

			<OriginsList profileId={profileId} editOrigin={editOrigin} />
		</Row>
	)
}

export default memo(ShippingFrom)
