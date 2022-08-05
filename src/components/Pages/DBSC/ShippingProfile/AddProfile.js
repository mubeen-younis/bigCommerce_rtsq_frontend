import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	addShippingClass,
	addShippingProfile,
	updateDbscData,
} from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import ShippingProfile from './ShippingProfile'

const { Option } = Select
const { TextArea } = Input

const AddProfile = ({ visible, toggleAddProfileModal }) => {
	const [shippingClass, setShippingClass] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		nickname: '',
		shipping_classes: [],
		class_name: '',
		slug: '',
		description: '',
	})
	const [action, setAction] = useState({
		type: 'add',
		payload: null,
	})

	const dispatch = useDispatch()
	const { shippingClasses, alertMessageType, shippingProfiles } = useSelector(
		state => state
	)

	useEffect(() => {
		if (alertMessageType === 'success') {
			form.resetFields()
			setAction({ type: '', payload: null })
			setShippingClass(false)
			toggleAddProfileModal(false)
		}
	}, [alertMessageType])

	const setModalTitle = useCallback(() => {
		const postfix = shippingClass ? ' class' : ' profile'
		return `Add shipping ${postfix}`
	}, [shippingClass])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				dispatch(
					updateDbscData(
						'update_dbsc_profile',
						{ ...values, id: action.payload.id },
						types.UPDATE_DBSC_PROFILE
					)
				)
				form.resetFields()
				return
			}

			if (shippingClass) dispatch(addShippingClass(values))
			else dispatch(addShippingProfile(values))
			form.resetFields()
		},
		[shippingClass, action.type, action.payload, dispatch]
	)

	const editProfile = useCallback(values => {
		setAction({
			type: 'edit',
			payload: values,
		})
		toggleAddProfileModal(true)

		const formData = {
			...values,
			nickname: values.p_nickname,
			shipping_classes: values.shipping_classes
				? JSON.parse(values.shipping_classes)
				: [],
		}

		form.setFieldsValue(formData)
	}, [])

	const filterShippingClasses = useCallback(() => {
		if (shippingProfiles && action.type !== 'edit') {
			const classesArr = []
			shippingProfiles.forEach(prof => {
				if (prof?.shipping_classes) {
					classesArr.push(...JSON.parse(prof.shipping_classes))
				}
			})

			const filteredClasses = shippingClasses.filter(
				classObj => !classesArr.includes(classObj.class_name)
			)

			return filteredClasses
		}

		return shippingClasses
	}, [action, shippingClasses, shippingProfiles])

	return (
		<>
			<ShippingProfile editProfile={editProfile} />

			{visible && (
				<Row gutter={30}>
					<Modal
						title={setModalTitle()}
						visible={visible}
						onCancel={() => {
							setAction({ type: 'add', payload: null })
							toggleAddProfileModal(false)
							setShippingClass(false)
							form.resetFields()
						}}
						onOk={() => form.submit()}
						centered
						destroyOnClose
						okText='Save'
						footer={[
							<Button
								key='back'
								onClick={() => toggleAddProfileModal(false)}>
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
							name='add_profile_info'
							className='form-wrp'
							size='large'
							form={form}
							initialValues={initialValues}
							onFinish={onFinish}>
							{!shippingClass ? (
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
											<Input placeholder='Nickname' />
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
											label='Shipping class'
											name='shipping_classes'
											rules={[
												{
													required: true,
													message: 'Shipping class',
												},
											]}>
											<Select
												placeholder='Search shipping classes'
												mode='multiple'>
												{filterShippingClasses()?.map(
													cls => (
														<Option
															key={cls.id.toString()}
															value={cls.class_name}>
															{cls.class_name}
														</Option>
													)
												)}
											</Select>
										</Form.Item>
									</Col>

									<Col
										className='gutter-row'
										xs={24}
										sm={24}
										md={24}
										lg={24}
										xl={24}>
										<Form.Item>
											<Button
												type='text'
												htmlType='button'
												onClick={() =>
													setShippingClass(
														prevState => !prevState
													)
												}>
												Add a new shipping class
											</Button>
										</Form.Item>
									</Col>
								</Row>
							) : (
								/* Add shipping class */
								<AddShippingClass shippingClass={shippingClass} />
							)}
						</Form>
					</Modal>
				</Row>
			)}
		</>
	)
}

export const AddShippingClass = ({ shippingClass }) => {
	return (
		<Row gutter={30}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Shipping class'
					name='class_name'
					rules={[
						{
							required: shippingClass,
							message: 'Shipping class',
						},
					]}>
					<Input placeholder='Class name' />
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Slug'
					name='slug'
					rules={[
						{
							required: shippingClass,
							message: 'Slug',
						},
					]}>
					<Input placeholder='Class slug' />
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Description'
					name='description'
					rules={[
						{
							required: shippingClass,
							message: 'Description',
						},
					]}>
					<TextArea />
				</Form.Item>
			</Col>
		</Row>
	)
}

export default memo(AddProfile)
