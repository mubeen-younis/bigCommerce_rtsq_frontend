import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import TabsLayout from '../tabs_layout/tabs';
import { getConnectionSettings } from '../Actions/Connection';
import { getQuoteSettings } from '../Actions/Settings';
import { getInstalledCarrierPlanInfo } from '../Actions/Carriers';

function RendorCarrier(props) {
	const {
		carrierId,
		token,
		setCarrierId,
		getPlanInfo,
		getConnectionSetting,
		getQuoteSetting,
	} = props;
	const { carrier_id } = useParams();

	useEffect(() => {
		if ((carrier_id !== undefined && !carrierId) || carrierId !== carrier_id) {
			setCarrierId(carrier_id);
			getPlanInfo(token, carrier_id);
			getConnectionSetting(token, carrier_id);
			getQuoteSetting(token, carrier_id);
		}
		// eslint-disable-next-line
	}, [carrier_id]);

	return <TabsLayout />;
}

const mapStateToProps = state => {
	return {
		token: state.token,
		carrierId: state.carrierId,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCarrierId: carrierId => dispatch({ type: 'CARRIER_ID', payload: carrierId }),
		getConnectionSetting: (token, carrierId) =>
			dispatch(getConnectionSettings(token, carrierId)),
		getQuoteSetting: (token, carrierId) => dispatch(getQuoteSettings(token, carrierId)),
		getPlanInfo: (token, carrierId) =>
			dispatch(getInstalledCarrierPlanInfo(token, carrierId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RendorCarrier);
