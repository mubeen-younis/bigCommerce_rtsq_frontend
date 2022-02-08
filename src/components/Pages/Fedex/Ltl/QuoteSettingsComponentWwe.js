import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Row, Col, Form, Input, Skeleton } from 'antd'
import CutOffTime from '../../../CutOffTime'
import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import {
	validateHandlingFeeMarkup,
	LableAsLimit,
} from '../../../../Utilities/numberValidation'
import RAD from '../../../RAD'
import LiftGateDelivery from '../../../LiftGateDelivery'
import DeliveryEstimateOptions from '../../../DeliveryEstimateOptions'
// import HoldAtTerminal from '../../../HoldAtTerminal'
import Discounts from '../../../Discounts'
import HandlingUnit from '../../../HandlingUnit'
import SaveButton from '../../../SaveButton'
import QuoteServices from './QuoteServices'

const initialState = {
	fedex_freight_economy_label: '',
	fedex_freight_priority_label: '',
	fedex_select_all: false,
	fedex_freight_economy: false,
	fedex_freight_priority: false,
	delivery_estimate_options: 1,
	order_cut_off_time: '',
	fulfillment_offset_days: '',
	all_week_days_select: true,
	week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	hold_at_terminal: false,
	hold_at_terminal_price: '',
	account_discount_price: 60,
	account_discount: 1,
	incentive_discount_percentage: '',
	showDeliveryEstimate: false,
	residentialPickup: false,
	alwaysResidentialDelivery: false,
	autoDetectedResidentialAddresses: false,
	alwaysLiftGatePickup: false,
	alwaysLiftGateDelivery: false,
	offerLiftGateDelivery: false,
	autoDetectedResidentialAddressesLfg: false,
	weight_of_handling_unit: '',
	max_weight_per_handling_unit: '',
	returnRates: false,
	quote_details: 1,
}

function QuoteSettingsComponentWwe(props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
	const dispatch = useDispatch()

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings()
		}
	}, [props.quoteSettings])

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

	const getQuoteSettings = () => {
		setQuoteSettingsState({
			...quoteSettingsState,
			...props.quoteSettings,
		})

		setLoading(false)
	}

	const onFinish = data => {
		data = {
			...quoteSettingsState,
			...data,
			carrierId: +props.carrierId,
		}
		console.log(data)
		let checkCS = data?.fedex_freight_priority || data?.fedex_freight_economy
		if (!data?.hold_at_terminal) {
			data = {
				...data,
				hold_at_terminal_price: props?.quoteSettings?.hold_at_terminal_price,
			}
		}
		let errormsg = ''

		/*errormsg = validateHandlingFeeMarkup(
			data?.weight_of_handling_unit,
			'Weight of Handling Unit'
		)*/

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.handling_free_markup,
				'Handling fee'
			)
		}
		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.hold_at_terminal_price,
				'Hold at terminal fee'
			)
		}
		if (data?.account_discount === 2) {
			if (
				data?.account_discount_price === null ||
				data?.account_discount_price === ''
			) {
				errormsg =
					'Promotional discount format should be 10 or 60.5, not allow to put negative value greater than 100. Only 4 digits are allowed after decimal point.'
			}
		} else {
			data.account_discount_price =
				props?.quoteSettings?.account_discount_price
		}

		if (checkCS && errormsg === '') {
			dispatch(
				postData(
					data,
					'GET_QUOTE_SETTINGS',
					'submit_quote_settings',
					props.token
				)
			)
		} else {
			errormsg =
				errormsg === ''
					? 'Please select at least one service option.'
					: errormsg
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: errormsg,
					alertMessageType: 'error',
				},
			})
		}
	}

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	const selectAllQuoteOptions = useCallback(
		checked => {
			handleStateChange('fedex_select_all', checked)

			if (checked) {
				handleStateChange('fedex_freight_economy', true)
				handleStateChange('fedex_freight_priority', true)
			} else {
				handleStateChange('fedex_freight_economy', false)
				handleStateChange('fedex_freight_priority', false)
			}
		},
		[handleStateChange]
	)

	const toggleOptions = useCallback(
		(checked, field) => {
			if (checked && quoteSettingsState[field] === true) {
				handleStateChange('fedex_select_all', checked)
			} else {
				handleStateChange('fedex_select_all', false)
			}
		},
		[handleStateChange, quoteSettingsState]
	)

	return loading || !props.quoteSettings ? (
		<Skeleton active />
	) : (
		<Fragment>
			<Form
				layout='vertical'
				name='quote_settings_info'
				className='form-wrp'
				size={'large'}
				form={form}
				onFinish={onFinish}
				initialValues={props.quoteSettings}>
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>Label As</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item
							className={'mb-0'}
							name='fedex_freight_economy_label'>
							<Input
								name='label_as'
								placeholder='LTL Freight Economy'
								value={
									props?.quoteSettings
										?.fedex_freight_economy_label ?? ''
								}
								onKeyDown={LableAsLimit}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							What the user sees during checkout, e.g. "LTL Freight
							Economy". Leave blank to display the carrier name.
						</div>
					</Col>
				</Row>
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>Label As</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item
							className={'mb-0'}
							name='fedex_freight_priority_label'>
							<Input
								name='label_as'
								placeholder='LTL Freight Priority'
								value={
									props?.quoteSettings
										?.fedex_freight_priority_label ?? ''
								}
								onKeyDown={LableAsLimit}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							What the user sees during checkout, e.g. "LTL Freight
							Priority". Leave blank to display the carrier name.
						</div>
					</Col>
				</Row>

				<QuoteServices
					quoteSettingsState={quoteSettingsState}
					selectAllQuoteOptions={selectAllQuoteOptions}
					handleChange={handleStateChange}
					toggleOptions={toggleOptions}
				/>
				<DeliveryEstimateOptions
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				<CutOffTime
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					handleChange={handleStateChange}
				/>

				<RAD
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				<LiftGateDelivery
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				{/* <HoldAtTerminal
					quoteSettingsState={quoteSettingsState}
					handleChange={handleStateChange}
				/> */}

				<HandlingUnit
					quoteSettingsState={quoteSettingsState}
					handleChange={handleStateChange}
				/>

				<Discounts
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
		alertMessageType: state.alertMessageType,
		radPlans: state.radPlans,
		installedAddons: state.installedAddons,
	}
}

export default connect(mapStateToProps)(QuoteSettingsComponentWwe)
