import React, { useCallback, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
const { Sider } = Layout;
const { Title } = Typography;

function SideMenu(props) {
  const dispatch = useDispatch();
  const { currentPlan, store } = useSelector((state) => state);
  const setActiveMenu = useCallback(
    (menuId) => {
      dispatch({
        type: 'SET_ACTIVE_MENU',
        payload: menuId + '',
      });
    },
    [dispatch]
  );

  const appTitleStyle = { display: 'block', fontSize: 18, float: 'left' };

  useEffect(() => {
    const name = window.location.pathname;
    if (name.match(/\/$/)) setActiveMenu('99');
    else if (name.includes('plans')) setActiveMenu('100');
    else if (name.includes('warehouses')) setActiveMenu('101');
    else if (name.includes('shipping_groups')) setActiveMenu('106');
    else if (name.includes('rad_settings')) setActiveMenu('108');
    else if (name.includes('product_settings')) setActiveMenu('111');
    else if (name.includes('fdo')) setActiveMenu('102');
    else if (name.includes('av')) setActiveMenu('103');
    else if (name.includes('importcsv')) setActiveMenu('104');
    else if (name.includes('orders')) setActiveMenu('107');
    else if (name.includes('compare_rates')) setActiveMenu('109');
    else if (name.includes('shipping_rules')) setActiveMenu('110');
    else if (name.includes('payments')) setActiveMenu('112');
    else if (name.includes('user_guide')) setActiveMenu('105');
    else if (name.includes('logs')) setActiveMenu('113');
    else if (name.includes('addon'))
      setActiveMenu('addon-' + name.substring(name.lastIndexOf('/') + 1));
    else setActiveMenu(name.substring(name.lastIndexOf('/') + 1));
  }, [setActiveMenu]);

  return (
    <>
      <h4 className={'app-logo'} style={appTitleStyle}>
        Real-time Shipping Quotes
      </h4>
      <hr></hr>

      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
        className={'sidemenu'}
        width={240}
      >
        <h4 className={'header'} style={appTitleStyle}>
          Real-time Shipping Quotes
        </h4>
        <Menu
          mode='inline'
          defaultSelectedKeys={'99'}
          selectedKeys={props.activeMenu}
        >
          {((currentPlan?.plan_id === 5 && store?.plan_level == 'Sandbox Store') || (currentPlan?.plan_id && currentPlan?.plan_id != 5 && store?.plan_level !== 'Sandbox Store')) && (
            <Menu.Item
              key='99'
              warnkey='99'
              onClick={() => setActiveMenu('99')}
            >
              <Link to='/'>Shipping Providers</Link>
            </Menu.Item>
          )}

          <Menu.Item
            key='100'
            warnkey='100'
            onClick={() => setActiveMenu('100')}
          >
            <Link to='/plans'>Plans</Link>
          </Menu.Item>
          {((currentPlan?.plan_id === 5 && store?.plan_level == 'Sandbox Store') || (currentPlan?.plan_id && currentPlan?.plan_id != 5 && store?.plan_level !== 'Sandbox Store')) && (
            <>
              <Menu.Item
                key='101'
                warnkey='101'
                onClick={() => setActiveMenu('101')}
              >
                <Link to='/warehouses'>Warehouses</Link>
              </Menu.Item>

              <Menu.Item
                key='108'
                warnkey={108}
                onClick={() => setActiveMenu('108')}
              >
                <Link to={`/rad_settings`}>Address Type Settings</Link>
              </Menu.Item>

              <Menu.Item
                key='106'
                warnkey={106}
                onClick={() => setActiveMenu('106')}
              >
                <Link to={`/shipping_groups`}>Shipping Groups</Link>
              </Menu.Item>

              <Menu.Item
                key='110'
                warnkey={110}
                onClick={() => setActiveMenu('110')}
              >
                <Link to={`/shipping_rules`}>Shipping Rules</Link>
              </Menu.Item>

              {/* Box Sizes and Pallets options */}
              {props?.installedAddons?.map((addon) => {
                const isSBSAddon = addon.name?.trim() === 'Standard Box Sizes';
                const isPalletPackagingAddon = addon.name?.trim() === 'Pallet Packaging';

                // If it's SBS addon, only show it when at least one Small carrier is enabled (exclude archived)
                if (isSBSAddon) {
                  const hasEnabledSmallCarrier = props?.installedCarriers?.some(carrier =>
                    carrier.is_enabled === 1 && (
                      carrier.slug === 'ups-small' ||
                      carrier.slug === 'fedex-small' ||
                      carrier.slug === 'usps-small' ||
                      carrier.slug === 'unishippers-small' ||
                      carrier.slug === 'purolator-small' ||
                      carrier.slug === 'ups-land-cost-small' ||
                      carrier.slug === 'small-package' ||
                      carrier.slug === 'ups-ship-engine' ||
                      carrier.slug.includes('-small')
                    )
                  );

                  return hasEnabledSmallCarrier ? (
                    <Menu.Item
                      key={'addon-' + addon.id.toString()}
                      warnkey={'addon-' + addon.id.toString()}
                      onClick={() =>
                        setActiveMenu('addon-' + addon.id.toString())
                      }
                    >
                      <Link to={`/addon/${addon.id}`}>Box Sizes</Link>
                    </Menu.Item>
                  ) : null;
                }

                // If it's Pallet Packaging addon, only show it when at least one LTL carrier is enabled (exclude archived)
                if (isPalletPackagingAddon) {
                  const hasEnabledLTLCarrier = props?.installedCarriers?.some(carrier =>
                    carrier.is_enabled === 1 && carrier.carrier_type === 1
                  );

                  return hasEnabledLTLCarrier ? (
                    <Menu.Item
                      key={'addon-' + addon.id.toString()}
                      warnkey={'addon-' + addon.id.toString()}
                      onClick={() =>
                        setActiveMenu('addon-' + addon.id.toString())
                      }
                    >
                      <Link to={`/addon/${addon.id}`}>Pallets</Link>
                    </Menu.Item>
                  ) : null;
                }

                return null;
              })}

              <Menu.Item
                key='111'
                warnkey={111}
                onClick={() => setActiveMenu('111')}
              >
                <Link to={`/product_settings`}>Product Settings</Link>
              </Menu.Item>

              <Menu.Item
                key='104'
                warnkey={104}
                onClick={() => setActiveMenu('104')}
              >
                <Link to={`/importcsv`}>Import CSV</Link>
              </Menu.Item>

              <Menu.Item
                key='107'
                warnkey={107}
                onClick={() => setActiveMenu('107')}
              >
                <Link to={`/orders`}>Orders</Link>
              </Menu.Item>

              <Menu.Item
                key='102'
                warnkey={102}
                onClick={() => setActiveMenu('102')}
              >
                <Link to={`/fdo`}>FreightDesk Online</Link>
              </Menu.Item>

              <Menu.Item
                key='103'
                warnkey={103}
                onClick={() => setActiveMenu('103')}
              >
                <Link to={`/av`}>Address Validation</Link>
              </Menu.Item>

              <Menu.Item
                key='112'
                warnkey={112}
                onClick={() => setActiveMenu('112')}
              >
                <Link to={`/payments`}>Payment History</Link>
              </Menu.Item>

              <Menu.Item
                key='105'
                warnkey={105}
                onClick={() => setActiveMenu('105')}
              >
                <Link to={`/user_guide`}>User Guide</Link>
              </Menu.Item>

              <Menu.Item
                key='113'
                warnkey={113}
                onClick={() => setActiveMenu('113')}
              >
                <Link to={`/logs`}>Logs</Link>
              </Menu.Item>

              {/* Other addons */}
              {props?.installedAddons?.every((add) => {
                const isSBSAddon = add.name?.trim() === 'Standard Box Sizes';
                const isPalletPackagingAddon = add.name?.trim() === 'Pallet Packaging';
                const isRADAddon = add.name?.trim() === 'Residential Address Detection';

                // Skip SBS, Pallet Packaging, and RAD as they're handled elsewhere or excluded
                if (isSBSAddon || isPalletPackagingAddon || isRADAddon) {
                  return true; // Don't count these for "No Add-on" message
                }

                return add.is_enabled === 0;
              }) ? (
                <Menu.Item></Menu.Item>
              ) : null}

              {props?.installedAddons?.map((addon) => {
                const isSBSAddon = addon.name?.trim() === 'Standard Box Sizes';
                const isPalletPackagingAddon = addon.name?.trim() === 'Pallet Packaging';
                const isRADAddon = addon.name?.trim() === 'Residential Address Detection';

                // Skip SBS, Pallet Packaging, and RAD
                if (isSBSAddon || isPalletPackagingAddon || isRADAddon) {
                  return null;
                }

                // For other addons, show if enabled as before
                return addon.is_enabled ? (
                  <Menu.Item
                    key={'addon-' + addon.id.toString()}
                    warnkey={'addon-' + addon.id.toString()}
                    onClick={() =>
                      setActiveMenu('addon-' + addon.id.toString())
                    }
                  >
                    <Link to={`/addon/${addon.id}`}>{addon.name}</Link>
                  </Menu.Item>
                ) : null;
              })}
            </>
          )}
        </Menu>
      </Sider>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    installedCarriers: state.installedCarriers,
    installedAddons: state.installedAddons,
    enitureCarriers: state.enitureCarriers,
    activeMenu: state.activeMenu,
    carrierId: state.carrierId,
  };
};

export default connect(mapStateToProps, null)(SideMenu);
