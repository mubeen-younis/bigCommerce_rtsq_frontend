import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import TabsLayout from '../tabs_layout/tabs';
// import { getCarrierDetails } from '../Actions/Carriers';
import { getConnectionSettings } from '../Actions/Connection';
import { getQuoteSettings } from '../Actions/Settings';

function RendorCarrier(props) {
	const { carrier_id } = useParams();

	useEffect(() => {
		if (
			(carrier_id !== undefined && !props.carrierId) ||
			props.carrierId !== carrier_id
		) {
			props.setCarrierId(carrier_id);
			props.getConnectionSettings(props.token, carrier_id);
			props.getQuoteSettings(props.token, carrier_id);
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
		// getCarrierDetails: data => dispatch(getCarrierDetails(data)),
		setCarrierId: carrierId => dispatch({ type: 'CARRIER_ID', payload: carrierId }),
		getConnectionSettings: (token, carrierId) =>
			dispatch(getConnectionSettings(token, carrierId)),
		getQuoteSettings: (token, carrierId) => dispatch(getQuoteSettings(token, carrierId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RendorCarrier);
