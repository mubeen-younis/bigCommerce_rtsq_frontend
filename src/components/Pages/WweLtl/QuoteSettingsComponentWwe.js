import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Select, Row, Col, Form, Input, Skeleton } from 'antd'

import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getQuoteSettings } from '../../../Actions/Settings'
import { validateHandlingFeeMarkup } from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions'
import CutOffTime from '../../CutOffTime'
import InsideDeliverySettings from '../../InsideDeliverySettings'
import LiftGateDelivery from '../../LiftGateDelivery'
import HandlingUnit from '../../HandlingUnit'
import RatingMethod from './RatingMethod'
import SaveButton from '../../SaveButton'
import WeightThreshold from '../../WeightThreshold'
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
  residentialPickup: false,
  alwaysResidentialDelivery: false,
  autoDetectedResidentialAddresses: false,
  liftGatePickup: false,
  offer_inside_delivery: false,
  always_inside_delivery: false,
  alwaysLiftGatePickup: false,
  alwaysLiftGateDelivery: false,
  offerLiftGateDelivery: false,
  autoDetectedResidentialAddressesLfg: false,
  returnRates: false,
  own_arrangement: 0,
  own_arrangement_text: '',
  insurance_category: '84-General Merchandise',
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
  const { thresholdSetting } = useSelector(state => state)

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
      own_arrangement_text: quoteSettingsState.own_arrangement_text,
      insurance_category:
        quoteSettingsState.insurance_category === undefined
          ? '84-General Merchandise'
          : quoteSettingsState.insurance_category,
    }

    let errormsg = validateHandlingFeeMarkup(
      data?.handling_free_markup,
      'Handling fee'
    )

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
          showLiftGatePickup={true}
        />

        <NotifyBeforeDelivery
				  quoteSettingsState={quoteSettingsState}
				  setQuoteSettingsState={setQuoteSettingsState}
			  />
        
        <InsideDeliverySettings
          quoteSettingsState={quoteSettingsState}
          setQuoteSettingsState={setQuoteSettingsState}
        />
        
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
            <label className={'text-gray'}>Insurance Category</label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={'mb-0'} name='insurance_category'>
              <Select
                name='insurance_category'
                defaultValue={
                  props.quoteSettings &&
                  props.quoteSettings.insurance_category !== undefined
                    ? props.quoteSettings.insurance_category
                    : '84-General Merchandise'
                }
                size={'large'}
                style={{ width: '100%' }}
                onChange={(value) => {
                  //setRatingMethod(value);
                  setQuoteSettingsState({
                    ...quoteSettingsState,
                    insurance_category: value,
                  })
                }}
              >
                <Option value='84-General Merchandise'>
                  General Merchandise
                </Option>
                <Option value='85-Antiques / Art / Collectibles'>
                  Antiques / Art / Collectibles
                </Option>
                <Option value='86-Commercial Electronics (Audio; Computer: Hardware, Servers, Parts &amp; Accessories)'>
                  Commercial Electronics (Audio; Computer: Hardware, Servers,
                  Parts &amp; Accessories)
                </Option>
                <Option value='87-Consumer Electronics (laptops, cellphones, PDAs, iPads, tablets, notebooks, etc.)'>
                  Consumer Electronics (laptops, cellphones, PDAs, iPads,
                  tablets, notebooks, etc.)
                </Option>
                <Option value='88-Fragile Goods (Glass, Ceramic, Porcelain, etc.)'>
                  Fragile Goods (Glass, Ceramic, Porcelain, etc.)
                </Option>
                <Option value='89-Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)'>
                  Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)
                </Option>
                <Option value='90-Machinery, Appliances and Equipment (Medical, Restaurant, Industrial, Scientific)'>
                  Machinery, Appliances and Equipment (Medical, Restaurant,
                  Industrial, Scientific)
                </Option>
                <Option value='91-Miscellaneous / Other / Mixed'>
                  Miscellaneous / Other / Mixed
                </Option>
                <Option value='92-Non-Perishable Foods / Beverages / Commodities / Vitamins'>
                  Non-Perishable Foods / Beverages / Commodities / Vitamins
                </Option>
                <Option value='93-Radioactive / Hazardous / Restricted or Controlled Items'>
                  Radioactive / Hazardous / Restricted or Controlled Items
                </Option>
                <Option value='94-Sewing Machines, Equipment and Accessories'>
                  Sewing Machines, Equipment and Accessories
                </Option>
                <Option value='95-Stone Products (Marble, Tile, Stonework, Granite, etc.)'>
                  Stone Products (Marble, Tile, Stonework, Granite, etc.)
                </Option>
                <Option value='96-Wine / Spirits / Alcohol / Beer'>
                  Wine / Spirits / Alcohol / Beer
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <WeightThreshold
          quoteSettingsState={quoteSettingsState}
          handleStateChange={handleStateChange}
        />
        <HandlingUnit
          quoteSettingsState={quoteSettingsState}
          handleChange={handleStateChange}
        />

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
            <label className={'text-gray'}>Allow For Own Arrangement</label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={'mb-0'} name='own_arrangement'>
              <Select
                defaultValue={
                  quoteSettingsState.own_arrangement
                    ? quoteSettingsState.own_arrangement
                    : 'No'
                }
                size={'large'}
                style={{ width: '100%' }}
                onChange={(value) => {
                  setQuoteSettingsState({
                    ...quoteSettingsState,
                    own_arrangement: value,
                  })
                }}
              >
                <Option value='0'>No</Option>
                <Option value='1'>Yes</Option>
              </Select>
            </Form.Item>
            <div className={'text-gray'}>
              Adds an option in the shipping cart for users to indicate that
              they will make and pay for their own LTL shipping arrangements.
            </div>
          </Col>
        </Row>

        {quoteSettingsState.own_arrangement === '1' && (
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
              <label className={'text-gray'}>Text for Own Arrangement</label>
            </Col>
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
              <Form.Item className={'mb-0'} name='own_arrangement_text'>
                <Input
                  onChange={(e) =>
                    setQuoteSettingsState({
                      ...quoteSettingsState,
                      own_arrangement_text: e.target.value,
                    })
                  }
                  value={quoteSettingsState.own_arrangement_text}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

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
