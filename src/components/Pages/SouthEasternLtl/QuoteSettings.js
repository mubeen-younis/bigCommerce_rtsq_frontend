import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Row, Col, Form, Input, Skeleton } from 'antd'
import { connect, useDispatch } from 'react-redux'
import CutOffTime from '../../CutOffTime'
import { postData } from '../../../Actions/Action'
import {
  validateHandlingFeeMarkup,
  LableAsLimit,
} from '../../../Utilities/numberValidation'
import LiftGateDelivery from '../../LiftGateDelivery'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions'
import HandlingUnit from '../../HandlingUnit'
import SaveButton from '../../SaveButton'
import WeightThreshold from '../../WeightThreshold'
import ErrorManagment from '../../ErrorManagment'

const initialState = {
  label_as: '',
  delivery_estimate_options: 1,
  order_cut_off_time: '',
  fulfillment_offset_days: '',
  error_managment:1,
  all_week_days_select: true,
  week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  residentialPickup: false,
  alwaysResidentialDelivery: false,
  autoDetectedResidentialAddresses: false,
  alwaysLiftGatePickup: false,
  alwaysLiftGateDelivery: false,
  offerLiftGateDelivery: false,
  autoDetectedResidentialAddressesLfg: false,
  weight_of_handling_unit: '',
  max_weight_per_handling_unit: '',
  weight_threshold: '150',
}

function QuoteSettingsComponent(props) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
  const dispatch = useDispatch()

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
    setQuoteSettingsState({
      ...quoteSettingsState,
      ...props.quoteSettings,
    })

    setLoading(false)
  }

  const onFinish = (data) => {
    data = {
      ...quoteSettingsState,
      ...data,
      carrierId: +props.carrierId,
    }

    let errormsg = ''
    if (errormsg === '') {
      errormsg = validateHandlingFeeMarkup(
        data?.handling_free_markup,
        'Handling fee'
      )
    }

    if (errormsg === '') {
      dispatch(
        postData(
          data,
          'GET_QUOTE_SETTINGS',
          'submit_quote_settings',
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
        <Row gutter={30} className={'mb-3'}>
          <Col
            className='gutter-row'
            style={{ paddingTop: '11px' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={6}
          >
            <label className={'text-gray'}>Label As</label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={'mb-0'} name='label_as'>
              <Input
                name='label_as'
                value={props?.quoteSettings?.label_as ?? ''}
                onKeyDown={LableAsLimit}
              />
            </Form.Item>
            <div className={'text-gray'}>
              What the user sees during checkout, e.g. "Freight". If left blank
              will default to "Freight".
            </div>
          </Col>
        </Row>

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

export default connect(mapStateToProps)(QuoteSettingsComponent)
