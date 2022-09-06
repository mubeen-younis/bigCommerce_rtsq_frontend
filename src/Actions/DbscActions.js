import axios from 'axios'
import types from '../Stores/types'
import { dispatchAlert, setModalData } from '../Utilities/dispatchAlert'

const reqConfig = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}

	return config
}

export const getShippingProfiles = token => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))

		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_dbsc_profiles`,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type: 'GET_DBSC_PROFILES',
				payload: data.data,
			})
		}

		dispatch(
			dispatchAlert(false, data.error ? 'error' : 'success', data.message)
		)
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const getShippingClasses = token => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))

		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_shipping_classes`,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type: 'GET_DBSC_CLASSES',
				payload: data.data,
			})
		}

		dispatch(
			dispatchAlert(false, data.error ? 'error' : 'success', data.message)
		)
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const getDbscData =
	(url = '', type = '', token) =>
	async dispatch => {
		try {
			dispatch(dispatchAlert(false, 'loading', ''))

			const { data } = await axios.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
				reqConfig(token)
			)
			if (!data.error) {
				dispatch({
					type,
					payload: data.data,
				})
			}

			dispatch(
				dispatchAlert(false, data.error ? 'error' : 'success', data.message)
			)
		} catch (err) {
			dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
		}
	}

export const addShippingClass = (classData, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/add_shipping_class`,
			classData,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type: 'ADD_DBSC_CLASS',
				payload: data.data,
			})
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const addShippingProfile = (profileData, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/add_dbsc_profile`,
			profileData,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type: 'ADD_DBSC_PROFILE',
				payload: data.data,
			})
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const addDbscData = (url, reqData, type, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type,
				payload: data.data,
			})
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const updateDbscData = (url, reqData, type, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type,
				payload: data.data,
			})
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const deleteDbscData = (url, reqData, type, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type,
				payload: data.data,
			})
			dispatch(setModalData('', false, '', null, ''))
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const getDbscZones = token => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))

		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_zones_bc`,
			reqConfig(token)
		)
		if (!data.error) {
			dispatch({
				type: 'GET_DBSC_BC_ZONES',
				payload: data.data,
			})
		}

		dispatch(
			dispatchAlert(false, data.error ? 'error' : 'success', data.message)
		)
	} catch (err) {
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const getDbscOtherSettings = token => async dispatch => {
	try {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: 'loading',
			},
		})

		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_dbsc_other_settings`,
			{
				headers: {
					authorization: `Bearer ${token}`,
				},
			}
		)
		if (!data.error) {
			dispatch({
				type: types.GET_DBSC_OTHER_SETTINGS,
				payload: data.data,
			})
		}

		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessage: '',
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

export const saveDbscOtherSettings = (reqData, token) => async dispatch => {
	try {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/save_dbsc_other_settings`,
			reqData,
			reqConfig(token)
		)

		if (!data.error) {
			dispatch({
				type: types.SET_DBSC_OTHER_SETTINGS,
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

export const setConfirmModalData =
	(title = '', visible = false, url = '', data = null, action = '', type = '') =>
	dispatch =>
		dispatch({
			type: 'SET_MODAL_DATA',
			payload: {
				title,
				visible,
				url,
				data,
				action,
				type,
			},
		})
