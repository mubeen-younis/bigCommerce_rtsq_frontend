import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Image, Avatar, List, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect, useDispatch } from 'react-redux';
import FreightProvidersSkeleton from '../SkeletonLoader/FreightProvidersSkeleton';

import {
  installCarrier,
  getInstalledCarriers,
  changeCarrierStatus,
  getAllAvailableCarriers,
} from '../../Actions/EnitureStore';
import Meta from 'antd/lib/card/Meta';
import PlanStatusHeading from '../../partials/PlanStatusHeading';
import ExportCSVDownloadStatus from '../../partials/ExportCSVDownloadStatus';
const { Title } = Typography;
// const { Meta } = Card;

function ShippingCarriersComponent(props) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailableCarriers, setIsLoadingAvailableCarriers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch available carriers on component mount
    if (props.token) {
      console.log('Dispatching getAllAvailableCarriers with token:', props.token);
      setIsLoadingAvailableCarriers(true);
      dispatch(getAllAvailableCarriers(props.token));
    }
  }, [dispatch, props.token]);

  // Separate effect for available carriers loading
  useEffect(() => {
    if (props.availableCarriers !== null) {
      console.log('Available carriers received, stopping loading:', props.availableCarriers);
      setIsLoadingAvailableCarriers(false);
    }
  }, [props.availableCarriers]);

  useEffect(() => {
    console.log('Loading effect - installedCarriers:', props.installedCarriers);
    console.log('Loading effect - availableCarriers:', props.availableCarriers);

    // Show loading when no data is available, then hide after data loads or timeout
    if (!props.installedCarriers || props.availableCarriers === null) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      // Data is available, stop loading after short delay
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [props.installedCarriers, props.availableCarriers]);

  // const { currentPlan } = useSelector(state => state)

  // Get all carriers sorted by name, regardless of type
  const getAllCarriers = () => {
    return props.installedCarriers
      ?.sort((carr1, carr2) => carr1.name.localeCompare(carr2.name)) || [];
  };

  // Get installed (enabled) carriers
  const getInstalledCarriers = () => {
    return getAllCarriers().filter((carrier) => carrier.is_enabled === 1);
  };

  // Get deactivated (disabled) carriers
  const getDeactivatedCarriers = () => {
    return getAllCarriers().filter((carrier) => carrier.is_enabled === 0);
  };

  // Get all available carriers from props
  const getAvailableCarriers = () => {
    console.log('Available carriers from props:', props.availableCarriers);
    return props.availableCarriers?.sort((carr1, carr2) => carr1.name.localeCompare(carr2.name)) || [];
  };

  // Filter available carriers based on search term
  const getFilteredAvailableCarriers = () => {
    const availableCarriers = getAvailableCarriers();
    if (!searchTerm) return availableCarriers;
    return availableCarriers.filter(carrier =>
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderCarrierListItem = (value) => {
    const actions = [];
    
    if (value.is_enabled === 1) {
      actions.push(
        <Link
          to={`/${value.id}`}
          style={{ display: 'inline-block' }}
          key="settings"
        >
          <Button
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
      );
    }
    
    actions.push(
      <Button
        key="toggle"
        type='primary'
        onClick={() => {
          props.changeCarrierStatus(value.id, props.token);
        }}
      >
        {value.is_enabled === 1 ? 'Disable' : 'Enable'}
      </Button>
    );

    return (
      <List.Item actions={actions}>
        <List.Item.Meta
          avatar={
            <Image
              preview={false}
              src={`images/${value.logo}`}
              width={60}
              height={60}
            />
          }
          title={value.name}
          description={value.is_enabled === 1 ? 'Enabled' : 'Disabled'}
        />
      </List.Item>
    );
  };

  const renderAvailableCarrierListItem = (carrier) => {
    const actions = [
      <Button
        key="install"
        type='primary'
        onClick={() => props.installCarrier(carrier.id, props.token)}
        disabled={carrier.status ? false : true}
      >
        {carrier.status ? 'Install' : 'Coming Soon'}
      </Button>
    ];

    return (
      <List.Item actions={actions}>
        <List.Item.Meta
          avatar={
            <Image
              preview={false}
              src={`images/${carrier.logo}`}
              width={60}
              height={60}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
            />
          }
          title={<strong>{carrier.name}</strong>}
          description={carrier.status ? 'Available for installation' : 'Coming soon'}
        />
      </List.Item>
    );
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

      {/* Installed Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoading ? (
          <FreightProvidersSkeleton title="Installed Providers" rows={3} />
        ) : (
          <>
            <Title level={4}>Installed Providers</Title>
            {getInstalledCarriers().length > 0 ? (
              <List
                bordered
                dataSource={getInstalledCarriers()}
                renderItem={renderCarrierListItem}
              />
            ) : (
              <div className={'no-data'}>No Installed Providers</div>
            )}
          </>
        )}
      </div>

      {/* Deactivated Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoading ? (
          <FreightProvidersSkeleton title="Deactivated Providers" rows={2} />
        ) : (
          <>
            <Title level={4}>Deactivated Providers</Title>
            {getDeactivatedCarriers().length > 0 ? (
              <List
                bordered
                dataSource={getDeactivatedCarriers()}
                renderItem={renderCarrierListItem}
              />
            ) : (
              <div className={'no-data'}>No Deactivated Providers</div>
            )}
          </>
        )}
      </div>

      {/* Available Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoadingAvailableCarriers ? (
          <FreightProvidersSkeleton title="Available Providers" rows={6} />
        ) : (
          <>
            <Title level={4}>Available Providers</Title>
            <div style={{
              marginBottom: '16px',
              padding: '0 4px',
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <Input
                placeholder="Search providers..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  maxWidth: '400px',
                  minWidth: '280px',
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  boxShadow: 'none',
                  fontSize: '14px'
                }}
                size="large"
                allowClear
              />
            </div>
            {getFilteredAvailableCarriers().length > 0 ? (
              <List
                bordered
                dataSource={getFilteredAvailableCarriers()}
                renderItem={renderAvailableCarrierListItem}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            ) : (
              <div className={'no-data'}>
                {searchTerm ? `No providers found matching "${searchTerm}"` : 'No Available Providers'}
              </div>
            )}
          </>
        )}
      </div>

      {/* <Row gutter={25}>
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
      </Row> */}

      {/* <Row gutter={25}>
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
      </Row> */}

    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    installedCarriers: state.installedCarriers,
    availableCarriers: state.availableCarriers,
    enitureCarriers: state.enitureCarriers,
    carriers: state.carriers,
    token: state.token,
    alertMessageType: state.alertMessageType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInstalledCarriers: () => dispatch(getInstalledCarriers()),
    changeCarrierStatus: (data, token) =>
      dispatch(changeCarrierStatus(data, token)),
    installCarrier: (id, token) => dispatch(installCarrier(id, token)),
    getAllAvailableCarriers: (token) => dispatch(getAllAvailableCarriers(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShippingCarriersComponent);
