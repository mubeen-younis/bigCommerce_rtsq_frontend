import types from './../Stores/types'
import axios from './../Utilities/authToken'
import { dispatchAlert } from './../Utilities/dispatchAlert'

export const getUpdateProductApiToken = (token) => async dispatch => {
	
	try {
		dispatch(dispatchAlert(false, 'loading'))
		const url = `${process.env.REACT_APP_ENITURE_API_URL}/getApiAccessToken`,
		
		  config = {
			headers: {
			  authorization: `Bearer ${token}`,
			},
		  }
		const reqData = {}

		const {
			data: { error, data, message },
		}  = await axios.post(url, reqData, config)

		if (!error) {
			dispatch({
				type: types.API_ACCESS_TOKEN,
				payload: data ?? [],
			})
		}
		dispatch(dispatchAlert(error, error ? 'error' : 'success', message))
	  } catch (err) {
		dispatch({
			type: types.API_ACCESS_TOKEN,
			payload: '',
		})
		dispatch(dispatchAlert(false, null))
	  }
	}

