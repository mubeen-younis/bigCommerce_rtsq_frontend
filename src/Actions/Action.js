import axios from 'axios'

export const postData = (data, type, url, token, setVisibleWarehouse = null) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		const isTestConnection = type === 'GET_CONNECTION_SETTINGS' && data.testType
		Object.keys(data).map(
			elem =>
				(data[elem] =
					typeof data[elem] == 'string' ? data[elem].trim() : data[elem])
		)

		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, data, config)
			.then(({ data }) => {
				if (!data.error) {
					if (data?.data?.value) {
						dispatch({
							type: type,
							payload: JSON.parse(data?.data?.value),
						})
					} else if (data?.data && !isTestConnection) {
						dispatch({
							type: type,
							payload: data?.data,
						})
					}

					if (type === 'SAVE_LOCATION') {
						setVisibleWarehouse(false)
					}
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

export const dismissAlert = () => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			alertMessage: null,
			showAlertMessage: false,
			alertMessageType: null,
		},
	})
}

export const setStore = store => {
	//localStorage.setItem('store', store)
	const config = {
		headers: {
			authorization: `Bearer ${store}`,
		},
	}
	return dispatch => {
		axios
			.get('store', {
				...config,
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'STORE',
						payload: data.data,
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
}

export const getPlansInfo = data => {
	const config = {
		headers: {
			authorization: `Bearer ${data.store}`,
		},
	}

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
					})
				} else {
					dispatch({
						type: 'ALERT_MESSAGE',
						showAlertMessage: true,
						alertMessage: data.message,
						alertMessageType: 'error',
					})
				}
			})
			.catch(error => {})
	}
}

export const getCurrentPlanInfo = store => {
	const config = {
		headers: {
			authorization: `Bearer ${store}`,
		},
	}

	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get-subscription-details`,
				config
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_CURRENT_PLAN',
						payload: data.data,
					})
				} else {
					dispatch({
						type: 'ALERT_MESSAGE',
						showAlertMessage: true,
						alertMessage: data.message,
						alertMessageType: 'error',
					})
				}
			})
			.catch(error => {})
	}
}
