import axios from 'axios';
const config = {
	headers: {
		authorization: `Bearer eyJpdiI6InQzYUJMcmNUZWtPSElRaG1CWnRMa1E9PSIsInZhbHVlIjoiSDZzMm5vSlJacVZaaW5WZTF5K2k2UT09IiwibWFjIjoi`,
	}, //Authorization: `Bearer ${token}`
};
const data = {
	store: 'uann2u',
};
export const installCarrier = (carrier_id, token) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/installCarrier`,
				{
					carrier_id,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'INSTALL_CARRIER',
						payload: data.data,
					});
				}
				console.log(data);
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

export const installAddon = (addon_id, token) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/installAddon`,
				{
					addon_id,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'INSTALL_ADDON',
						payload: data.data,
					});
				}
				console.log(data);
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

export const getInstalledCarriers = (data) => {
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/getInstalledCarriers`, {
				headers: {
					authorization: `Bearer ${data.store}`,
				},
			})
			.then(({ data }) => {
				if (data.data.installedCarriers) {
					dispatch({
						type: 'GET_INSTALLED_CARRIERS',
						payload: data.data.installedCarriers,
					});
				} else {
					dispatch({
						type: 'GET_INSTALLED_CARRIERS',
						payload: data.data,
					});
				}

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

export const changeCarrierStatus = (carrier_id, token) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/changeCarrierStatus`,
				{
					carrier_id,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
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

export const getInstalledAddons = (data) => {
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_installed_addons`, {
				headers: {
					authorization: `Bearer ${data.store}`,
				},
			})
			.then(({ data }) => {
				dispatch({
					type: 'GET_INSTALLED_ADDONS',
					payload: data.data,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

export const changeAddonStatus = (addon_id, token) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/changeAddonStatus`,
				{
					addon_id,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				dispatch({
					type: 'CHANGE_ADDON_STATUS',
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
