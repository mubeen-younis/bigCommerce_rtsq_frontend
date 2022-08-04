import { Button, Col, Skeleton } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConfirmModalData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'

const OriginsList = ({ profileId, editOrigin }) => {
	const { shippingOrigins } = useSelector(state => state)
	const dispatch = useDispatch()

	if (!shippingOrigins) return <Skeleton active />

	return (
		<>
			{shippingOrigins?.map(org =>
				org.profile_id === profileId ? (
					<>
						<Col
							className='gutter-row'
							xs={12}
							sm={12}
							md={12}
							lg={12}
							xl={12}>
							<p className='mb-0'>{org?.ori_nickname}</p>
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
							<Button type='link' onClick={() => {}}>
								...
							</Button>
							<Button
								type='link'
								onClick={() => {
									editOrigin(org)
									// dispatch(
									// 	setConfirmModalData(
									// 		'Update',
									// 		true,
									// 		'',
									// 		org,
									// 		types.UPDATE_DBSC_ORIGIN,
									// 		'ORIGIN'
									// 	)
									// )
								}}>
								Edit
							</Button>
							<Button
								type='link'
								onClick={() => {
									dispatch(
										setConfirmModalData(
											'origin',
											true,
											'delete_dbsc_origin',
											org.id,
											types.DELETE_DBSC_ORIGIN
										)
									)
								}}>
								Delete
							</Button>
						</Col>
					</>
				) : null
			)}
		</>
	)
}

export default OriginsList
