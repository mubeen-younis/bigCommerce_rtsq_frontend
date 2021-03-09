import axios from 'axios';

export const postData = (data, type, url, token, setVisibleWarehouse = null) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, data, config)
			.then(({ data }) => {
				if (!data.error) {
					if (data.data.value) {
						dispatch({
							type: type,
							payload: JSON.parse(data.data.value),
						});
					} else if (data.data) {
						dispatch({
							type: type,
							payload: data.data,
						});
					}

					if (type === 'SAVE_LOCATION') {
						setVisibleWarehouse(false);
					}
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
			.catch(error => {});
	};
};

export const dismissAlert = () => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			alertMessage: null,
			showAlertMessage: false,
			alertMessageType: null,
		},
	});
};

export const setStore = store => {
	console.log('store action', store);
	localStorage.setItem('store', store);
	return dispatch => {
		dispatch({
			type: 'STORE',
			payload: store,
		});
	};
};

export const getPlansInfo = data => {
	const config = {
		headers: {
			authorization: `Bearer ${data.store}`,
		},
	};

	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_plans_info`, {
				...config,
				params: { store: 'stores/uann2u' },
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_PLANS_INFO',
						payload: JSON.parse(data.data[0].value),
					});
				} else {
					dispatch({
						type: 'ALERT_MESSAGE',
						showAlertMessage: true,
						alertMessage: data.message,
						alertMessageType: 'error',
					});
				}
			})
			.catch(error => {});
	};
};
