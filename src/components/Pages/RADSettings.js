import React, { Fragment, useState, useCallback, useEffect } from "react"
import {
  Typography,
  Row,
  Col,
  Space,
  Button,
  Form,
  Skeleton,
  Checkbox,
  Card,
  Radio,
  Tooltip,
} from "antd"
import { useDispatch, useSelector } from "react-redux"
import { submitRADSettings, getRADSettings } from "../../Actions/RAD"

const { Title } = Typography
const initialState = {
  always_quote_residential_delivery: false,
  return_rates: false,
  residential_delivery_auto_detect: false,
  unconfirmed_address_type: 1,
  suppress_rad_notation: 1,
  always_residential_pickup_delivery: false,
}

function ShippingGroupsComponent() {
  const [settings, setSettings] = useState(initialState)
  const dispatch = useDispatch()
  const { token, radSettings, installedCarriers, installedAddons, radPlans} = useSelector(state => state)
  const [pickup, setPickup] = useState(true)
  const RAD_ADDON = 'RAD'

  useEffect(() => {
    if (!radSettings) {
      dispatch(getRADSettings(token))
    }

    if (installedCarriers) {
      for (const ic of installedCarriers) {
        if (ic.slug === "ltl-quotes" && ic.is_enabled) {
          setPickup(false)
        }
      }
    }

    if (radSettings) {
      if (radSettings?.settings) {
        const newSettings = JSON.parse(radSettings?.settings) ?? {}
        setSettings(prevSettings => ({
          ...prevSettings,
          ...newSettings,
        }))
      }
    }
  }, [dispatch, radSettings, token])

  const isRadSuspend = radPlans?.currentPackage?.status === null || radPlans?.currentPackage?.status === 3 || radPlans?.currentPackage?.status === 0

  const isRadInstalled = installedAddons?.find(add => add.short_code === RAD_ADDON && add.is_enabled == 1) && !isRadSuspend
		? true
		: false

  const handleStateChange = useCallback(e => {
    const { name, checked } = e.target

    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }))
  }, [])

  const onFinish = useCallback(() => {

    if(settings.residential_delivery_auto_detect){
      settings.residential_delivery_auto_detect = isRadInstalled
    }
    dispatch(
      submitRADSettings(
        {
          ...radSettings,
          settings,
        },
        token
      )
    )
  }, [dispatch, radSettings, settings, token])

  if (!radSettings) return <Skeleton active />

  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
        <Row>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>Address Type Settings</Title>
          </Col>
        </Row>

        <Card>
          <Row gutter={30}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item className={"mb-0"}>
                <Checkbox
                  name="always_quote_residential_delivery"
                  checked={settings.always_quote_residential_delivery}
                  onChange={e => {
                    handleStateChange(e)
                    setSettings(prevSettings => ({
                      ...prevSettings,
                      residential_delivery_auto_detect: false,
                    }))
                  }}
                >
                  Always quote residential delivery
                </Checkbox>
              </Form.Item>
            </Col>

            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item className="mb-0">
                <Checkbox
                  name="return_rates"
                  checked={settings.return_rates}
                  onChange={e => handleStateChange(e)}
                >
                  Do not return rate if the shipping address appears to be a
                  post office box
                </Checkbox>
              </Form.Item>
            </Col>

            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item className={"mb-0"}>
                <Checkbox
                  name="residential_delivery_auto_detect"
                  checked={settings.residential_delivery_auto_detect && isRadInstalled}
                  disabled={!isRadInstalled}
                  onChange={e => {
                    handleStateChange(e)
                    setSettings(prevSettings => ({
                      ...prevSettings,
                      always_quote_residential_delivery: false,
                    }))
                  }}
                >
                  Auto-detect residential addresses{" "}
                </Checkbox>
                {!isRadInstalled && (
                  <span
								    style={{
									    'font-size': '10px',
								    }}>
								    <i>(To utilize this feature, you need the Residential Address Detection add-on. Navigate to the Dashboard and go to add-ons to activate/install this extension.)</i>
						      </span>
                )}
              </Form.Item>
            </Col>
            <Col
              className="gutter-row mt-1"
              xs={24}
              sm={14}
              md={12}
              lg={12}
              xl={8}
            >
              <label
                className="text-gray ml-5"
                style={{
                  marginLeft: "1.5em",
                }}
              >
                Default unconfirmed address types to:
              </label>
            </Col>
            <Col xs={24} sm={10} md={12} lg={12} xl={16}>
              <Radio.Group
                className="mt-1 mb-2"
                onChange={e =>
                  setSettings(prevSettings => ({
                    ...prevSettings,
                    unconfirmed_address_type: +e.target.value,
                  }))
                }
                value={settings.unconfirmed_address_type}
              >
                <Space
                  direction="vertical"
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Radio
                    disabled={!settings?.residential_delivery_auto_detect || !isRadInstalled}
                    value={1}
                  >
                    Residential
                  </Radio>
                  <Radio
                    disabled={!settings?.residential_delivery_auto_detect || !isRadInstalled}
                    value={2}
                  >
                    Commercial
                  </Radio>
                </Space>
              </Radio.Group>
            </Col>
            <Col className="gutter-row" xs={14} sm={14} md={12} lg={12} xl={8}>
              <label
                className="text-gray ml-5"
                style={{
                  marginLeft: "1.5em",
                }}
              >
                Address type disclosure:
              </label>
            </Col>
            <Col xs={24} sm={10} md={12} lg={12} xl={16}>
              <Radio.Group
                className="mb-2"
                onChange={e =>
                  setSettings(prevSettings => ({
                    ...prevSettings,
                    suppress_rad_notation: +e.target.value,
                  }))
                }
                value={settings?.suppress_rad_notation}
              >
                <Space
                  direction="vertical"
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Radio
                    disabled={!settings?.residential_delivery_auto_detect || !isRadInstalled}
                    value={1}
                  >
                    Inform the shopper when the ship-to address is identified as
                    residential address
                  </Radio>
                  <Radio
                    disabled={!settings?.residential_delivery_auto_detect || !isRadInstalled}
                    value={0}
                  >
                    Don't disclose the address type to the shopper
                  </Radio>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item style={{ textAlign: "right", marginBottom: "0" }}>
                <Space>
                  <Button
                    onClick={onFinish}
                    type="primary"
                    size="medium"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Space>
    </Fragment>
  )
}

export default ShippingGroupsComponent
