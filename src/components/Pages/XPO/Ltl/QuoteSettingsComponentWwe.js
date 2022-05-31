import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Row, Form, Col, Input, Skeleton, Checkbox } from 'antd'

import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
  validateHandlingFeeMarkup,
  LableAsLimit,
} from '../../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../../DeliveryEstimateOptions'
import CutOffTime from '../../../CutOffTime'
import RAD from '../../../RAD'
import LiftGateDelivery from '../../../LiftGateDelivery'
// import HoldAtTerminal from '../../../HoldAtTerminal'
import HandlingUnit from '../../../HandlingUnit'
import SaveButton from '../../../SaveButton'

const initialState = {
  label_as: '',
  showDeliveryEstimate: false,
  delivery_estimate_options: 1,
  order_cut_off_time: '',
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
  hold_at_terminal: false,
  hold_at_terminal_price: '',
  weight_of_handling_unit: '',
  max_weight_per_handling_unit: '',
  return_rates_threshold: false,
  weight_threshold: '',
}

function QuoteSettingsComponentWwe(props) {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)

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
                value={props.quoteSettings ? props.quoteSettings.label_as : ''}
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

        <Row gutter={30} className='mb-3'>
          <Col
            className='gutter-row'
            style={{ paddingTop: '11px' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={6}
          >
            <label className={'text-gray'}>
              Return LTL quotes when an order parcel shipment weight exceeds the
              weight threshold
            </label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
            <Form.Item className={'mb-0'}>
              <Checkbox
                checked={quoteSettingsState.return_rates_threshold}
                onChange={(e) =>
                  handleStateChange('return_rates_threshold', e.target.checked)
                }
              />
            </Form.Item>
            <div className={'text-gray'}>
              Return LTL quotes when an order parcel shipment weight exceeds the
              weight threshold When checked, the LTL Freight Quote will return
              quotes when an order’s total weight exceeds the weight threshold
              (the maximum permitted by WWE and UPS), even if none of the
              products have settings to indicate that it will ship LTL Freight.
              To increase the accuracy of the returned quote(s), all products
              should have accurate weights and dimensions.
            </div>
          </Col>
        </Row>

        {quoteSettingsState.return_rates_threshold && (
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
              <label className={'text-gray'}>
                Weight threshold for LTL Freight Quotes
              </label>
            </Col>
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
              <Form.Item
                className={'mb-0'}
                name='weight_threshold'
                rules={[
                  {
                    require: quoteSettingsState.return_rates_threshold,
                  },
                ]}
              >
                <Input
                  maxLength='7'
                  value={quoteSettingsState.weight_threshold}
                  type='number'
                  min='0'
                  step='0.001'
                  max='150'
                  pattern='[0-9.?(0-9){2}?]+%?$'
                  required={quoteSettingsState.return_rates_threshold}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

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
