import axios from 'axios';

export const submitQuoteSettings = data => {
	const config = {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-type': 'application/json',
		},
	};
	return dispatch => {
		axios
			.post(`${process.env.ENITURE_API_URL}/submit_quote_settings`, config, {
				data,
			})
			.then(({ data }) => {
				console.log(data);
			})
			.catch(err => {
				console.log(err);
			});
	};
};

export const getQuoteSettings = (token, carrierId) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};

	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_qoute_settings/${carrierId}`,
				config
			)
			.then(({ data }) => {
				//if (data.data.length > 0) {
				dispatch({
					type: 'GET_QUOTE_SETTINGS',
					payload: JSON.parse(data.data.value),
				});
				//}
			})
			.catch(err => {
				console.log(err);
			});
	};
};
