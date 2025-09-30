import axios from 'axios';
import { changeAddonStatus as changeAddonStatusFromStore } from './EnitureStore';

export const getSbsPlans = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
		params:{
			addon_type:'SBS'
		}
	};
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: 'loading',
			},
		});

		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get-all-pacakges`, config)
			.then(({ data }) => {
				if (!data.error || data.data.length === 0) {
					dispatch({
						type: 'SBS_PLANS',
						payload: data.data,
					});
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : false,
					},
				});
			})
			.catch(error => {});
	};
};

export const changePlan = (token, plan_package, SetCancelSubsriptionVisible) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/subscribe-package`,
				{
					package: plan_package,
					addon_type:'SBS'
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
						type: 'SBS_PLANS',
						payload: data.data,
					});
				}
				SetCancelSubsriptionVisible(false)
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data?.data?.Message ?? data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			});
	};
};

export const changeAddonSuspendStatus = (addon_id, token, action) => {
	return changeAddonStatusFromStore(2, token);
};

export const changeBinsPackagingMode = (token, action) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/bins-package-mode`,
				{
					addon_type:'SBS',
					bin_pack_mode: action
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch(err => {
				
			});
	};
};