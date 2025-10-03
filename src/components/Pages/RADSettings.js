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
  Select,
  Modal,
} from "antd"
import { useDispatch, useSelector } from "react-redux"
import { submitRADSettings, getRADSettings, getRadPlans, changePlan, changeAddonSuspendStatus, changeDefaultAddress, getAddonAddressSettings } from "../../Actions/RAD"
import { changeAddonStatus } from "../../Actions/EnitureStore"

const { Title } = Typography
const { Option } = Select
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
  const { token, radSettings, installedCarriers, installedAddons, radPlans, store, addonSettings} = useSelector(state => state)
  const [pickup, setPickup] = useState(true)
  const [suspend, setSuspend] = useState(false)
  const [cancelSubsriptionVisible, SetCancelSubsriptionVisible] = useState(false)
  const [newPlan, SetNewPlan] = useState(0)
  const [address, setAddress] = useState(1)
  const [isAddonDisabled, setIsAddonDisabled] = useState(false)
  const RAD_ADDON = 'RAD'

  useEffect(() => {
    if (!radSettings) {
      dispatch(getRADSettings(token))
    }

    if (!radPlans) {
      dispatch(getRadPlans(token))
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

    if (addonSettings) {
      setAddress(addonSettings.unconfirmed_default)
    }
  }, [dispatch, radSettings, token, radPlans, addonSettings])

  const isRadSuspend = radPlans?.currentPackage?.status === null || radPlans?.currentPackage?.status === 3 || radPlans?.currentPackage?.status === 0

  const isRadInstalled = ((installedAddons?.find(add => add.short_code === RAD_ADDON && add.is_enabled == 1) && !isRadSuspend) ||
    (radPlans?.currentPackage !== null && radPlans?.currentPackage?.status !== 0)) && !isAddonDisabled
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

  const handleChangePlan = () => {
    dispatch(changePlan(token, newPlan?.id, SetCancelSubsriptionVisible))
  }

  const chanePlanAction = (plan_value) => {
    if (plan_value === 'disable_addon') {
      // Disable the RAD addon
      const radAddon = installedAddons?.find(add => add.short_code === RAD_ADDON)
      if (radAddon?.id) {
        dispatch(changeAddonStatus(radAddon.id, token))
      }
      setIsAddonDisabled(true)
    } else {
      setIsAddonDisabled(false)
      if (plan_value === 'disable' || plan_value === 7 || plan_value === 22) {
        dispatch(changePlan(token, plan_value, SetCancelSubsriptionVisible))
      } else {
        SetNewPlan(
          radPlans?.allRadPackages.find(({ id }) => id === plan_value)
        )
        SetCancelSubsriptionVisible(true)
      }
    }
  }

  const handleAddonSuspendStatus = (value) => {
    let action = value ? 3 : 1
    dispatch(
      changeAddonSuspendStatus(
        radPlans?.currentPackage?.package_id,
        token,
        action
      )
    )
  }

  const onChange = (e) => {
    setAddress(e.target.value)
    dispatch(changeDefaultAddress('addon_id', token, e.target.value))
  }

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
              <div className="mb-1 mt-3">
                <label className="text-gray mb-1" style={{ display: 'block', fontWeight: 'bold' }}>
                  Residential Address Detection Plan Management
                </label>
                <p className="text-gray mb-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                  When enabled, the address type of the ship-to address will be retrieved from a database sourced from the USPS.
                  The enabled shipping providers will be informed if the address is residential so that their residential delivery
                  fee is included in their shipping rate estimates. Refer to the{' '}
                  <a
                    href='https://eniture.com/bigcommerce-real-time-shipping-quotes/#documentation'
                    target='_blank'
                    rel='noreferrer'
                  >
                    User's Guide
                  </a>{' '}
                  for more information.
                </p>
              </div>
            </Col>

            <Col className="gutter-row" xs={24} sm={12} md={10} lg={8} xl={6}>
              <Form.Item className="mb-2">
                <label className="text-gray" style={{ fontSize: '13px', fontWeight: '600' }}>
                  Auto-renew Plan:
                </label>
                <Select
                  defaultValue={
                    radPlans?.currentPackage === null
                      ? 'disable_addon'
                      : radPlans?.currentPackage
                          ?.package_to_be_charge_status === 1
                      ? radPlans?.currentPackage?.to_be_charge_package_id
                      : radPlans?.currentPackage?.status === 0
                      ? 'disable_addon'
                      : radPlans?.currentPackage
                          ?.package_to_be_charge_status === 'Trial'
                      ? '100/15 days ($0)'
                      : radPlans?.currentPackage
                          ?.package_to_be_charge_status === 'Development Plan'
                      ? radPlans?.currentPackage
                          ?.total_hits  + '/' + radPlans?.currentPackage
                          ?.current_package_period + ' Development Plan ($0)'
                      : radPlans?.currentPackage?.package_to_be_charge_status
                  }
                  style={{ width: '100%' }}
                  onChange={chanePlanAction}
                  name='plan_value'
                  size="small"
                >
                  <Option key='disable_addon' value='disable_addon'>
                    Disable (default)
                  </Option>
                  {radPlans?.currentPackage !== null &&
                  radPlans?.currentPackage?.current_package_name !==
                    'Trial' && radPlans?.currentPackage?.current_package_name !==
                    'Development Plan' &&
                  radPlans?.currentPackage?.status !== 0 ? (
                    <Option key='disable' value='disable'>
                      Disable
                    </Option>
                  ) : null}
                  {radPlans?.allRadPackages?.length > 0
                    ? radPlans?.allRadPackages?.map(plan =>
                        plan?.status && (
                          plan.cost !== 0
                            ? <Option key={plan.id} value={plan.id} disabled={store?.plan_level === 'Sandbox Storecc'}>
                              {Intl.NumberFormat('en-US').format(
                                plan.htis
                              )}/mo (${plan.cost})
                              </Option>
                            : (plan.name == 'Development Plan' && store?.plan_level == 'Sandbox Storecc')
                            ? <Option key={plan.id} value={plan.id}>
                              {Intl.NumberFormat('en-US').format(
                                plan.htis
                              )}/5 years {plan.name} (${
                                plan.cost
                              })
                              </Option>
                            : (plan.name == 'Trial' && store?.plan_level != 'Sandboxcc Store')
                            ? <Option key={plan.id} value={plan.id} disabled={store?.plan_level === 'Sandboxcc Store'}>
                                {Intl.NumberFormat('en-US').format(
                                  plan.htis
                                )}/15 days (${plan.cost})
                              </Option>
                            : null
                        )
                      )
                    : null
                  }
                </Select>

                {radPlans?.currentPackage === null ? (
                  <p className="text-gray" style={{ fontSize: '13px', marginTop: '8px' }}>
                    <strong>You have not activated any plan. Select plan from dropdown.</strong>
                  </p>
                ) : (
                  <Fragment>
                    {radPlans?.currentPackage?.current_package_name === null ? (
                      <p className="text-gray" style={{ fontSize: '13px', marginTop: '8px' }}>
                        <strong>No plan is activated.</strong>
                      </p>
                    ) : radPlans?.currentPackage?.status === 0 ? (
                      <p className="text-gray" style={{ fontSize: '13px', marginTop: '8px' }}>
                        <strong>Your current subscription is expired.</strong>
                      </p>
                    ) : (
                      <div style={{ marginTop: '8px' }}>
                        <div className="mb-1">
                          <span className="text-gray" style={{ fontSize: '13px', fontWeight: '600' }}>Current plan: </span>
                          <span className="text-gray" style={{ fontSize: '13px' }}>
                            ${radPlans?.currentPackage?.current_package_cost}/{radPlans?.currentPackage?.current_package_period}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray" style={{ fontSize: '13px', fontWeight: '600' }}>Usage: </span>
                          <span className="text-gray" style={{ fontSize: '13px' }}>
                            {Intl.NumberFormat('en-US').format(radPlans?.currentPackage?.consumed_hits)}/
                            {Intl.NumberFormat('en-US').format(radPlans?.currentPackage?.total_allowed_hits)}
                            {radPlans?.currentPackage?.total_allowed_hits !== 'Unlimited' &&
                              ` (${radPlans?.currentPackage?.consumed_hits_in_per}%)`}
                          </span>
                        </div>
                        <div className="mb-0">
                          <Checkbox
                            onChange={(e) => {
                              handleAddonSuspendStatus(e.target.checked);
                              setSuspend(e.target.checked);
                            }}
                            checked={suspend || radPlans?.currentPackage?.status === 3}
                            defaultValue={radPlans?.currentPackage?.status}
                          >
                            Suspend Use
                          </Checkbox>
                        </div>
                      </div>
                    )}
                  </Fragment>
                )}
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

      <Modal
        title='Note!'
        visible={cancelSubsriptionVisible}
        onCancel={() => SetCancelSubsriptionVisible(false)}
        centered
        onOk={() => handleChangePlan()}
        okText='Confirm'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        You have elected to enable the {/*newPlan?.name*/} Residential Address
        Detection feature. By confirming this election you will be charged for
        the {Intl.NumberFormat('en-US').format(newPlan?.htis)}/mo ($
        {newPlan?.cost}.00) plan. To ensure service continuity the plan will
        automatically renew each month, or when the plan is depleted, whichever
        comes first. You can change which plan is put into effect on the next
        renewal date by updating the selection on this page at anytime.
      </Modal>
    </Fragment>
  )
}

export default ShippingGroupsComponent
