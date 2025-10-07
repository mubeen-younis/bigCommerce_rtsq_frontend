import React, { Fragment, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Checkbox,
  Typography,
  Card,
  Select,
  Skeleton,
  Modal,
  Radio,
} from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getRadPlans,
  changePlan,
  changeAddonSuspendStatus,
  changeDefaultAddress,
  getAddonAddressSettings,
} from '../Actions/RAD';

const { Title } = Typography;
const { Option } = Select;

function AutoDetectResidentialComponent(props) {
  const { addon_id } = useParams();
  const [suspend, setSuspend] = useState(false);
  const [cancelSubsriptionVisible, SetCancelSubsriptionVisible] =
    useState(false);
  const [newPlan, SetNewPlan] = useState(0);
  const [address, setAddress] = useState(1);
  const dispatch = useDispatch();
  const { store } = useSelector(state => state)
  useEffect(() => {
    if (!props.radPlans) {
      props.getRadPlans(props.token);
    }
    if (!props.addonSettings) {
      dispatch(getAddonAddressSettings(addon_id, props.token));
    }
    if (props.addonSettings) {
      setAddress(props.addonSettings.unconfirmed_default);
    }

    // eslint-disable-next-line
  }, [props.addonSettings]);

  const changePlan = () => {
    props.changePlan(props.token, newPlan?.id, SetCancelSubsriptionVisible);
  };

  const chanePlanAction = (plan_value) => {
    if (plan_value === 'disable' || plan_value === 7 || plan_value === 22) {
      props.changePlan(props.token, plan_value, SetCancelSubsriptionVisible);
    } else {
      SetNewPlan(
        props?.radPlans?.allRadPackages.find(({ id }) => id === plan_value)
      );
      SetCancelSubsriptionVisible(true);
    }
  };

  if (!props.radPlans) {
    return <Skeleton active />;
  }

  if (
    props?.radPlans?.currentPackage?.status === null ||
    props?.radPlans?.currentPackage?.status === 3
  ) {
    //setSuspend(true)
  }

  const changeAddonStatus = (value) => {
    let action = value ? 3 : 1;
    dispatch(
      changeAddonSuspendStatus(
        props?.radPlans?.currentPackage?.package_id,
        props.token,
        action
      )
    );
  };

  const onChange = (e) => {
    setAddress(e.target.value);
    dispatch(changeDefaultAddress(addon_id, props.token, e.target.value));
  };
  return (
    <Fragment>
      <Row gutter={24}>
        <Col
          className='gutter-row mb-3'
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <Title level={3} style={{ textAlign: 'center' }}>
            Residential Address Detection
          </Title>
        </Col>
      </Row>
      <Modal
        title='Note!'
        visible={cancelSubsriptionVisible}
        onCancel={() => SetCancelSubsriptionVisible(false)}
        centered
        onOk={() => changePlan()}
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

      <Row gutter={24} justify='center' className={'mb-3'}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={12}>
          <Card style={{ width: '100%' }}>
            <p>
              When enabled, the address type of the ship-to address will be
              retrieved from a database sourced from the USPS. The enabled
              shipping providers will be informed if the address is residential
              so that their residential delivery fee is included in their
              shipping rate estimates. The next subscription begins when the
              current one expires or is depleted, whichever comes first. Refer
              to the{' '}
              <a
                href='https://eniture.com/bigcommerce-real-time-shipping-quotes/#documentation'
                target='_blank'
                rel='noreferrer'
              >
                {' '}
                User's Guide
              </a>{' '}
              for more detailed information.
            </p>

            <label>
              <strong>Auto-renew</strong>
            </label>
            <Select
              defaultValue={
                props?.radPlans?.currentPackage === null
                  ? 'Select Plan'
                  : props?.radPlans?.currentPackage
                      ?.package_to_be_charge_status === 1
                  ? props?.radPlans?.currentPackage?.to_be_charge_package_id
                  : props?.radPlans?.currentPackage?.status === 0
                  ? null
                  : props?.radPlans?.currentPackage
                      ?.package_to_be_charge_status === 'Trial'
                  ? '100/15 days ($0) - Trial'
                  : props?.radPlans?.currentPackage
											?.package_to_be_charge_status === 'Development Plan'
									? props?.radPlans?.currentPackage
                      ?.total_hits  + '/' + props?.radPlans?.currentPackage
                      ?.current_package_period + ' Development Plan ($0)'
									: props?.radPlans?.currentPackage?.package_to_be_charge_status
              }
              style={{ width: '100%', marginBottom: '20px' }}
              onChange={chanePlanAction}
              name='plan_value'
            >
              {props?.radPlans?.currentPackage !== null &&
              props?.radPlans?.currentPackage?.current_package_name !==
                'Trial' && props?.radPlans?.currentPackage?.current_package_name !==
                'Development Plan' &&
              props?.radPlans?.currentPackage?.status !== 0 ? (
                <Option key='disable' value='disable'>
                  Disable
                </Option>
              ) : null}
              {props?.radPlans?.allRadPackages?.length > 0
                ? props?.radPlans?.allRadPackages?.map(plan =>
                    <>
                      plan?.status && (
                        {plan.cost !== 0
                          ? <Option key={plan.id} value={plan.id} disabled={store.plan_level === 'Sandbox Store'}>
                            {Intl.NumberFormat('en-US').format(
                              plan.htis
                            )}/mo (${plan.cost})
                            </Option>
                          : (plan.name == 'Development Plan' && store.plan_level == 'Sandbox Store')
                          ? <Option key={plan.id} value={plan.id}>
                            {Intl.NumberFormat('en-US').format(
                              plan.htis
                            )}/5 years {plan.name} (${
                              plan.cost
                            })
                            </Option>
                          : (plan.name == 'Trial' && store.plan_level != 'Sandbox Store')
                          ? <Option key={plan.id} value={plan.id} disabled={store.plan_level === 'Sandbox Store'}>
                              {Intl.NumberFormat('en-US').format(
                                plan.htis
                              )}/15 days (${plan.cost})
                            </Option>
                          : null
                        }
                      )
                    </>
                  )
                : null
              }
            </Select>

            {props?.radPlans?.currentPackage === null ? (
              <p>
                <strong>
                  You have not activated any plan. Select plan from dropdown.
                </strong>
              </p>
            ) : (
              <Fragment>
                {props?.radPlans?.currentPackage?.current_package_name ===
                null ? (
                  <h1 className='mb-2'>
                    <b>No plan is activated.</b>
                  </h1>
                ) : props?.radPlans?.currentPackage?.status === 0 ? (
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
                      }}
                    >
                      <p style={{ marginBottom: '0' }}>
                        {/*props?.radPlans?.currentPackage?.current_package_name*/}{' '}
                        ${props?.radPlans?.currentPackage?.current_package_cost}
                        /
                        {
                          props?.radPlans?.currentPackage
                            ?.current_package_period
                        }
                      </p>
                      <p style={{ marginBottom: '0' }}>
                        Start date:{' '}
                        {new Date(
                          props?.radPlans?.currentPackage?.subscription_time
                        )
                          .toDateString()
                          .substring(4)}{' '}
                      </p>
                      <p style={{ marginBottom: '0' }}>
                        End date:{' '}
                        {new Date(props?.radPlans?.currentPackage?.expiry_time)
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
                      }}
                    >
                      <p style={{ marginBottom: '0' }}>
                        {Intl.NumberFormat('en-US').format(
                          props?.radPlans?.currentPackage?.consumed_hits
                        )}
                        /
                        {Intl.NumberFormat('en-US').format(
                          props?.radPlans?.currentPackage?.total_allowed_hits
                        )}{' '}
                        {props?.radPlans?.currentPackage?.consumed_hits_in_per}
                        {props?.radPlans?.currentPackage?.total_allowed_hits ===
                        'Unlimited'
                          ? ''
                          : '%'}{' '}
                        {/*+props?.radPlans?.currentPackage?.last_update_time.replace(/[-: ]/g, '') === 0 */}
                      </p>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        marginBottom: '20px',
                      }}
                    >
                      <Checkbox
                        onChange={(e) => {
                          changeAddonStatus(e.target.checked);
                          setSuspend(e.target.checked);
                          //props.changeAddonSuspendStatus(props?.radPlans?.currentPackage?.package_id, props.token);
                        }}
                        checked={
                          suspend ||
                          props?.radPlans?.currentPackage?.status === 3
                        }
                        defaultValue={props?.radPlans?.currentPackage?.status}
                      >
                        Suspend use
                      </Checkbox>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    radPlans: state.radPlans,
    installedAddons: state.installedAddons,
    alertMessage: state.alertMessageType,
    addonSettings: state.addonSettings,
    SetCancelSubsriptionVisible: state.SetCancelSubsriptionVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRadPlans: (token) => dispatch(getRadPlans(token)),
    changePlan: (token, plan_package, SetCancelSubsriptionVisible) =>
      dispatch(changePlan(token, plan_package, SetCancelSubsriptionVisible)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoDetectResidentialComponent);
