import axios from 'axios'
import types from '../Stores/types'
import { dispatchAlert } from '../Utilities/dispatchAlert'

const reqConfig = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}

	return config
}

export const getRadPlans = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
		params: {
			addon_type: 'RAD',
		},
	}
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: 'loading',
			},
		})

		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get-all-pacakges`, config)
			.then(({ data }) => {
				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'RAD_PLANS',
						payload: data.data,
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : false,
					},
				})
			})
			.catch(error => {})
	}
}

export const changeDefaultAddress = (addon_id, token, address_type) => {
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
				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'CHANGE_DEFAULT_ADDRESS',
						payload: JSON.parse(data.data.value),
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
	}
}

export const changePlan = (token, plan_package, SetCancelSubsriptionVisible) => {
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
				`${process.env.REACT_APP_ENITURE_API_URL}/subscribe-package`,
				{
					package: plan_package,
					addon_type: 'RAD',
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
						type: 'RAD_PLANS',
						payload: data.data,
					})
				}
				SetCancelSubsriptionVisible(false)
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data?.data?.Message ?? data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
	}
}

export const changeAddonSuspendStatus = (addon_id, token, action) => {
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
				`${process.env.REACT_APP_ENITURE_API_URL}/suspend-use-addon`,
				{
					package: addon_id,
					addon_type: 'RAD',
					suspend: action,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				dispatch({
					type: 'RAD_PLANS',
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

export const getAddonAddressSettings = (addon_id, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: 'loading',
			},
		})

		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/rad/getAddonAdressSettings`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
					params: {
						addon_id,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_ADDON_ADDRESS_SETTING',
						payload: JSON.parse(data.data.value),
					})
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : false,
					},
				})
			})
			.catch(err => console.log(err))
	}
}

export const getRADSettings = token => async dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			showAlertMessage: false,
			alertMessageType: 'loading',
		},
	})

	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/getResidentialSettings`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(({ data }) => {
			if (!data.error) {
				dispatch({
					type: types.GET_RAD_SETTINGS,
					payload: data?.data,
				})
			}

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage: data.message,
					showAlertMessage: true,
					alertMessageType: data.error ? 'error' : false,
				},
			})
		})
		.catch(err => console.log(err))
}

export const submitRADSettings = (settings, token) => async dispatch => {
	try {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/saveResidentialSettings`,
			settings,
			reqConfig(token)
		)

		if (!data.error) {
			dispatch({
				type: types.SET_RAD_SETTINGS,
				payload: data.data,
			})
		}

		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessage: data.message,
				alertMessageType: data.error ? 'error' : 'success',
			},
		})
	} catch (err) {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: '',
			},
		})
	}
}
