import React, { Fragment, useState, useEffect, useCallback } from "react"
import { Typography, Row, Col, Form, Input, Skeleton, Radio } from "antd"
import { connect, useDispatch } from "react-redux"
import { postData } from "../../../Actions/Action"
import { getQuoteSettings } from "../../../Actions/Settings"
import {
  handlingFeeMarkup,
  validateHandlingFeeMarkup,
} from "../../../Utilities/numberValidation"
import DeliveryEstimateOptions from "../../DeliveryEstimateOptions"
import CutOffTime from "../../CutOffTime"
import CanadaToCanada from "./Services/CanadaToCanada"
import InternationalServices from "./Services/InternationalServices"
import CanadaToUS from "./Services/CanadaToUS"
import GroundTransit from "../../GroundTransit"
import RAD from "../../RAD"
import HazardousMaterial from "../../HazardousMaterial"
import SaveButton from "../../SaveButton"

const { Title } = Typography
const initialState = {
  carrier_services: {},
  delivery_estimate_options: 1,
  showDeliveryEstimate: false,
  order_cut_off_time: "",
  fulfillment_offset_days: "",
  select_all_week_days: false,
  all_week_days_select: true,
  week_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
}

function QuoteSettingsComponentWweSmall(props) {
  const [loading, setLoading] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [internationalcheckAll, setInternationalCheckAll] = useState(false)
  const [CanadaToUSCheckAll, setCanadaToUSCheckAll] = useState(false)
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
      checks?.purolator_express &&
      checks?.purolator_express_9AM &&
      checks?.purolator_express_10__30AM &&
      checks?.purolator_ground &&
      checks?.purolator_ground_9AM &&
      checks?.purolator_ground_10__30AM
    ) {
      setCheckAll(true)
    }

    if (
      checks?.purolator_express_international &&
      checks?.purolator_express_international_12_am
    ) {
      setInternationalCheckAll(true)
    }

    if (
      checks?.purolator_ground_us &&
      checks?.purolator_express_us &&
      checks?.purolator_express_us_9_am &&
      checks?.purolator_express_us_10_30am
    ) {
      setCanadaToUSCheckAll(true)
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
        [e.target.name]: !quoteSettingsState?.carrier_services?.[e.target.name],
      },
    })

    /*if (checkAll && !e.target.checked) {
			setCheckAll(false)
			return
		}*/

    const checks = {
      purolator_express:
        quoteSettingsState?.carrier_services?.purolator_express,
      purolator_express_9AM:
        quoteSettingsState?.carrier_services?.purolator_express_9AM,
      purolator_express_10__30AM:
        quoteSettingsState?.carrier_services?.purolator_express_10__30AM,
      purolator_ground: quoteSettingsState?.carrier_services?.purolator_ground,
      purolator_ground_9AM:
        quoteSettingsState?.carrier_services?.purolator_ground_9AM,
      purolator_ground_10__30AM:
        quoteSettingsState?.carrier_services?.purolator_ground_10__30AM,
    }
    if (Object.keys(checks).includes(e.target.name)) {
      checks[e.target.name] = e.target.checked
      const isCheckedAll = Object.values(checks).every(ck => ck)
      setCheckAll(isCheckedAll)
    }

    const internationalChecks = {
      purolator_express_international:
        quoteSettingsState?.carrier_services?.purolator_express_international,
      purolator_express_international_12_am:
        quoteSettingsState?.carrier_services
          ?.purolator_express_international_12_am,
    }

    if (Object.keys(internationalChecks).includes(e.target.name)) {
      internationalChecks[e.target.name] = e.target.checked
      const internationalIsCheckAll = Object.values(internationalChecks).every(
        ck => ck
      )
      setInternationalCheckAll(internationalIsCheckAll)
    }

    const canadaToUSChecks = {
      purolator_ground_us:
        quoteSettingsState?.carrier_services?.purolator_ground_us,
      purolator_express_us:
        quoteSettingsState?.carrier_services?.purolator_express_us,
      purolator_express_us_9_am:
        quoteSettingsState?.carrier_services?.purolator_express_us_9_am,
      purolator_express_us_10_30am:
        quoteSettingsState?.carrier_services?.purolator_express_us_10_30am,
    }

    if (Object.keys(canadaToUSChecks).includes(e.target.name)) {
      canadaToUSChecks[e.target.name] = e.target.checked
      const CanadaToUSIsCheckAll = Object.values(canadaToUSChecks).every(
        ck => ck
      )
      setCanadaToUSCheckAll(CanadaToUSIsCheckAll)
    }
  }

  const allCheckHandler = () => {
    setCheckAll(!checkAll)

    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        purolator_express: !checkAll,
        purolator_express_9AM: !checkAll,
        purolator_express_10__30AM: !checkAll,
        purolator_ground: !checkAll,
        purolator_ground_9AM: !checkAll,
        purolator_ground_10__30AM: !checkAll,
      },
    })
  }

  const internationalAllCheckHandler = checked => {
    setInternationalCheckAll(checked)

    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        purolator_express_international: checked,
        purolator_express_international_12_am: checked,
      },
    })
  }

  const CanadatoUSAllCheckHandler = checked => {
    setCanadaToUSCheckAll(checked)

    setQuoteSettingsState({
      ...quoteSettingsState,
      carrier_services: {
        ...quoteSettingsState.carrier_services,
        purolator_ground_us: checked,
        purolator_express_us: checked,
        purolator_express_us_9_am: checked,
        purolator_express_us_10_30am: checked,
      },
    })
  }

  const onFinish = data => {
    let CS = quoteSettingsState?.carrier_services ?? {}
    let checkCS =
      CS?.purolator_express ||
      CS?.purolator_express_9AM ||
      CS?.purolator_express_10__30AM ||
      CS?.purolator_ground ||
      CS?.purolator_ground_9AM ||
      CS?.purolator_ground_10__30AM ||
      CS?.purolator_express_international ||
      CS?.purolator_express_international_12_am ||
      CS?.purolator_ground_us ||
      CS?.purolator_express_us ||
      CS?.purolator_express_us_9_am ||
      CS?.purolator_express_us_10_30am

    console.log(quoteSettingsState) //return false;
    var errormsg = ""
    if (errormsg === "") {
      errormsg = validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express_markup,
        "Purolator Express markup ",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express9_a_m_markup,
        "Purolator Express 9 A.M. markup",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express10_30_a_m_markup,
        "Purolator Express 10:30 A.M. markup",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_ground_markup,
        "Purolator Ground markup",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_ground9_a_m_markup,
        "Purolator Ground 9 A.M. markup",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_ground10_30_a_m_markup,
        "Purolator Ground 10:30 A.M. markup",
        true
      )
    }

    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.handling_fee_markup,
        "Handling Fee markup",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.air_hazardous_material_fee,
        "Air Hazardous Material Fee",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.ground_hazardous_material_fee,
        "Ground Hazardous Material Fee",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_ground_us_markup,
        "Purolator Ground U.S.",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express_us_markup,
        "Purolator Express U.S.",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express_us_9_am_markup,
        "Purolator Express U.S. 9 A.M",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services?.purolator_express_us_10_am_markup,
        "Purolator Express U.S. 10 A.M.",
        true
      )
    }
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services
          ?.purolator_express_international_markup,
        "Purolator Express International",
        true
      )
    }

    /////////////////International////////////
    if (errormsg === "") {
      errormsg += validateHandlingFeeMarkup(
        quoteSettingsState?.carrier_services
          ?.purolator_express_international_12_am_markup,
        "Purolator Express International 12 A.M.",
        true
      )
    }

    //////////////

    if (checkCS && errormsg === "") {
      props.postData(
        { ...quoteSettingsState, carrierId: +props.carrierId },
        props.token
      )
    } else {
      errormsg =
        errormsg === ""
          ? "Please select at least one service option."
          : errormsg
      errormsg = errormsg.split("exploder")[0]

      dispatch({
        type: "ALERT_MESSAGE",
        payload: {
          showAlertMessage: true,
          alertMessage: errormsg,
          alertMessageType: "error",
        },
      })

      setTimeout(() => {
        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            showAlertMessage: false,
            alertMessage: errormsg,
            alertMessageType: "error",
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
    add => add.short_code === "RAD" && add.is_enabled === 1
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
        layout="vertical"
        name="quote_settings_info"
        className="form-wrp"
        size={"large"}
        onFinish={onFinish}
        initialValues={props.quoteSettings}
      >
        {/* UPS SERVICES */}
        <Row gutter={24} align="middle" className={"mb-4"}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>Purolator Services</Title>
          </Col>

          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className={"text-black"}>
              The services selected will display in the cart if they are
              available for the origin and destination addresses, and if the
              Purolator Rate Estimate API has been enabled for the corresponding
              shipping zone.
            </label>
          </Col>
        </Row>

        <Row className={"mb-2"}>
          <CanadaToCanada
            quoteSettingsState={quoteSettingsState}
            checkAll={checkAll}
            allCheckHandler={allCheckHandler}
            onCheck={onCheck}
            onChange={onChange}
          />

          <CanadaToUS
            quoteSettingsState={quoteSettingsState}
            CanadaToUSCheckAll={CanadaToUSCheckAll}
            CanadatoUSAllCheckHandler={CanadatoUSAllCheckHandler}
            onChange={onChange}
            onCheck={onCheck}
          />
          <InternationalServices
            quoteSettingsState={quoteSettingsState}
            internationalcheckAll={internationalcheckAll}
            internationalAllCheckHandler={internationalAllCheckHandler}
            onChange={onChange}
            onCheck={onCheck}
          />
        </Row>

        <Row className={"mb-2"}></Row>
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

        <Row gutter={24} className={"mb-3"}>
          <Col
            className="gutter-row"
            style={{ paddingTop: "11px" }}
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={6}
          >
            <label className={"text-gray"}>Handling Fee / Markup</label>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={18} xl={18}>
            <Form.Item className={"mb-0"}>
              <Input
                type="text"
                name="handling_fee_markup"
                maxLength="7"
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
            <div className={"text-gray"}>
              Amount excluding tax. Enter an amount, e.g 3.75, or a percentage,
              e.g, 5%. Leave blank to disable.
            </div>
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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    postData: (data, token) =>
      dispatch(
        postData(data, "GET_QUOTE_SETTINGS", "submit_quote_settings", token)
      ),
    getSettings: (token, carrier_id) =>
      dispatch(getQuoteSettings(token, carrier_id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuoteSettingsComponentWweSmall)
