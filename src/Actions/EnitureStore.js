import axios from 'axios'

export const installCarrier = (carrier_id, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

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
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch(error => {})
	}
}

export const getAllCarriers = data => {
	const config = {
		headers: {
			authorization: `Bearer ${data.store}`,
		},
	}

	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/getRecommendedCarriers`,
				config
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_CARRIERS',
						payload: data.data.carriers,
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				})
			})
			.catch(({ response }) => {
				if (
					response &&
					response.data.error &&
					response.data.message === 'Token Mismatch'
				) {
					dispatch({
						type: 'GET_CARRIERS',
						payload: undefined,
					})

					dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							showAlertMessage: false,
							alertMessageType: 'Token Mismatch',
						},
					})

					return
				}
			})
	}
}

export const getAllAvailableCarriers = (token) => {
	return dispatch => {
		console.log('getAllAvailableCarriers called with token:', token);
		console.log('API URL:', `${process.env.REACT_APP_ENITURE_API_URL}/getAllCarriers`);

		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/getAllCarriers`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				console.log('getAllCarriers API response:', data);
				if (!data.error) {
					console.log('Dispatching carriers to Redux:', data.carriers);
					dispatch({
						type: 'GET_ALL_AVAILABLE_CARRIERS',
						payload: data.carriers,
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: false,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch((error) => {
				console.log('getAllCarriers API error:', error);
				if (
					error.response &&
					error.response.data?.error &&
					error.response.data?.message === 'Token Mismatch'
				) {
					dispatch({
						type: 'GET_ALL_AVAILABLE_CARRIERS',
						payload: [],
					})

					dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							showAlertMessage: false,
							alertMessageType: 'Token Mismatch',
						},
					})

					return
				}

				dispatch({
					type: 'GET_ALL_AVAILABLE_CARRIERS',
					payload: [],
				})

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: 'Failed to fetch available carriers',
						showAlertMessage: true,
						alertMessageType: 'error',
					},
				})
			})
	}
}

export const getInstalledCarriers = data => {
	return dispatch => {
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
					})
				} else {
					dispatch({
						type: 'GET_INSTALLED_CARRIERS',
						payload: data.data,
					})
				}
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ?? 'error',
					},
				})
			})
			.catch(err => {
				dispatch({
					type: 'GET_INSTALLED_CARRIERS',
					payload: undefined,
				})
			})
	}
}

export const changeCarrierStatus = (carrier_id, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

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
				if (!data.error) {
					dispatch({
						type: 'CHANGE_CARRIER_STATUS',
						payload: data.data,
					})
				}
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch(err => {
				console.log(err)
			})
	}
}

export const installAddon = (addon_id, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

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
					})
				}
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch(error => {})
	}
}

export const getAllAddons = data => {
	const config = {
		headers: {
			authorization: `Bearer ${data.store}`,
		},
	}

	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/getRecommendedAddons`,
				config
			)
			.then(({ data }) => {
				dispatch({
					type: 'GET_ADDONS',
					payload: data.data,
				})
			})
			.catch(error => {
				dispatch({
					type: 'GET_ADDONS',
					payload: undefined,
				})
			})
	}
}

export const getInstalledAddons = data => {
	return dispatch => {
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
				})
			})
			.catch(err => {
				dispatch({
					type: 'GET_INSTALLED_ADDONS',
					payload: undefined,
				})
			})
	}
}

export const changeAddonStatus = (addon_id, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

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
				})

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch(err => {
				console.log(err)
			})
	}
}
