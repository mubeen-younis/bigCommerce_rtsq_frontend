import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Form, Skeleton } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import { validateHandlingFeeMarkup } from '../../../../Utilities/numberValidation'
import GlobalTranz from './QuoteSettings/GlobalTranz'
import Cerasis from './QuoteSettings/Cerasis'
import HandlingUnit from '../../../HandlingUnit'
import SaveButton from '../../../SaveButton'
import WeightThreshold from '../../../WeightThreshold'
import ErrorManagment from '../../../ErrorManagment'

const initialState = {
  showDeliveryEstimate: false,
  delivery_estimate_options: 1,
  order_cut_off_time: '',
  fulfillment_offset_days: '',
  all_week_days_select: true,
  week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  residentialPickup: false,
  error_managment:1,
  alwaysResidentialDelivery: false,
  autoDetectedResidentialAddresses: false,
  alwaysLiftGatePickup: false,
  alwaysLiftGateDelivery: false,
  offerLiftGateDelivery: false,
  autoDetectedResidentialAddressesLfg: false,
  weight_of_handling_unit: '',
  max_weight_per_handling_unit: '',
  handling_free_markup: '',
  returnRates: false,
  weight_threshold: '150',
}

function QuoteSettingsComponentWwe(props) {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
  const { carrier_type } = useSelector((state) => state)

  useEffect(() => {
    if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
      getQuoteSettings()
    }
    // eslint-disable-next-line
  }, [props.quoteSettings])

  const radCheck = props.installedAddons.find(
    (add) => add.short_code === 'RAD' && add.is_enabled === 1
  )

  const handleStateChange = useCallback((name, value) => {
    setQuoteSettingsState((prevState) => ({
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

  const getQuoteSettings = () => {
    setQuoteSettingsState({
      ...quoteSettingsState,
      ...props.quoteSettings,
    })

    setLoading(false)
  }

  const onFinish = (data) => {
    data = {
      ...data,
      ...quoteSettingsState,
      carrierId: +props.carrierId,
    }

    let errormsg = ''
    if (
      !quoteSettingsState?.quickest_service &&
      quoteSettingsState?.method === 0 &&
      carrier_type === 'GTZ'
    ) {
      errormsg = 'Please select at least one service option.'
    }

    /*if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.weight_of_handling_unit,
				'Weight of Handling Unit',
				true
			)
		}

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.max_weight_per_handling_unit,
				'Maximum Weight per Handling Unit',
				true
			)
		}*/

    if (errormsg === '') {
      errormsg = validateHandlingFeeMarkup(
        data?.handling_free_markup,
        'Handling fee'
      )
    }

    if (errormsg === '') {
      props.postData(data, props.token)
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
        initialValues={props.quoteSettings}
      >
        {carrier_type === 'GTZ' && (
          <GlobalTranz
            quoteSettingsState={quoteSettingsState}
            setQuoteSettingsState={setQuoteSettingsState}
            radStatus={radStatus}
          />
        )}

        {carrier_type === 'CRS' && (
          <Cerasis
            quoteSettingsState={quoteSettingsState}
            setQuoteSettingsState={setQuoteSettingsState}
            radStatus={radStatus}
          />
        )}

        <WeightThreshold
          quoteSettingsState={quoteSettingsState}
          handleStateChange={handleStateChange}
        />

        <HandlingUnit
          quoteSettingsState={quoteSettingsState}
          handleChange={handleStateChange}
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
