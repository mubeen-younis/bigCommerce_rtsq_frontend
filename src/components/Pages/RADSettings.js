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
  const { token, radSettings, installedCarriers, installedAddons, radPlans, store, addonSettings } = useSelector(state => state)
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

    // Set residential_delivery_auto_detect as opposite of always_quote_residential_delivery
    settings.residential_delivery_auto_detect = !settings.always_quote_residential_delivery

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
    if (plan_value === 'disable' || plan_value === 7 || plan_value === 22) {
      dispatch(changePlan(token, plan_value, SetCancelSubsriptionVisible))
    } else {
      SetNewPlan(
        radPlans?.allRadPackages.find(({ id }) => id === plan_value)
      )
      SetCancelSubsriptionVisible(true)
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

  // Get the dropdown value based on backend data
  const getDropdownValue = () => {
    const cp = radPlans?.currentPackage
    if (!cp || cp === null) return 'disable'
    if (cp.status === 0) return 'disable'

    const status = cp.package_to_be_charge_status
    if (status === 0 || status === '0' || status === null || status === undefined) return 'disable'

    // For all cases where auto-renew is enabled, return the plan ID
    if (status === 1 || status === '1' || status === 'Trial' || status === 'Development Plan') {
      return cp.to_be_charge_package_id ? cp.to_be_charge_package_id : 'disable'
    }

    // If status is a numeric ID, return it
    if (typeof status === 'number') return status
    if (typeof status === 'string' && /^\d+$/.test(status)) return parseInt(status)

    return 'disable'
  }

  if (!radSettings) return <Skeleton active />

  return (
    <Fragment>
      <Row gutter={24} justify='center'>
        <Col
          className='gutter-row mb-3'
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={22}>
          <Title level={3}>
            Address Type Settings
          </Title>
        </Col>
      </Row>

      <Row gutter={24} justify='center' className={'mb-3'}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={22}>
          <Card style={{ width: '100%' }}>
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
                    onChange={e => handleStateChange(e)}
                  >
                    Always quote residential delivery
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="mb-1 mt-3">
                  <h3 style={{ fontWeight: "bold" }}>Automatic Address Detection Settings</h3>
                  <p style={{ marginBottom: '10px' }}>
                    When enabled, for ship-to addresses in the USA only, the app will automatically detect the
                    address type and inform the shipping provider of the result. The shipping provider will include
                    its residential delivery fee if the address type is residential. If the ship-to address is not
                    in the USA, the visitor will be offered options that include residential delivery. Ship-to addresses
                    not in the USA will not decrement the current subscription plan. The next subscription begins when
                    the current one expires or is depleted, which ever comes first.
                  </p>
                </div>
              </Col>

              <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item className="mb-2">
                  <label>
                    <strong>Auto-renew</strong>
                  </label>
                  <Select
                    value={getDropdownValue()}
                    style={{ width: '100%', marginBottom: '20px' }}
                    onChange={chanePlanAction}
                    name='plan_value'
                  >
                    <Option key='disable' value='disable'>
                      Disable (default)
                    </Option>

                    {/* If current selection is not in the allRadPackages list, add it from currentPackage */}
                    {(() => {
                      const currentValue = getDropdownValue()
                      const currentPackage = radPlans?.currentPackage

                      // Check if current value exists in allRadPackages
                      const existsInList = radPlans?.allRadPackages?.some(p => String(p.id) === String(currentValue))

                      // If not in list but we have currentPackage data, render it
                      if (!existsInList && currentValue !== 'disable' && currentPackage?.current_package_name) {
                        // Build the full label based on package details
                        let label = ''
                        const packageName = currentPackage.current_package_name
                        const totalHits = currentPackage.total_allowed_hits

                        if (packageName === 'Trial') {
                          label = `${Intl.NumberFormat('en-US').format(totalHits)}/15 days ($0) - Trial`
                        } else if (packageName === 'Development Plan') {
                          label = `${Intl.NumberFormat('en-US').format(totalHits)}/5 years ${packageName} ($0)`
                        } else {
                          // For paid plans, extract cost from current_package_cost
                          const cost = currentPackage.current_package_cost || 0
                          label = `${Intl.NumberFormat('en-US').format(totalHits)}/mo ($${cost})`
                        }

                        return (
                          <Option key={String(currentValue)} value={currentValue}>
                            {label}
                          </Option>
                        )
                      }
                      return null
                    })()}

                    {radPlans?.allRadPackages?.length > 0
                      ? radPlans?.allRadPackages?.map(plan => {
                        if (plan.cost !== 0) {
                          const htisDisplay = typeof plan.htis === 'number'
                            ? Intl.NumberFormat('en-US').format(plan.htis)
                            : 'Unlimited';
                          return (
                            <Option key={plan.id} value={plan.id} disabled={store?.plan_level === 'Sandbox Store'}>
                              {htisDisplay}/mo (${plan.cost})
                            </Option>
                          );
                        } else if (plan.name == 'Development Plan' && store?.plan_level == 'Sandbox Store') {
                          return (
                            <Option key={plan.id} value={plan.id}>
                              {Intl.NumberFormat('en-US').format(plan.htis)}/5 years {plan.name} (${plan.cost})
                            </Option>
                          );
                        } else if (plan.name == 'Trial' && store?.plan_level != 'Sandbox Store') {
                          return (
                            <Option key={plan.id} value={plan.id} disabled={store?.plan_level === 'Sandbox Store'}>
                              {Intl.NumberFormat('en-US').format(plan.htis)}/15 days (${plan.cost}) - Trial
                            </Option>
                          );
                        }
                        return null;
                      })
                      : null
                    }
                  </Select>

                  {radPlans?.currentPackage === null ? (
                    <p>
                      <strong>You have not activated any plan. Select plan from dropdown.</strong>
                    </p>
                  ) : (
                    <Fragment>
                      {radPlans?.currentPackage?.current_package_name === null ? (
                        <h1 className='mb-2'>
                          <b>No plan is activated.</b>
                        </h1>
                      ) : radPlans?.currentPackage?.status === 0 ? (
                        <h1 className='mb-2'>
                          <b>Your current subscription is expired.</b>
                        </h1>
                      ) : (
                        <Fragment>
                          <label>
                            <strong>Current plan</strong>
                          </label>

                          <div
                            style={{
                              width: '100%',
                              marginBottom: '20px',
                            }}>
                            <p style={{ marginBottom: '0' }}>
                              ${radPlans?.currentPackage?.current_package_cost}/{radPlans?.currentPackage?.current_package_period}
                            </p>
                            <p style={{ marginBottom: '0' }}>
                              Start date:{' '}
                              {new Date(
                                radPlans?.currentPackage?.subscription_time
                              )
                                .toDateString()
                                .substring(4)}{' '}
                            </p>
                            <p style={{ marginBottom: '0' }}>
                              End date:{' '}
                              {new Date(
                                radPlans?.currentPackage?.expiry_time
                              )
                                .toDateString()
                                .substring(4)}
                            </p>
                          </div>

                          <label>
                            <strong>Current usage</strong>
                          </label>

                          <div
                            style={{
                              width: '100%',
                              marginBottom: '20px',
                            }}>
                            <p style={{ marginBottom: '0' }}>
                              {Intl.NumberFormat('en-US').format(radPlans?.currentPackage?.consumed_hits)}/
                              {Intl.NumberFormat('en-US').format(radPlans?.currentPackage?.total_allowed_hits)}{' '}
                              {radPlans?.currentPackage?.consumed_hits_in_per}%{' '}
                            </p>
                          </div>

                          <Checkbox
                            onChange={(e) => {
                              handleAddonSuspendStatus(e.target.checked);
                              setSuspend(e.target.checked);
                            }}
                            checked={suspend || radPlans?.currentPackage?.status === 3}
                            defaultValue={radPlans?.currentPackage?.status}
                          >
                            Suspend use
                          </Checkbox>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </Form.Item>
              </Col>


              {/* Auto-detect residential addresses checkbox hidden - always set to true */}
              <Col
                className="gutter-row mt-1"
                xs={24}
                sm={14}
                md={12}
                lg={12}
                xl={8}
              >
                <label
                  className="ml-5"
                  style={{
                    marginLeft: "",
                    color: (isRadInstalled && !suspend && radPlans?.currentPackage?.status !== 3 && !settings.always_quote_residential_delivery) ? '#262626' : 'rgba(0, 0, 0, 0.25)',
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
                      disabled={!isRadInstalled || suspend || radPlans?.currentPackage?.status === 3 || settings.always_quote_residential_delivery}
                      value={1}
                    >
                      Residential
                    </Radio>
                    <Radio
                      disabled={!isRadInstalled || suspend || radPlans?.currentPackage?.status === 3 || settings.always_quote_residential_delivery}
                      value={2}
                    >
                      Commercial
                    </Radio>
                  </Space>
                </Radio.Group>
              </Col>
              <Col className="gutter-row" xs={14} sm={14} md={12} lg={12} xl={8}>
                <label
                  className="ml-5"
                  style={{
                    marginLeft: "",
                    color: (isRadInstalled && !suspend && radPlans?.currentPackage?.status !== 3 && !settings.always_quote_residential_delivery) ? '#262626' : 'rgba(0, 0, 0, 0.25)',
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
                      disabled={!isRadInstalled || suspend || radPlans?.currentPackage?.status === 3 || settings.always_quote_residential_delivery}
                      value={1}
                    >
                      Inform the shopper when the ship-to address is identified as
                      residential address
                    </Radio>
                    <Radio
                      disabled={!isRadInstalled || suspend || radPlans?.currentPackage?.status === 3 || settings.always_quote_residential_delivery}
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
        </Col>
      </Row>

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
