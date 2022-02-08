import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Typography, Row, Col, Form, Input, Skeleton, Radio } from 'antd'
import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
} from '../../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../../DeliveryEstimateOptions'
import CutOffTime from '../../../CutOffTime'
import RAD from '../../../RAD'
import InternationalServices from './Services/InternationalServices'
import OneRateServices from './Services/OneRateServices'
import DomesticServices from './Services/DomesticServices'
import { domestic_services } from './Services/DomesticServices'
import { one_rate_services } from './Services/OneRateServices'
import { international_services } from './Services/InternationalServices'
import GroundTransit from '../../../GroundTransit'
import HazardousMaterial from '../../../HazardousMaterial'
import SaveButton from '../../../SaveButton'

const { Title } = Typography
const initialState = {
	carrier_services: {},
	international_service_description: '',
	delivery_estimate_options: 1,
	showDeliveryEstimate: false,
	order_cut_off_time: '',
	fulfillment_offset_days: '',
	all_week_days_select: true,
	week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
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
}

function QuoteSettingsComponentWweSmall(props) {
	const [loading, setLoading] = useState(true)
	const [checkAll, setCheckAll] = useState(false)
	const [internationalcheckAll, setInternationalCheckAll] = useState(false)
	const [oneRatecheckAll, setOneRateCheckAll] = useState(false)
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
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
			.map(
				srvc => props?.quoteSettings?.carrier_services?.[generateIndex(srvc)]
			)
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

	const generateIndex = useCallback(
		srvc => srvc.toLowerCase().replaceAll(' ', '_'),
		[]
	)

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
					srvc =>
						quoteSettingsState?.carrier_services?.[generateIndex(srvc)]
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
				const qs = { ...quoteSettingsState, carrierId: +props.carrierId }
				delete qs.carrier_services?.['standard_overnight']
				delete qs.carrier_services?.['priority_overnight']

				props.postData(qs, props.token)
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
				{/* FEDEX SERVICES */}
				<Row gutter={30} align='middle' className={'mb-4'}>
					{props?.sbsPlans?.currentPackage?.status !== 1 && (
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<div className={'note-bx'}>
								Standard Box size feature is required for the One
								Rate services.
							</div>
						</Col>
					)}
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Fedex Services</Title>
					</Col>

					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<label className={'text-black'}>
							The services selected will display in the cart if they
							are available for the origin and destination addresses,
							and if the Fedex Small Package Quotes API has been
							enabled for the corresponding shipping zone.
						</label>
					</Col>
				</Row>

				<Row gutter={30} justify='space-between' wrap={true} align='top'>
					{/* US Domestic Services */}
					<DomesticServices
						quoteSettingsState={quoteSettingsState}
						checkAll={checkAll}
						setCheckAll={setCheckAll}
						allCheckHandler={allCheckHandler}
						onChange={onChange}
						onCheck={onCheck}
					/>

					{/* One Rate Services */}
					<OneRateServices
						quoteSettingsState={quoteSettingsState}
						allCheckHandler={allCheckHandler}
						oneRatecheckAll={oneRatecheckAll}
						setOneRateCheckAll={setOneRateCheckAll}
						onCheck={onCheck}
					/>

					{/* International Services */}
					<InternationalServices
						quoteSettingsState={quoteSettingsState}
						allCheckHandler={allCheckHandler}
						internationalcheckAll={internationalcheckAll}
						setInternationalCheckAll={setInternationalCheckAll}
						onCheck={onCheck}
						onChange={onChange}
					/>
				</Row>

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
				<GroundTransit
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>
				<RAD
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>
				<HazardousMaterial
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				{/* Other Settings */}
				<Row gutter={24} className={'mb-4'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
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
					<Col
						className='gutter-row mb-2'
						xs={24}
						sm={24}
						md={24}
						lg={18}
						xl={18}>
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

					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}
						style={{ paddingTop: '11px' }}>
						<label className={'text-gray'}>Negotiated Rates</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={18}
						xl={18}>
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
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}
						style={{ paddingTop: '11px' }}>
						<label className={'text-gray'}></label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={18}
						xl={18}>
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

				<SaveButton />
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
		sbsPlans: state.sbsPlans,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)
			),
		getSettings: (token, carrier_id) =>
			dispatch(getQuoteSettings(token, carrier_id)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuoteSettingsComponentWweSmall)
