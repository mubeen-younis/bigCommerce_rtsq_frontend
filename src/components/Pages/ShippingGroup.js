import React, { Fragment, useState } from 'react'
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
import { postData } from '../../Actions/Action'
import addKeysToList from './../../Utilities/addKey'
import { getWarehouse, deleteLocation } from '../../Actions/Warehouse'

const { Title } = Typography
const { Option } = Select
const shipping_groups = []
const initialState = {
	nickname: '',
	checkout_description: '',
	rate: '',
	rate_x_quantity: true,
}

function WarehouseComponent() {
	const [modalVisibility, setModalVisibility] = useState(false)
	const [locationDetail, setLocationDetail] = useState(initialState)
	const [warehouseDeleteModal, setDeleteWarehouseModal] = useState(false)
	const [warehouseInfo, setWarehouseInfo] = useState({
		id: null,
		type: null,
	})
	const form = Form.useForm()
	const dispatch = useDispatch()
	const { alertMessageType, token } = useSelector(state => state)

	const onFinish = values => {
		const data = locationDetail
		let error = false,
			errormsg = ''

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
			dispatch(
				postData(
					data,
					'SAVE_LOCATION',
					'save_location',
					token,
					setModalVisibility
				)
			)
		}
	}

	const openLocationModal = location_type => {
		setLocationDetail({
			location_type: location_type,
		})
		setModalVisibility(true)
	}

	const openDeleteLocationModal = data => {
		setDeleteWarehouseModal(true)
		setWarehouseInfo({
			id: data.id,
			type: data.type,
		})
	}

	const editLocation = data => {
		setLocationDetail({})
		setModalVisibility(true)

		dispatch(getWarehouse(data.id, setLocationDetail, setModalVisibility, token))
	}

	const changeValue = e => {
		setLocationDetail({
			...locationDetail,
			[e.target.name]: e.target.value,
		})
	}

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
			title: 'Rate X',
			dataIndex: 'rate_x_quantity',
		},
		{
			key: 'checkout_description',
			title: 'Checkout Description',
			dataIndex: 'checkout_description',
		},
		{
			key: 'zip',
			title: 'Action',
			render: (text, record) => (
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

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row gutter={30}>
					<Modal
						title={
							<Title className={'mb-0'} level={4}>
								{alertMessageType === 'loading'
									? 'Loading. Please wait...'
									: 'Shipping Groups'}
							</Title>
						}
						centered
						visible={modalVisibility}
						onCancel={() => setModalVisibility(false)}
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
								initialValues={locationDetail}
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
											rules={[
												{
													required: true,
													message: 'Nickname',
												},
											]}>
											<Input
												name='nickname'
												placeholder='Nickname'
												value={locationDetail.nickname}
												onChange={changeValue}
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
											label='Checkout Description'
											rules={[
												{
													required: true,
													message: 'Checkout Description',
												},
											]}>
											<Input
												name='checkout_description'
												placeholder='Checkout Description'
												value={
													locationDetail.checkout_description ||
													''
												}
												onChange={changeValue}
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
											label='Rate'
											rules={[
												{
													required: true,
													message: 'Rate',
												},
											]}>
											<Input
												type='number'
												min={0}
												name='rate'
												placeholder='Rate'
												value={locationDetail.rate}
												onChange={changeValue}
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
											label='Rate X Quantity'
											rules={[
												{
													required: true,
													message: 'Rate X Quantity',
												},
											]}>
											<Select
												defaultValue={true}
												value={
													locationDetail.rate_x_quantity ||
													false
												}
												onChange={val =>
													setLocationDetail(prevState => ({
														...prevState,
														rate_x_quantity: val,
													}))
												}>
												<Option value={true}>Yes</Option>
												<Option value={false}>No</Option>
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

					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>
							Shipping Group{' '}
							<Button
								type='primary'
								onClick={() => openLocationModal(1)}>
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
							// dataSource={warehouse ? addKeysToList(warehouse) : []}
							dataSource={addKeysToList(shipping_groups)}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>

			<Modal
				title='Confirm Delete'
				visible={warehouseDeleteModal}
				onOk={() =>
					deleteLocation(
						warehouseInfo.id,
						warehouseInfo.type,
						setDeleteWarehouseModal,
						token
					)
				}
				onCancel={() => setDeleteWarehouseModal(false)}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>Are you sure you want to delete this origin?</p>
			</Modal>
		</Fragment>
	)
}

export default WarehouseComponent
