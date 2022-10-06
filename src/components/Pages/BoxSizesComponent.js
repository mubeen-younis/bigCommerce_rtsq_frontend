import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {upsBoxTypes, boxDiscription } from '../../Utilities/constants'
import { Link } from 'react-router-dom'
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Checkbox,
	Input,
	Table,
	Divider,
	Modal,
	Skeleton,
} from 'antd'

import {
	getBoxSizes,
	addBoxSize,
	deleteBoxSize,
	getProductBoxSizes,
	addProductNewBoxSize,
	deleteProductBoxSize,
} from '../../Actions/BoxSizes'
// import addKeysToList from '../../Utilities/addKey'
import {
	handlingFeeMarkup,
	valueLimit,
	valueLimitAfterDecimal,
	blockInvalidChar,
} from '../../Utilities/numberValidation'

const { Option } = Select
const { Title } = Typography

const initialState = {
	nickname: '',
	box_name: 'Merchant defined Box (default)',
	length: '',
	width: '',
	height: '',
	max_weight: '',
	ext_length: '',
	ext_width: '',
	ext_height: '',
	box_weight: '',
	box_fee: '',
	is_available: false,
	box_type: 1,
}

const productBoxInitialState = {
	quantity: '',
	nickname: '',
	length: '',
	width: '',
	height: '',
	weight: '',
	box_fee: '',
}

const boxTypes = [
	{ label: 'Fedex Envelope (9.5 x 12.5)', id: 'FEDEX_ENVELOPE__19-5_12-5_0-5-1' },
	{
		label: 'Fedex Reusable Envelope (9.5 x 15.5)',
		id: 'FEDEX_ENVELOPE__19-5_12-5_0-5-2',
	},
	{
		label: 'Fedex Pak - Small (10.25 x 12.75 x 1.5)',
		id: 'FEDEX_PAK__10-25_12-75_1-5-1',
	},
	{ label: 'Fedex Pak - Large (12 x 15.5 x 1.5)', id: 'FEDEX_PAK__12_15-5_1-5-2' },
	{
		label: 'Fedex Pak - Padded (11.75 x 14.75 x 1.25)',
		id: 'FEDEX_PAK__11-75_14-75_1-25-1',
	},
	{
		label: 'Fedex Pak - Reusable (10 x 14.5 x 1.25)',
		id: 'FEDEX_PAK__10_14-5_1-25-1',
	},
	{
		label: 'Fedex Small Box (10.875 x 1.5 x 12.375)',
		id: 'FEDEX_SMALL_BOX__10-875_1-5_12-375_1',
	},
	{
		label: 'Fedex Small Box (8.75 x 2.625 x 11.25)',
		id: 'FEDEX_SMALL_BOX__8-75_2-625_11-25_2',
	},
	{
		label: 'Fedex Medium Box (11.5 x 2.375 x 13.25)',
		id: 'FEDEX_MEDIUM_BOX__11-5_2-375_13-25_1',
	},
	{
		label: 'Fedex Medium Box (8.75 x 4.375 x 11.25)',
		id: 'FEDEX_MEDIUM_BOX__8-75_4-375_11-25_2',
	},
	{
		label: 'Fedex Large Box (12.375 x 3 x 17.5)',
		id: 'FEDEX_LARGE_BOX__12-375_3_17-5_1',
	},
	{
		label: 'Fedex Large Box (8.75 x 7.75 x 11.25)',
		id: 'FEDEX_LARGE_BOX__8-75_7-75_11-25_2',
	},
	{
		label: 'Fedex Extra Large Box (11.875 x 10.75 x 11)',
		id: 'FEDEX_EXTRA_LARGE_BOX__11-875_10-75_11_1',
	},
	{
		label: 'Fedex Extra Large Box (15.75 x 14.125 x 6)',
		id: 'FEDEX_EXTRA_LARGE_BOX__15-75_14-125_6_2',
	},
]

const uspsBoxTypes = [
	{
		lable: 'Merchant defined Box (default)',
		id: 'Merchant defined Box (default)',
	},
	{ lable: 'USPS Priority Mail Box', id: 'UPMB' },
	{ lable: 'USPS Priority Mail Express Box', id: 'UMEB' },
	{ lable: 'USPS Priority Mail Large Flat Rate Box', id: 'UFLAT' },
	{ lable: 'USPS Priority Mail Medium Flat Rate Box', id: 'UFLAT' },
	{ lable: 'USPS Priority Mail Small Flat Rate Box', id: 'UFLAT' },
	{ lable: 'USPS Priority Mail Padded Flat Rate Envelope', id: 'UFLAT' },
]

const pattern = {
	pattern: /^\d+(\.\d{1,2})?$/,
	message: 'There must be two decimal places',
}

function BoxSizesComponent(props) {
	const [visible, setVisibleAddBox] = useState(false)
	const [boxSize, setBoxSize] = useState(initialState)
	const [productBoxSize, setProductBoxSize] = useState(productBoxInitialState)
	const [productBoxVisible, setProductBoxVisible] = useState(false)
	const [loadBoxSize, setLoadBoxSize] = useState(false)
	const [boxType, setBoxType] = useState('')
	const [discription, setDiscription] = useState({})
	const [operation, setOperation] = useState(false)
	const [recordId, setRecordId] = useState(0)
	const [deleteBoxModal, setDeleteBoxModal] = useState(false)
	const dispatch = useDispatch()
	const { productBoxes, isFedexSmallCarrier, isUspsSmallCarrier, isUpsSmallCarrier} = useSelector(
		state => state
	)
	const [boxSizeForm] = Form.useForm()

	useEffect(() => {
		props.getBoxSizes(props.token)
		dispatch(getProductBoxSizes(props.token))
		// eslint-disable-next-line
	}, [dispatch])

	const populateBoxValues = useCallback(
		(box_id = '') => {
			if (box_id === 'Merchant defined Box (default)') {
				setBoxSize(prevState => ({
					...initialState,
					...prevState,
				}))
				boxSizeForm.setFieldsValue({
					...initialState,
				})
			} else {
				const { label } = boxTypes.filter(bt => bt.id === box_id)[0]
				const dimensions = label
					.substring(label.indexOf('(') + 1, label.indexOf(')'))
					.replaceAll(' ', '')
					.split('x')

				let height = '0.5',
					max_weight = '10'

				if (dimensions.length > 2) {
					height = dimensions[2]
					max_weight = '50'
				}

				const newValues = {
					nickname: label.substring(0, label.indexOf('(') - 1),
					length: dimensions[0],
					width: dimensions[1],
					height,
					max_weight,
					box_weight: 0,
					box_name: box_id,
				}

				setBoxSize(prevState => ({
					...prevState,
					...newValues,
				}))

				boxSizeForm.setFieldsValue(newValues)
			}
		},
		[boxSizeForm]
	)

	const upsBoxInfo = useCallback(
		(box_id = '') => {
			setDiscription(boxDiscription[box_id])
		},
		[]
	)

	const setDiscriptionText = 
		<>
			<span>{discription?.dimensions}</span><br/>
			<span>{discription?.cb_dimensions}</span><br/>
			<span>{discription?.size_samples}</span>
		</>

	const setUspsBoxFields = useCallback((val = '', opt) => {
		boxSizeForm.setFieldsValue({
			nickname: String(opt.children),
			length: 0,
			width: 0,
			height: 0,
		})
	}, [])

	const onFinish = values => {
		const {
			length,
			width,
			height,
			ext_length,
			ext_width,
			ext_height,
			max_weight,
			box_weight,
			box_fee,
		} = values
		let error = ''
		error = valueLimit(length, 108, 'interior length')
		error += valueLimit(width, 108, 'interior width')
		error += valueLimit(height, 108, 'interior height')
		error = valueLimit(ext_length, 108, 'exterior length')
		error += valueLimit(ext_width, 108, 'exterior width')
		error += valueLimit(ext_height, 108, 'exterior height')

		error += valueLimit(max_weight, 150, 'max weight')

		error += valueLimitAfterDecimal(length, 2, 'interior length')
		error += valueLimitAfterDecimal(width, 2, 'interior width')
		error += valueLimitAfterDecimal(height, 2, 'interior height')
		error += valueLimitAfterDecimal(ext_length, 2, 'exterior length')
		error += valueLimitAfterDecimal(ext_width, 2, 'exterior width')
		error += valueLimitAfterDecimal(ext_height, 2, 'exterior height')

		error += valueLimitAfterDecimal(max_weight, 3, 'max weight')
		error += valueLimitAfterDecimal(box_weight, 3, 'box weight')
		error += valueLimitAfterDecimal(box_fee, 3, 'box fee')

		if (+ext_length && +length > +ext_length)
			error = 'Interior length cannot be greater than exterior length'
		if (+ext_width && +width > +ext_width)
			error = 'Interior width cannot be greater than exterior width'
		if (+ext_height && +height > +ext_height)
			error = 'Interior height cannot be greater than exterior height'

		const limit = 165
		const int_girth = 2 * (+width + +height) + +length
		if (int_girth > limit)
			error = 'Interior length plus girth cannot exceed ' + limit + '.'

		if (+ext_height && +ext_length && +ext_width) {
			const ext_girth = 2 * (+ext_width + +ext_height) + +ext_length
			if (ext_girth > limit)
				error = 'Exterior length plus girth cannot exceed ' + limit + '.'
		}

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
			if (isUspsSmallCarrier) {
				values['box_name'] = values?.box_name?.replace(/[0-9]/, '')
			}
			const boxType =
				values?.box_name === 'Merchant defined Box (default)'
					? 1
					: (isFedexSmallCarrier && 2) || (isUspsSmallCarrier && 3) || (isUpsSmallCarrier && 5)
			if (!operation) {
				props.addBoxSize(
					props.token,
					{
						...values,
						is_available: boxSize.is_available,
						box_type: boxType,
						box_name: values?.box_name,
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
						box_type: boxType,
						box_name: values?.box_name,
					},
					'update_boxsize',
					'UPDATE_BOX_SIZE',
					setVisibleAddBox
				)
			}
		}
		//setVisibleAddBox(false);
	}

	const addProductBoxSize = useCallback(
		values => {
			let error = valueLimit(values?.length, 108, 'length')
			error += valueLimit(values?.width, 108, 'width')
			error += valueLimit(values?.height, 108, 'height')
			error += valueLimit(values?.weight, 150, 'weight')

			error += valueLimitAfterDecimal(values?.length, 3, 'length')
			error += valueLimitAfterDecimal(values?.width, 3, 'width')
			error += valueLimitAfterDecimal(values?.height, 3, 'height')
			error += valueLimitAfterDecimal(values?.weight, 3, 'weight')

			error += valueLimitAfterDecimal(values?.box_fee, 3, 'box fee')

			if (error !== '') {
				error = error.split('exploder')[0]
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
					dispatch(
						addProductNewBoxSize(
							props.token,
							{ ...values, product_id: recordId },
							'addmultiplepackages',
							'ADD_PRODUCT_BOX_SIZE',
							setProductBoxVisible
						)
					)
				} else {
					dispatch(
						addProductNewBoxSize(
							props.token,
							{ ...productBoxSize, ...values, product_id: recordId },
							'updatemultiplepackages',
							'ADD_PRODUCT_BOX_SIZE',
							setProductBoxVisible
						)
					)
				}
			}
		},
		[dispatch, operation, productBoxSize, props.token, recordId]
	)

	const editBoxSize = record => {
		setOperation(true)
		setLoadBoxSize(true)
		setBoxSize({ ...record })

		if (['UMEB', 'UPMB', 'UFLAT'].includes(record?.box_name)) {
			let index = 0
			for (const key in uspsBoxTypes) {
				if (uspsBoxTypes[key].lable === record.nickname) {
					index = key
					break
				}
			}

			let box_name = record.box_name + index
			boxSizeForm.setFieldsValue({
				...record,
				box_name,
			})
		} else {
			boxSizeForm.setFieldsValue(record)
		}
		boxSizeForm.setFieldsValue(record)
		setVisibleAddBox(true)

		setTimeout(() => {
			setLoadBoxSize(false)
		}, 1000)
	}

	const editProductBoxSize = record => {
		setOperation(true)
		setLoadBoxSize(true)
		setProductBoxSize(record)
		setProductBoxVisible(true)

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
			title: 'Interior Length(in)',
			dataIndex: 'length',
		},
		{
			key: 'width',
			title: 'Interior Width(in)',
			dataIndex: 'width',
		},
		{
			key: 'height',
			title: 'Interior Height(in)',
			dataIndex: 'height',
		},
		{
			key: 'ext_length',
			title: 'Exterior Length(in)',
			dataIndex: 'ext_length',
		},
		{
			key: 'ext_width',
			title: 'Exterior Width(in)',
			dataIndex: 'ext_width',
		},
		{
			key: 'ext_height',
			title: 'Exterior Height(in)',
			dataIndex: 'ext_height',
		},
		{
			key: 'maxWeight',
			title: 'Max Weight (LBS)',
			dataIndex: 'max_weight',
		},
		{
			key: 'boxWeight',
			title: 'Box Weight(LBS)',
			dataIndex: 'box_weight',
		},

		{
			key: 'available',
			title: 'Available',
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
						onClick={
							() => {
								confirmDeleteBox(record.id)
								setBoxType('common box')
							} /*props.deleteBoxSize(record.id, props.token)*/
						}>
						Delete
					</a>
				</Space>
			),
		},
	]

	const productBoxescolumns = [
		{
			key: 'quantity',
			title: 'Quantity',
			dataIndex: 'quantity',
		},
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			key: 'length',
			title: 'Length(in)',
			dataIndex: 'length',
		},
		{
			key: 'width',
			title: 'Width(in)',
			dataIndex: 'width',
		},
		{
			key: 'height',
			title: 'Height(in)',
			dataIndex: 'height',
		},
		{
			key: 'Weight',
			title: 'Weight (LBS)',
			dataIndex: 'weight',
		},
		{
			key: 'actions',
			title: 'Actions',
			render: (text, record) => (
				<Space size='middle'>
					<a
						href='#!'
						onClick={() => {
							editProductBoxSize(record)
							setRecordId(record.product_id)
						}}>
						Edit
					</a>
					<a
						href='#!'
						className={'btn-danger'}
						onClick={
							() => {
								confirmDeleteBox(record.id)
								setBoxType('product box')
							}
							/*props.deleteBoxSize(record.id, props.token)*/
						}>
						Delete
					</a>
				</Space>
			),
		},
	]

	const addonCheck = props.installedAddons.find(
		add => add.name === 'Standard Box Sizes'
	)

	return !addonCheck ? (
		<h1>
			Click <Link to='/'>here</Link> to add the {addonCheck?.name} add-on.
		</h1>
	) : (
		<Fragment>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<div>
						{/* <Form.Item className={'mb-2'}>
							<Checkbox
								onChange={e => setCheckEnable(!checkEnable)}
								name='check_enable'
								checked={checkEnable}
							>
								Enable
							</Checkbox>
						</Form.Item>
						<p>Current usage: $0.00 / $60.00 (0.00%)</p>
						<Row gutter={10} align='middle' justify='center'>
							<Col className='gutter-row' xs={24} sm={4} md={4} lg={4} xl={4}>
								Crapped amount: $
							</Col>
							<Col className='gutter-row' xs={24} sm={5} md={5} lg={5} xl={5}>
								<Form.Item className={'mb-0'} name='crapped_amount'>
									<Input />
								</Form.Item>
							</Col>
							<Col className='gutter-row' xs={24} sm={15} md={15} lg={15} xl={15}>
								Cost: 3 cent per calculation
							</Col>
						</Row>
						<Row gutter={10} align='middle' justify='center'>
							<Col className='gutter-row mt-3' xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
									<Space>
										<Button style={{ width: '100px' }} type='primary' htmlType='submit'>
											Save
										</Button>
									</Space>
								</Form.Item>
							</Col>
						</Row>

						<Divider /> */}

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
									Add Box
								</Button>
								<Modal
									title={
										<Title className={'mb-0'} level={4}>
											Box Size
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
													lg={24}
													xl={24}>
													<Form.Item
														className={'mb-2'}
														label='Nickname'
														name='nickname'
														rules={[
															{
																required: true,
																message:
																	'Nickname Required',
															},
														]}>
														<Input placeholder='Nickname' />
													</Form.Item>
												</Col>
												<>
													{isFedexSmallCarrier ? (
														<Col
															className='gutter-row'
															xs={24}
															sm={24}
															md={24}
															lg={24}
															xl={24}>
															<Form.Item
																className={'mb-2'}
																label='Box Type'
																name='box_name'
																rules={[
																	{
																		required: true,
																		message:
																			'Box Type Required',
																	},
																]}>
																<Select
																	//defaultValue='Merchant defined Box (default)'
																	//name='box_name'
																	onChange={opt =>
																		populateBoxValues(
																			opt
																		)
																	}>
																	<Option value='Merchant defined Box (default)'>
																		Merchant
																		defined Box
																		(default)
																	</Option>
																	{boxTypes.map(
																		bt => (
																			<Option
																				value={
																					bt.id
																				}
																				key={
																					bt.id
																				}>
																				{
																					bt.label
																				}
																			</Option>
																		)
																	)}
																</Select>
															</Form.Item>
														</Col>
													) : isUpsSmallCarrier ? (
														<>
														<Col
															className='gutter-row'
															xs={24}
															sm={24}
															md={24}
															lg={24}
															xl={24}>
															<Form.Item
																className={'mb-2'}
																label='Box Type'
																name='box_name'
																rules={[
																	{
																		required: true,
																		message:
																			'Box Type Required',
																	},
																]}>
																<Select
																	//defaultValue='Merchant defined Box (default)'
																	//name='box_name'
																	onChange={opt =>
																		upsBoxInfo(
																			opt
																		)
																	}>
																	<Option value='Merchant defined Box (default)'>
																		Merchant
																		defined Box
																		(default)
																	</Option>
																	{upsBoxTypes.map(
																		bt => (
																			<Option
																				value={
																					bt.id
																				}
																				key={
																					bt.id
																				}>
																				{
																					bt.label
																				}
																			</Option>
																		)
																	)}
																</Select>
															</Form.Item>
														</Col>
														{discription?.dimensions && discription?.dimensions?.length > 0 && <Col
														className='gutter-row note-bx'
															xs={24}
															sm={24}
															md={24}
															lg={24}
															xl={24}>
															<Form.Item>
																{setDiscriptionText}
															</Form.Item>
														</Col>
														}
														</>
													) : isUspsSmallCarrier ? (
														<Col
															className='gutter-row'
															xs={24}
															sm={24}
															md={24}
															lg={24}
															xl={24}>
															<Form.Item
																className={'mb-2'}
																label='Box Type'
																name='box_name'
																rules={[
																	{
																		required: true,
																		message:
																			'Box Type Required',
																	},
																]}>
																<Select
																	defaultValue='Merchant defined Box (default)'
																	name='box_name'
																	onChange={(
																		val,
																		opt
																	) =>
																		setUspsBoxFields(
																			val,
																			opt
																		)
																	}>
																	{uspsBoxTypes.map(
																		(bt, i) => (
																			<Option
																				value={
																					bt.id +
																					i
																				}
																				key={
																					bt.id +
																					i
																				}>
																				{
																					bt.lable
																				}
																			</Option>
																		)
																	)}
																</Select>
															</Form.Item>
														</Col>
													) : (
														<Col
															className='gutter-row'
															xs={24}
															sm={24}
															md={24}
															lg={24}
															xl={24}>
															<Form.Item
																className={'mb-2'}
																label='Box Type'
																name='box_name'
																rules={[
																	{
																		required: true,
																		message:
																			'Box Type Required',
																	},
																]}>
																<Select
																	//defaultValue='Merchant defined Box (default)'
																	name='box_name'>
																	<Option value='Merchant defined Box (default)'>
																		Merchant
																		defined Box
																		(default)
																	</Option>
																</Select>
															</Form.Item>
														</Col>
													)}
												</>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}>
													<Form.Item
														className={'mb-2'}
														label='Interior Length (in)'
														name='length'
														rules={[
															{
																required: true,
																message:
																	'Interior Length Required',
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
															placeholder='Interior Length (in)'
															//pattern='[0-9.?(0-9){2}?]+%?$'
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
														label='Interior Width (in)'
														name='width'
														rules={[
															{
																required: true,
																message:
																	'Interior Width Required',
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
															placeholder='Interior Width (in)'
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
														label='Interior Height (in)'
														name='height'
														rules={[
															{
																required: true,
																message:
																	'Interior Height Required',
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
															placeholder='Interior Height (in)'
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
														label='Exterior Length (in)'
														name='ext_length'
														rules={[pattern]}>
														<Input
															type='number'
															onKeyDown={
																blockInvalidChar
															}
															min='0'
															step='0.01'
															placeholder='Exterior Length (in)'
															//pattern='[0-9.?(0-9){2}?]+%?$'
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
														label='Exterior Width (in)'
														name='ext_width'
														rules={[pattern]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
															min={0}
															placeholder='Exterior Width (in)'
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
														label='Exterior Height (in)'
														name='ext_height'
														rules={[pattern]}>
														<Input
															type='number'
															onKeyDown={
																handlingFeeMarkup
															}
															step='0.01'
															min={0}
															placeholder='Exterior Height (in)'
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
																	'Max Weight Required',
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
														label='Box Weight (LBS)'
														name='box_weight'
														rules={[
															{
																required: true,
																message:
																	'Box Weight Required',
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
															placeholder='Box Weight'
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
														label='Box Fee (e.g 1.75)'
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
															placeholder='Box Fee'
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
															//name='is_available'
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
									? props.boxSizes /*addKeysToList(props.boxSizes) */
									: []
							}
							columns={columns}
						/>

						<Modal
							title={
								<Title className={'mb-0'} level={4}>
									Product Box Size
								</Title>
							}
							centered
							visible={productBoxVisible}
							onCancel={() => {
								setVisibleAddBox(false)
								setProductBoxVisible(false)
								setRecordId(null)
							}}
							afterClose={() => {
								setBoxSize(initialState)
								setProductBoxSize(productBoxInitialState)
								setRecordId(null)
							}}
							destroyOnClose={true}
							footer={null}
							width={800}
							cancelButtonProps={{ style: { display: 'none' } }}>
							{loadBoxSize ? (
								<Skeleton active />
							) : (
								<Form
									layout='vertical'
									name='add_box_sizes'
									className='form-wrp'
									size={'large'}
									onFinish={addProductBoxSize}
									initialValues={productBoxSize}>
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
												label='Quantity'
												name='quantity'
												rules={[
													{
														required: true,
														message: 'Quantity Required',
													},
												]}>
												<Input
													type='number'
													step='1'
													min='1'
													placeholder='Quantity'
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
												className={'mb-2'}
												label='Nickname'
												name='nickname'
												rules={[
													{
														required: true,
														message: 'Nickname Required',
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
											lg={12}
											xl={12}>
											<Form.Item
												className={'mb-2'}
												label='Length (in)'
												name='length'
												rules={[
													{
														required: true,
														message: 'Length Required',
													},
													pattern,
												]}>
												<Input
													type='number'
													onKeyDown={blockInvalidChar}
													min='0'
													step='0.01'
													placeholder='Length (in)'
													//pattern='[0-9.?(0-9){2}?]+%?$'
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
														message: 'Width Required',
													},
													pattern,
												]}>
												<Input
													type='number'
													onKeyDown={handlingFeeMarkup}
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
												name='height'
												rules={[
													{
														required: true,
														message: 'Height Required',
													},
													pattern,
												]}>
												<Input
													type='number'
													onKeyDown={handlingFeeMarkup}
													step='0.01'
													min={0}
													placeholder='Height (in)'
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
												label='Weight (LBS)'
												name='weight'
												rules={[
													{
														required: true,
														message: 'Weight Required',
													},
													pattern,
												]}>
												<Input
													type='number'
													onKeyDown={handlingFeeMarkup}
													step='0.01'
													min={0}
													placeholder='Weight (pounds)'
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
												label='Box Fee (e.g 1.75)'
												name='box_fee'
												rules={[pattern]}>
												<Input
													type='number'
													onKeyDown={handlingFeeMarkup}
													step='0.01'
													maxLength='7'
													min={0}
													placeholder='Box Fee'
												/>
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

						<Title level={5}>Items that ship as multiple packages</Title>
						<p>
							In order for an item to appear below, it must have the{' '}
							<b>This item ships as multiple packages</b> setting
							enabled on its Product Settings
						</p>
						<br />

						{productBoxes?.map(pb => (
							<Fragment>
								<h3>SKU: {pb.sku} </h3>
								<p>{pb.name} </p>

								{pb?.boxes && pb?.boxes?.length > 0 && (
									<Table
										className={'custom-table mt-3'}
										dataSource={pb.boxes}
										columns={productBoxescolumns}
										pagination={false}
									/>
								)}
								<br />
								<Button
									style={{ width: '100px' }}
									type='primary'
									onClick={() => {
										setProductBoxVisible(true)
										setOperation(false)
										setRecordId(pb.id)
									}}>
									Add Box
								</Button>

								<Divider />
							</Fragment>
						))}
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
				<p>Are you sure you want to delete the box?</p>
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
