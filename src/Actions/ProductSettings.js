import axios from 'axios'

export const submitProductSettings = (productSettings, token, setState) => {
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
				`${process.env.REACT_APP_ENITURE_API_URL}/update_product`,
				productSettings,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'UPDATE_PRODUCT_SETTINGS',
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

export const getProduct = (id, setselectedProductDetail, setLoadProduct, token) => {
	return dispatch => {
		dispatch({
			type: 'GET_PRODUCT_DETAIL',
			payload: null,
		})
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_product`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				params: {
					product_id: id,
				},
			})
			.then(({ data }) => {
				if (!data.error) {
					/*let product = data.data[0];
				let settings = product.settings !="" ? JSON.parse(product.settings) : {}
				product = { ...product, ...settings, product_id: id };*/
					dispatch({
						type: 'GET_PRODUCT_DETAIL',
						payload: data.data,
					})
					//setselectedProductDetail(product);
					//setLoadProduct(false);
				}
			})
	}
}

export const importProducts = (email, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: 'loading',
			},
		})
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessage: 'Products synchronize request is in progress.',
				alertMessageType: 'success',
			},
		})
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/import_products`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				params: {
					email,
				},
			})
			.then(({ data }) => {
				if (!data?.error && data?.data?.length > 0) {
					dispatch({
						type: 'GET_ALL_PRODUCTS',
						payload: data.data,
					})
				}
			})
	}
}

export const getAllProducts = (
	token,
	current,
	perpage,
	sortProd,
	setLoading,
	search = null
) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
		params: {
			page: current,
			perpage,
			sortProd: sortProd,
			search,
		},
	}
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_products`, config)
			.then(({ data }) => {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: data.data,
				})
				dispatch({
					type: 'PRODUCTS_PAGINATION',
					payload: data.meta,
				})
				dispatch({
					type: 'SEARCHED_PRODUCT',
					payload: search,
				})
				setLoading(false)
			})
			.catch(error => {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: [],
				})
			})
	}
}

export const getInsuraceStatus = (token, installed_carrier_id) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
	return dispatch => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/has_insurance`,
				{ installed_carrier_id },
				config
			)
			.then(({ data }) => {
				dispatch({
					type: 'SET_INSURANCE_STATUS',
					payload: data.data,
				})
			})
			.catch(error => {
				dispatch({
					type: 'SET_INSURANCE_STATUS',
					payload: false,
				})
			})
	}
}
