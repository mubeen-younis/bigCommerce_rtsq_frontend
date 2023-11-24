import types from './../Stores/types'
import axios from './../Utilities/authToken'
import { dispatchAlert } from './../Utilities/dispatchAlert'

export const getShippingRules = token => async dispatch => {
	try {
		dispatch(dispatchAlert(false, 'loading'))

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		const {
			data: { error, data, message },
		} = await axios.get('get_shipping_rules', config)

		if (!error) {
			dispatch({
				type: types.GET_SHIPPING_RULES,
				payload: data ?? [],
			})
		}
		dispatch(dispatchAlert(error, error ? 'error' : 'success', message))
	} catch ({ response }) {
		if (
			response &&
			response?.data?.error &&
			response?.data?.message === 'Token Mismatch'
		) {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
					alertMessageType: 'Token Mismatch',
				},
			})

			return
		}

		dispatch(dispatchAlert(false, null))
		dispatch({
			type: types.GET_SHIPPING_RULES,
			payload: [],
		})
	}
}


export const getStatesProvinces = (countryCode,token) => async dispatch => {
	
	try {
		const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_country_states`,
		
		  config = {
			headers: {
			  authorization: `Bearer ${token}`,
			},
		  }
		const reqData = {'countryCode' : countryCode}

		const {
			data: { error, data, message },
		}  = await axios.post(url, reqData, config)

		if (!error) {
			dispatch({
				type: types.GET_STATES_PROVINCES,
				payload: data,
			})
		}
	  } catch (err) {
		dispatch(dispatchAlert(false, null))
	  }
	}

	export const getCarrServices = (carrierId, token, isLTL) => async dispatch => {
	
		try {
			const url = `${process.env.REACT_APP_ENITURE_API_URL}/getCarrierServices`,
			
			  config = {
				headers: {
				  authorization: `Bearer ${token}`,
				},
			  }

			const reqData = {'isLTL' : isLTL, 'carrierId' : carrierId}
	
			const {
				data: { error, data, message },
			}  = await axios.post(url, reqData, config)
	
			if (!error) {
				dispatch({
					type: types.GET_CARRIER_SERVICES,
					payload: data,
				})
			}
		  } catch (err) {
			dispatch(dispatchAlert(false, null))
		  }
		}


export const saveShippingRule = (shipping_rule, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading'))

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		const {
			data: { error, data, message },
		} = await axios.post('save_shipping_rule', shipping_rule, config)

		if (!error) {
			if (data?.save === 1) {
				dispatch({
					type: types.ADD_SHIPPING_RULE,
					payload: data.shippingRule,
				})
			} else {
				dispatch({
					type: types.UPDATE_SHIPPING_RULE,
					payload: data.shippingRule,
				})
			}
		}
		dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
	} catch (err) {
		dispatch(dispatchAlert(false, null))
	}
}

export const deleteShippingRule = (uuid, token) => async dispatch => {
	try {
		dispatch(dispatchAlert(true, 'loading'))

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		const {
			data: { error, data, message },
		} = await axios.post('delete_shipping_rule', { uuid }, config)

		if (!error) {
			dispatch({
				type: types.DELETE_SHIPPING_RULE,
				payload: data,
			})
		}
		dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
	} catch (err) {
		dispatch(dispatchAlert(false, null))
	}
}
