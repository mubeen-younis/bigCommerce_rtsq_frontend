import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Form, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getQuoteSettings } from '../../../Actions/Settings'
import { validateHandlingFeeMarkup } from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions'
import CutOffTime from '../../CutOffTime'
import LiftGateDelivery from '../../LiftGateDelivery'
import HandlingUnit from '../../HandlingUnit'
import RatingMethod from './RatingMethod'
import SaveButton from '../../SaveButton'
import WeightThreshold from '../../WeightThreshold'
import TruckloadSettings from '../../TruckloadSettings'
import { getServices, getAddTabSettings } from '../../../Actions/Carriers'

const initialState = {
	number_of_options: 1,
	showDeliveryEstimate: false,
	delivery_estimate_options: 1,
	order_cut_off_time: '',
	error_managment:1,
	fulfillment_offset_days: '',
	all_week_days_select: true,
	week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	residentialPickup: false,
	alwaysResidentialDelivery: false,
	autoDetectedResidentialAddresses: false,
	alwaysLiftGatePickup: false,
	alwaysLiftGateDelivery: false,
	offerLiftGateDelivery: false,
	autoDetectedResidentialAddressesLfg: false,
	handling_free_markup: '',
}

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(true)
	const [truckLoading, setTruckLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
	const [ratingMethod, setRatingMethod] = useState(1)
	const { quoteSettings, installedAddons, token, carrierId, radPlans, carriersSettings, thresholdSetting } =
		useSelector(state => state)

	useEffect(() => {
		const setQuoteSettings = () => {
			let ratingMethodInit =
				quoteSettings.method !== undefined ? quoteSettings.method : 1
			setRatingMethod(ratingMethodInit)

			setQuoteSettingsState(prevState => ({
				...prevState,
				...quoteSettings,
			}))
			setLoading(false)
		}

		if (quoteSettings !== null && quoteSettings !== undefined) {
			setQuoteSettings()
		} else {
			dispatch(getQuoteSettings(token, carrierId))
		}
	}, [carrierId, dispatch, quoteSettings, token])

	useEffect(() => {
		if(!carriersSettings){
			dispatch(getServices(token, carrierId))
			dispatch(getAddTabSettings(token, carrierId))
		}
		setTruckLoading(false)
	}, [])

	const radCheck = installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	)

	let radStatus = false
	if (radCheck !== undefined) {
		radStatus =
			radPlans && radPlans?.currentPackage === null
				? false
				: radPlans && radPlans?.currentPackage?.status !== 1
				? false
				: true
	}

	const onFinish = data => {
		data = {
			...quoteSettingsState,
			...data,
			carrierId: +carrierId,
		}

		let errormsg = validateHandlingFeeMarkup(
			data?.handling_free_markup,
			'Handling fee'
		)

		if (errormsg === '') {
			dispatch(
				postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)
			)
			dispatch(
				postData(
					thresholdSetting,
					'GET_THRESHOLD_SETTINGS',
					'submit_threshold_settings',
					token
				)
			)
		} else {
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

	return loading || quoteSettings === undefined || quoteSettings === null || truckLoading ? (
		<Skeleton active />
	) : (
		<Fragment>
			<Form
				layout='vertical'
				name='quote_settings_info'
				className='form-wrp'
				size={'large'}
				onFinish={onFinish}
				initialValues={quoteSettings}>
				<RatingMethod
					props={props}
					quoteSettingsState={quoteSettingsState}
					handleChange={handleStateChange}
					ratingMethod={ratingMethod}
					setRatingMethod={setRatingMethod}
				/>

				<TruckloadSettings
					props={props}
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					ratingMethod={ratingMethod}
					handleChange={handleStateChange}
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

				<LiftGateDelivery
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				<WeightThreshold
					quoteSettingsState={quoteSettingsState}
					handleStateChange={handleStateChange}
				/>

				<HandlingUnit
					quoteSettingsState={quoteSettingsState}
					handleChange={handleStateChange}
				/>

				<SaveButton />
			</Form>
		</Fragment>
	)
}

export default QuoteSettingsComponentWwe
