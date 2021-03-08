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
