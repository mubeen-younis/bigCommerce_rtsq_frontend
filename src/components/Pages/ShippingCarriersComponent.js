import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Image, Avatar, List, Input, Modal, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect, useDispatch } from 'react-redux';
import FreightProvidersSkeleton from '../SkeletonLoader/FreightProvidersSkeleton';

import {
  installCarrier,
  getInstalledCarriers,
  changeCarrierStatus,
  getAllAvailableCarriers,
} from '../../Actions/EnitureStore';
import { getConnectionSettings } from '../../Actions/Connection';
import { getQuoteSettings, getThresholdSettings, getStaffNoteSettings } from '../../Actions/Settings';
import { getInsuraceStatus } from '../../Actions/ProductSettings';
import TabsLayout from '../../tabs_layout/tabs';
import { provisionCarrierForSettings } from '../../Actions/EnitureStore';
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
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeCarrierId, setActiveCarrierId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedProviders, setArchivedProviders] = useState([]);

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

    // Only show loading on initial load when both are null/empty
    if ((!props.installedCarriers || props.installedCarriers.length === 0) && props.availableCarriers === null) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      // Data is available, stop loading immediately
      setIsLoading(false);
    }
  }, [props.installedCarriers, props.availableCarriers]);

  // Monitor when installation modal is closed to refresh carriers if needed
  useEffect(() => {
    // If modal was closed and we had an active carrier ID, it might have been installed
    if (!isInstallModalOpen && activeCarrierId) {
      const timer = setTimeout(() => {
        // Only refresh if the carrier might have been installed (not just opened and closed immediately)
        // We can add a small refresh here since the modal was actually used for installation
        if (props.token) {
          props.getInstalledCarriers({ store: props.token });
        }
        setActiveCarrierId(null); // Reset active carrier
      }, 1000); // Longer delay to allow any connection settings save to complete
      return () => clearTimeout(timer);
    }
  }, [isInstallModalOpen, activeCarrierId, props]);

  // const { currentPlan } = useSelector(state => state)

  // Get all carriers sorted by name, regardless of type
  const getAllCarriers = () => {
    const list = Array.isArray(props.installedCarriers)
      ? props.installedCarriers.filter(Boolean)
      : [];
    return list.sort((c1, c2) => (c1?.name || '').localeCompare(c2?.name || ''));
  };

  // Get installed (enabled) carriers
  const getInstalledCarriers = () => {
    return getAllCarriers()
      .filter((carrier) => carrier.is_enabled === 1)
      .filter(carrier => !archivedProviders.some(archived => archived.id === carrier.id));
  };

  // Get deactivated (disabled) carriers
  const getDeactivatedCarriers = () => {
    const allDisabled = getAllCarriers().filter((carrier) => carrier.is_enabled === 0);
    return allDisabled.filter(carrier => !archivedProviders.some(archived => archived.id === carrier.id));
  };

  // Toggle between deactivated and archived view
  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
  };

  // Archive a provider
  const archiveProvider = (provider) => {
    setArchivedProviders(prev => [...prev, provider]);
  };

  // Restore a provider from archive
  const restoreProvider = (provider) => {
    setArchivedProviders(prev => prev.filter(archived => archived.id !== provider.id));
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


  const openInstallModalWithSettings = async (carrier) => {
    setActiveCarrierId(carrier.id);
    const carrierSlug = props.availableCarriers?.find(c => c.id === carrier.id)?.slug;
    // Prefer existing installed carrier with same slug to populate saved data
    const existing = props.installedCarriers?.find(ic => ic.slug === carrierSlug);
    let installedId = existing?.id || null;
    if (!installedId) {
      // Provision on backend to obtain an installed_carrier_id for submit_connection_settings
      try {
        const res = await dispatch(provisionCarrierForSettings(carrier.id, props.token));
        installedId = res?.data?.data?.installed_carrier_id || res?.data?.data?.id || carrier.id;
      } catch (e) {}
    }
    dispatch({ type: 'CARRIER_ID', payload: installedId || carrier.id });
    dispatch(getConnectionSettings(props.token, installedId || carrier.id));
    // Do not fetch Quote Settings for install flow
    // dispatch(getQuoteSettings(props.token, carrier.id));
    dispatch(getInsuraceStatus(props.token, carrier.id));
    // Preload optional support data but safe if they require installed carrier
    if (props.token) {
      dispatch(getThresholdSettings(props.token));
      dispatch(getStaffNoteSettings(props.token));
    }
    // Mark that we are in install flow so submits send is_installing=1
    dispatch({ type: 'SET_IS_INSTALLING', payload: true });
    setIsInstallModalOpen(true);
  };

  // Create table columns for providers
  const getProviderTableColumns = (isArchived = false, isDeactivated = false) => {
    return [
      {
        title: 'Provider Image',
        dataIndex: 'logo',
        key: 'logo',
        width: 150,
        align: 'center',
        render: (logo) => (
          <Image
            preview={false}
            src={`images/${logo}`}
            width={60}
            height={60}
          />
        ),
      },
      {
        title: 'Nickname',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 250,
        render: (nickname, record) => (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {nickname || record.name}
            </div>
            {isArchived && (
              <Button
                type="link"
                size="small"
                style={{ padding: 0, height: 'auto' }}
                onClick={() => restoreProvider(record)}
              >
                Restore
              </Button>
            )}
            {isDeactivated && (
              <Button
                type="link"
                size="small"
                style={{ padding: 0, height: 'auto' }}
                onClick={() => archiveProvider(record)}
              >
                Archive
              </Button>
            )}
          </div>
        ),
      },
      {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Actions</div>,
        key: 'actions',
        align: 'center',
        width: 400,
        render: (_, record) => {
          const actions = [];

          // Define 3PL carriers that have carriers tab
          const carriersTabCarriers = [
            'ltl-quotes',
            'freightquote-ltl',
            'tql-ltl',
            'echo-ltl',
            'freightquote-chr-ltl',
            'priority-one-ltl',
            'unishipper-ltl',
            'kn-ltl',
            'gtz-ltl'
          ];

          // Check if this carrier has carriers tab
          const hasCarriersTab = carriersTabCarriers.includes(record.slug);

          // Add Carriers link for 3PL carriers
          if (hasCarriersTab) {
            actions.push(
              <Link
                to={`/${record.id}?tab=2`}
                style={{ display: 'inline-block' }}
                key="carriers"
              >
                <Button
                  type='default'
                  size='small'
                  style={{ marginRight: '8px', marginBottom: '4px' }}
                  onClick={() =>
                    dispatch({
                      type: 'SET_ACTIVE_MENU',
                      payload: record.id.toString(),
                    })
                  }
                >
                  Carriers
                </Button>
              </Link>
            );
          }

          // Add Connection Settings link (not available for usps-small and dbsc)
          if (record.slug !== 'usps-small' && record.slug !== 'dbsc') {
            actions.push(
              <Link
                to={`/${record.id}?tab=1`}
                style={{ display: 'inline-block' }}
                key="connection"
              >
                <Button
                  type='default'
                  size='small'
                  style={{ marginRight: '8px', marginBottom: '4px' }}
                  onClick={() =>
                    dispatch({
                      type: 'SET_ACTIVE_MENU',
                      payload: record.id.toString(),
                    })
                  }
                >
                  Connection Settings
                </Button>
              </Link>
            );
          }

          // Add Quote Settings link (not available for dbsc)
          if (record.slug !== 'dbsc') {
            actions.push(
              <Link
                to={`/${record.id}?tab=5`}
                style={{ display: 'inline-block' }}
                key="quote"
              >
                <Button
                  type='default'
                  size='small'
                  style={{ marginRight: '8px', marginBottom: '4px' }}
                  onClick={() =>
                    dispatch({
                      type: 'SET_ACTIVE_MENU',
                      payload: record.id.toString(),
                    })
                  }
                >
                  Quote Settings
                </Button>
              </Link>
            );
          }

          // Add Enable/Disable button
          actions.push(
            <Button
              key="toggle"
              type='primary'
              size='small'
              style={{ marginBottom: '4px' }}
              onClick={() => {
                props.changeCarrierStatus(record.id, props.token);
              }}
              disabled={isArchived}
            >
              {record.is_enabled === 1 ? 'Disable' : 'Enable'}
            </Button>
          );

          return (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: '4px',
              alignItems: 'center'
            }}>
              {actions}
            </div>
          );
        },
      },
    ];
  };

  // Create table columns for available providers
  const getAvailableProviderTableColumns = () => {
    return [
      {
        title: 'Provider Image',
        dataIndex: 'logo',
        key: 'logo',
        width: 150,
        align: 'center',
        render: (logo) => (
          <Image
            preview={false}
            src={`images/${logo}`}
            width={60}
            height={60}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
          />
        ),
      },
      {
        title: 'Provider Name',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        render: (name, record) => (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {name}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {record.status ? 'Available for installation' : 'Coming soon'}
            </div>
          </div>
        ),
      },
      {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Actions</div>,
        key: 'actions',
        align: 'center',
        width: 180,
        render: (_, record) => (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Button
              type='primary'
              size='small'
              onClick={() => {
                // Do NOT install on click; just open connection settings for this carrier
                openInstallModalWithSettings(record);
              }}
              disabled={!record.status}
            >
              {record.status ? 'Add Account' : 'Coming Soon'}
            </Button>
          </div>
        ),
      },
    ];
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
      <Modal
        title={'Connection Settings'}
        visible={isInstallModalOpen}
        onCancel={() => {
          setIsInstallModalOpen(false);
          dispatch({ type: 'SET_IS_INSTALLING', payload: false });
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        {isInstallModalOpen && activeCarrierId ? (
          <TabsLayout onlyConnection forcedSlug={props.availableCarriers?.find(c => c.id === activeCarrierId)?.slug || ''} />
        ) : null}
      </Modal>
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
            {(() => {
              const installedEnabled = (props.installedCarriers || [])
                .filter(Boolean)
                .filter(carrier => carrier.is_enabled === 1)
                .filter(carrier => !archivedProviders.some(archived => archived.id === carrier.id))
                .sort((c1, c2) => (c1?.name || '').localeCompare(c2?.name || ''));
              return installedEnabled.length > 0 ? (
                <Table
                  columns={getProviderTableColumns(false, false)}
                  dataSource={installedEnabled}
                  rowKey="id"
                  pagination={false}
                  showHeader={true}
                />
              ) : (
                <div className={'no-data'}>No Installed Providers</div>
              );
            })()}
          </>
        )}
      </div>

      {/* Deactivated/Archived Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoading ? (
          <FreightProvidersSkeleton title={showArchived ? "Archived Providers" : "Deactivated Providers"} rows={2} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ margin: 0 }}>
                {showArchived ? 'Archived Providers' : 'Deactivated Providers'}
              </Title>
              <Button
                type="link"
                onClick={toggleArchivedView}
                style={{ padding: '0', height: 'auto', fontSize: '14px' }}
              >
                {showArchived ? 'View Inactive' : 'View Archives'}
              </Button>
            </div>
            {showArchived ? (
              archivedProviders.length > 0 ? (
                <Table
                  columns={getProviderTableColumns(true, false)}
                  dataSource={archivedProviders}
                  rowKey="id"
                  pagination={false}
                  showHeader={true}
                />
              ) : (
                <div className={'no-data'}>No Archived Providers</div>
              )
            ) : (
              getDeactivatedCarriers().length > 0 ? (
                <Table
                  columns={getProviderTableColumns(false, true)}
                  dataSource={getDeactivatedCarriers()}
                  rowKey="id"
                  pagination={false}
                  showHeader={true}
                />
              ) : (
                <div className={'no-data'}>No Deactivated Providers</div>
              )
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
              <Table
                columns={getAvailableProviderTableColumns()}
                dataSource={getFilteredAvailableCarriers()}
                rowKey="id"
                pagination={false}
                showHeader={true}
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
    getInstalledCarriers: (storeToken) => dispatch(getInstalledCarriers({ store: storeToken })),
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
