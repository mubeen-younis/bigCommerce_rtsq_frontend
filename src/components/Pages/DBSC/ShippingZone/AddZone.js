import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Card } from 'antd'
import Title from 'antd/lib/typography/Title'
import { useDispatch, useSelector } from 'react-redux'
import { addDbscData, updateDbscData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import ZonesList from './ZonesList'

const AddZone = ({ profileId, shippingZones, originId }) => {
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
	const dispatch = useDispatch()
	const { dbscBigComZones, alertMessageType, token } = useSelector(state => state)

	const clearStates = useCallback(() => {
		setIsOpen(false)
		form.resetFields()
		form.setFieldsValue(initialValues)
		setAction({
			...action,
			type: 'add',
			payload: {},
		})
	}, [action, form, initialValues])

	useEffect(() => {
		if (alertMessageType === 'success') clearStates()
	}, [alertMessageType])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				dispatch(
					updateDbscData(
						'update_dbsc_zone',
						{ ...values, id: action.payload.id, profile_id: profileId },
						types.UPDATE_DBSC_ZONE,
						token
					)
				)
			} else {
				dispatch(
					addDbscData(
						'add_dbsc_zone',
						{
							...values,
							profile_id: profileId,
							dbsc_origin_id: originId,
						},
						types.ADD_DBSC_ZONE,
						token
					)
				)
			}
		},
		[action?.type, action.payload?.id, dispatch, profileId, originId, token]
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
		[form]
	)

	const filterZoneRegions = useCallback(() => {
		if (shippingZones && action.type !== 'edit') {
			const regions = []
			shippingZones?.forEach(zone => {
				if (zone.selected_region) {
					regions.push(...JSON.parse(zone.selected_region))
				}
			})

			const filteredRegions =
				dbscBigComZones?.filter(zr => !regions.includes(zr.id.toString())) ??
				[]

			return filteredRegions ?? []
		}

		return dbscBigComZones ?? []
	}, [action.type, dbscBigComZones, shippingZones])

	return (
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
							dispatch({
								type: 'ALERT_MESSAGE',
								payload: {
									showAlertMessage: false,
									alertMessageType: '',
								},
							})
						}}>
						Add shipping zone
					</Button>
				</Col>
			</Row>

			{/* Zones List */}
			<ZonesList
				profileId={profileId}
				shippingZones={shippingZones}
				editZone={editZone}
			/>

			{/* Add New Shipping Zone */}
			{isOpen && (
				<Modal
					title={`${action.type === 'edit' ? 'Edit' : 'Create'} zone`}
					visible={isOpen}
					onCancel={clearStates}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					afterClose={clearStates}
					okText='Save'
					footer={[
						<Button key='back' onClick={clearStates}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
							loading={alertMessageType === 'loading'}
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
										placeholder='Select regions with within this zone'
										filterOption={(input, option) =>
											option.children
												.toLowerCase()
												.includes(input.toLowerCase())
										}>
										{filterZoneRegions()?.map(region => (
											<Select.Option
												key={region.id}
												value={region.id.toString()}>
												{region.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			)}
		</Card>
	)
}

export default memo(AddZone)
