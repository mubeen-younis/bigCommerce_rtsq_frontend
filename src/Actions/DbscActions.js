// import axios from '../Utilities/axios'
import axios from 'axios'
import { dispatchAlert, setModalData } from '../Utilities/dispatchAlert'

export const getShippingProfiles = token => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).get('get_dbsc_profiles')
		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_dbsc_profiles`,
			config
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
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).get('get_shipping_classes')
		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_shipping_classes`,
			config
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
	(url = '', type = '', token = '') =>
	async dispatch => {
		try {
			dispatch(dispatchAlert(false, 'loading', ''))
			const config = {
				headers: {
					authorization: `Bearer ${token}`,
				},
			}

			// const { data } = await axios(token).get(url)
			const { data } = await axios.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
				config
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
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).post('add_shipping_class', classData)
		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/add_shipping_class`,
			classData,
			config
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

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).post('add_dbsc_profile', profileData)
		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/add_dbsc_profile`,
			profileData,
			config
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

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).post(url, reqData)
		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			config
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
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		/* Destructuring the data property from the response object. */

		// const { data } = await axios(token).post(url, reqData)
		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			config
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

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).post(url, reqData)
		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,
			reqData,
			config
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
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		// const { data } = await axios(token).get('get_zones_bc')
		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_zones_bc`,
			config
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
