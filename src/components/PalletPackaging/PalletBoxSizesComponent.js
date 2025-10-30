import React, { Fragment, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { EllipsisOutlined } from '@ant-design/icons'
import {
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Checkbox,
	Input,
	Table,
	Modal,
	Skeleton,
	Menu,
	Dropdown,
} from 'antd'
import {
	getBoxSizes,
	addBoxSize,
	deleteBoxSize,
	getProductBoxSizes,
	deleteProductBoxSize,
} from '../../Actions/BoxSizes'
import {
	handlingFeeMarkup,
	valueLimitAfterDecimal,
	blockInvalidChar,
} from '../../Utilities/numberValidation'

const { Title } = Typography

const initialState = {
	nickname: '',
	box_name: 'Merchant defined Box (default)',
	length: '',
	width: '',
	height: '',
	ext_height: '',
	max_weight: '',
	box_weight: '',
	box_fee: '',
	is_available: false,
	box_type: 4,
	weightWithPallet:'',
	heightWithPallet:''

}

const pattern = {
	pattern: /^\d+(\.\d{1,2})?$/,
	message: 'There must be two decimal places',
}

// Pattern for dimension fields: max 3 digits before decimal, max 3 digits after decimal
const dimensionPattern = {
	pattern: /^\d{1,3}(\.\d{1,3})?$/,
	message: 'Maximum 3 digits before decimal point and 3 digits after (e.g., 123.456)',
}

// Pattern for weight fields: max 4 digits before decimal, max 3 digits after decimal
const weightPattern = {
	pattern: /^\d{1,4}(\.\d{1,3})?$/,
	message: 'Maximum 4 digits before decimal point and 3 digits after (e.g., 1234.567)',
}

function BoxSizesComponent(props) {
	const [visible, setVisibleAddBox] = useState(false)
	const [boxSize, setBoxSize] = useState(initialState)
	const [loadBoxSize, setLoadBoxSize] = useState(false)
	const [boxType, setBoxType] = useState('')
	const [operation, setOperation] = useState(false)
	const [recordId, setRecordId] = useState(0)
	const [deleteBoxModal, setDeleteBoxModal] = useState(false)
	const dispatch = useDispatch()
	const [boxSizeForm] = Form.useForm()

	// Watch form values for real-time calculations
	const maxHeight = Form.useWatch('height', boxSizeForm)
	const palletHeight = Form.useWatch('ext_height', boxSizeForm)
	const maxWeight = Form.useWatch('max_weight', boxSizeForm)
	const palletWeight = Form.useWatch('box_weight', boxSizeForm)

	useEffect(() => {
		props.getBoxSizes(props.token)
		dispatch(getProductBoxSizes(props.token))
		// eslint-disable-next-line
	}, [dispatch])

	// Calculate and update Max Height w/ Pallet in real-time
	useEffect(() => {
		const height = parseFloat(maxHeight) || 0
		const extHeight = parseFloat(palletHeight) || 0
		const total = height + extHeight

		// Only update if the form is initialized
		if (boxSizeForm) {
			boxSizeForm.setFieldsValue({
				heightWithPallet: total > 0 ? total.toFixed(2) : ''
			})
		}
	}, [maxHeight, palletHeight, boxSizeForm])

	// Calculate and update Max Weight w/ Pallet in real-time
	useEffect(() => {
		const weight = parseFloat(maxWeight) || 0
		const boxWeight = parseFloat(palletWeight) || 0
		const total = weight + boxWeight

		// Only update if the form is initialized
		if (boxSizeForm) {
			boxSizeForm.setFieldsValue({
				weightWithPallet: total > 0 ? total.toFixed(2) : ''
			})
		}
	}, [maxWeight, palletWeight, boxSizeForm])

	const onFinish = values => {
		const { length, width, height, max_weight, box_weight, box_fee } = values
		let error = ''

		error += valueLimitAfterDecimal(length, 2, 'length')
		error += valueLimitAfterDecimal(width, 2, 'width')
		error += valueLimitAfterDecimal(height, 2, 'height')

		error += valueLimitAfterDecimal(max_weight, 3, 'max weight')
		error += valueLimitAfterDecimal(box_weight, 3, 'pallet weight')
		error += valueLimitAfterDecimal(box_fee, 3, 'pallet fee')

		if (error !== '') {
			if (error.includes('exploder')) error = error.split('exploder')[0]

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
					alertMessage: error,
					showAlertMessage: true,
					alertMessageType: 'error',
				},
			})
		} else {
			if (!operation) {
				props.addBoxSize(
					props.token,
					{
						...values,
						is_available: boxSize.is_available,
						box_name: values?.box_name ?? 'Pallet Box',
						box_type: 4,
					},
					'save_boxsize',
					'ADD_BOX_SIZE',
					setVisibleAddBox
				)
			} else {
				props.addBoxSize(
					props.token,
					{
						...values,
						is_available: boxSize.is_available,
						id: boxSize.id,
						box_type: 4,
						box_name: values?.box_name ?? 'Pallet Box',
					},
					'update_boxsize',
					'UPDATE_BOX_SIZE',
					setVisibleAddBox
				)
			}
		}
	}

	const editBoxSize = record => {
		setOperation(true)
		setLoadBoxSize(true)
		setBoxSize({ ...record })

		boxSizeForm.setFieldsValue(record)
		setVisibleAddBox(true)

		setTimeout(() => {
			setLoadBoxSize(false)
		}, 1000)
	}

	const confirmDeleteBox = id => {
		setRecordId(id)
		setDeleteBoxModal(true)
	}

	const limitInputLength = (maxLength) => (e) => {
		if (e.target.value.length > maxLength) {
			e.target.value = e.target.value.slice(0, maxLength)
		}
	}

	const actionMenu = (record) => (
		<Menu>
			<Menu.Item key="1" onClick={() => editBoxSize(record)}>
				Edit
			</Menu.Item>
			<Menu.Item key="2" onClick={() => {
				confirmDeleteBox(record.id)
				setBoxType('common box')
			}}>
				Delete
			</Menu.Item>
		</Menu>
	)

	const columns = [
		{
			title: 'Action',
			key: 'action',
			width: 80,
			render: (text, record) => (
				<Space size='middle'>
					<Dropdown overlay={actionMenu(record)} trigger={['hover']} placement="bottomRight">
						<Button type="text" icon={<EllipsisOutlined className="large-ellipsis-icon" />} />
					</Dropdown>
				</Space>
			),
		},
		{
			ellipsis: true,
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			ellipsis: true,
			key: 'length',
			title: 'Length (in)',
			dataIndex: 'length',
		},
		{
			ellipsis: true,
			key: 'width',
			title: 'Width (in)',
			dataIndex: 'width',
		},
		{
			ellipsis: true,
			key: 'height',
			title: 'Max Height (in)',
			dataIndex: 'height',
		},
		{
			ellipsis: true,
			key: 'ext_height',
			title: 'Pallet Height (in)',
			dataIndex: 'ext_height',
		},
		{
			ellipsis: true,
			key: 'maxWeight',
			title: 'Max Weight (LBS)',
			dataIndex: 'max_weight',
		},
		{
			ellipsis: true,
			key: 'palletWeight',
			title: 'Pallet Weight (LBS)',
			dataIndex: 'box_weight',
		},
		{
			ellipsis: true,
			key: 'palletFee',
			title: 'Pallet Fee (e.g 1.75)',
			dataIndex: 'box_fee',
		},
		{
			ellipsis: true,
			key: 'heightWithPallet',
			title: 'Max Height w/ Pallet',
			dataIndex: 'heightWithPallet',
		},
		{
			ellipsis: true,
			key: 'weightWithPallet',
			title: 'Max Weight w/ Pallet',
			dataIndex: 'weightWithPallet',
		},
		{
			key: 'available',
			title: 'Available',
			dataIndex: 'availability',
		},
	]

	return (
		<Fragment>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<div>
						<Row gutter={10} align='middle' justify='center'>
							<Col
								className='gutter-row'
								style={{ textAlign: 'right', marginBottom: '0' }}
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Button
									style={{ width: '100px' }}
									type='primary'
									onClick={() => {
										setBoxSize(initialState)
										setOperation(false)
										setVisibleAddBox(true)
										boxSizeForm.setFieldsValue(initialState)
									}}>
									Add Pallet
								</Button>
								<Modal
									title={
										<Title className={'mb-0'} level={4}>
											Pallet Properties
										</Title>
									}
									centered
									visible={visible}
									onCancel={() => setVisibleAddBox(false)}
									afterClose={() => setBoxSize(initialState)}
									destroyOnClose={true}
									footer={null}
									width={800}
									cancelButtonProps={{
										style: { display: 'none' },
									}}>
									{loadBoxSize ? (
										<Skeleton active />
									) : (
										<Form
											layout='vertical'
											name='add_box_sizes'
											className='form-wrp'
											size={'large'}
											initialValues={boxSize}
											form={boxSizeForm}
											onFinish={onFinish}>
											<Row gutter={30}>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Nickname'
														name='nickname'
														rules={[
															{
																required: true,
																message:
																	'Nickname is required',
															},
															{
																max: 30,
																message:
																	'Nickname length must be less than or equal to 30 characters.',
															},
														]}>
														<Input
															placeholder='Nickname'
															maxLength={30}
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Length (in)'
														name='length'
														rules={[
															{
																required: true,
																message:
																	'Length (in) is required',
															},
															dimensionPattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																blockInvalidChar
															}
															onInput={limitInputLength(7)}
															min='0'
															step='0.001'
															placeholder='Length (in)'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Width (in)'
														name='width'
														rules={[
															{
																required: true,
																message:
																	'Width (in) is required',
															},
															dimensionPattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															onInput={limitInputLength(7)}
															step='0.001'
															min={0}
															placeholder='Width (in)'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Max Height (in)'
														name='height'
														rules={[
															{
																required: true,
																message:
																	'Max Height (in) is required',
															},
															dimensionPattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															onInput={limitInputLength(7)}
															step='0.001'
															min={0}
															placeholder='Max Height (in)'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Pallet Height (in)'
														name='ext_height'
														rules={[
															dimensionPattern,
															{
																required: true,
																message:
																	'Pallet Height (in) is required',
															},
														]}>
														<Input
															type='number'
															onKeyDown={
																blockInvalidChar
															}
															onInput={limitInputLength(7)}
															min='0'
															step='0.001'
															placeholder='Pallet Height (in)'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Max Weight (LBS)'
														name='max_weight'
														rules={[
															{
																required: true,
																message:
																	'Max Weight (LBS) is required',
															},
															weightPattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															onInput={limitInputLength(8)}
															step='0.001'
															min={0}
															placeholder='Max Weight'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Pallet Weight (LBS)'
														name='box_weight'
														rules={[
															{
																required: true,
																message:
																	'Pallet Weight (LBS) is required',
															},
															weightPattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															onInput={limitInputLength(8)}
															step='0.001'
															min={0}
															placeholder='Pallet Weight'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Pallet Fee (e.g 1.75)'
														name='box_fee'
														rules={[
															pattern,
															{
																validator: (_, value) => {
																	if (value && (value < 0 || value > 10000)) {
																		return Promise.reject(new Error('Pallet Fee must be between 0 and 10000'))
																	}
																	return Promise.resolve()
																}
															}
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															onInput={limitInputLength(5)}
															step='0.01'
															min={0}
															max={10000}
															placeholder='Pallet Fee'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Max Height w/ Pallet'
														name='heightWithPallet'
														rules={[pattern]}>
														<Input
															type='number'
															disabled
															placeholder='Max Height w/ Pallet'
														/>
													</Form.Item>
												</Col>

												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Max Weight w/ Pallet'
														name='weightWithPallet'
														rules={[pattern]}>
														<Input
															type='number'
															disabled
															placeholder='Max Weight w/ Pallet'
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
													<Form.Item name='is_available'>
														<Checkbox
															onChange={e =>
																setBoxSize({
																	...boxSize,
																	is_available:
																		e.target
																			.checked,
																})
															}
															checked={
																boxSize.is_available
																	? true
																	: false
															}>
															Is Available
														</Checkbox>
													</Form.Item>
												</Col>
											</Row>
											<Row
												gutter={30}
												align='middle'
												className={'mt-3'}>
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
							</Col>
						</Row>
						<Table
							className={'custom-table mt-3'}
							dataSource={
								props.boxSizes
									? props.boxSizes?.filter(
											bs => +bs?.box_type === 4
									  )
									: []
							}
							columns={columns}
						/>
					</div>
				</Col>
			</Row>

			<Modal
				title='Confirm Delete'
				visible={deleteBoxModal}
				onOk={() => {
					if (boxType === 'common box') {
						props.deleteBoxSize(recordId, props.token, setDeleteBoxModal)
					} else if (boxType === 'product box') {
						dispatch(
							deleteProductBoxSize(
								recordId,
								props.token,
								setDeleteBoxModal
							)
						)
					}
				}}
				onCancel={() => setDeleteBoxModal(false)}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>Are you sure you want to delete the pallet?</p>
			</Modal>
		</Fragment>
	)
}

const mapStateToProps = state => ({
	token: state.token,
	boxSizes: state.boxSizes,
	installedAddons: state.installedAddons,
	sbsPlans: state.sbsPlans,
})

const mapDispatchToProps = dispatch => ({
	addBoxSize: (token, boxSize, url, type, setVisibleAddBox) =>
		dispatch(addBoxSize(token, boxSize, url, type, setVisibleAddBox)),
	getBoxSizes: token => dispatch(getBoxSizes(token)),
	deleteBoxSize: (id, token, setDeleteBoxModal) =>
		dispatch(deleteBoxSize(id, token, setDeleteBoxModal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BoxSizesComponent)
