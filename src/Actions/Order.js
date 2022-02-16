import axios from 'axios'

export const getAllOrders = (
	token,
	current,
	perpage,
	sortOrder,
	setLoading,
	search = 0,
	status = null
) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
			},
		})
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
			params: {
				page: current,
				perpage,
				sortOrder: sortOrder,
				search,
				status: status,
			},
		}

		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_orders`, config)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_ORDERS',
						payload: data?.data,
					})
					dispatch({
						type: 'ORDERS_PAGINATION',
						payload: data?.meta,
					})
					dispatch({
						type: 'SEARCHED_ORDER',
						payload: search === 0 ? null : search,
					})
				} else {
					/*dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							alertMessage: data.message,
							showAlertMessage: true,
							alertMessageType: data.error ? 'error' : 'success',
						},
					});*/
					dispatch({
						type: 'GET_ORDERS',
						payload: [],
					})
					dispatch({
						type: 'ORDERS_PAGINATION',
						payload: [],
					})
				}
				setLoading(false)
			})
			.catch(err => {
				dispatch({
					type: 'GET_ORDERS',
					payload: [],
				})
			})
	}
}

export const getOrderDetail = (id, setselectedOrderDetail, setLoadOrder, token) => {
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_order_widget`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				params: {
					order_id: id,
				},
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_ORDER_WIDGET',
						payload: data?.data,
					})
					//setselectedOrderDetail(orderDetail);
					setLoadOrder(false)
				}
			})
			.catch(err => {
				if (err.response.data && err.response.data.error) {
					dispatch({
						type: 'GET_ORDER_WIDGET',
						payload: err.response.data.data,
					})
				}
				setLoadOrder(false)
			})
	}
}

export const submitOrderSettings = (orderSettings, token, setState) => {
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
				`${process.env.REACT_APP_ENITURE_API_URL}/update_order`,
				orderSettings,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'UPDATE_ORDER_SETTINGS',
						payload: data.data,
					})

					setState(ps => ({
						...ps,
						visible: false,
					}))
				}

				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				})
			})
			.catch(error => {})
	}
}
