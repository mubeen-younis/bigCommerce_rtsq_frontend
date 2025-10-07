import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Image, Avatar, List, Input, Modal, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect, useDispatch, useSelector } from 'react-redux';
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
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCarriersModalOpen, setIsCarriersModalOpen] = useState(false);
  const [selectedCarrierForModal, setSelectedCarrierForModal] = useState(null);
  const [selectedModalTab, setSelectedModalTab] = useState('1');

  // Get carrier installation success state from Redux
  const { carrierInstallationSuccess, currentPlan, plans } = useSelector(state => state);

  // Get current plan details from plans array
  const currentPlanDetails = plans?.find(p => p.id === currentPlan?.plan_id);

  // Plan ID to max carriers mapping
  const planCarriersMapping = {
    0: 0,  // No plan
    1: 1,  // Trial - 1 carrier
    2: 3,  // Basic - 3 carriers
    3: 5,  // Standard - 5 carriers
    4: 10, // Advanced - 10 carriers (unlimited)
    5: 1,  // Development - 1 carrier
  };

  // Get max carriers allowed for current plan
  const maxCarriers = currentPlan?.total_allowed_carriers
    || currentPlanDetails?.max_enabled_carriers
    || currentPlan?.max_enabled_carriers
    || currentPlan?.allowed_enabled_carriers
    || planCarriersMapping[currentPlan?.plan_id]
    || 0;

  // Track installedCarriers state changes for nickname debugging
  useEffect(() => {
    if (props.installedCarriers?.length > 0) {
      console.log('🔍 NICKNAME DEBUG: Installed carriers with nicknames:', props.installedCarriers.map(c => ({
        id: c.id,
        name: c.name,
        nickname: c.nickname,
        hasNickname: !!c.nickname
      })));
    }
  }, [props.installedCarriers]);

  useEffect(() => {
    // Fetch available carriers on component mount
    if (props.token) {
      setIsLoadingAvailableCarriers(true);
      dispatch(getAllAvailableCarriers(props.token));
    }
  }, [dispatch, props.token]);

  // Separate effect for available carriers loading
  useEffect(() => {
    if (props.availableCarriers !== null) {
      setIsLoadingAvailableCarriers(false);
    }
  }, [props.availableCarriers]);

  useEffect(() => {
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
      // Reset active carrier without refreshing data to prevent unwanted reloading
      setActiveCarrierId(null);
    }
  }, [isInstallModalOpen, activeCarrierId]);

  // Handle successful carrier installation
  useEffect(() => {
    if (carrierInstallationSuccess) {
      console.log('🔍 NICKNAME DEBUG: New carrier installed with nickname:', carrierInstallationSuccess.newCarrier?.nickname);

      // Close the modal
      setIsInstallModalOpen(false);
      dispatch({ type: 'SET_IS_INSTALLING', payload: false });
      dispatch({ type: 'SET_AVAILABLE_CARRIER_ID', payload: null });
      setActiveCarrierId(null);

      // Clear the success state
      dispatch({ type: 'CLEAR_CARRIER_INSTALLATION_SUCCESS' });
    }
  }, [carrierInstallationSuccess, dispatch, props]);

  // const { currentPlan } = useSelector(state => state)

  // Get all carriers sorted by name, regardless of type
  const getAllCarriers = () => {
    const list = Array.isArray(props.installedCarriers)
      ? props.installedCarriers.filter(Boolean)
      : [];
    return list.sort((c1, c2) => (c1?.name || '').localeCompare(c2?.name || ''));
  };

  // Get installed (enabled) carriers
  const getEnabledCarriers = () => {
    const allCarriers = getAllCarriers();
    const enabledCarriers = allCarriers.filter((carrier) => {
      const isEnabled = carrier.is_enabled === 1 || carrier.is_enabled === '1';
      return isEnabled;
    });
    return enabledCarriers;
  };

  // Get deactivated (disabled) carriers
  const getDeactivatedCarriers = () => {
    return getAllCarriers().filter((carrier) => carrier.is_enabled === 0);
  };

  // Get archived carriers
  const getArchivedCarriers = () => {
    return getAllCarriers().filter((carrier) => carrier.is_enabled === 2);
  };

  // Toggle between deactivated and archived view
  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
  };

  // Get all available carriers from props
  const getAvailableCarriers = () => {
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

    // For available carriers (not yet installed), use the carrier.id directly
    // without provisioning to avoid auto-enabling the carrier
    if (!installedId) {
      installedId = carrier.id;
    }

    dispatch({ type: 'CARRIER_ID', payload: installedId });
    // Store the original available carrier ID for installation purposes
    dispatch({ type: 'SET_AVAILABLE_CARRIER_ID', payload: carrier.id });
    dispatch(getConnectionSettings(props.token, installedId));
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

  const openConnectionSettingsModal = async (carrier) => {
    setSelectedCarrierForModal(carrier);
    setSelectedModalTab('1');
    dispatch({ type: 'CARRIER_ID', payload: carrier.id });
    dispatch(getConnectionSettings(props.token, carrier.id));
    dispatch(getInsuraceStatus(props.token, carrier.id));
    if (props.token) {
      dispatch(getThresholdSettings(props.token));
      dispatch(getStaffNoteSettings(props.token));
    }
    setIsConnectionModalOpen(true);
  };

  const openQuoteSettingsModal = async (carrier) => {
    setSelectedCarrierForModal(carrier);
    setSelectedModalTab('5');
    dispatch({ type: 'CARRIER_ID', payload: carrier.id });
    dispatch(getConnectionSettings(props.token, carrier.id));
    dispatch(getQuoteSettings(props.token, carrier.id));
    dispatch(getInsuraceStatus(props.token, carrier.id));
    if (props.token) {
      dispatch(getThresholdSettings(props.token));
      dispatch(getStaffNoteSettings(props.token));
    }
    setIsQuoteModalOpen(true);
  };

  const openCarriersModal = async (carrier) => {
    setSelectedCarrierForModal(carrier);
    setSelectedModalTab('2');
    dispatch({ type: 'CARRIER_ID', payload: carrier.id });
    dispatch(getConnectionSettings(props.token, carrier.id));
    dispatch(getQuoteSettings(props.token, carrier.id));
    dispatch(getInsuraceStatus(props.token, carrier.id));
    if (props.token) {
      dispatch(getThresholdSettings(props.token));
      dispatch(getStaffNoteSettings(props.token));
    }
    setIsCarriersModalOpen(true);
  };

  const closeAllModals = () => {
    setIsConnectionModalOpen(false);
    setIsQuoteModalOpen(false);
    setIsCarriersModalOpen(false);
    setSelectedCarrierForModal(null);
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
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
          />
        ),
      },
      {
        title: 'Nickname',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 250,
        render: (nickname, record) => {
          console.log('🔍 NICKNAME DEBUG: Rendering carrier - nickname:', nickname, 'name:', record.name, 'will display:', nickname || record.name);
          return (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {nickname || record.name}
              </div>
              {isArchived && (
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => {
                    props.changeCarrierStatus(record.id, props.token, 0); // Restore (status = 0)
                  }}
                >
                  Restore
                </Button>
              )}
              {isDeactivated && (
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => {
                    props.changeCarrierStatus(record.id, props.token, 2); // Archive (status = 2)
                  }}
                >
                  Archive
                </Button>
              )}
            </div>
          );
        },
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
              <a
                style={{
                  display: 'inline-block',
                  color: '#1890ff',
                  marginRight: '12px',
                  marginBottom: '4px',
                  cursor: 'pointer'
                }}
                key="carriers"
                onClick={(e) => {
                  e.preventDefault();
                  openCarriersModal(record);
                }}
              >
                Carriers
              </a>
            );
          }

          // Add Quote Settings link (not available for dbsc)
          if (record.slug !== 'dbsc') {
            actions.push(
              <a
                style={{
                  display: 'inline-block',
                  color: '#1890ff',
                  marginRight: '12px',
                  marginBottom: '4px',
                  cursor: 'pointer'
                }}
                key="quote"
                onClick={(e) => {
                  e.preventDefault();
                  openQuoteSettingsModal(record);
                }}
              >
                Quote Settings
              </a>
            );
          }

          // Add Connection Settings link (not available for usps-small and dbsc)
          if (record.slug !== 'usps-small' && record.slug !== 'dbsc') {
            actions.push(
              <a
                style={{
                  display: 'inline-block',
                  color: '#1890ff',
                  marginRight: '12px',
                  marginBottom: '4px',
                  cursor: 'pointer'
                }}
                key="connection"
                onClick={(e) => {
                  e.preventDefault();
                  openConnectionSettingsModal(record);
                }}
              >
                Connection Settings
              </a>
            );
          }

          // Add Activate/Deactivate button
          actions.push(
            <Button
              key="toggle"
              type='primary'
              size='small'
              style={{ marginBottom: '4px' }}
              onClick={() => {
                const newStatus = record.is_enabled === 1 ? 0 : 1; // Toggle between Activate (1) and Deactivate (0)
                props.changeCarrierStatus(record.id, props.token, newStatus);
              }}
              disabled={isArchived}
            >
              {record.is_enabled === 1 ? 'Deactivate' : 'Activate'}
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
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
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
            <div style={{ fontWeight: 'bold' }}>
              {name}
            </div>
            {!record.status && (
              <div style={{ color: '#666', fontSize: '12px' }}>
                Coming soon
              </div>
            )}
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
            {record.status ? (
              <a
                style={{
                  color: '#1890ff',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  // Do NOT install on click; just open connection settings for this carrier
                  openInstallModalWithSettings(record);
                }}
              >
                Add Account
              </a>
            ) : (
              <span style={{ color: '#999' }}>Coming Soon</span>
            )}
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

      {/* Current Plan Information */}
      {currentPlan && (
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
                border: 'none',
                fontSize: '1em',
                backgroundColor: '#f0f5ff',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <strong>Current plan:</strong> {currentPlan.name || currentPlanDetails?.name || 'N/A'}
                </div>
                <div>
                  <strong>Enable upto {maxCarriers} providers</strong>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Modal
        title={'Connection Settings'}
        visible={isInstallModalOpen}
        onCancel={() => {
          setIsInstallModalOpen(false);
          dispatch({ type: 'SET_IS_INSTALLING', payload: false });
          dispatch({ type: 'SET_AVAILABLE_CARRIER_ID', payload: null });
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        {isInstallModalOpen && activeCarrierId ? (
          <TabsLayout onlyConnection forcedSlug={props.availableCarriers?.find(c => c.id === activeCarrierId)?.slug || ''} hideHeader={true} hideTabs={true} />
        ) : null}
      </Modal>

      {/* Connection Settings Modal */}
      <Modal
        title={`Connection Settings - ${selectedCarrierForModal?.nickname || selectedCarrierForModal?.name || ''}`}
        visible={isConnectionModalOpen}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        destroyOnClose
      >
        {isConnectionModalOpen && selectedCarrierForModal ? (
          <TabsLayout forcedSlug={selectedCarrierForModal.slug} initialTab="1" hideHeader={true} hideTabs={true} />
        ) : null}
      </Modal>

      {/* Quote Settings Modal */}
      <Modal
        title={`Quote Settings - ${selectedCarrierForModal?.nickname || selectedCarrierForModal?.name || ''}`}
        visible={isQuoteModalOpen}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        destroyOnClose
      >
        {isQuoteModalOpen && selectedCarrierForModal ? (
          <TabsLayout forcedSlug={selectedCarrierForModal.slug} initialTab="5" hideHeader={true} hideTabs={true} />
        ) : null}
      </Modal>

      {/* Carriers Modal */}
      <Modal
        title={`Carriers - ${selectedCarrierForModal?.nickname || selectedCarrierForModal?.name || ''}`}
        visible={isCarriersModalOpen}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        destroyOnClose
      >
        {isCarriersModalOpen && selectedCarrierForModal ? (
          <TabsLayout forcedSlug={selectedCarrierForModal.slug} initialTab="2" hideHeader={true} hideTabs={true} />
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
              const installedProviders = getEnabledCarriers();
              return installedProviders.length > 0 ? (
                <Table
                  key={`installed-${installedProviders.length}-${installedProviders.map(p => p.id).join('-')}`}
                  columns={getProviderTableColumns(false, false)}
                  dataSource={installedProviders}
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

      {/* Inactive Installed/Archived Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoading ? (
          <FreightProvidersSkeleton title={showArchived ? "Archived Providers" : "Inactive Installed Providers"} rows={2} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ margin: 0 }}>
                {showArchived ? 'Archived Providers' : 'Inactive Installed Providers'}
              </Title>
              <Button
                type="link"
                onClick={toggleArchivedView}
                style={{ padding: '0', height: 'auto', fontSize: '14px' }}
              >
                {showArchived ? 'View Inactive' : 'View Archive'}
              </Button>
            </div>
            {showArchived ? (
              (() => {
                const archivedProviders = getArchivedCarriers();
                return archivedProviders.length > 0 ? (
                  <Table
                    columns={getProviderTableColumns(true, false)}
                    dataSource={archivedProviders}
                    rowKey="id"
                    pagination={false}
                    showHeader={true}
                  />
                ) : (
                  <div className={'no-data'}>No Archived Providers</div>
                );
              })()
            ) : (
              (() => {
                const deactivatedProviders = getDeactivatedCarriers();
                return deactivatedProviders.length > 0 ? (
                  <Table
                    columns={getProviderTableColumns(false, true)}
                    dataSource={deactivatedProviders}
                    rowKey="id"
                    pagination={false}
                    showHeader={true}
                  />
                ) : (
                  <div className={'no-data'}>No Inactive Installed Providers</div>
                );
              })()
            )}
          </>
        )}
      </div>

      {/* All Providers Section */}
      <div style={{ marginBottom: '25px' }}>
        {isLoadingAvailableCarriers ? (
          <FreightProvidersSkeleton title="All Providers" rows={6} />
        ) : (
          <>
            <Title level={4}>All Providers</Title>
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
                {searchTerm ? `No providers found matching "${searchTerm}"` : 'No Providers Available'}
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
    changeCarrierStatus: (data, token, status) =>
      dispatch(changeCarrierStatus(data, token, status)),
    installCarrier: (id, token) => dispatch(installCarrier(id, token)),
    getAllAvailableCarriers: (token) => dispatch(getAllAvailableCarriers(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShippingCarriersComponent);
