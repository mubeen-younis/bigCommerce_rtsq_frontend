import React, {useEffect, useState} from "react"
import { Row, Col, Form, Typography, Input, Checkbox } from "antd"
import { LableAsLimit } from "../Utilities/numberValidation"
import { useSelector } from "react-redux"

const { Title } = Typography
const carrierServices = ["TSM", "REEF", "ABHB"]

const TruckloadSettings = ({
  quoteSettingsState,
  setQuoteSettingsState,
  props,
  ratingMethod,
}) => {
  const { carriersSettings } = useSelector(state => state)
  const [inputFlatbed, setInputFlatbed] = useState(quoteSettingsState?.flatbed);
  const [inputRefrigerated, setInputRefrigerated] = useState(quoteSettingsState?.refrigerated);
  const [inputVan, setInputVan] = useState(quoteSettingsState?.van);

  const checkServiceEnabled = service => {
    return carriersSettings && carriersSettings.includes(service) && +ratingMethod !== 3
  }

  const filterService = () => {
    const isServices =
      carriersSettings &&
      carriersSettings?.filter(cs => carrierServices.includes(cs))
    if (!isServices || !isServices?.length) {
      return false
    }
    return true
  }

  return !filterService() ? null : (
    <>
      <Row gutter={30} className={"mb-4"}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Truckload settings</Title>
        </Col>
        {!checkServiceEnabled(carrierServices[0]) ? null : (
          <>
            <Col
              className="gutter-row"
              style={{ paddingTop: "11px" }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={6}
            >
              <label className={"text-gray"}>Flatbed</label>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
              <Form.Item className={"mb-0"} name="flatbed">
                <Input
                  name="flatbed"
                  value={props.quoteSettings ? props.quoteSettings.flatbed : ""}
                  onKeyDown={LableAsLimit}
                  onChange={(e) => setInputFlatbed(e.target.value)}
                  addonAfter={inputFlatbed ? <span>{`${inputFlatbed?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
                />
              </Form.Item>
              <div className={"text-gray"}>
                What the user sees during checkout, e.g. "Freight". Leave blank
                to display "Flatbed Truckload Service".
              </div>
            </Col>
          </>
        )}
      </Row>

      {!checkServiceEnabled(carrierServices[1]) ? null : (
        <Row gutter={30} className={"mb-3"}>
          <Col
            className="gutter-row"
            style={{ paddingTop: "11px" }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={6}
          >
            <label className={"text-gray"}>Refrigerated</label>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={"mb-0"} name="refrigerated">
              <Input
                name="refrigerated"
                value={
                  props.quoteSettings ? props.quoteSettings.refrigerated : ""
                }
                onKeyDown={LableAsLimit}
                onChange={(e) => setInputRefrigerated(e.target.value)}
                addonAfter={inputRefrigerated ? <span>{`${inputRefrigerated?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
              />
            </Form.Item>
            <div className={"text-gray"}>
              What the user sees during checkout, e.g. "Freight". Leave blank to
              display "Refrigerated Truckload Service"
            </div>
          </Col>
        </Row>
      )}

      {!checkServiceEnabled(carrierServices[2]) ? null : (
        <Row gutter={30} className={"mb-3"}>
          <Col
            className="gutter-row"
            style={{ paddingTop: "11px" }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={6}
          >
            <label className={"text-gray"}>Van</label>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={"mb-0"} name="van">
              <Input
                name="van"
                value={props.quoteSettings ? props.quoteSettings.van : ""}
                onKeyDown={LableAsLimit}
                onChange={(e) => setInputVan(e.target.value)}
                addonAfter={inputVan ? <span>{`${inputVan?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
              />
            </Form.Item>
            <div className={"text-gray"}>
              What the user sees during checkout, e.g. "Freight". Leave blank to
              display "Truckload Service"
            </div>
          </Col>
        </Row>
      )}

      <Row gutter={30} align="middle" className={"mb-3"}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
          <label className={"text-gray"}>Truckload weight threshold</label>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
          <Form.Item className={"mb-0"}>
            <Input
              maxLength="7"
              value={quoteSettingsState.truckload_weight_threshold}
              type="number"
              min="0"
              step="0.001"
              onChange={e =>
                setQuoteSettingsState(prevSettings => ({
                  ...prevSettings,
                  truckload_weight_threshold: e.target.value,
                }))
              }
              pattern="[0-9.?(0-9){2}?]+%?$"
            />
          </Form.Item>
          <div className={"text-gray"}>
            When the weight of the cart is greater than this value then
            Truckload rate should be returned.
          </div>
        </Col>
      </Row>

      <Row gutter={30} align="middle" className="mb-2">
        <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
          <label className="text-gray">
            Quote LTL freight above the truckload weight threshold
          </label>
        </Col>
        <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
          <Form.Item className="mb-0">
            <Checkbox
              name="quoteltl_and_truckload"
              checked={quoteSettingsState?.quoteltl_and_truckload}
              onChange={e =>
                setQuoteSettingsState(prevSettings => ({
                  ...prevSettings,
                  quoteltl_and_truckload: e.target.checked,
                }))
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default TruckloadSettings
