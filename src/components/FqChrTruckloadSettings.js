import React, { useEffect, useState } from "react"
import { Row, Col, Form, Typography, Input, Checkbox, Radio } from "antd"
import { LableAsLimit } from "../Utilities/numberValidation"
import { useSelector } from "react-redux"

const { Title } = Typography
const carrierServices = ["FQTL", "FQRL", "FQFL"]

const FqChrTruckloadSettings = ({
  quoteSettingsState,
  setQuoteSettingsState,
  props,
}) => {
  const { carriersSettings } = useSelector(state => state)
  const [inputValue, setInputValue] = useState(quoteSettingsState?.truck_label_as);

  const checkServiceEnabled = service => {
    return carriersSettings && carriersSettings.includes(service)
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
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
              <label className={"text-gray"}>Van (Default)</label>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
              <Form.Item className={"mb-0"}>
                <Radio
                  name="tl_equipment_type"
                  value={true}
                  checked={quoteSettingsState?.tl_equipment_type === 1}
                  onChange={() =>
                    setQuoteSettingsState({
                      ...quoteSettingsState,
                      tl_equipment_type: 1,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </>
        )}
        {!checkServiceEnabled(carrierServices[1]) ? null : (
          <>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
              <label className={"text-gray"}>Refrigerated</label>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
              <Form.Item className={"mb-0"}>
                <Radio
                  name="tl_equipment_type"
                  checked={quoteSettingsState?.tl_equipment_type === 2}
                  onChange={() =>
                    setQuoteSettingsState({
                      ...quoteSettingsState,
                      tl_equipment_type: 2,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </>
        )}
        {!checkServiceEnabled(carrierServices[2]) ? null : (
          <>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
              <label className={"text-gray"}>Flatbed</label>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
              <Form.Item className={"mb-0"}>
                <Radio
                  name="tl_equipment_type"
                  checked={quoteSettingsState.tl_equipment_type === 3}
                  onChange={() =>
                    setQuoteSettingsState({
                      ...quoteSettingsState,
                      tl_equipment_type: 3,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

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
          <label className={"text-gray"}>Label As</label>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
          <Form.Item className={"mb-0"} name="truck_label_as">
            <Input
              name="truck_label_as"
              value={
                props.quoteSettings ? props.quoteSettings.truck_label_as : ""
              }
              onKeyDown={LableAsLimit}
              onChange={(e) => setInputValue(e.target.value)}
              addonAfter={inputValue ? <span>{`${inputValue?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
            />
          </Form.Item>
          <div className={"text-gray"}>
            Enter a description for how you want the quote presented.
          </div>
        </Col>
      </Row>

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


      <Row gutter={30} align="middle" className="mb-3">
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
          <label className="text-gray">Truckload Weight Break</label>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
          <Form.Item className="mb-0">
            <Input
              type="number"
              min="0"
              step="0.001"
              placeholder="Leave blank to disable"
              value={quoteSettingsState.truckload_weight_break}
              onChange={(e) =>
                setQuoteSettingsState((prevSettings) => ({
                  ...prevSettings,
                  truckload_weight_break: e.target.value,
                }))
              }
            />
          </Form.Item>
          <div className="text-gray">
            The total weight of the cart will be divided by this value to determine the number of truckload shipments required.
            Leave blank to disable this calculation.
          </div>
        </Col>
      </Row>

       <Row gutter={30} align="middle" className={"mb-3"}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
          <label className={"text-gray"}>Truckload cubic volume threshold</label>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
          <Form.Item className={"mb-0"}>
            <Input
              maxLength="7"
              value={quoteSettingsState.truckload_cubic_volume_threshold}
              type="number"
              min="0"
              step="0.001"
              onChange={e =>
                setQuoteSettingsState(prevSettings => ({
                  ...prevSettings,
                  truckload_cubic_volume_threshold: e.target.value,
                }))
              }
              pattern="[0-9.?(0-9){2}?]+%?$"
            />
          </Form.Item>
          <div className={"text-gray"}>
            When the cubic volume of the cart is greater than this value then
            Truckload rate should be returned.
          </div>
        </Col>
      </Row>


      <Row gutter={30} align="middle" className="mb-3">
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={6}>
          <label className="text-gray">Truckload Cubic Volume Break</label>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
          <Form.Item className="mb-0">
            <Input
              type="number"
              min="0"
              step="0.001"
              placeholder="Leave blank to disable"
              value={quoteSettingsState.truckload_cubic_volume_break}
              onChange={(e) =>
                setQuoteSettingsState((prevSettings) => ({
                  ...prevSettings,
                  truckload_cubic_volume_break: e.target.value,
                }))
              }
            />
          </Form.Item>
          <div className="text-gray">
            The total cubic volume of cart contents will be divided by this value to determine the number of truckload shipments.
            Leave blank to disable.
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

export default FqChrTruckloadSettings