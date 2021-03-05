import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import TabsLayout from '../tabs_layout/tabs';
import { getCarrierDetails } from '../Actions/Action';

function RendorCarrier(props) {
	const { carrier_id } = useParams();

	useEffect(() => {
		if (
			(carrier_id !== undefined && !props.carrierId) ||
			props.carrierId !== carrier_id
		) {
			props.setCarrierId(carrier_id);

			const data = {
				carrierId: carrier_id,
				shop: 'dev-azm-1.myshopify.com',
			};

			props.getCarrierDetails(data);
		}
		// eslint-disable-next-line
	}, []);

	return <TabsLayout />;
}

const mapStateToProps = (state) => {
	return {
		token: state.token,
		carrierId: state.carrierId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getCarrierDetails: () => dispatch(getCarrierDetails()),
		setCarrierId: (carrierId) => dispatch({ type: 'CARRIER_ID', payload: carrierId }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RendorCarrier);
