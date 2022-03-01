import React, { Fragment, useState, useCallback, useEffect } from 'react'
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Modal,
	Form,
	Input,
	Table,
	Skeleton,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
	getShippingGroups,
	saveShippingGroup,
	deleteShippingGroup,
} from '../../Actions/ShippingGroupsActions'
import addKeysToList from './../../Utilities/addKey'

const { Title } = Typography
const { Option } = Select
const initialState = {
	nickname: '',
	checkout_description: '',
	rate: '',
	rate_x_quantity: 1,
}

function ShippingGroupsComponent() {
	const [modal, setModal] = useState({
		open: false,
		type: '',
	})
	const [shippingGroupId, setShippingGroupId] = useState(null)
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { alertMessageType, shippingGroups } = useSelector(state => state)

	useEffect(() => {
		if (!shippingGroups) {
			dispatch(getShippingGroups())
		}
	}, [dispatch, shippingGroups])

	useEffect(() => {
		if (alertMessageType === 'success') {
			setModal({
				open: false,
				type: '',
			})
		}
	}, [alertMessageType])

	const hanldeModalToggling = useCallback(
		(open = false, type = '') =>
			setModal({
				open,
				type,
			}),
		[]
	)

	const editLocation = useCallback(
		record => {
			hanldeModalToggling(true, 'edit')
			setShippingGroupId(record.uuid)
			form.setFieldsValue(record)
		},
		[form, hanldeModalToggling]
	)

	const openDeleteLocationModal = useCallback(
		record => {
			hanldeModalToggling(true, 'delete')
			setShippingGroupId(record.uuid)
		},
		[hanldeModalToggling]
	)

	const onFinish = useCallback(
		values => {
			let error = false,
				errormsg = '',
				data = {}

			if (modal.open && modal.type === 'edit') {
				data = shippingGroups?.find(sg => sg.uuid === shippingGroupId) ?? {}
			}

			if (error) {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: false,
						alertMessageType: 'loading',
					},
				})
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: errormsg,
						showAlertMessage: true,
						alertMessageType: 'error',
					},
				})
			} else {
				dispatch(saveShippingGroup({ ...data, ...values }))
			}
		},
		[dispatch, modal.open, modal.type, shippingGroupId, shippingGroups]
	)

	const columns = [
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			key: 'rate',
			title: 'Rate',
			dataIndex: 'rate',
		},
		{
			key: 'rate_x_quantity',
			title: 'Rate X Qty',
			dataIndex: 'rate_x_quantity',
			render: rate_x_quantity => (rate_x_quantity === 1 ? 'Yes' : 'No'),
		},
		{
			key: 'checkout_description',
			title: 'Label As',
			dataIndex: 'checkout_description',
		},
		{
			key: 'action',
			title: 'Action',
			render: text => (
				<Space size='middle'>
					<Button onClick={() => editLocation(text)}>Edit</Button>
					<Button
						onClick={() => openDeleteLocationModal(text)}
						className={'btn-danger'}>
						Delete
					</Button>
				</Space>
			),
		},
	]

	if (!shippingGroups) return <Skeleton active />

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row gutter={30}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>
							Shipping Groups{' '}
							<Button
								type='primary'
								onClick={() => {
									form.setFieldsValue(initialState)
									hanldeModalToggling(true, 'add')
								}}>
								Add
							</Button>
						</Title>
						<p>
							Warehouses that inventory all products not otherwise
							identified as drop shipped items. The warehouse with the
							lowest shipping cost to the destination is used for
							quoting purposes.
						</p>
						<Table
							className={'custom-table'}
							dataSource={
								shippingGroups ? addKeysToList(shippingGroups) : []
							}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>

			{/* Add/Edit Modal */}
			<Modal
				title={
					<Title className={'mb-0'} level={4}>
						{alertMessageType === 'loading'
							? 'Loading. Please wait...'
							: 'Shipping Groups'}
					</Title>
				}
				centered
				visible={
					modal.open && (modal.type === 'add' || modal.type === 'edit')
				}
				onCancel={() => hanldeModalToggling(false, '')}
				footer={null}
				width={800}>
				{alertMessageType === 'loading' ? (
					<Skeleton active />
				) : (
					<Form
						layout='vertical'
						name='add_shipping_group_info'
						className='form-wrp'
						size={'large'}
						form={form}
						initialValues={initialState}
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
									className={'mb-2'}
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
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Label As'
									name='checkout_description'
									rules={[
										{
											required: true,
											message: 'Label As',
										},
									]}>
									<Input placeholder='Label As' />
								</Form.Item>
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
								<Form.Item
									className={'mb-2'}
									label='Rate'
									name='rate'
									rules={[
										{
											required: true,
											message: 'Rate',
											pattern: /^\d+(.\d{0,2})?$/,
										},
									]}>
									<Input
										type='number'
										min={0}
										step={0.01}
										placeholder='e.g. 2 or 2.50'
									/>
								</Form.Item>
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
								<Form.Item
									className={'mb-2'}
									label='Rate X Qty'
									name='rate_x_quantity'
									rules={[
										{
											required: true,
											message: 'Rate X Qty',
										},
									]}>
									<Select>
										<Option value={1}>Yes</Option>
										<Option value={0}>No</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mt-3'}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									style={{
										textAlign: 'right',
										marginBottom: '0',
									}}>
									<Space>
										<Button
											type='primary'
											size={'large'}
											htmlType='submit'>
											Save
										</Button>
									</Space>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				)}
			</Modal>

			{/* Delete Modal */}
			<Modal
				title='Confirm Delete'
				centered
				visible={modal.open && modal.type === 'delete'}
				onOk={() => dispatch(deleteShippingGroup(shippingGroupId))}
				onCancel={() => hanldeModalToggling(false, '')}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>Are you sure you want to delete this shipping group?</p>
			</Modal>
		</Fragment>
	)
}

export default ShippingGroupsComponent
