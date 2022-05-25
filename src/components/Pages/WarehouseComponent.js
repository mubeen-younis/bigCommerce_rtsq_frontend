import React, { Fragment, useCallback, useState } from 'react'
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
	Checkbox,
	Table,
	Tooltip,
	Skeleton,
} from 'antd'
import { connect, useDispatch } from 'react-redux'
import { postData } from '../../Actions/Action'
import addKeysToList from './../../Utilities/addKey'
import {
	handleKeyDownDecimalNumber,
	checkDigitsAfterDecimal,
	handleKeyPhoneNumber,
	handleKeyAddress,
} from './../../Utilities/numberValidation'

import {
	getGoogleResponse,
	getWarehouse,
	deleteLocation,
} from '../../Actions/Warehouse'
import axios from 'axios'

const { Title } = Typography
const initialState = {
	enable_instore: false,
	enable_ld: false,
	instore_zipcodes: [],
	ld_zipcodes: [],
	default_location: 'default',
	location_type: 0,
}
const requiredMark = (
	<span
		style={{
			color: '#ff4d4f',
		}}>
		{' '}
		*
	</span>
)

function WarehouseComponent(props) {
	const [getLocationOn, setGetLocationOn] = useState(false)
	const [visible1, setVisibleWarehouse] = useState(false)
	const [warehouseDeleteModal, setDeleteWarehouseModal] = useState(false)
	const [warehouseInfo, setWarehouseInfo] = useState({
		id: null,
		type: null,
	})
	const [locationDetail, setLocationDetail] = useState(initialState)
	const [city, setCity] = useState('')
	const [originRatesCity, setOriginRatesCity] = useState([])
	const [, setAction] = useState('')
	const [locationId, setLocationId] = useState(null)
	const dispatch = useDispatch()
	const {
		postData,
		getGoogleResponse,
		showAlertMessage,
		alertMessageType,
		alertMessage,
		googleLocationResponse,
		getWarehouse,
		deleteLocation,
		warehouse,
		dropships,
		token,
		// plansInfo,
	} = props
	const [form] = Form.useForm()

	const onFinish = values => {
		let data = city.length
			? { ...locationDetail, city, location_id: locationDetail['id'] }
			: { ...locationDetail, location_id: locationDetail['id'] }
		let error = false
		let errormsg = ''
		if (data?.enable_ld === true) {
			if (
				(data?.ld_miles === undefined || data?.ld_miles === '') &&
				(data?.ld_zipcodes === undefined || data?.ld_zipcodes?.length === 0)
			) {
				error = true
				errormsg =
					'Local delivery is enabled you must enter miles or postal codes.'
			} else if (data?.ld_fee === '' || data?.ld_fee === undefined) {
				error = true
				errormsg =
					'Local delivery is enabled you must enter local delivery fee.'
			}
		}
		if (
			data?.enable_instore === true &&
			(data?.instore_miles === undefined || data?.instore_miles === '') &&
			(data?.instore_zipcodes === undefined ||
				data?.instore_zipcodes?.length === 0)
		) {
			error = true
			errormsg =
				'In-store pick up is enabled you must enter miles or postal codes.'
		} else if (checkDigitsAfterDecimal(data?.instore_miles, 2)) {
			error = true
			errormsg =
				'In-store pick up miles only 2 digits are allowed after decimal point.'
		} else if (checkDigitsAfterDecimal(data?.ld_miles, 2)) {
			error = true
			errormsg =
				'Local delivery miles only 2 digits are allowed after decimal point.'
		} else if (
			data?.ld_fee !== undefined &&
			checkDigitsAfterDecimal(data?.ld_fee, 2)
		) {
			error = true
			errormsg =
				'Local delivery fees only 2 digits are allowed after decimal point.'
		}
		if (error === true) {
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
			postData(
				data,
				'SAVE_LOCATION',
				'save_location',
				token,
				setVisibleWarehouse
			)
		}
	}

	if (
		showAlertMessage &&
		alertMessageType === 'error' &&
		alertMessage.includes('Zero') &&
		getLocationOn
	) {
		setLocationDetail({
			...locationDetail,
			city: '',
			state: '',
			country: '',
			instore_city: '',
			instore_state: '',
			instore_country: '',
		})

		setGetLocationOn(false)
	}

	if (alertMessageType !== 'loading' && googleLocationResponse && getLocationOn) {
		let city = ''

		if (googleLocationResponse.city.length > 1) {
			city = googleLocationResponse.city
			setCity(googleLocationResponse.city[0])
		} else {
			city = googleLocationResponse.city[0]
			setCity('')
		}

		setLocationDetail({
			...locationDetail,
			city,
			state: googleLocationResponse.state,
			country: googleLocationResponse.country,
		})
		setGetLocationOn(false)
	}

	const getGoogleLocation = zip_code => {
		if (zip_code.length > 4) {
			getGoogleResponse(zip_code, token, setGetLocationOn)
		}

		setGetLocationOn(false)
	}

	const openLocationModal = location_type => {
		setLocationDetail({
			location_type: location_type,
		})
		setVisibleWarehouse(true)
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
		setVisibleWarehouse(true)

		getWarehouse(data.id, setLocationDetail, setVisibleWarehouse, props.token)
	}

	const changeValue = e => {
		setLocationDetail({
			...locationDetail,
			[e.target.name]: e.target.value,
		})
	}

	const handleChange = (name, tags) => {
		setLocationDetail({
			...locationDetail,
			[name]: tags,
		})
	}

	const columns = [
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		/*{
			key: 'address',
			title: 'Street address',
			dataIndex: 'address',
		},*/
		{
			key: 'city',
			title: 'City',
			dataIndex: 'city',
		},
		{
			key: 'state',
			title: 'State',
			dataIndex: 'state',
		},
		{
			key: 'zip_code',
			title: 'Zip',
			dataIndex: 'zip_code',
		},
		{
			key: 'Country',
			title: 'Country',
			dataIndex: 'country',
		},
		{
			key: 'zip',
			title: 'Action',
			render: (text, record) => (
				<Space size='middle'>
					<Button
						onClick={() => {
							setAction('edit')
							setLocationId(record.id)
							editLocation(text)
						}}>
						Edit
					</Button>
					<Button
						onClick={() => openDeleteLocationModal(text)}
						className={'btn-danger'}>
						Delete
					</Button>
				</Space>
			),
		},
	]

	const listLocations = useCallback(() => {
		let locations = [...(warehouse ?? []), ...(dropships ?? [])]
		const list = [
			{
				label: 'This location (default)',
				value: 'default',
			},
			{
				label: 'Suppress carrier-provided shipping rates',
				value: 'suppress',
			},
			{
				label: 'Other',
				value: 'other',
			},
		]

		if (locations.length) {
			locations = locations
				.filter(loc => loc.id !== locationId)
				.sort((a, b) => a.nickname.localeCompare(b.nickname))
				.map(loc => ({
					label: loc.nickname,
					value: loc.id,
				}))

			list.push(...locations)
		}

		return list
	}, [dropships, locationId, warehouse])

	const populateOriginRatesLocation = useCallback(
		async (zip_code = '') => {
			try {
				const zipCode = zip_code ?? locationDetail?.instore_postalCode
				const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipCode}`
				const config = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: false,
						alertMessageType: 'loading',
					},
				})

				const { data } = await axios.get(url, config)
				if (!data.error) {
					const updatedLocationDetail = {
						instore_city: data?.data?.city[0] ?? '',
						instore_state: data?.data?.state ?? '',
						instore_country: data?.data?.country ?? '',
					}

					setOriginRatesCity(data?.data?.city)
					setLocationDetail({
						...locationDetail,
						...updatedLocationDetail,
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: data.error,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			} catch (err) {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: '',
						showAlertMessage: false,
						alertMessageType: null,
					},
				})
			}
		},
		[dispatch, locationDetail, token]
	)

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row gutter={30}>
					<Modal
						title={
							<Title className={'mb-0'} level={4}>
								{alertMessageType === 'loading'
									? 'Loading. Please wait...'
									: locationDetail.location_type === 1
									? 'Warehouse'
									: 'Drop ship'}
							</Title>
						}
						centered
						visible={visible1}
						destroyOnClose
						onCancel={() => {
							setVisibleWarehouse(false)
							setLocationDetail(initialState)
						}}
						footer={null}
						width={800}>
						{alertMessageType === 'loading' ? (
							<Skeleton active />
						) : (
							<Form
								layout='vertical'
								name='add_warehouse_info'
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
													required: false,
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
									<Col
										className='gutter-row'
										xs={24}
										sm={24}
										md={24}
										lg={24}
										xl={24}>
										<Form.Item
											className={'mb-2'}
											label='Street Address'

											//rules={[{ required: true, message: 'Street Address' }]}
										>
											<Input
												placeholder='320 W. Lanier Ave, Ste 200'
												name='address'
												value={locationDetail.address}
												onChange={e => {
													changeValue(e)
												}}
												onKeyDown={e =>
													handleKeyAddress(e, 6, 2)
												}
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
											label='Zip Code'
											required
											rules={[
												{
													required: true,
													message: 'Zip Code',
												},
											]}>
											<Input
												placeholder='Zip Code'
												name='zip_code'
												value={locationDetail.zip_code}
												onChange={e => {
													changeValue(e)
													getGoogleLocation(e.target.value)
												}}
												required
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
										{locationDetail &&
										locationDetail.city &&
										typeof locationDetail.city === 'object' ? (
											<Form.Item
												className={'mb-2'}
												label='City'
												rules={[
													{
														required: true,
														message: 'City',
													},
												]}>
												<Select
													name='city'
													placeholder='City'
													defaultValue={
														locationDetail.city[0]
													}
													size={'large'}
													style={{ width: '100%' }}
													onChange={city => setCity(city)}>
													{locationDetail.city.map(
														city => (
															<Select.Option
																value={city}
																key={city}>
																{city}
															</Select.Option>
														)
													)}
												</Select>
											</Form.Item>
										) : (
											<Form.Item
												className={'mb-2'}
												label='City'
												rules={[
													{
														required: true,
														message: 'City',
													},
												]}
												required>
												<Input
													name='city'
													placeholder='City'
													value={locationDetail.city}
													onChange={e => {
														changeValue(e)
														setCity('')
													}}
													required
												/>
											</Form.Item>
										)}
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
											label='State'
											rules={[
												{ required: true, message: 'State' },
											]}
											required>
											<Input
												name='state'
												placeholder='State'
												value={locationDetail.state}
												onChange={changeValue}
												required
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
											label='Country'
											rules={[
												{
													required: true,
													message: 'Country',
												},
											]}
											required>
											<Input
												name='country'
												placeholder='Country'
												value={locationDetail.country}
												onChange={changeValue}
												required
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
										<Title level={4}>In-store pick up</Title>
									</Col>
								</Row>
								<Row gutter={30} align='middle'>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Enable in-store pick up
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											name='enable_instore'
											className={'mb-0'}>
											<Checkbox
												name='enable_instore'
												checked={
													locationDetail.enable_instore
												}
												onChange={e =>
													setLocationDetail({
														...locationDetail,
														enable_instore:
															!locationDetail.enable_instore,
													})
												}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											></Checkbox>
											{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
												<a href='#!' className='stnd-plan text-danger'>
													Advance plan required
												</a>
											)*/}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Offer if address is within (miles):
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message: 'Email Required',
												},
											]}>
											<Input
												name='instore_miles'
												value={locationDetail.instore_miles}
												onChange={changeValue}
												maxLength='6'
												onKeyDown={e =>
													handleKeyDownDecimalNumber(
														e,
														6,
														2
													)
												}
												step='0.01'
												type='number'
												min='0'
												pattern='[0-9.?(0-9){2}?]+%?$'
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											/>
										</Form.Item>
									</Col>
								</Row>

								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Offer if postal code matches:
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message: 'Postal Code Required',
												},
											]}>
											<Select
												name='instore_zipcodes'
												value={
													locationDetail.instore_zipcodes
												}
												mode='tags'
												style={{ width: '100%' }}
												onChange={tags =>
													handleChange(
														'instore_zipcodes',
														tags
													)
												}
												tokenSeparators={[',']}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
												onInputKeyDown={key => {
													if (
														key.code !== 'Backspace' &&
														key.code !== 'ArrowLeft' &&
														key.code !== 'ArrowRight' &&
														(key.code === 'Space' ||
															key.target.value.length >
																6)
													) {
														key.preventDefault()
														return
													}
												}}
												maxTagTextLength='7'
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Checkout description:
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message:
														'Checkout Description Required',
												},
											]}>
											<Input
												name='instock_description'
												value={
													locationDetail.instock_description
												}
												placeholder='In-store pick up'
												onChange={e =>
													e.target.value.length < 21 &&
													changeValue(e)
												}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Phone number:
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item className={'mb-0'}>
											<Input
												placeholder='404-369-0680'
												name='phone'
												value={locationDetail.phone}
												onChange={e =>
													e.target.value.length < 17 &&
													changeValue(e)
												}
												onKeyDown={e =>
													handleKeyPhoneNumber(e)
												}
												maxLength='20'
											/>
										</Form.Item>
									</Col>
								</Row>

								{locationDetail.location_type === 1 && (
									<Row
										gutter={30}
										align='middle'
										className={'mb-2'}>
										<Col
											className='gutter-row'
											xs={24}
											sm={8}
											md={8}
											lg={8}
											xl={8}>
											<label className={'text-gray'}>
												Origin for shipping rates:
											</label>
										</Col>
										<Col
											className='gutter-row'
											xs={24}
											sm={16}
											md={16}
											lg={16}
											xl={16}>
											<Form.Item className={'mb-0'}>
												<Select
													name='default_location'
													defaultValue='default'
													value={
														locationDetail.default_location
													}
													onChange={opt =>
														setLocationDetail({
															...locationDetail,
															default_location: opt,
														})
													}
													options={listLocations()}
												/>
											</Form.Item>
										</Col>
									</Row>
								)}

								{/* Other option fields */}
								{locationDetail?.location_type === 1 &&
									locationDetail?.default_location === 'other' && (
										<>
											<Row gutter={30} className='mb-2'>
												<Col
													className='gutter-row'
													xs={24}
													sm={8}
													md={8}
													lg={8}
													xl={8}>
													<label className={'text-gray'}>
														Postal Code {requiredMark}
													</label>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={16}
													md={16}
													lg={16}
													xl={16}>
													<Form.Item
														className={'mb-0'}
														// name='instore_postalCode'
														rules={[
															{
																required:
																	locationDetail?.default_location ===
																	'other',
																message:
																	'Postal Code Required',
															},
														]}>
														<Input
															placeholder='Postal Code'
															name='instore_postalCode'
															value={
																locationDetail?.instore_postalCode
															}
															onChange={e => {
																changeValue(e)
																e.target.value
																	.length > 4 &&
																	populateOriginRatesLocation(
																		e.target
																			.value
																	)
															}}
															required
														/>
													</Form.Item>
												</Col>
											</Row>
											<Row gutter={30} className='mb-2'>
												<Col
													className='gutter-row'
													xs={24}
													sm={8}
													md={8}
													lg={8}
													xl={8}>
													<label className={'text-gray'}>
														City {requiredMark}
													</label>
												</Col>
												{originRatesCity?.length > 1 ? (
													<Col
														className='gutter-row'
														xs={24}
														sm={16}
														md={16}
														lg={16}
														xl={16}>
														<Form.Item
															// name='instore_city'
															className={'mb-0'}>
															<Select
																name='instore_city'
																placeholder='City'
																style={{
																	width: '100%',
																}}
																defaultValue={
																	originRatesCity[0]
																}
																value={
																	locationDetail?.instore_city
																}
																onChange={city =>
																	setLocationDetail(
																		prevState => ({
																			...prevState,
																			instore_city:
																				city,
																		})
																	)
																}>
																{originRatesCity?.map(
																	city => (
																		<Select.Option
																			value={
																				city
																			}
																			key={
																				city
																			}>
																			{city}
																		</Select.Option>
																	)
																)}
															</Select>
														</Form.Item>
													</Col>
												) : (
													<Col
														className='gutter-row'
														xs={24}
														sm={16}
														md={16}
														lg={16}
														xl={16}>
														<Form.Item
															className={'mb-0'}
															// name='instore_city'
															rules={[
																{
																	required:
																		locationDetail?.default_location ===
																		'other',
																	message:
																		'City Required',
																},
															]}>
															<Input
																name='instore_city'
																placeholder='City'
																value={
																	locationDetail?.instore_city
																}
																onChange={e =>
																	changeValue(e)
																}
																required
															/>
														</Form.Item>
													</Col>
												)}
											</Row>
											<Row gutter={30} className='mb-2'>
												<Col
													className='gutter-row'
													xs={24}
													sm={8}
													md={8}
													lg={8}
													xl={8}>
													<label className={'text-gray'}>
														State/Province {requiredMark}
													</label>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={16}
													md={16}
													lg={16}
													xl={16}>
													<Form.Item
														className={'mb-0'}
														// name='instore_state'
														rules={[
															{
																required:
																	locationDetail?.default_location ===
																	'other',
																message:
																	'State/Province Required',
															},
														]}>
														<Input
															name='instore_state'
															placeholder='State/Province'
															value={
																locationDetail?.instore_state
															}
															onChange={e =>
																changeValue(e)
															}
															required
														/>
													</Form.Item>
												</Col>
											</Row>
											<Row gutter={30} className='mb-2'>
												<Col
													className='gutter-row'
													xs={24}
													sm={8}
													md={8}
													lg={8}
													xl={8}>
													<label className={'text-gray'}>
														Country {requiredMark}
													</label>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={16}
													md={16}
													lg={16}
													xl={16}>
													<Form.Item
														className={'mb-0'}
														// name='instore_country'
														rules={[
															{
																required:
																	locationDetail?.default_location ===
																	'other',
																message:
																	'Country Required',
															},
														]}>
														<Input
															placeholder='Country'
															name='instore_country'
															value={
																locationDetail?.instore_country
															}
															onChange={e =>
																changeValue(e)
															}
															required
														/>
													</Form.Item>
												</Col>
											</Row>
										</>
									)}

								<Row gutter={30}>
									<Col
										className='gutter-row'
										xs={24}
										sm={24}
										md={24}
										lg={24}
										xl={24}>
										<Title level={4}>Local Delivery</Title>
									</Col>
								</Row>
								<Row gutter={30} align='middle'>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Enable local delivery
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item className={'mb-0'}>
											<Checkbox
												name='enable_ld'
												checked={locationDetail.enable_ld}
												onChange={e =>
													setLocationDetail({
														...locationDetail,
														enable_ld:
															!locationDetail.enable_ld,
													})
												}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											></Checkbox>
											{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
												<a href='#!' className='stnd-plan text-danger'>
													Advance plan required
												</a>
											)*/}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Offer if address is within (miles):
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item className={'mb-0'}>
											<Input
												name='ld_miles'
												value={locationDetail.ld_miles}
												onChange={changeValue}
												onKeyDown={e =>
													handleKeyDownDecimalNumber(
														e,
														6,
														2
													)
												}
												step='0.01'
												min='0'
												type='number'
												pattern='[0-9.?(0-9){2}?]+%?$'
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Offer if postal code matches:
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message: 'Postal Code Required',
												},
											]}>
											<Select
												name='ld_zipcodes'
												value={locationDetail.ld_zipcodes}
												mode='tags'
												style={{ width: '100%' }}
												onChange={e =>
													handleChange('ld_zipcodes', e)
												}
												tokenSeparators={[',']}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
												onInputKeyDown={key => {
													if (
														key.code !== 'Backspace' &&
														key.code !== 'ArrowLeft' &&
														key.code !== 'ArrowRight' &&
														(key.code === 'Space' ||
															key.target.value.length >
																6)
													) {
														key.preventDefault()
														return
													}
												}}
												maxTagTextLength='7'
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Checkout description:
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message:
														'Checkout Description Required',
												},
											]}>
											<Input
												name='ld_description'
												value={locationDetail.ld_description}
												placeholder='Local delivery'
												onChange={e =>
													e.target.value.length < 21 &&
													changeValue(e)
												}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Local delivery fee
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item
											className={'mb-0'}
											rules={[
												{
													required: false,
													message:
														'Local delivery fee Required',
												},
											]}>
											<Input
												name='ld_fee'
												value={locationDetail.ld_fee}
												onChange={changeValue}
												type='number'
												onKeyDown={e =>
													handleKeyDownDecimalNumber(
														e,
														7,
														2
													)
												}
												step='0.01'
												min='0'
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={30} align='middle'>
									<Col
										className='gutter-row'
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={8}>
										<label className={'text-gray'}>
											Suppress other rates
											<Tooltip
												placement='top'
												title={
													'This setting only suppresses rates that would otherwise be returned by this app.'
												}>
												<Button
													className={'text-gray'}
													type='link'>
													[?]
												</Button>
											</Tooltip>
										</label>
									</Col>
									<Col
										className='gutter-row'
										xs={24}
										sm={16}
										md={16}
										lg={16}
										xl={16}>
										<Form.Item className={'mb-0'}>
											<Checkbox
												name='ld_enable_supress'
												checked={
													locationDetail.ld_enable_supress
												}
												onChange={e =>
													setLocationDetail({
														...locationDetail,
														ld_enable_supress:
															!locationDetail.ld_enable_supress,
													})
												}
												//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
											></Checkbox>
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
							Warehouses{' '}
							<Button
								type='primary'
								onClick={() => {
									setAction('add')
									setLocationId(null)
									setLocationDetail(initialState)
									openLocationModal(1)
								}}>
								Add
							</Button>
						</Title>
						<p>
							Warehouses contain all products not otherwise assigned to
							a drop ship location. If more than one warehouse is
							defined, the warehouse closest to the ship-to address
							will be used as the shipment origin.
						</p>
						<Table
							className={'custom-table'}
							dataSource={warehouse ? addKeysToList(warehouse) : []}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>

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
							Drop ships{' '}
							<Button
								type='primary'
								onClick={() => {
									setAction('add')
									setLocationId(null)
									setLocationDetail(initialState)
									openLocationModal(2)
								}}>
								Add
							</Button>
						</Title>
						<p>
							Products can be assigned to a drop ship location. The
							assignment is made on the product's shipping parameters
							page. A product assigned to a drop ship location will
							always use that location as the ship-from address. If
							there are other items in the Cart that are being quoted
							as shipping from other locations, the cheapest rate for
							each location will be added together and displayed as a
							single shipping rate.
						</p>
						<Table
							className={'custom-table'}
							dataSource={dropships ? addKeysToList(dropships) : []}
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

const mapStateToProps = state => {
	return {
		warehouse: state.warehouse,
		dropships: state.dropships,
		googleLocationResponse: state.googleLocationResponse,
		showAlertMessage: state.showAlertMessage,
		alertMessageType: state.alertMessageType,
		alertMessage: state.alertMessage,
		confirmModal: state.confirmModal,
		token: state.token,
		plansInfo: state.plansInfo,
	}
}

const mapDispatchToProps = dispatch => ({
	postData: (data, type, url, token, visibility) =>
		dispatch(postData(data, type, url, token, visibility)),
	getGoogleResponse: (data, token, visibility) =>
		dispatch(getGoogleResponse(data, token, visibility)),
	getWarehouse: (id, locationDetail, visibility, token) =>
		dispatch(getWarehouse(id, locationDetail, visibility, token)),
	deleteLocation: (id, type, visibility, token) =>
		dispatch(deleteLocation(id, type, visibility, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseComponent)
