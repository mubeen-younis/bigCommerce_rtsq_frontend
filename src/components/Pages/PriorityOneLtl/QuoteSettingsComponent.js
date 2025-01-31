import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Select, Row, Col, Form, Input, Skeleton } from 'antd'

import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getQuoteSettings } from '../../../Actions/Settings'
import { checkDigitsAfterDecimal, checkValueLimit, validateHandlingFeeMarkup } from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions'
import CutOffTime from '../../CutOffTime'
import InsideDeliverySettings from '../../InsideDeliverySettings'
import LiftGateDelivery from '../../LiftGateDelivery'
import HandlingUnit from '../../HandlingUnit'
import RatingMethod from './RatingMethod'
import SaveButton from '../../SaveButton'
import WeightThreshold from '../../WeightThreshold'
import LimitedAccessSettings from '../../LimitedAccessSettings'
import ErrorManagment from '../../ErrorManagment'
import NotifyBeforeDelivery from '../../NotifyBeforeDelivery'

const { Option } = Select
const initialState = {
  number_of_options: 1,
  showDeliveryEstimate: false,
  delivery_estimate_options: 1,
  error_managment:1,
  order_cut_off_time: '',
  fulfillment_offset_days: '',
  all_week_days_select: true,
  week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  alwaysResidentialDelivery: false,
  autoDetectedResidentialAddresses: false,
  alwaysLiftGateDelivery: false,
  offerLiftGateDelivery: false,
  autoDetectedResidentialAddressesLfg: false,
  returnRates: false,
  weight_threshold: '150',
  return_rates: false,
  always_quote_notify: false,
  offer_notify_as_option: false,
}

function QuoteSettingsComponentWwe(props) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
  const [ratingMethod, setRatingMethod] = useState(1)
  const { thresholdSetting, staffNoteSettings } = useSelector(state => state)

  useEffect(() => {
    if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
      getQuoteSettings()
    }

    // eslint-disable-next-line
  }, [props.quoteSettings])

  const radCheck = props.installedAddons.find(
    (add) => add.short_code === 'RAD' && add.is_enabled === 1
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
    let ratingMethodInit =
      props.quoteSettings.method !== undefined ? props.quoteSettings.method : 1
    setRatingMethod(ratingMethodInit)

    setQuoteSettingsState((prevState) => ({
      ...prevState,
      ...props.quoteSettings,
    }))
    setLoading(false)
  }

  const onFinish = (data) => {
    data = {
      ...quoteSettingsState,
      ...data,
      carrierId: +props.carrierId,
    }

    let errormsg = validateHandlingFeeMarkup(
      data?.handling_free_markup,
      'Handling fee'
    )

    if (data?.offer_limited_access_delivery === true || data?.always_limited_access_delivery === true) {
      if (data?.limited_access_fee === '' || data?.limited_access_fee === undefined || data?.limited_access_fee === null) {
        errormsg =
          'Limited access delivery is enabled you must enter limited access delivery fee.'
      } else if (checkDigitsAfterDecimal(data?.limited_access_fee, 2)) {
        errormsg =
          'Limited access delivery fee only 2 digits are allowed after decimal point.'
      } else if (checkValueLimit(data?.limited_access_fee, 7)) {
        errormsg =
          'Limited access delivery fee only 7 digits are allowed.'
      }
    }

    if (errormsg === '') {
      props.postData(data, props.token)
      dispatch(
        postData(
          thresholdSetting,
          'GET_THRESHOLD_SETTINGS',
          'submit_threshold_settings',
          props.token
        )
      )
      dispatch(
				postData(
					staffNoteSettings,
					'GET_STAFFNOTE_SETTINGS',
					'submit_staffnote_settings',
					props.token
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
    setQuoteSettingsState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }, [])

  return loading ||
    props.quoteSettings === undefined ||
    props.quoteSettings === null ? (
    <Skeleton active />
  ) : (
    <Fragment>
      <Form
        layout='vertical'
        name='quote_settings_info'
        className='form-wrp'
        size={'large'}
        onFinish={onFinish}
        initialValues={props.quoteSettings}
      >
        <RatingMethod
          props={props}
          quoteSettingsState={quoteSettingsState}
          handleChange={handleStateChange}
          ratingMethod={ratingMethod}
          setRatingMethod={setRatingMethod}
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
          showLiftGatePickup={false}
        />

        <NotifyBeforeDelivery
				  quoteSettingsState={quoteSettingsState}
				  setQuoteSettingsState={setQuoteSettingsState}
			  />

        <LimitedAccessSettings
          quoteSettingsState={quoteSettingsState}
          setQuoteSettingsState={setQuoteSettingsState}
          islimitedAccessFee = {true}
        />
        
        {/* Below committed code will use for future use */}
        {/* 
        <InsideDeliverySettings
          quoteSettingsState={quoteSettingsState}
          setQuoteSettingsState={setQuoteSettingsState}
        /> */}
        
        <WeightThreshold
          quoteSettingsState={quoteSettingsState}
          handleStateChange={handleStateChange}
        />
        <HandlingUnit
          quoteSettingsState={quoteSettingsState}
          handleChange={handleStateChange}
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

const mapStateToProps = (state) => {
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

const mapDispatchToProps = (dispatch) => {
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
)(QuoteSettingsComponentWwe)
