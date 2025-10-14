import { Button, Col, Row, Skeleton, Typography, Form, Input, Modal, Radio, Select, Space } from 'antd'
import React, { useState, useCallback, useEffect, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProfilesList from './ShippingProfile/ProfilesList'
import types from '../../../Stores/types'
import { getDbscData, getDbscZones, addShippingClass, addShippingProfile, updateDbscData } from '../../../Actions/DbscActions'
import { setModalTitle } from '../../../Utilities/modalActions'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const ShippingRatesComponent = () => {
	const [addProfileModal, setAddProfileModal] = useState()
	const [shippingClass, setShippingClass] = useState(false)
	const [fromProfile, setFromProfile] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		nickname: '',
		allow_all_classes: '1',
		shipping_classes: [],
		class_name: '',
		slug: '',
		description: '',
	})
	const [action, setAction] = useState({
		type: 'add',
		payload: {
			id: '',
		},
	})
	const [isRequired, setIsRequired] = useState(true)

	const dispatch = useDispatch()
	const { shippingProfiles, shippingClasses, dbscBigComZones, token, alertMessageType } =
		useSelector(state => state)

	const toggleAddProfileModal = useCallback(
		(open = false) => setAddProfileModal(open),
		[]
	)

	useEffect(() => {
		if (!shippingProfiles) {
			dispatch(
				getDbscData('get_dbsc_profiles', types.GET_DBSC_PROFILES, token)
			)
		}
		if (!shippingClasses) {
			dispatch(
				getDbscData('get_shipping_classes', types.GET_DBSC_CLASSES, token)
			)
		}
		if (!dbscBigComZones) dispatch(getDbscZones(token))
	}, [dispatch, token])

	useEffect(() => {
		if (alertMessageType === 'success') {
			if (fromProfile) {
				setShippingClass(false)
				toggleAddProfileModal(true)
			} else clearStates()
		}
	}, [alertMessageType, fromProfile, form, toggleAddProfileModal])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				dispatch(
					updateDbscData(
						'update_dbsc_profile',
						{ ...values, id: action.payload.id },
						types.UPDATE_DBSC_PROFILE,
						token
					)
				)
				return
			}

			if (shippingClass) dispatch(addShippingClass(values, token))
			else {
				dispatch(addShippingProfile(values, token))
				setFromProfile(false)
			}
		},
		[action.type, action.payload?.id, shippingClass, dispatch, token]
	)

	const toggleShippingClassValidity = useCallback(allow_all_classes => {
		if (+allow_all_classes === 1) setIsRequired(false)
		else setIsRequired(true)
	}, [])

	const editProfile = useCallback(
		values => {
			setAction({
				type: 'edit',
				payload: values,
			})
			toggleAddProfileModal(true)
			toggleShippingClassValidity(values?.allow_all_classes)

			const formData = {
				...values,
				nickname: values.p_nickname,
				shipping_classes: values.shipping_classes
					? JSON.parse(values.shipping_classes)
					: [],
			}

			form.setFieldsValue(formData)
		},
		[form, toggleAddProfileModal, toggleShippingClassValidity]
	)

	const filterShippingClasses = useCallback(() => {
		if (
			shippingProfiles &&
			shippingProfiles.store_profiles &&
			action.type !== 'edit'
		) {
			const classesArr = []
			shippingProfiles.store_profiles?.forEach(prof => {
				if (prof?.shipping_classes) {
					classesArr.push(...JSON.parse(prof.shipping_classes))
				}
			})

			const filteredClasses = shippingClasses?.filter(
				classObj => !classesArr.includes(classObj.class_name)
			)

			return filteredClasses ?? []
		}

		return shippingClasses ?? []
	}, [action?.type, shippingClasses, shippingProfiles])

	const clearStates = useCallback(() => {
		setAction({ type: 'add', payload: null })
		setShippingClass(false)
		setIsRequired(true)
		setFromProfile(false)
		toggleAddProfileModal(false)
		form.resetFields()
		form.setFieldsValue(initialValues)
	}, [form, initialValues, toggleAddProfileModal])

	if (!shippingProfiles) return <Skeleton active />

	return (
		<div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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
					<Button
						type='link'
						onClick={() => {
							toggleAddProfileModal(true)
							dispatch({
								type: 'ALERT_MESSAGE',
								payload: {
									showAlertMessage: false,
									alertMessageType: '',
								},
							})
						}}>
						Create new profile
					</Button>
				</Col>
			</Row>

			<ProfilesList editProfile={editProfile} />

			{addProfileModal && (
				<Row gutter={30}>
					<Modal
						title={setModalTitle(action.type, shippingClass)}
						visible={addProfileModal}
						onCancel={clearStates}
						onOk={() => form.submit()}
						centered
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
											<Input
												placeholder='Nickname'
												readOnly={
													action.type === 'edit' &&
													action?.payload
														?.is_general_profile
												}
												disabled={
													action.type === 'edit' &&
													action?.payload
														?.is_general_profile
												}
											/>
										</Form.Item>
									</Col>

									{action.type === 'edit' &&
									action?.payload?.is_general_profile ? (
										<Col
											className='gutter-row'
											xs={24}
											sm={24}
											md={24}
											lg={24}
											xl={24}>
											<Form.Item
												name='allow_all_classes'
												rules={[
													{
														required: true,
														message: '',
													},
												]}>
												<Radio.Group>
													<Space
														direction='vertical'
														size='middle'>
														<Radio
															value={1}
															onChange={() =>
																setIsRequired(false)
															}>
															Use the General Profile
															for all products not
															included in another
															shipping profile
														</Radio>
														<Radio
															value={2}
															onChange={() =>
																setIsRequired(true)
															}>
															Use the General Profile
															only for products that
															have the following
															Shipping Class(es)
														</Radio>
													</Space>
												</Radio.Group>
											</Form.Item>
										</Col>
									) : null}

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
													required: isRequired,
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
										className='gutter-row mt-1'
										xs={24}
										sm={24}
										md={24}
										lg={24}
										xl={24}>
										<Form.Item>
											<Button
												type='primary'
												htmlType='button'
												onClick={() => {
													setFromProfile(true)
													setShippingClass(
														prevState => !prevState
													)
													setAction({
														type: 'add',
														payload: {},
													})
												}}>
												Add a new shipping class
											</Button>
										</Form.Item>
									</Col>
								</Row>
							) : (
								<AddShippingClass shippingClass={shippingClass} />
							)}
						</Form>
					</Modal>
				</Row>
			)}
		</div>
	)
}

const AddShippingClass = ({ shippingClass }) => {
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

export default memo(ShippingRatesComponent)
