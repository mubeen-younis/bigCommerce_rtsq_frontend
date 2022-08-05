import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Card } from 'antd'
import Title from 'antd/lib/typography/Title'
import { useDispatch, useSelector } from 'react-redux'
import {
	addDbscData,
	getDbscData,
	updateDbscData,
} from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import ZonesList from './ZonesList'

const AddZone = ({ profileId }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		zone_name: '',
		define_by_zone: '1',
		selected_region: [],
		postcode: '',
	})
	const [action, setAction] = useState({
		type: 'add',
		payload: null,
	})
	const [originExist, setOriginExist] = useState(false)
	const dispatch = useDispatch()
	const { dbscBigComZones, shippingZones, alertMessageType, shippingOrigins } =
		useSelector(state => state)

	useEffect(() => {
		if (!shippingZones) {
			dispatch(getDbscData('get_dbsc_zones', types.GET_DBSC_ZONES))
		}
	}, [])

	useEffect(() => {
		if (alertMessageType === 'success') {
			form.resetFields()
			setAction({ type: '', payload: null })
			setIsOpen(false)
		}

		if (shippingOrigins) {
			const origins = shippingOrigins.filter(
				origin => origin.profile_id === profileId
			)

			if (origins.length > 0) {
				setOriginExist(true)
			}
		}
	}, [alertMessageType, shippingOrigins])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				dispatch(
					updateDbscData(
						'update_dbsc_zone',
						{ ...values, id: action.payload.id, profile_id: profileId },
						types.UPDATE_DBSC_ZONE
					)
				)
			} else {
				dispatch(
					addDbscData(
						'add_dbsc_zone',
						{ ...values, profile_id: profileId },
						types.ADD_DBSC_ZONE
					)
				)
			}
		},
		[action.type, profileId, dispatch]
	)

	const editZone = useCallback(
		values => {
			setIsOpen(true)
			setAction({
				type: 'edit',
				payload: values,
			})

			const regions = values.selected_region
				? JSON.parse(values.selected_region)
				: []
			form.setFieldsValue({ ...values, selected_region: regions })
		},
		[action.type, form]
	)

	const filterZoneRegions = useCallback(() => {
		if (shippingZones && action.type !== 'edit') {
			const regions = []
			const zones = shippingZones?.filter(
				zone => zone.profile_id === profileId
			)

			zones.forEach(zone => {
				if (zone.selected_region) {
					regions.push(...JSON.parse(zone.selected_region))
				}
			})
			const filteredRegions = dbscBigComZones.filter(
				zr => !regions.includes(zr.id)
			)

			return filteredRegions
		}

		return dbscBigComZones
	}, [action.type, dbscBigComZones, profileId, shippingZones])

	return originExist ? (
		<Card>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={4}>Shipping To</Title>
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
							setIsOpen(true)
							setAction({
								type: 'add',
								payload: null,
							})
						}}>
						Add shipping zone
					</Button>
				</Col>
			</Row>

			{/* Zones List */}
			<ZonesList profileId={profileId} editZone={editZone} />

			{/* Add New Shipping Zone */}
			{isOpen && (
				<Modal
					title='Create zone'
					visible={isOpen}
					onCancel={() => {
						setIsOpen(false)
						form.resetFields()
					}}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					okText='Save'
					footer={[
						<Button key='back' onClick={() => setIsOpen(false)}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
							// loading={loading}
							onClick={() => form.submit()}>
							Save
						</Button>,
					]}>
					<Form
						layout='vertical'
						name='add_zone_info'
						className='form-wrp'
						size='large'
						form={form}
						initialValues={initialValues}
						onFinish={onFinish}>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className='mb-2'
									label='Zone name'
									name='zone_name'
									rules={[
										{
											required: true,
											message: 'Zone name',
										},
									]}>
									<Input />
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className='mb-2'
									name='selected_region'
									label='Zone Regions'
									rules={[
										{
											required: true,
											message: 'Zone regions',
										},
									]}>
									<Select
										mode='multiple'
										placeholder='Select regions with within this zone'>
										{filterZoneRegions().map(region => (
											<Select.Option
												key={region.id}
												value={region.id.toString()}>
												{region.name}
											</Select.Option>
										))}
										{/* {dbscBigComZones?.map(region => (
											<Select.Option
												key={region.id}
												value={region.id.toString()}>
												{region.name}
											</Select.Option>
										))} */}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			)}
		</Card>
	) : null
}

export default memo(AddZone)
