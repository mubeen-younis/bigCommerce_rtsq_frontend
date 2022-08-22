import React, { useCallback, useEffect, memo, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Radio, Space } from 'antd'
import { updateDbscData } from '../../../../Actions/DbscActions'
import { useDispatch, useSelector } from 'react-redux'
import types from '../../../../Stores/types'
import { addDbscData } from '../../../../Actions/DbscActions'
import ShippingFrom from './ShippingFrom'

const { Option } = Select

const AddOrigin = ({ profileId }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		nickname: '',
		street_address: '',
		city: '',
		state_or_province: '',
		postal_code: '',
		country: '',
		from_shipping_origin: '1',
		availability_in_other_plugins: '1',
	})
	const [action, setAction] = useState({
		type: 'add',
		payload: null,
	})
	const [originId, setOriginId] = useState(null)

	const dispatch = useDispatch()
	const { alertMessageType, shippingProfiles, token } = useSelector(state => state)

	useEffect(() => {
		if (alertMessageType === 'success') {
			setAction({ type: '', payload: null })
			setIsOpen(false)
		}
	}, [alertMessageType, form])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				const payload = {
					...values,
					id: action.payload.id,
					profile_id: profileId,
					origin_id: originId,
				}

				dispatch(
					updateDbscData(
						'update_dbsc_origin',
						payload,
						types.UPDATE_DBSC_ORIGIN,
						token
					)
				)
			} else {
				dispatch(
					addDbscData(
						'add_dbsc_origin',
						{ ...values, profile_id: profileId, origin_id: originId },
						types.ADD_DBSC_ORIGIN,
						token
					)
				)
			}
		},
		[action.type, action.payload?.id, dispatch, profileId, originId, token]
	)

	const editOrigin = useCallback(
		values => {
			setIsOpen(true)
			setAction({
				type: 'edit',
				payload: values,
			})

			form.setFieldsValue(values)
		},
		[form]
	)

	return (
		<>
			<ShippingFrom
				profileId={profileId}
				setIsOpen={setIsOpen}
				editOrigin={editOrigin}
				origins={shippingProfiles?.origins?.[profileId] ?? []}
				setOriginId={setOriginId}
			/>

			<Row gutter={30}>
				<Modal
					title='Add shipping origin'
					visible={isOpen}
					onCancel={() => {
						setIsOpen(false)
						form.resetFields()
						setAction({
							...action,
							type: 'add',
							payload: {},
						})
					}}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					afterClose={form.resetFields}
					okText='Save'
					footer={[
						<Button key='back' onClick={() => setIsOpen(false)}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
							onClick={() => form.submit()}>
							Save
						</Button>,
					]}>
					<Form
						layout='vertical'
						name='add_warehouse_info'
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
									label='Nickname'
									name='nickname'
									rules={[
										{
											required: true,
											message: 'Nickname',
										},
									]}>
									<Input name='nickname' />
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
									label='Street address'
									name='street_address'
									rules={[
										{
											required: true,
											message: 'Street address',
										},
									]}>
									<Input
										name='Street_address'
										placeholder='6180 Buffington Road'
									/>
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
									label='City'
									name='city'
									rules={[
										{
											required: true,
											message: 'City',
										},
									]}>
									<Input name='city' placeholder='Atlanta' />
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
									label='State or Province'
									name='state_or_province'
									rules={[
										{
											required: true,
											message: 'State or Province',
										},
										{
											max: 2,
											message:
												'Maximum 2 characters allowed e.g FL',
										},
									]}>
									<Input name='state' placeholder='GA' />
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
									label='Postal Code'
									name='postal_code'
									rules={[
										{
											required: true,
											message: 'Postal Code',
										},
									]}>
									<Input name='postal_code' placeholder='30349' />
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
									label='Country code'
									name='country'
									rules={[
										{
											required: true,
											message: 'Country code',
										},
										{
											len: 2,
											message:
												'Maximum 2 characters allowed e.g US.',
										},
									]}>
									<Input name='country' placeholder='US' />
								</Form.Item>
							</Col>

							{action.type !== 'edit' && (
								<>
									<Col
										className='gutter-row'
										xs={24}
										sm={24}
										md={24}
										lg={24}
										xl={24}>
										<Form.Item
											className='mb-2'
											label='Add the shipping origin'
											name='from_shipping_origin'
											rules={[
												{
													required: false,
													message:
														'Add the shipping origin',
												},
											]}>
											<Radio.Group>
												<Space direction='vertical'>
													<Radio value='1'>
														To this Shipping From profile
													</Radio>
													<Radio value='2'>
														As a new Shipping From
														profile
													</Radio>
												</Space>
											</Radio.Group>
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
											label='Availability in other plugins by Eniture Technology'
											name='availability_in_other_plugins'
											rules={[
												{
													required: false,
													message:
														'Availability in other plugins by Eniture Technology',
												},
											]}>
											<Select>
												<Option value='1'>
													Not available
												</Option>
												<Option value='2'>
													Available as a warehouse
												</Option>
												<Option value='3'>
													Available as a dropship
												</Option>
											</Select>
										</Form.Item>
									</Col>
								</>
							)}
						</Row>
					</Form>
				</Modal>
			</Row>
		</>
	)
}

export default memo(AddOrigin)
