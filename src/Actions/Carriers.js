import axios from 'axios';
const config = {
	headers: {
		authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
	},
};

export const getServices = () => {
	const token = '';
	const config = {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-type': 'application/json',
		}, //Authorization: `Bearer ${token}`
	};
	const data = {
		shop: 'dev-azm-1.mybigcommerce.com',
	};
	const store = {
		store: 'uann2u',
	};

	return (dispatch) => {
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
			.catch((error) => {});
	};
};

export const getAddTabSettings = (token) => {
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_add_tab_sett_store`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			.then(({ data }) => {
				console.log(JSON.parse(data.data[0].value));
				dispatch({
					type: 'GET_ADD_TAB_SETTING',
					payload: JSON.parse(data.data[0].value),
				});
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				});
			})
			.catch((error) => {});
	};
};
