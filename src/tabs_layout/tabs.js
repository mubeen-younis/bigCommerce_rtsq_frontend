import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import CarriersComponent from '../components/CarriersComponent';
import PlanStatusHeading from '../partials/PlanStatusHeading';
import GTZCarriersComponent from '../components/Pages/GlobalTranz/Ltl/CarriersComponent';
import useLoadComponent from '../hooks/useLoadComponent';
import ShippingRatesComponent from '../components/Pages/DBSC/ShippingRatesComponent';
import ShippingClassesComponent from '../components/Pages/DBSC/ShippingClassesComponent';
import OtherSettings from '../components/Pages/DBSC/OtherSettings';
import DBSCConnectionSettingsComponent from '../components/Pages/DBSC/ConnectionSettingsComponent';
import DisplayLogsPage from '../components/DisplayLogsPage';

const { TabPane } = Tabs;

function TabsLayout({ onlyConnection = false, forcedSlug = '', initialTab = '1', hideHeader = false, hideTabs = false }) {
  const { installedCarriers, carrierId, quoteSettings } = useSelector(state => state);
  const [component, setComponent] = useState(0);
  const [tab, setTab] = useState(initialTab);
  const [carrierSlug, setCarrierSlug] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Check for tab in URL parameters first, then localStorage
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else if (localStorage.getItem('tab')) {
      setTab(localStorage.getItem('tab'));
    }

    return () => localStorage.removeItem('tab');
  }, [location.search]);

  useEffect(() => {
    const loadComponent = () => {
      const slugs = [
        'ltl-quotes',
        'small-package',
        'ups-ltl',
        'ups-small',
        'fedex-ltl',
        'fedex-small',
        'gtz-ltl',
        'xpo-ltl',
        'rl-ltl',
        'unishippers-small',
        'yrc-ltl',
        'freightquote-ltl',
        'estes-ltl',
        'dayross-ltl',
        'odfl-ltl',
        'saia-ltl',
        'abf-ltl',
        'southeastern-ltl',
        'usps-small',
        'tql-ltl',
        'echo-ltl',
        'daylight-ltl',
        'purolator-small',
        'freightquote-chr-ltl',
        'ups-ship-engine',
        'priority-one-ltl',
        'unishipper-ltl',
        'ups-land-cost-small',
        'kn-ltl',
        'ct-ltl',
        'dbsc',
      ];

      if (forcedSlug) {
        const componentIndex = slugs.indexOf(forcedSlug);
        if (componentIndex >= 0) {
          setComponent(componentIndex);
          setCarrierSlug(forcedSlug);
        } else {
          // Fallback to first component for unknown slugs
          setComponent(0);
          setCarrierSlug('ltl-quotes');
        }
        return;
      }

      for (const ic of installedCarriers) {
        if (+ic.id === +carrierId) {
          const isFedexSmallCarrier = ic.slug === 'fedex-small';
          const isUspsSmallCarrier = ic.slug === 'usps-small';
          const isUpsSmallCarrier = ic.slug === 'ups-small';

          dispatch({
            type: 'SET_FEDEX_SMALL_CARRIER',
            payload:
              isUspsSmallCarrier || isUpsSmallCarrier
                ? false
                : isFedexSmallCarrier,
          });
          dispatch({
            type: 'SET_USPS_SMALL_CARRIER',
            payload:
              isFedexSmallCarrier || isUpsSmallCarrier
                ? false
                : isUspsSmallCarrier,
          });
          dispatch({
            type: 'SET_UPS_SMALL_CARRIER',
            payload:
              isFedexSmallCarrier || isUspsSmallCarrier
                ? false
                : isUpsSmallCarrier,
          });

          const componentIndex = slugs.indexOf(ic.slug);
          setComponent(componentIndex >= 0 ? componentIndex : 0);
          setCarrierSlug(ic.slug);
          break;
        }
      }
    };

    loadComponent();
  }, [carrierId, dispatch, installedCarriers, forcedSlug]);

  const handleActiveTab = useCallback((key = '') => {
    localStorage.setItem('tab', key);
    setTab(key);
  }, []);

  const [connSettingsComponent, quoteSettingsComponent] =
    useLoadComponent(component);

  if (onlyConnection) {
    return (
      <Fragment>
        {!hideHeader && <PlanStatusHeading />}
        {hideTabs ? (
          carrierSlug === 'dbsc' ? <DBSCConnectionSettingsComponent /> : connSettingsComponent
        ) : (
          <Tabs className={'tabs-wrp'} activeKey={tab} onChange={handleActiveTab} type='card'>
            <TabPane tab='Connection Settings' key='1'>
              {carrierSlug === 'dbsc' ? <DBSCConnectionSettingsComponent /> : connSettingsComponent}
            </TabPane>
          </Tabs>
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {!hideHeader && <PlanStatusHeading />}

      {hideTabs ? (
        // Render content directly without tabs based on initialTab
        <>
          {initialTab === '1' && (carrierSlug === 'dbsc' ? <DBSCConnectionSettingsComponent /> : connSettingsComponent)}
          {initialTab === '2' && (
            ['ltl-quotes', 'freightquote-ltl', 'tql-ltl', 'echo-ltl', 'freightquote-chr-ltl', 'priority-one-ltl', 'unishipper-ltl', 'kn-ltl'].includes(carrierSlug) ? (
              <CarriersComponent />
            ) : ['gtz-ltl'].includes(carrierSlug) ? (
              <GTZCarriersComponent />
            ) : null
          )}
          {initialTab === '5' && quoteSettingsComponent}
          {initialTab === '7' && quoteSettings?.isEnableLogs && <DisplayLogsPage />}
          {initialTab === '9' && carrierSlug === 'dbsc' && <ShippingRatesComponent />}
          {initialTab === '10' && carrierSlug === 'dbsc' && <OtherSettings />}
          {initialTab === '11' && carrierSlug === 'dbsc' && <ShippingClassesComponent />}
        </>
      ) : (
        <Tabs className={'tabs-wrp'} activeKey={tab} onChange={handleActiveTab} type='card'>
          <TabPane tab='Connection Settings' key='1'>
            {carrierSlug === 'dbsc' ? <DBSCConnectionSettingsComponent /> : connSettingsComponent}
          </TabPane>
          {[
            'ltl-quotes',
            'freightquote-ltl',
            'tql-ltl',
            'echo-ltl',
            'freightquote-chr-ltl',
            'priority-one-ltl',
            'unishipper-ltl',
            'kn-ltl'
          ].includes(carrierSlug) && (
            <TabPane tab='Carriers' key='2'>
              <CarriersComponent />
            </TabPane>
          )}
          {['gtz-ltl'].includes(carrierSlug) && (
            <TabPane tab='Carriers' key='2'>
              <GTZCarriersComponent />
            </TabPane>
          )}
          {['dbsc'].includes(carrierSlug) && (
            <>
              <TabPane tab='Shipping Rates' key='9'>
                <ShippingRatesComponent />
              </TabPane>
              <TabPane tab='Other Settings' key='10'>
                <OtherSettings />
              </TabPane>
              <TabPane tab='Shipping Classes' key='11'>
                <ShippingClassesComponent />
              </TabPane>
            </>
          )}

          {!['dbsc'].includes(carrierSlug) && (
            <TabPane tab='Quote Settings' key='5'>
              {quoteSettingsComponent}
            </TabPane>
          )}

          {quoteSettings?.isEnableLogs && (
            <TabPane tab='Logs' key='7'>
              <DisplayLogsPage />
            </TabPane>
          )}
        </Tabs>
      )}
		</Fragment>
	)
}

export default TabsLayout;
