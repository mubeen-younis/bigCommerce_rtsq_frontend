import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Form, Input, Skeleton, Radio } from 'antd';
import { connect, useDispatch } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';
import {
  handlingFeeMarkup,
  validateHandlingFeeMarkup,
} from '../../../Utilities/numberValidation';
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions';
import CutOffTime from '../../CutOffTime';
import DomesticServices from './Services/DomesticServices';
import InternationalServices from './Services/InternationalServices';
import GroundTransit from '../../GroundTransit';
import HazardousMaterial from '../../HazardousMaterial';
import SaveButton from '../../SaveButton';
import ErrorManagment from '../../ErrorManagment';
import EnableLogs from '../../EnableLogs';

const { Title } = Typography;
const initialState = {
  carrier_services: {
    ups_ground: false,
    ups_ground_international: false,
    ups_2nd_day_air: false,
    ups_2nd_day_air_am: false,
    ups_next_day_air_saver: false,
    ups_next_day_air: false,
    ups_next_day_air_early_am: false,
    ups_3_day_select: false,
    ups_ground_markup: '',
    ups_ground_international_markup: '',
    ups_2nd_day_air_markup: '',
    ups_2nd_day_air_am_markup: '',
    ups_next_day_air_saver_markup: '',
    ups_next_day_air_markup: '',
    ups_next_day_air_early_am_markup: '',
    ups_3_day_select_markup: '',
    ups_standard: false,
    ups_standard_international: false,
    ups_worldwide_expedited: false,
    ups_worldwide_saver: false,
    ups_worldwide_express: false,
    ups_worldwide_express_plus: false,
    ups_standard_markup: '',
    ups_standard_international_markup: '',
    ups_worldwide_expedited_markup: '',
    ups_worldwide_saver_markup: '',
    ups_worldwide_express_markup: '',
    ups_worldwide_express_plus_markup: '',
  },
  delivery_estimate_options: 1,
  error_managment: 1,
  showDeliveryEstimate: false,
  order_cut_off_time: '',
  fulfillment_offset_days: '',
  select_all_week_days: false,
  all_week_days_select: true,
  week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  number_of_transit_days: null,
  ground_metric: 1,
  returnRates: false,
  ground_service_for_hazardous_material: false,
  ground_hazardous_material_fee: null,
  air_hazardous_material_fee: null,
  handling_fee_markup: null,
  quote_details: null,
};

function QuoteSettingsComponentUpsShipEngine(props) {
  const [loading, setLoading] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [internationalcheckAll, setInternationalCheckAll] = useState(false);
  const [quoteSettingsState, setQuoteSettingsState] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
      getQuoteSettings();
    }
    // eslint-disable-next-line
  }, [props.quoteSettings]);

  const getQuoteSettings = () => {
    const checks = props.quoteSettings.carrier_services;
    if (
      checks?.ups_ground &&
      checks?.ups_3_day_select &&
      checks?.ups_2nd_day_air &&
      checks?.ups_2nd_day_air_am &&
      checks?.ups_next_day_air &&
      checks?.ups_next_day_air_saver &&
      checks?.ups_next_day_air_early_am
    ) {
      setCheckAll(true);
    }

    if (
      checks?.ups_standard_international &&
      checks?.ups_ground_international &&
      checks?.ups_worldwide_expedited &&
      checks?.ups_worldwide_saver &&
      checks?.ups_worldwide_express &&
      checks?.ups_worldwide_express_plus
    ) {
      setInternationalCheckAll(true);
    }

    setQuoteSettingsState({ ...quoteSettingsState, ...props.quoteSettings });
    setLoading(false);
  };

  const onChange = (e) => {
    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        [e.target.name]: e.target.value,
      },
    });
  };

  const onCheck = (e) => {
    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        [e.target.name]: !quoteSettingsState?.carrier_services?.[e.target.name],
      },
    });

    const checks = {
      ups_ground: quoteSettingsState?.carrier_services?.ups_ground,
      ups_3_day_select: quoteSettingsState?.carrier_services?.ups_3_day_select,
      ups_2nd_day_air: quoteSettingsState?.carrier_services?.ups_2nd_day_air,
      ups_2nd_day_air_am:
        quoteSettingsState?.carrier_services?.ups_2nd_day_air_am,
      ups_next_day_air: quoteSettingsState?.carrier_services?.ups_next_day_air,
      ups_next_day_air_saver:
        quoteSettingsState?.carrier_services?.ups_next_day_air_saver,
      ups_next_day_air_early_am:
        quoteSettingsState?.carrier_services?.ups_next_day_air_early_am,
    };

    //Marks check all for domestic services
    if (Object.keys(checks).includes(e.target.name)) {
      checks[e.target.name] = e.target.checked;
      const isCheckedAll = Object.values(checks).every((ck) => ck);
      setCheckAll(isCheckedAll);
    }

    const internationalChecks = {
      ups_standard_international:
        quoteSettingsState?.carrier_services?.ups_standard_international,
      ups_ground_international:
        quoteSettingsState?.carrier_services?.ups_ground_international,
      ups_worldwide_expedited:
        quoteSettingsState?.carrier_services?.ups_worldwide_expedited,
      ups_worldwide_saver:
        quoteSettingsState?.carrier_services?.ups_worldwide_saver,
      ups_worldwide_express:
        quoteSettingsState?.carrier_services?.ups_worldwide_express,
      ups_worldwide_express_plus:
        quoteSettingsState?.carrier_services?.ups_worldwide_express_plus,
    };

    if (Object.keys(internationalChecks).includes(e.target.name)) {
      internationalChecks[e.target.name] = e.target.checked;
      const internationalIsCheckAll = Object.values(internationalChecks).every(
        (ck) => ck
      );
      setInternationalCheckAll(internationalIsCheckAll);
    }
  };

  const allCheckHandler = () => {
    setCheckAll(!checkAll);

    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        ups_ground: !checkAll,
        ups_3_day_select: !checkAll,
        ups_2nd_day_air: !checkAll,
        ups_2nd_day_air_am: !checkAll,
        ups_next_day_air_saver: !checkAll,
        ups_next_day_air: !checkAll,
        ups_next_day_air_early_am: !checkAll,
        ups_standard: !checkAll,
      },
    });
  };

  const internationalAllCheckHandler = (checked) => {
    setInternationalCheckAll(checked);

    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        ups_standard_international: checked,
        ups_ground_international: checked,
        ups_worldwide_expedited: checked,
        ups_worldwide_saver: checked,
        ups_worldwide_express: checked,
        ups_worldwide_express_plus: checked,
      },
    });
  };

  const onFinish = (data) => {
    let CS = quoteSettingsState?.carrier_services ?? {};
    let checkCS =
      CS?.ups_2nd_day_air ||
      CS?.ups_2nd_day_air_am ||
      CS?.ups_3_day_select ||
      CS?.ups_ground ||
      CS?.ups_next_day_air ||
      CS?.ups_next_day_air_early_am ||
      CS?.ups_next_day_air_saver ||
      CS?.ups_standard ||
      CS?.ups_standard_international ||
      CS?.ups_worldwide_expedited ||
      CS?.ups_worldwide_saver ||
      CS?.ups_worldwide_express ||
      CS?.ups_worldwide_express_plus;

    var errormsg = '';
    if (errormsg === '') {
      errormsg = validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_ground_markup,
        'UPS Ground markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_3_day_select_markup,
        'UPS 3 Day Select markup',
        true
      );
    }

    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_standard_markup,
        'UPS Standard markup',
        true
      );
    }

    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_2nd_day_air_markup,
        'UPS 2nd Day Air markup',
        true
      );
    }

    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_2nd_day_air_am_markup,
        'UPS 2nd Day Air A.M. markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_next_day_air_saver_markup,
        'UPS Next Day Air Saver markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_next_day_air_markup,
        'UPS Next Day Air markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_next_day_air_early_am_markup,
        'UPS Next Day Air Early markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.handling_fee_markup,
        'Handling Fee markup',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.air_hazardous_material_fee,
        'Air Hazardous Material Fee',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.ground_hazardous_material_fee,
        'Ground Hazardous Material Fee',
        true
      );
    }

    /////////////////International////////////
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_standard_international_markup,
        'UPS Standard',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_worldwide_expedited_markup,
        'UPS Worldwide Expedited',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_worldwide_saver_markup,
        'UPS Worldwide Saver',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_worldwide_express_markup,
        'UPS Worldwide Express',
        true
      );
    }
    if (errormsg === '') {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.ups_worldwide_express_plus_markup,
        'UPS Worldwide Express Plus',
        true
      );
    }

    //////////////

    if (checkCS && errormsg === '') {
      props.postData(
        { ...quoteSettingsState, carrierId: +props.carrierId },
        props.token
      );
    } else {
      errormsg =
        errormsg === ''
          ? 'Please select at least one service option.'
          : errormsg;
      errormsg = errormsg.split('exploder')[0];

      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: true,
          alertMessage: errormsg,
          alertMessageType: 'error',
        },
      });

      setTimeout(() => {
        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            showAlertMessage: false,
            alertMessage: errormsg,
            alertMessageType: 'error',
          },
        });
      }, 1500);
    }
  };

  const handleStateChange = useCallback((name, value) => {
    setQuoteSettingsState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

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
        initialValues={props.quoteSettings}
      >
        {/* UPS SERVICES */}
        <Row gutter={24} align='middle' className={'mb-4'}>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>UPS via ShipEngine Services</Title>
          </Col>

          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className={'text-black'}>
              The services selected will display in the cart if they are
              available for the origin and destination addresses, and if the UPS
              Small Package Quotes API has been enabled for the corresponding
              shipping zone.
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

        <HazardousMaterial
          quoteSettingsState={quoteSettingsState}
          setQuoteSettingsState={setQuoteSettingsState}
        />

        <Row gutter={24} className={'mb-3'}>
          <Col
            className='gutter-row'
            style={{ paddingTop: '11px' }}
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={6}
          >
            <label className={'text-gray'}>Handling Fee / Markup</label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
            <Form.Item className={'mb-0'}>
              <Input
                type='text'
                name='handling_fee_markup'
                maxLength='7'
                //pattern='[0-9.?(0-9){2}?]+%?$'
                //pattern="^[\-\+]\s*\d+\s*$"
                //pattern='^[%$][-+]?\d+([,.]\d{1,2})?|^[-+]?\d+([,.]\d{1,2})?[%]?'
                value={quoteSettingsState?.handling_fee_markup}
                onChange={(e) =>
                  setQuoteSettingsState({
                    ...quoteSettingsState,
                    handling_fee_markup: e.target.value,
                  })
                }
                onKeyDown={handlingFeeMarkup}
              />
            </Form.Item>
            <div className={'text-gray'}>
              Amount excluding tax. Enter an amount, e.g 3.75, or a percentage,
              e.g, 5%. Leave blank to disable.
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
  );
}

const mapStateToProps = (state) => {
  return {
    quoteSettings: state.quoteSettings,
    token: state.token,
    carrierId: state.carrierId,
    plansInfo: state.plansInfo,
    installedAddons: state.installedAddons,
    radPlans: state.radPlans,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postData: (data, token) =>
      dispatch(
        postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)
      ),
    getSettings: (token, carrier_id) =>
      dispatch(getQuoteSettings(token, carrier_id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuoteSettingsComponentUpsShipEngine);
