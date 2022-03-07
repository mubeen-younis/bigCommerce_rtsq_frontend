import types from './../Stores/types'
import axios from './../Utilities/authToken'
import { dispatchAlert } from './../Utilities/dispatchAlert'

export const getShippingGroups = () => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading'))

		const {
			data: { error, data, message },
		} = await axios.get('get_shipping_groups')

		if (!error) {
			dispatch({
				type: types.GET_SHIPPING_GROUPS,
				payload: data ?? [],
			})
		}
		dispatch(dispatchAlert(error, error ? 'error' : 'success', message))
	} catch (err) {
		dispatch(dispatchAlert(false, null))
		dispatch({
			type: types.GET_SHIPPING_GROUPS,
			payload: [],
		})
	}
}

export const saveShippingGroup = shipping_group => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading'))

		const {
			data: { error, data, message },
		} = await axios.post('save_shipping_group', shipping_group)

		if (!error) {
			if (data?.save === 1) {
				dispatch({
					type: types.ADD_SHIPPING_GROUP,
					payload: data.shippingGroup,
				})
			} else {
				dispatch({
					type: types.UPDATE_SHIPPING_GROUP,
					payload: data.shippingGroup,
				})
			}
		}
		dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
	} catch (err) {
		dispatch(dispatchAlert(false, null))
	}
}

export const deleteShippingGroup = uuid => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading'))

		const {
			data: { error, data, message },
		} = await axios.post('delete_shipping_group', { uuid })

		if (!error) {
			dispatch({
				type: types.DELETE_SHIPPING_GROUP,
				payload: data,
			})
		}
		dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
	} catch (err) {
		dispatch(dispatchAlert(false, null))
	}
}
