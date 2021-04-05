import axios from 'axios';

export const getServices = () => {
	const data = {
		shop: 'dev-azm-1.mybigcommerce.com',
	};

	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_services`, {
				data,
			})
			.then(({ data }) => {
				if (data.data.length > 0) {
					let carrierServices = [];
					data.data.map((value, index) =>
						carrierServices.push({
							key: value.speed_freight_carrierSCAC,
							sr_no: index + 1,
							carrier_name: value.speed_freight_carrierName,
							carrier_logo: (
								<img
									style={{ height: '40px' }}
									src={`../../Carrier_Logos/${value.carrier_logo}`}
									alt={value.speed_freight_carrierName}
								/>
							),
						})
					);

					dispatch({
						type: 'GET_SERVICES',
						payload: carrierServices,
					});
				}
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				});
			})
			.catch(error => {});
	};
};

export const getAddTabSettings = (token, carrierId) => {
	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_add_tab_sett_store/${carrierId}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				dispatch({
					type: 'GET_ADD_TAB_SETTING',
					payload: JSON.parse(data.data[0].value),
				});
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				});
			})
			.catch(error => {});
	};
};

export const getCarrierDetails = data => {
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_info`, {
				// data,
				params: {
					...data,
				},
			})
			.then(({ data }) => {
				if (data?.settings && data.settings.length > 0) {
					dispatch({
						type: 'GET_CONNECTION_SETTINGS',
						payload: data.settings,
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};
};

export const getInstalledCarrierPlanInfo = (token, carrierId) => {
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/getInstalledCarrierPlanInfo`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				params: {
					carrierId,
				},
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_INSTALLED_CARRIER_PLAN_INFO',
						payload: data.data,
					});

					/* dispatch({
						type: 'SKELETON_LOADING',
						payload: false,
					}); */
				}
			})
			.catch(error => {});
	};
};
