import { Button, Col, Row } from 'antd'
import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import ActionButtons from '../ActionButtons'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import AddZone from '../ShippingZone/AddZone'

const OriginsList = ({ profileId, editOrigin, shippingOrigins, originId }) => {
	const [orgId, setOrgId] = useState(null)
	const { shippingProfiles } = useSelector(state => state)
	const dispatch = useDispatch()

	return shippingOrigins && shippingOrigins.length > 0 ? (
		<>
			{shippingOrigins?.map(org => (
				<Row key={org.id}>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}>
						<p className='mb-0'>{org?.nickname}</p>
						<p>
							{org?.street_address} , {org?.city}{' '}
							{org?.state_or_province} {org?.postal_code} ,
							{org?.country}
						</p>
					</Col>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={12}
						style={{ textAlign: 'right' }}>
						<ActionButtons>
							<div>
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
										editOrigin({
											...org,
											parentId: originId,
										})
										dispatch({
											type: types.SET_ACTION_BUTTONS_VISIBILITY,
											payload: {
												visible: false,
												id: null,
											},
										})
									}}>
									Edit
								</Button>
							</div>
							<Button
								type='link'
								onClick={() => {
									setOrgId(org.id)
									dispatch(
										setConfirmModalData(
											'origin',
											true,
											'delete_dbsc_origin',
											org.id,
											types.DELETE_DBSC_ORIGIN
										)
									)
									dispatch({
										type: types.SET_ACTION_BUTTONS_VISIBILITY,
										payload: {
											visible: false,
											id: null,
										},
									})
								}}>
								Delete
							</Button>
						</ActionButtons>
					</Col>
				</Row>
			))}

			<ConfirmDeleteModal id={orgId} />
			<AddZone
				shippingZones={shippingProfiles?.zones?.[originId] ?? []}
				profileId={profileId}
				originId={originId}
			/>
		</>
	) : null
}

export default memo(OriginsList)
