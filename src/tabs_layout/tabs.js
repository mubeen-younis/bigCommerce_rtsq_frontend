import React from 'react';
import { Tabs } from 'antd';
import CarriersComponent from '../components/CarriersComponent';
import ConnectionSettingsComponent from '../components/Pages/WweLtl/ConnectionSettingsComponent';
import WarehouseComponent from '../components/Pages/WarehouseComponent';
import QuoteSettingsComponentWwe from '../components/Pages/WweLtl/QuoteSettingsComponentWwe';
import UserGuideComponent from '../components/Pages/UserGuideComponent';
import AlertMessage from "../Utilities/AlertMessage";

const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}

function TabsLayout(){
    return(
        <>
            
            <Tabs className={"tabs-wrp"} onChange={callback} type="card">
                <TabPane tab="Connection Settinngs" key="1">
                    <AlertMessage />
                    <ConnectionSettingsComponent />
                </TabPane>
                <TabPane tab="Carriers" key="2">
                    <AlertMessage />
                    <CarriersComponent />
                </TabPane>
                <TabPane tab="Warehouse" key="3">
                    <AlertMessage />
                    <WarehouseComponent />
                </TabPane>
                <TabPane tab="Quote Settings" key="4">
                    <AlertMessage />
                    <QuoteSettingsComponentWwe />
                </TabPane>
                {/* <TabPane tab="Import CSV" key="5">
                    <AlertMessage />
                    <ImportCsvComponent />
                </TabPane>
                <TabPane tab="Box Sizes" key="7">
                    <BoxSizesComponent />
                </TabPane> */}
                <TabPane tab="User Guide" key="6">
                    <UserGuideComponent />
                </TabPane>
            </Tabs>
        </>
    );
}

export default TabsLayout;