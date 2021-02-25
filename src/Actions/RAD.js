import axios from 'axios';
export const getRadPlans = (token) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	return (dispatch) => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/rad/get_plans`, config)
			.then(({ data }) => {
				if (!data.error || data.data.length === 0) {
					if (data.data.plans) {
						dispatch({
							type: 'RAD_PLANS',
							payload: data.data.plans,
						});
					} else {
						dispatch({
							type: 'RAD_PLANS',
							payload: data.data,
						});
					}
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch((error) => {});
	};
};
