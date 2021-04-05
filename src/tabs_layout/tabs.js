import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import CarriersComponent from '../components/CarriersComponent';
import ProductSettingsComponent from '../components/ProductSettingsComponent';
import ConnectionSettingsComponent from '../components/Pages/WweLtl/ConnectionSettingsComponent';
import WarehouseComponent from '../components/Pages/WarehouseComponent';
import QuoteSettingsComponentWwe from '../components/Pages/WweLtl/QuoteSettingsComponentWwe';
import UserGuideComponent from '../components/Pages/UserGuideComponent';
import QuoteSettingsComponentWweSmall from '../components/Pages/WweSmall/QuoteSettingsComponentWweSmall';
// import AlertMessage from "../Utilities/AlertMessage";

const { TabPane } = Tabs;
function callback(key) {
	// console.log(key);
}

function TabsLayout(props) {
	const { planInfo, installedCarriers, carrierId } = props;
	const slugs = ['ltl-quotes', 'small-package'];
	const plans = {
		0: 'Trial',
		1: 'Basic',
		2: 'Standard',
		3: 'Advanced',
	};

	let component = 0;
	for (const ic of installedCarriers) {
		if (ic.id === +carrierId) {
			component = slugs.indexOf(ic.slug);
			break;
		}
	}

	return (
		<Fragment>
			{planInfo && (
				<div className='note-bx'>
					You are currently on <strong>{plans[planInfo.plan_type]}</strong> Plan. The plan
					renews on {planInfo.expiry_date}.
				</div>
			)}

			<Tabs className={'tabs-wrp'} onChange={callback} type='card'>
				<TabPane tab='Connection Settinngs' key='1'>
					<ConnectionSettingsComponent />
				</TabPane>
				{component !== 1 && (
					<TabPane tab='Carriers' key='2'>
						<CarriersComponent />
					</TabPane>
				)}
				<TabPane tab='Warehouse' key='3'>
					<WarehouseComponent />
				</TabPane>
				<TabPane tab='Quote Settings' key='4'>
					{component === 0 && <QuoteSettingsComponentWwe />}
					{component === 1 && <QuoteSettingsComponentWweSmall />}
				</TabPane>
				<TabPane tab='Product Settings' key='5'>
					<ProductSettingsComponent />
				</TabPane>
				{/* <TabPane tab="Import CSV" key="6">
                    <AlertMessage />
                    <ImportCsvComponent />
                </TabPane>
                <TabPane tab="Box Sizes" key="7">
                    <BoxSizesComponent />
                </TabPane> */}
				<TabPane tab='User Guide' key='6'>
					<UserGuideComponent />
				</TabPane>
			</Tabs>
		</Fragment>
	);
}

const mapStateToProps = state => ({
	planInfo: state.plansInfo,
	installedCarriers: state.installedCarriers,
	carrierId: state.carrierId,
});

export default connect(mapStateToProps)(TabsLayout);
