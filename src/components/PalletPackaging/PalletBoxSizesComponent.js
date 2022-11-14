import React, { Fragment, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
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
}

const pattern = {
	pattern: /^\d+(\.\d{1,2})?$/,
	message: 'There must be two decimal places',
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

	useEffect(() => {
		props.getBoxSizes(props.token)
		dispatch(getProductBoxSizes(props.token))
		// eslint-disable-next-line
	}, [dispatch])

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

	const columns = [
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			key: 'length',
			title: 'Length (in)',
			dataIndex: 'length',
		},
		{
			key: 'width',
			title: 'Width (in)',
			dataIndex: 'width',
		},
		{
			key: 'ext_height',
			title: 'Height (in)',
			dataIndex: 'ext_height',
		},
		{
			key: 'palletWeight',
			title: 'Pallet Weight (LBS)',
			dataIndex: 'box_weight',
		},
		{
			key: 'height',
			title: 'Max Height (in)',
			dataIndex: 'height',
		},
		{
			key: 'maxWeight',
			title: 'Max Weight (LBS)',
			dataIndex: 'max_weight',
		},
		{
			key: 'palletFee',
			title: 'Pallet Fee (e.g 1.75)',
			dataIndex: 'box_fee',
		},
		{
			key: 'available',
			title: 'Is Available',
			dataIndex: 'availability',
		},
		{
			key: 'actions',
			title: 'Actions',
			render: (text, record) => (
				<Space size='middle'>
					<a href='#!' onClick={() => editBoxSize(record)}>
						Edit
					</a>
					<a
						href='#!'
						className={'btn-danger'}
						onClick={() => {
							confirmDeleteBox(record.id)
							setBoxType('common box')
						}}>
						Delete
					</a>
				</Space>
			),
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
															pattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																blockInvalidChar
															}
															min='0'
															step='0.01'
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
															pattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
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
														label='Height (in)'
														name='ext_height'
														rules={[
															pattern,
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
															min='0'
															step='0.01'
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
														label='Pallet Weight (LBS)'
														name='box_weight'
														rules={[
															{
																required: true,
																message:
																	'Pallet Weight (LBS) is required',
															},
															pattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
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
														label='Max Height (in)'
														name='height'
														rules={[
															{
																required: true,
																message:
																	'Max Height (in) is required',
															},
															pattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
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
														label='Max Weight (LBS)'
														name='max_weight'
														rules={[
															{
																required: true,
																message:
																	'Max Weight (LBS) is required',
															},
															pattern,
														]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
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
														label='Pallet Fee (e.g 1.75)'
														name='box_fee'
														rules={[pattern]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
															maxLength='7'
															min={0}
															placeholder='Pallet Fee'
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
