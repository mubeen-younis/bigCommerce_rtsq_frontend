import { Button, Col, Row, Skeleton, Typography } from 'antd'
import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddProfile from './ShippingProfile/AddProfile'
import ShippingProfile from './ShippingProfile/ShippingProfile'
import types from '../../../Stores/types'
import {
	getShippingProfiles,
	getShippingClasses,
	getDbscData,
} from '../../../Actions/DbscActions'

const { Title } = Typography

const ShippingRatesComponent = () => {
	const [addProfileModal, setAddProfileModal] = useState()
	const dispatch = useDispatch()
	const { shippingProfiles } = useSelector(state => state)

	const toggleAddProfileModal = useCallback(
		(open = false) => setAddProfileModal(open),
		[]
	)

	useEffect(() => {
		dispatch(getDbscData('get_dbsc_profiles', types.GET_DBSC_PROFILES))
		dispatch(getDbscData('get_shipping_classes', types.GET_DBSC_CLASSES))
	}, [])

	if (!shippingProfiles) return <Skeleton active />

	return (
		<>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={4}>Shipping Profiles</Title>
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
