import React from 'react';
import { Tabs } from 'antd';
import PlansComponent from '../components/PlansComponent';
import CarriersComponent from '../components/CarriersComponent';
import ConnectionSettingsComponent from '../components/Pages/WweLtl/ConnectionSettingsComponent';
import WarehouseComponent from '../components/Pages/WarehouseComponent';
import QuoteSettingsComponentWwe from '../components/Pages/WweLtl/QuoteSettingsComponentWwe';
import ImportCsvComponent from '../components/Pages/ImportCsvComponent';
import UserGuideComponent from '../components/Pages/UserGuideComponent';

const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}

function TabsLayout(){
    return(
        <Tabs className={"tabs-wrp"} onChange={callback} type="card">
            <TabPane tab="Plans" key="1">
                <PlansComponent />
            </TabPane>
            <TabPane tab="Connection Settinngs" key="2">
                <ConnectionSettingsComponent />
            </TabPane>
            <TabPane tab="Carriers" key="3">
                <CarriersComponent />
            </TabPane>
            <TabPane tab="Warehouse" key="4">
                <WarehouseComponent />
            </TabPane>
            <TabPane tab="Quote Settings" key="5">
                <QuoteSettingsComponentWwe />
            </TabPane>
            <TabPane tab="Import CSV" key="6">
                <ImportCsvComponent />
            </TabPane>
            {/* <TabPane tab="Box Sizes" key="7">
                <BoxSizesComponent />
            </TabPane> */}
            <TabPane tab="User Guide" key="8">
                <UserGuideComponent />
            </TabPane>
        </Tabs>
    );
}

export default TabsLayout;