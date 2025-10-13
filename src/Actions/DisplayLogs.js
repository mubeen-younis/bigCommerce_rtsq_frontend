import axios from 'axios'

export const getAllLogs = (
	token,
	current,
	perpage,
	sortProd,
	setLogsLoading,
	search = null,
	carrier = null,
) => {
	const params = {
		page: current,
		perpage,
		sortProd: sortProd,
		search,
	}

	// Only add carrier_slug if carrier is provided (not null)
	if (carrier) {
		params.carrier_slug = carrier
	}

	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
		params,
	}
	return dispatch => {
		setLogsLoading(true)
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_logs`, config)
			.then(({ data }) => {
				dispatch({
					type: 'GET_ALL_LOGS',
					payload: data.data,
				})
				dispatch({
					type: 'LOGS_PAGINATION',
					payload: data.meta,
				})
				setLogsLoading(false)
			})
			.catch(error => {
				setLogsLoading(false)
				dispatch({
					type: 'GET_ALL_LOGS',
					payload: [],
				})
			})
	}
}
