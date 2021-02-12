import axios from 'axios';

export const installCarrier = (data) => {
	return (dispatch) => {
		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/${'url'}`, data)
			.then(({ data }) => {
				if (!data.error) {
					if (data.value !== undefined) {
						dispatch({
							type: 'type',
							payload: JSON.parse(data.data.value),
						});
					}
				}
				console.log('data', data);
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch((error) => {});
	};
};

export const changeCarrierStatus = (carrier_id) => {
	return (dispatch) => {
		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/changeCarrierStatus`, {
				carrier_id,
			})
			.then(({ data }) => {
				dispatch({
					type: 'CHANGE_CARRIER_STATUS',
					payload: data.data,
				});

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

export const getInstalledCarriers = () => {
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/getInstalledCarriers`)
			.then(({ data }) => {
				dispatch({
					type: 'GET_INSTALLED_CARRIERS',
					payload: data.data.installedCarriers,
				});

				/* dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				}); */
			})
			.catch((err) => {
				console.log(err);
			});
	};
};
