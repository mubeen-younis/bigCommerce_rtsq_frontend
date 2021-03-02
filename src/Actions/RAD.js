import axios from 'axios';

export const getRadPlans = (token) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	return (dispatch) => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/rad/get_plans`, config)
			.then(({ data }) => {
				console.log(data);

				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'RAD_PLANS',
						payload: data.data,
					});
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				});
			})
			.catch((error) => {});
	};
};

export const changePlan = (token) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/rad/change_plan`,
				{},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				console.log(data);

				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'RAD_PLANS',
						payload: data.data,
					});
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				});
			});
	};
};

export const changeAddonSuspendStatus = (addon_id, token) => {
	return (dispatch) => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/changeAddonSuspendStatus`,
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
				console.log(data);

				dispatch({
					type: 'CHANGE_ADDON_SUSPEND_STATUS',
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

export const changeDefaultAddress = (addon_id, token, address_type) => {
	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/rad/changeDefaultAddress`,
				{
					addon_id,
					address: {
						unconfirmed_default: address_type,
					},
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				console.log(data);

				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'CHANGE_DEFAULT_ADDRESS',
						payload: JSON.parse(data.data.value),
					});
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				});
			});
	};
};

export const getAddonAdressSettings = (addon_id, token) => {
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/rad/getAddonAdressSettings`, {
				authorization: `Bearer ${token}`,
				params: {
					addon_id,
				},
			})
			.then(({ data }) => {
				console.log(data);

				if (!data.error) {
					dispatch({
						type: 'GET_ADDON_ADDRESS_SETTING',
						payload: JSON.parse(data.data.value),
					});
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				});
			})
			.catch((err) => console.log(err));
	};
};
