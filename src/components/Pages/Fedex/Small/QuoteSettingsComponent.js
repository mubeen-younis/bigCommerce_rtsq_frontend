import React, { Fragment, useState, useEffect, useCallback } from 'react'
import {
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Input,
	Checkbox,
	Skeleton,
	Radio,
} from 'antd'
import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
	handleKeyDownDecimalNumber,
} from '../../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../../DeliveryEstimateOptions';
import CutOffTime from '../../../CutOffTime'
import RAD from '../../../RAD'

const { Title } = Typography

const domestic_services = [
	'Ground Home Delivery',
	//'Date Certain Home Delivery',
	//'Evening Home Delivery',
	//'Appointment Home Delivery',
	'Ground',
	'Express Saver',
	'2 Day',
	'2 Day AM',
	'Priority Overnight',
	'First Overnight',
	'Standard Overnight',
	'Smart Post',
]

const international_services = [
	'International Distribution Freight',
	'International Economy',
	'International Economy Distribution',
	'International Economy Freight',
	'International First',
	'International Priority',
	'International Priority Distribution',
	'International Priority Freight',
	'International Priority Overnight',
	'International Standard Overnight',
	'International Ground',
]

const one_rate_services = [
	{ label: '' },
	{ label: '' },
	/*{ label: '' },
	{ label: '' },
	{ label: '' },*/
	{ label: 'Express Saver' },
	{ label: '2 Day' },
	{ label: '2 Day AM' },
	{ label: 'Standard Overnight' },
	{ label: 'Priority Overnight' },
	{ label: 'First Overnight' },
	{ label: '' },
]

function QuoteSettingsComponentWweSmall(props) {
	const [loading, setLoading] = useState(true)
	const [checkAll, setCheckAll] = useState(false)
	const [internationalcheckAll, setInternationalCheckAll] = useState(false)
	const [oneRatecheckAll, setOneRateCheckAll] = useState(false)
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		carrier_services: {},
		international_service_description: '',
		delivery_estimate_options: 1,
		showDeliveryEstimate: false,
		order_cut_off_time: '',
		fulfillment_offset_days: '',
		select_all_week_days: false,
		week_days: [],
		number_of_transit_days: null,
		ground_metric: 1,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		returnRates: false,
		ground_service_for_hazardous_material: false,
		ground_hazardous_material_fee: null,
		air_hazardous_material_fee: null,
		handling_fee_markup: null,
		quote_details: null,
		negotiated_rates: 1,
	})
	const dispatch = useDispatch()

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings()
		}
		// eslint-disable-next-line
	}, [props.quoteSettings])

	const getQuoteSettings = () => {
		let checks = domestic_services
			.map(
				srvc =>
					props?.quoteSettings?.carrier_services?.[
						'fedex_' + generateIndex(srvc)
					]
			)
			.every(ck => ck)
		if (checks) setCheckAll(true)

		checks = one_rate_services
			.filter(srvc => srvc.label.length)
			.map(
				srvc =>
					props?.quoteSettings?.carrier_services?.[
						'one_rate_' + generateIndex(srvc.label)
					]
			)
			.every(ck => ck)
		if (checks) setOneRateCheckAll(true)

		checks = international_services
			.map(srvc => props?.quoteSettings?.carrier_services?.[generateIndex(srvc)])
			.every(ck => ck)
		if (checks) setInternationalCheckAll(true)

		setQuoteSettingsState({ ...quoteSettingsState, ...props.quoteSettings })
		setLoading(false)
	}

	const onChange = e => {
		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				[e.target.name]: e.target.value,
			},
		})
	}

	const onCheck = e => {
		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				[e.target.name]: e.target.checked,
			},
		})

		const domesticCheckedAll = domestic_services
			.map(srvc =>
				'fedex_' + generateIndex(srvc) === e.target.name
					? e.target.checked
					: quoteSettingsState?.carrier_services?.[
							'fedex_' + generateIndex(srvc)
					  ]
			)
			.every(ck => ck)
		setCheckAll(domesticCheckedAll)

		const oneRateCheckedAll = one_rate_services
			.filter(srvc => srvc.label.length)
			.map(srvc =>
				'one_rate_' + generateIndex(srvc.label) === e.target.name
					? e.target.checked
					: quoteSettingsState?.carrier_services?.[
							'one_rate_' + generateIndex(srvc.label)
					  ]
			)
			.every(ck => ck)
		setOneRateCheckAll(oneRateCheckedAll)

		const internationalCheckedAll = international_services
			.map(srvc =>
				generateIndex(srvc) === e.target.name
					? e.target.checked
					: quoteSettingsState?.carrier_services?.[generateIndex(srvc)]
			)
			.every(ck => ck)
		setInternationalCheckAll(internationalCheckedAll)
	}

	const generateIndex = useCallback(srvc => srvc.toLowerCase().replaceAll(' ', '_'), [])

	const allCheckHandler = useCallback(
		(allCheckType, checked = false, services, prefix = '') => {
			allCheckType(checked)

			services =
				prefix === 'one_rate_'
					? services
							.filter(({ label }) => label.length)
							.map(({ label }) => label)
					: services

			let updated_services = {}
			for (const srvc of services)
				updated_services[prefix + generateIndex(srvc)] = checked

			setQuoteSettingsState({
				...quoteSettingsState,
				carrier_services: {
					...quoteSettingsState.carrier_services,
					...updated_services,
				},
			})
		},
		[generateIndex, quoteSettingsState]
	)

	const onFinish = useCallback(
		data => {
			let checkCS = [
				...domestic_services.map(
					srvc =>
						quoteSettingsState?.carrier_services?.[
							'fedex_' + generateIndex(srvc)
						]
				),
				...one_rate_services
					.filter(srvc => srvc.label.length)
					.map(
						({ label }) =>
							quoteSettingsState?.carrier_services?.[
								'one_rate_' + generateIndex(label)
							]
					),
				...international_services.map(
					srvc => quoteSettingsState?.carrier_services?.[generateIndex(srvc)]
				),
			].some(srvc => srvc)

			let errormsg = '',
				markup = '_markup',
				allMarkups = [
					...domestic_services.map(srvc => ({
						label: srvc,
						index: `fedex_${generateIndex(srvc)}${markup}`,
					})),
					...one_rate_services
						.filter(({ label }) => label.length)
						.map(({ label }) => ({
							label,
							index: `one_rate_${generateIndex(label)}${markup}`,
						})),
					...international_services.map(srvc => ({
						label: srvc,
						index: `${generateIndex(srvc)}${markup}`,
					})),
				]

			if (checkCS) {
				for (const am of allMarkups) {
					errormsg = validateHandlingFeeMarkup(
						quoteSettingsState?.carrier_services?.[am.index],
						`${am.label} markup`,
						true
					)

					if (errormsg !== '') break
				}

				if (errormsg === '')
					errormsg += validateHandlingFeeMarkup(
						quoteSettingsState?.ground_hazardous_material_fee,
						'Ground Hazardous Material Fee',
						true
					)

				if (errormsg === '')
					errormsg += validateHandlingFeeMarkup(
						quoteSettingsState?.air_hazardous_material_fee,
						'Air Hazardous Material Fee',
						true
					)

				if (errormsg === '')
					errormsg += validateHandlingFeeMarkup(
						quoteSettingsState?.handling_fee_markup,
						'Handling Fee markup',
						true
					)
			}

			if (checkCS && errormsg === '') {
				props.postData(
					{ ...quoteSettingsState, carrierId: +props.carrierId },
					props.token
				)
			} else {
				errormsg =
					errormsg === ''
						? 'Please select at least one service option.'
						: errormsg
				errormsg = errormsg.split('exploder')[0]

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: true,
						alertMessage: errormsg,
						alertMessageType: 'error',
					},
				})

				setTimeout(() => {
					dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							showAlertMessage: false,
							alertMessage: errormsg,
							alertMessageType: 'error',
						},
					})
				}, 1500)
			}
		},
		[dispatch, generateIndex, props, quoteSettingsState]
	)

	const radCheck = props.installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	)

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	let radStatus = false
	if (radCheck !== undefined) {
		radStatus =
			props?.radPlans?.currentPackage === null
				? false
				: props?.radPlans?.currentPackage?.status !== 1
				? false
				: true
	}

	return loading &&
		(props.quoteSettings === undefined || props.quoteSettings === null) ? (
		<Skeleton active />
	) : (
		<Fragment>
			<Form
				layout='vertical'
				name='quote_settings_info'
				className='form-wrp'
				size={'large'}
				onFinish={onFinish}
				initialValues={props.quoteSettings}>
				{/* UPS SERVICES */}
				<Row gutter={30} align='middle' className={'mb-4'}>
					
					{ props?.sbsPlans?.currentPackage?.status !== 1 &&
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<div className={'note-bx'}>
							Standard Box size feature is required for the One Rate services.
						</div>
					</Col>
					}
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Fedex Services</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-black'}>
							The services selected will display in the cart if they are
							available for the origin and destination addresses, and if the
							Fedex Small Package Quotes API has been enabled for the
							corresponding shipping zone.
						</label>
					</Col>
				</Row>

				<Row gutter={30} justify='space-between'>
					{/* US Domestic Services */}
					<Col span={10}>
						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col
								className='gutter-row middle'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Title level={5} style={{ textAlign: 'center' }}>
									Domestic Services
								</Title>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Select All Services</label>
							</Col>
							<Col span={4}>
								<Form.Item className='mb-0'>
									<Checkbox
										name='select_all'
										value={true}
										checked={checkAll}
										onChange={e =>
											allCheckHandler(
												setCheckAll,
												e.target.checked,
												domestic_services,
												'fedex_'
											)
										}></Checkbox>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Home Delivery</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_ground_home_delivery'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_ground_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										name={'fedex_ground_home_delivery_markup'}
										value={
											quoteSettingsState?.carrier_services
												?.fedex_ground_home_delivery_markup
										}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						{/*}<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Date Certain Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_date_certain_home_delivery'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_date_certain_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_date_certain_home_delivery_markup
										}
										name={'fedex_date_certain_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Evening Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_evening_home_delivery'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_evening_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_evening_home_delivery_markup
										}
										name={'fedex_evening_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>
									Appointment Home Delivery
								</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_appointment_home_delivery'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_appointment_home_delivery
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_appointment_home_delivery_markup
										}
										name={'fedex_appointment_home_delivery_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row> {*/}

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Ground</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_ground'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_ground
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_ground_markup
										}
										name={'fedex_ground_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Express Saver</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_express_saver'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_express_saver
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										//maxLength='7'
										value={
											quoteSettingsState?.carrier_services
												?.fedex_express_saver_markup
										}
										//pattern='[0-9.?(0-9){2}?]+%?$'
										name={'fedex_express_saver_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>2 Day</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_2_day'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_2_day
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={22} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_2_day_markup
										}
										name={'fedex_2_day_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>2 Day AM</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_2_day_am'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_2_day_am
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_2_day_am_markup
										}
										name={'fedex_2_day_am_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Standard Overnight</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_standard_overnight'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_standard_overnight
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_standard_overnight_markup
										}
										name={'fedex_standard_overnight_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Priority Overnight</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_priority_overnight'
										value={true}
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_priority_overnight
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_priority_overnight_markup
										}
										name={'fedex_priority_overnight_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>First Overnight</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_first_overnight'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_first_overnight
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_first_overnight_markup
										}
										name={'fedex_first_overnight_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>SmartPost</label>
							</Col>
							<Col span={4}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='fedex_smart_post'
										checked={
											quoteSettingsState?.carrier_services
												?.fedex_smart_post
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={12} xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item className={'mb-0'}>
									<Input
										value={
											quoteSettingsState?.carrier_services
												?.fedex_smart_post_markup
										}
										name={'fedex_smart_post_markup'}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
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
								<label className={'text-gray'}>
									Markup (e.g Currency 1.0 or percentage 5%)
								</label>
							</Col>
						</Row>
					</Col>

					{/* One Rate Services */}
					<Col span={4} align='middle' className={'mb-2'}>
						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Title level={5} style={{ textAlign: 'center' }}>
									One Rate
								</Title>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={24}>
								<Form.Item className='mb-0'>
									<Checkbox
										name='select_all'
										checked={oneRatecheckAll}
										onChange={e =>
											allCheckHandler(
												setOneRateCheckAll,
												e.target.checked,
												one_rate_services,
												'one_rate_'
											)
										}></Checkbox>
								</Form.Item>
							</Col>
						</Row>

						{one_rate_services.map(is =>
							is.label.length ? (
								<Row gutter={30} align='middle' className={'mb-2'}>
									<Col span={24}>
										<Form.Item className={'mb-0'}>
											<Checkbox
												name={
													'one_rate_' +
													is.label
														.toLowerCase()
														.trim()
														.replaceAll(' ', '_')
												}
												value={true}
												checked={
													quoteSettingsState
														?.carrier_services?.[
														'one_rate_' +
															is.label
																.toLowerCase()
																.trim()
																.replaceAll(' ', '_')
													]
												}
												onChange={onCheck}></Checkbox>
										</Form.Item>
									</Col>
									<Col span={24} style={{visibility:'hidden'}}>
									<Form.Item className={'mb-0'}>
									<Input/>
									</Form.Item>
									</Col>
									<Col span={24}>
										<label className={'text-gray'} style={{visibility:'hidden'}}>SmartPost</label>
									</Col>
								</Row>
							) : (
								<Row gutter={30} align='middle' className={'mb-2'} style={{visibility:'hidden'}}>
									<Col span={20}>
										<label className={'text-gray'}>SmartPost</label>
									</Col>
									<Col span={4}>
										<Form.Item className={'mb-0'}>
											<Checkbox></Checkbox>
										</Form.Item>
									</Col>
									<Col span={24}>
									<Form.Item className={'mb-0'}>
									<Input/>
									</Form.Item>
									</Col>
									<Col span={24}>
										<label className={'text-gray'}>SmartPost</label>
									</Col>
								</Row>
							)
						)}
					</Col>

					{/* International Services */}
					<Col span={10}>
						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Title level={5} style={{ textAlign: 'center' }}>
									International Services
								</Title>
							</Col>
						</Row>

						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col span={20}>
								<label className={'text-gray'}>Select All Services</label>
							</Col>
							<Col span={4}>
								<Form.Item className='mb-0'>
									<Checkbox
										name='select_all'
										value={true}
										checked={internationalcheckAll}
										onChange={e =>
											allCheckHandler(
												setInternationalCheckAll,
												e.target.checked,
												international_services,
												''
											)
										}></Checkbox>
								</Form.Item>
							</Col>
						</Row>

						{international_services.map(is => (
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col span={20}>
									<label className={'text-gray'}>{is}</label>
								</Col>
								<Col span={4}>
									<Form.Item className={'mb-0'}>
										<Checkbox
											name={is
												.toLowerCase()
												.trim()
												.replaceAll(' ', '_')}
											value={true}
											checked={
												quoteSettingsState?.carrier_services?.[
													is
														.toLowerCase()
														.trim()
														.replaceAll(' ', '_')
												]
											}
											onChange={onCheck}></Checkbox>
									</Form.Item>
								</Col>
								<Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item className={'mb-0'}>
										<Input
											//maxLength='7'
											value={
												quoteSettingsState?.carrier_services?.[
													is
														.toLowerCase()
														.trim()
														.replaceAll(' ', '_') + '_markup'
												]
											}
											//pattern='[0-9.?(0-9){2}?]+%?$'
											name={
												is
													.toLowerCase()
													.trim()
													.replaceAll(' ', '_') + '_markup'
											}
											onChange={onChange}
											onKeyDown={handlingFeeMarkup}
											maxLength='7'
											type='text'
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
									<label className={'text-gray'}>
										Markup (e.g Currency 1.0 or percentage 5%)
									</label>
								</Col>
							</Row>
						))}
					</Col>
				</Row>

				{/*  International Service Descriptions 
				<Row gutter={30} align='middle' className={'mb-1'}>
					<Col
						className='gutter-row'
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={6}
						style={{ marginBottom: '35px' }}>
						<label className={'text-gray'}>
							{' '}
							International Service Descriptions
						</label>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										international_service_description: e.target.value,
									}))
								}
								value={
									quoteSettingsState?.international_service_description
								}
							/>
						</Form.Item>
						<div className={'text-gray mb-3'}>
							Define a message that will be appended to the international
							service descriptions.
						</div>
					</Col>
				</Row>*/}

				<Row className={'mb-2'}></Row>

				<DeliveryEstimateOptions
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>	
					
				<CutOffTime
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					handleChange={handleStateChange}
				/>

				{/* Ground transit time settings */}
				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col
						className='gutter-row mt-4'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Ground transit time restrictions</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Enter the number of transit days to restrict ground service
							to. Leave blank to disable this service.
						</label>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={18}>
						<Form.Item className={'mb-0'} name='number_of_transit_days'>
							<Input
								type='number'
								min='1'
								step='1'
								value={quoteSettingsState?.number_of_transit_days}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										number_of_transit_days: e.target.value,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Restrict by the carrier's in transit days metric
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='ground_metric'
								value='1'
								checked={quoteSettingsState?.ground_metric === 1}
								// checked={true}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_metric: 1,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Restrict by the calendar days in transit
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='ground_metric'
								value='2'
								checked={quoteSettingsState.ground_metric === 2}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_metric: 2,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>
				</Row>
				{/* End Transit  */}

				{/* Residential address settings */}
				<RAD
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				{/* Hazardous material settings */}
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Hazardous material settings</Title>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={12}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>
							Only quote ground service for hazardous materials shipments
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-3'}>
							<Checkbox
								name={'ground_service_for_hazardous_material'}
								value={true}
								checked={
									quoteSettingsState?.ground_service_for_hazardous_material
								}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_service_for_hazardous_material:
											!quoteSettingsState?.ground_service_for_hazardous_material,
									})
								}></Checkbox>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={12}
						md={12}
						lg={6}
						xl={6}>
						<label className={'text-gray'}>
							Ground Hazardous Material Fee
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								name={'ground_hazardous_material_fee'}
								maxLength='7'
								value={quoteSettingsState?.ground_hazardous_material_fee}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_hazardous_material_fee: e.target.value,
									})
								}
								onKeyDown={e => handleKeyDownDecimalNumber(e, 7, 2)}
								type='number'
								min='0'
								step='0.01'
								//pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
						</div>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={12}
						md={12}
						lg={6}
						xl={6}>
						<label className={'text-gray'}>Air Hazardous Material Fee</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='number'
								name={'air_hazardous_material_fee'}
								value={quoteSettingsState?.air_hazardous_material_fee}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										air_hazardous_material_fee: e.target.value,
									})
								}
								onKeyDown={e => handleKeyDownDecimalNumber(e, 7, 2)}
								min='0'
								step='0.01'
								//pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
						</div>
					</Col>
				</Row>

				{/* Other Settings */}
				<Row gutter={24} className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Other settings</Title>
					</Col>
					{/*}<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address is a post office
							box
						</label>
						</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox />
						</Form.Item>
					</Col>{*/}

					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}
						style={{ paddingTop: '11px' }}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='text'
								name='handling_fee_markup'
								maxLength='7'
								value={quoteSettingsState?.handling_fee_markup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										handling_fee_markup: e.target.value,
									})
								}
								onKeyDown={handlingFeeMarkup}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount, e.g 3.75, or a
							percentage, e.g, 5%. Leave blank to disable.
						</div>
					</Col>
				</Row>

				{/* Negotiated Rates */}
				<Row gutter={30}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Negotiated Rates</Title>
					</Col>

					<Col className='gutter-row' xs={6} sm={6} md={6} lg={6} xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={18} sm={18} md={18} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='negotiated_rates'
								value='1'
								checked={quoteSettingsState?.negotiated_rates === 1}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										negotiated_rates: 1,
									})
								}>
								Show Negotiated Rates.
							</Radio>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row mb-3'
						xs={6}
						sm={6}
						md={6}
						lg={6}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={18} sm={18} md={18} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='negotiated_rates'
								value='2'
								checked={quoteSettingsState.negotiated_rates === 2}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										negotiated_rates: 2,
									})
								}>
								Don't Show Negotiated Rates.
							</Radio>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} className={'mt-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
							<Space>
								<Button type='primary' size={'large'} htmlType='submit'>
									Save Settings
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		quoteSettings: state.quoteSettings,
		token: state.token,
		carrierId: state.carrierId,
		plansInfo: state.plansInfo,
		installedAddons: state.installedAddons,
		radPlans: state.radPlans,
		sbsPlans: state.sbsPlans
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)
			),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuoteSettingsComponentWweSmall)
