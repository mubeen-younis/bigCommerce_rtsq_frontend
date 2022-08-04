import axios from '../Utilities/axios'
import { dispatchAlert, setModalData } from '../Utilities/dispatchAlert'

export const getShippingProfiles = () => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))

		const { data } = await axios().get('get_dbsc_profiles')
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

export const getShippingClasses = () => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading', ''))

		const { data } = await axios().get('get_shipping_classes')
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
	(url = '', type = '') =>
	async dispatch => {
		try {
			dispatch(dispatchAlert(false, 'loading', ''))

			const { data } = await axios().get(url)
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

export const addShippingClass = classData => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios().post('add_shipping_class', classData)
		console.log(data)
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

export const addShippingProfile = profileData => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))
		console.log(profileData)

		const { data } = await axios().post('add_dbsc_profile', profileData)
		console.log(data)
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

export const addDbscData = (url, reqData, type) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios().post(url, reqData)
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

export const updateDbscData = (url, reqData, type) => async dispatch => {}

export const deleteDbscData = (url, reqData, type) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading', ''))

		const { data } = await axios().post(url, reqData)
		if (!data.error) {
			dispatch({
				type,
				payload: data.data,
			})
			dispatch(setModalData('', false, '', null, ''))
		}

		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		console.log(err)
		dispatch(dispatchAlert(false, 'error', 'Something went wrong'))
	}
}

export const setConfirmModalData = (
	title = '',
	visible = false,
	url = '',
	data = null,
	action = ''
) => ({
	type: 'SET_MODAL_DATA',
	payload: {
		title,
		visible,
		url,
		data,
		action,
	},
})
