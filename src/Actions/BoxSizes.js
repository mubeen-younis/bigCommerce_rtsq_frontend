import axios from 'axios';

export const getBoxSizes = token => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			showAlertMessage: false,
			alertMessageType: 'loading',
		},
	});

	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_boxsize`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(({ data }) => {
			if (!data.error) {
				dispatch({
					type: 'GET_BOX_SIZES',
					payload: data.data,
				});
			}

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
					alertMessageType: data.error ? 'error' : 'success',
				},
			});
		})
		.catch(err => console.log(err));
};

export const addBoxSize = (token, boxSize, url, type) => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			showAlertMessage: true,
			alertMessageType: 'loading',
		},
	});

	axios
		.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, boxSize, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(({ data }) => {
			if (!data.error) {
				dispatch({
					type,
					payload: data.data,
				});
			}

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage:
						typeof data.message === 'object'
							? data.message[Object.keys(data.message)[0]]
							: data.message,
					showAlertMessage: true,
					alertMessageType: data.error ? 'error' : 'success',
				},
			});
		})
		.catch(err => console.log(err));
};

export const deleteBoxSize = (id, token) => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			showAlertMessage: true,
			alertMessageType: 'loading',
		},
	});

	axios
		.delete(`${process.env.REACT_APP_ENITURE_API_URL}/boxsize/delete/${id}`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(({ data }) => {
			if (!data.error) {
				dispatch({
					type: 'DELETE_BOX_SIZE',
					payload: data.data,
				});
			}

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage: data.message,
					showAlertMessage: true,
					alertMessageType: data.error ? 'error' : 'success',
				},
			});
		})
		.catch(err => console.log(err));
};
