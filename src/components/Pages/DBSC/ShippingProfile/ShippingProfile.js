import { Button, Card, Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import AddOrigin from '../ShippingOrigin/AddOrigin'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'

const ShippingProfile = ({ editProfile, shippingProfiles }) => {
	const dispatch = useDispatch()

	return (
		<Space direction='vertical' size='large' className='w-100'>
			{shippingProfiles?.map(pf => (
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
							<Button
								type='link'
								onClick={() => {
									dispatch({
										type: 'ALERT_MESSAGE',
										payload: {
											showAlertMessage: false,
											alertMessageType: '',
										},
									})
									editProfile(pf)
								}}>
								Edit
							</Button>
							{!pf?.is_general_profile && (
								<Button
									type='link'
									onClick={() => {
										dispatch(
											setConfirmModalData(
												'profile',
												true,
												'delete_dbsc_profile',
												pf.id,
												types.DELETE_DBSC_PROFILE
											)
										)
									}}>
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

					{/* Shipping Origin */}
					<AddOrigin profileId={pf.id} />
				</Card>
			))}

			<ConfirmDeleteModal />
		</Space>
	)
}

export default memo(ShippingProfile)
