import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Typography, Row, Col, Form, Input, Skeleton, Select } from 'antd'
import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getQuoteSettings } from '../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
} from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions'
import CutOffTime from '../../CutOffTime'
import DomesticServices from './Services/DomesticServices'
import InternationalServices from './Services/InternationalServices'
import GroundTransit from '../../GroundTransit'
import HazardousMaterial from '../../HazardousMaterial'
import SaveButton from '../../SaveButton'
import ErrorManagment from '../../ErrorManagment'
import EnableLogs from '../../EnableLogs'

const { Title } = Typography
const initialState = {
	carrier_services: {
		usps_first_class_mail: false,
		usps_priority_mail_express: false,
		usps_priority_mail: false,
		usps_priority_mail_flat_rate: false,
		usps_retail_ground: false,
		usps_first_class_mail_markup: '',
		usps_priority_mail_express_markup: '',
		usps_priority_mail_markup: '',
		usps_priority_mail_flat_rate_markup: '',
		usps_retail_ground_markup: '',
		usps_priority_mail_international_express: false,
		usps_priority_mail_international: false,
		usps_priority_mail_international_flat_rate_box: false,
		usps_first_class_package_international_service: false,
		usps_priority_mail_international_express_markup: '',
		usps_priority_mail_internationalmarkup: '',
		usps_priority_mail_international_flat_rate_box_markup: '',
		usps_first_class_package_international_service_markup: '',
	},
	delivery_estimate_options: 1,
	error_managment:1,
	order_cut_off_time: '',
	fulfillment_offset_days: '',
	select_all_week_days: false,
	all_week_days_select: true,
	week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	number_of_transit_days: null,
	ground_metric: 1,
	alwaysResidentialDelivery: false,
	autoDetectedResidentialAddresses: false,
	ground_service_for_hazardous_material: false,
	ground_hazardous_material_fee: null,
	air_hazardous_material_fee: null,
	handling_fee_markup: null,
	rate_tier: 'retail',
}

function QuoteSettingsComponentWweSmall(props) {
	const [loading, setLoading] = useState(true)
	const [checkAll, setCheckAll] = useState(false)
	const [internationalcheckAll, setInternationalCheckAll] = useState(false)
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
	const dispatch = useDispatch()

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings()
		}
		// eslint-disable-next-line
	}, [props.quoteSettings])

	const getQuoteSettings = () => {
		const checks = props.quoteSettings.carrier_services
		if (
			checks?.usps_first_class_mail &&
			checks?.usps_priority_mail_express &&
			checks?.usps_priority_mail &&
			checks?.usps_priority_mail_flat_rate &&
			checks?.usps_retail_ground
		) {
			setCheckAll(true)
		}

		if (
			checks?.usps_priority_mail_international_express &&
			checks?.usps_priority_mail_international &&
			checks?.usps_priority_mail_international_flat_rate_box &&
			checks?.usps_first_class_package_international_service
		) {
			setInternationalCheckAll(true)
		}

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

		const checks = {
			usps_first_class_mail:
				quoteSettingsState?.carrier_services?.usps_first_class_mail,
			usps_priority_mail_express:
				quoteSettingsState?.carrier_services?.usps_priority_mail_express,
			usps_priority_mail:
				quoteSettingsState?.carrier_services?.usps_priority_mail,
			usps_priority_mail_flat_rate:
				quoteSettingsState?.carrier_services?.usps_priority_mail_flat_rate,
			usps_retail_ground:
				quoteSettingsState?.carrier_services?.usps_retail_ground,
		}
		if (Object.keys(checks).includes(e.target.name)) {
			checks[e.target.name] = e.target.checked
			const isCheckedAll = Object.values(checks).every(ck => ck)
			setCheckAll(isCheckedAll)
		}

		const internationalChecks = {
			usps_priority_mail_international_express:
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international_express,
			usps_priority_mail_international:
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international,
			usps_priority_mail_international_flat_rate_box:
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international_flat_rate_box,
			usps_first_class_package_international_service:
				quoteSettingsState?.carrier_services
					?.usps_first_class_package_international_service,
		}
		if (Object.keys(internationalChecks).includes(e.target.name)) {
			internationalChecks[e.target.name] = e.target.checked
			const internationalIsCheckAll = Object.values(internationalChecks).every(
				ck => ck
			)
			setInternationalCheckAll(internationalIsCheckAll)
		}
	}

	const allCheckHandler = () => {
		setCheckAll(!checkAll)

		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				usps_first_class_mail: !checkAll,
				usps_priority_mail_express: !checkAll,
				usps_priority_mail: !checkAll,
				usps_priority_mail_flat_rate: !checkAll,
				usps_retail_ground: !checkAll,
			},
		})
	}

	const internationalAllCheckHandler = checked => {
		setInternationalCheckAll(checked)

		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				usps_priority_mail_international_express: checked,
				usps_priority_mail_international: checked,
				usps_priority_mail_international_flat_rate_box: checked,
				usps_first_class_package_international_service: checked,
			},
		})
	}

	const onFinish = data => {
		const CS = quoteSettingsState?.carrier_services ?? {}
		const checkCS =
			CS?.usps_first_class_mail ||
			CS?.usps_priority_mail_express ||
			CS?.usps_priority_mail ||
			CS?.usps_priority_mail_flat_rate ||
			CS?.usps_retail_ground ||
			CS?.usps_priority_mail_international_express ||
			CS?.usps_priority_mail_international ||
			CS?.usps_priority_mail_international_flat_rate_box ||
			CS?.usps_first_class_package_international_service

		let errormsg = ''
		// Domestic services check
		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services?.usps_first_class_mail_markup,
				'USPS First Class Mail markup ',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_express_markup,
				'USPS Priority Mail Express markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services?.usps_priority_mail_markup,
				'USPS Priority Mail markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_flat_rate_markup,
				'USPS Priority Mail Flat Rate* markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services?.usps_retail_ground_markup,
				'USPS Retail Ground markup',
				true
			)
		}

		// International services check
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international_express_markup,
				'USPS Priority Mail International Express markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international_markup,
				'USPS Priority Mail International markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_priority_mail_international_flat_rate_box_markup,
				'USPS Priority Mail International Flat Rate Box* markup',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.carrier_services
					?.usps_first_class_package_international_service_markup,
				'USPS First-Class Package International Service markup',
				true
			)
		}

		// Ground & Air hazardous fees checks
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.air_hazardous_material_fee,
				'Air Hazardous Material Fee',
				true
			)
		}
		if (errormsg === '') {
			errormsg += validateHandlingFeeMarkup(
				quoteSettingsState?.ground_hazardous_material_fee,
				'Ground Hazardous Material Fee',
				true
			)
		}

		// handling fee/markup check
		if (errormsg === '') {
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
	}

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	const radCheck = props.installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	)

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
				<Row gutter={24} align='middle' className={'mb-4'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>USPS Services</Title>
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
							and if the USPS Small Package Quotes API has been enabled
							for the corresponding shipping zone.
						</label>
					</Col>
				</Row>

				<Row className={'mb-2'}>
					<DomesticServices
						quoteSettingsState={quoteSettingsState}
						checkAll={checkAll}
						allCheckHandler={allCheckHandler}
						onCheck={onCheck}
						onChange={onChange}
					/>
					<InternationalServices
						quoteSettingsState={quoteSettingsState}
						internationalcheckAll={internationalcheckAll}
						internationalAllCheckHandler={internationalAllCheckHandler}
						onChange={onChange}
						onCheck={onCheck}
					/>
				</Row>

				<Row className={'mb-2'}></Row>

				<Row gutter={24} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}>
						<label className={'text-gray'}>Rate tier</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={18}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Select
								options={[
									{
										label: 'Retail (at Post Office)',
										value: 'retail',
									},
									{
										label: 'Commercial Basic',
										value: 'commercialBase',
									},
									{
										label: 'Commercial Plus',
										value: 'commercialPlus',
									},
								]}
								name='rate_tier'
								defaultValue='retail'
								value={quoteSettingsState?.rate_tier}
								onChange={val =>
									setQuoteSettingsState({
										...quoteSettingsState,
										rate_tier: val,
									})
								}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24} className={'mb-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Other settings</Title>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col
						className='gutter-row'
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
				</Row>

				<EnableLogs 
					quoteSettingsState={quoteSettingsState} 
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				<ErrorManagment
          			quoteSettingsState={quoteSettingsState}
          			handleChange={handleStateChange}
        		/>

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
