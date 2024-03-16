import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Image, Avatar } from 'antd';
import { connect, useDispatch } from 'react-redux';

import {
  installCarrier,
  getInstalledCarriers,
  changeCarrierStatus,
  changeAddonStatus,
  getInstalledAddons,
  installAddon,
} from '../../Actions/EnitureStore';
import Meta from 'antd/lib/card/Meta';
import PlanStatusHeading from '../../partials/PlanStatusHeading';
import ExportCSVDownloadStatus from '../../partials/ExportCSVDownloadStatus';
const { Title } = Typography;
// const { Meta } = Card;

function ShippingCarriersComponent(props) {
  const dispatch = useDispatch();
  // const { currentPlan } = useSelector(state => state)
  const isLTL = props.installedCarriers?.find((carr) => carr.carrier_type === 1)
    ? true
    : false;
  const isSmall = props.installedCarriers?.find(
    (carr) => carr.carrier_type === 2
  )
    ? true
    : false;
  const getInstalledCarriers = (carrier_type = 1) => {
    return props.installedCarriers
      .sort((carr1, carr2) => carr1.name.localeCompare(carr2.name))
      .map((value, key) => {
        return (
          carrier_type === value.carrier_type && (
            <Col
              className='gutter-row mb-3'
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              key={key}
            >
              <Card className={'card-custom'} style={{ width: '100%' }}>
                <div className={'card-inner'}>
                  <figure>
                    <Image
                      preview={false}
                      src={`images/${value.logo}`}
                      className='mb-2'
                    />
                  </figure>
                  {/* <Meta title={value.name} description='' /> */}
                  {value.is_enabled === 1 ? (
                    <Fragment>
                      <Link
                        to={`/${value.id}`}
                        style={{ display: 'inline-block' }}
                      >
                        <Button
                          className={''}
                          type='primary'
                          style={{ marginRight: '6px' }}
                          onClick={() =>
                            dispatch({
                              type: 'SET_ACTIVE_MENU',
                              payload: value.id.toString(),
                            })
                          }
                        >
                          Settings
                        </Button>
                      </Link>

                      <Button
                        className={''}
                        type='primary'
                        onClick={() => {
                          props.changeCarrierStatus(value.id, props.token);
                        }}
                        /* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
                      >
                        {value.is_enabled === 1 ? 'Disable' : 'Enable'}
                      </Button>
                    </Fragment>
                  ) : (
                    <Button
                      className={''}
                      type='primary'
                      onClick={() => {
                        props.changeCarrierStatus(value.id, props.token);
                      }}
                      /* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
                    >
                      {value.is_enabled === 1 ? 'Disable' : 'Enable'}
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          )
        );
      });
  };

  const getInstalledAddons = () => {
    return props.installedAddons
      .sort((add1, add2) => (add1.name > add2.name ? 1 : -1))
      .map((value, key) => {
        return (
          <Col
            className='gutter-row mb-3'
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={6}
            key={key}
          >
            <Card className={'card-custom'} style={{ width: '100%' }}>
              <div className={'card-inner'}>
                <figure>
                  <Image
                    preview={false}
                    src={`images/${value.logo}`}
                    className='mb-2'
                  />
                  {/* <img
									style={{ height: '175px' }}
									src={`images/${value.logo}`}
									alt={'text alt'}
								/> */}
                </figure>
                {/* <Meta title={value.name} description='' /> */}
                <Button
                  // className={'mt-3'}
                  type='primary'
                  onClick={() => props.changeAddonStatus(value.id, props.token)}
                  /* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
                >
                  {value.is_enabled === 1 ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </Card>
          </Col>
        );
      });
  };

  const getEnitureCarriers = (carrier_type = 1) => {
    return props?.carriers
      ?.sort((carr1, carr2) => (carr1.name > carr2.name ? 1 : -1))
      .map((value, key) => {
        return (
          carrier_type === value.carrier_type &&
          value.status == 1 && (
            <Col
              className='gutter-row mb-3'
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              key={key}
            >
              <Card className={'card-custom'} style={{ width: '100%' }}>
                <div className={'card-inner'}>
                  <figure>
                    <Image
                      preview={false}
                      src={`images/${value.logo}`}
                      className='mb-2'
                    />
                  </figure>
                  {/* <Meta title={value.name} description='' /> */}
                  <Button
                    // className={'mt-3'}
                    type='primary'
                    onClick={() => props.installCarrier(value.id, props.token)}
                    disabled={value.status ? false : true}
                  >
                    {value.status ? 'Install' : 'Coming Soon'}
                  </Button>
                </div>
              </Card>
            </Col>
          )
        );
      });
  };

  const getRecommendedAddons = () => {
    return props.addons
      .sort((add1, add2) => (add1.name > add2.name ? 1 : -1))
      .map((value, key) => {
        return (
          <Col
            className='gutter-row mb-3'
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={6}
            key={key}
          >
            <Card className={'card-custom'} style={{ width: '100%' }}>
              <div className={'card-inner'}>
                <figure>
                  <Image
                    preview={false}
                    src={`images/${value.logo}`}
                    className='mb-2'
                  />
                </figure>
                {/* <Meta title={value.name} description='' /> */}
                <Button
                  // className={'mt-3'}
                  type='primary'
                  onClick={() => props.installAddon(value.id, props.token)}
                  disabled={value.status ? false : true}
                >
                  {value.status ? 'Install' : 'Coming Soon'}
                </Button>
              </div>
            </Card>
          </Col>
        );
      });
  };

  return (
    <Fragment>
      <PlanStatusHeading />
      <ExportCSVDownloadStatus />
      <Row gutter={25}>
        <Col
          className='gutter-row mb-3'
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <Card
            size='default'
            style={{
              borderRadius: '5px',
              border: '1px solid skyblue',
              fontSize: '1em',
            }}
          >
            <Meta
              avatar={
                <Avatar
                  src={
                    <svg
                      viewBox='0 0 20 20'
                      className='Polaris-Icon__Svg'
                      focusable='false'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
                      ></path>
                    </svg>
                  }
                />
              }
              title={
                <h3 style={{ fontWeight: 600, marginBottom: 0 }}>
                  Getting Started
                </h3>
              }
              description={
                <p>
                  Below is a list of supported shipping providers. The plan you
                  subscribe to will dictate how many shipping providers you can
                  enable. Click on Plans in the navigation menu to review and
                  select a plan. To enable a provider, click on the Enable
                  button. Afterward, use the{' '}
                  <a
                    target='_blank'
                    href='https://eniture.com/bigcommerce-real-time-shipping-quotes/'
                    rel='noreferrer'
                  >
                    User’s Guide
                  </a>{' '}
                  for instructions on how to connect to your account and perform
                  the other steps necessary to make the integration functional.
                  If you require customer support you can open a support ticket
                  by emailing support@eniture.com or by calling 404-369-0680
                  extension 2. You can also check our{' '}
                  <a
                    target='_blank'
                    href='https://support.eniture.com/'
                    rel='noreferrer'
                  >
                    Knowledge Base
                  </a>{' '}
                  to see if there is an article that provides an answer to your
                  question.
                </p>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={25}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>LTL Freight Providers</Title>
        </Col>
        {props.installedCarriers !== undefined &&
        isLTL &&
        props.installedCarriers.length > 0 ? (
          getInstalledCarriers(1)
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>No LTL Freight Provider Installed</span>
          </Col>
        )}
      </Row>

      <Row gutter={25}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Parcel & Postal Providers</Title>
        </Col>
        {props.installedCarriers !== undefined &&
        isSmall &&
        props.installedCarriers.length > 0 ? (
          getInstalledCarriers(2)
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>
              No Parcel & Postal Provider Installed
            </span>
          </Col>
        )}
      </Row>

      <Row gutter={25}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Add-ons</Title>
        </Col>
        {props.installedAddons !== undefined &&
        props.installedAddons.length > 0 ? (
          getInstalledAddons()
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>No Add-on installed</span>
          </Col>
        )}
      </Row>

      <Row gutter={25}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Other Available LTL Freight Providers</Title>
        </Col>

        {props?.carriers?.length > 0 &&
        props.carriers.filter((carr) => +carr.carrier_type === 1)?.length >
          0 ? (
          getEnitureCarriers(1)
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>No Carrier Found</span>
          </Col>
        )}
      </Row>

      <Row gutter={25}>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Other Available Parcel & Postal Providers</Title>
        </Col>

        {props?.carriers?.length > 0 &&
        props.carriers.filter((carr) => +carr.carrier_type === 2)?.length >
          0 ? (
          getEnitureCarriers(2)
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>No Carrier Found</span>
          </Col>
        )}
      </Row>

      <Row gutter={25} id='addons-section'>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
          <Title level={4}>Other Available Add-ons</Title>
        </Col>

        {props.addons !== undefined && props.addons.length > 0 ? (
          getRecommendedAddons()
        ) : (
          <Col
            className='gutter-row w-100 mb-3'
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <span className={'no-data'}>No Add-on Found</span>
          </Col>
        )}
      </Row>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    installedCarriers: state.installedCarriers,
    installedAddons: state.installedAddons,
    enitureCarriers: state.enitureCarriers,
    carriers: state.carriers,
    addons: state.addons,
    token: state.token,
    alertMessageType: state.alertMessageType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInstalledCarriers: () => dispatch(getInstalledCarriers()),
    changeCarrierStatus: (data, token) =>
      dispatch(changeCarrierStatus(data, token)),
    getInstalledAddons: () => dispatch(getInstalledAddons()),
    changeAddonStatus: (data, token) =>
      dispatch(changeAddonStatus(data, token)),
    installCarrier: (id, token) => dispatch(installCarrier(id, token)),
    installAddon: (id, token) => dispatch(installAddon(id, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShippingCarriersComponent);
