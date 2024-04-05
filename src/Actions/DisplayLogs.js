import axios from 'axios'

export const getAllLogs = (
	token,
	current,
	perpage,
	sortProd,
	setLogsLoading,
	search = null,
	carrier,
) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
		params: {
			carrier_slug : carrier,
			page: current,
			perpage,
			sortProd: sortProd,
			search,
		},
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
