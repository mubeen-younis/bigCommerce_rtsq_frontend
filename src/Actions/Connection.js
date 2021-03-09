import axios from 'axios';

export const submitConnectionSettings = data => {
	const config = {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-type': 'application/json',
		},
	};
	return dispatch => {
		axios
			.post(`${process.env.ENITURE_API_URL}/submit_connection_settings`, config, {
				data,
			})
			.then(({ data }) => {
				console.log(data);
			})
			.catch(error => {});
	};
};

export const getConnectionSettings = (token, carrierId) => {
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_conn_settings`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				params: {
					carrierId,
				},
			})
			.then(({ data }) => {
				dispatch({
					type: 'GET_CONNECTION_SETTINGS',
					payload: JSON.parse(data.data.value),
				});
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				});
			})
			.catch(error => {
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				});
			});
	};
};
