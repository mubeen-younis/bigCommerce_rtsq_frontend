import axios from 'axios'
import types from '../Stores/types'
import { changeAddonStatus as changeAddonStatusFromStore } from './EnitureStore'

const addon_type = 'PLT'

export const getPalletsPlans = token => {
	const config = {
		headers: { authorization: `Bearer ${token}` },
		params: { addon_type },
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
				if (!data.error || data?.data?.length === 0) {
					dispatch({ type: types.PLT_PLANS, payload: data.data })
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
				{ package: plan_package, addon_type },
				{
					headers: { authorization: `Bearer ${token}` },
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({ type: types.PLT_PLANS, payload: data.data })
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
					addon_type: addon_type,
					suspend: action
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				dispatch({
					type: types.PLT_PLANS,
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
