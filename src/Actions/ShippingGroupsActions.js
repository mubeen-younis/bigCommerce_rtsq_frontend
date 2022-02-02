import axios from './../Utilities/authToken'
import { dispatchAlert } from './../Utilities/dispatchAlert'
import types from './../Stores/types'

export const saveShippingGroup = shipping_group => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading'))

		const {
			data: { error, data },
		} = await axios.post('save_shipping_group', shipping_group)

		if (!error) {
			dispatch({
				type: types.ADD_SHIPPING_GROUP,
				payload: data,
			})
		}
		dispatch(dispatchAlert(true, data.error ? 'error' : 'success', data.message))
	} catch (err) {
		console.log(err)
		dispatch(dispatchAlert(false, null))
	}
}
