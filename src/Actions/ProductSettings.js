import axios from 'axios';

export const submitProductSettings = (data, token) => {
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
				`${process.env.REACT_APP_ENITURE_API_URL}/update_product`,
				{
					...data,
					product_id: data.product_id,
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
			.catch(error => {});
	};
};

export const getProduct = (id, setselectedProductDetail, setLoadProduct, token) => {
	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_product`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
			params: {
				product_id: id,
			},
		})
		.then(res => {
			let data = JSON.parse(res.data.data[0].settings);
			data = { ...data, product_id: id };

			setselectedProductDetail(data);
			setLoadProduct(false);
		});
};

export const importProducts = token => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/import_products`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			.then(resp => {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: resp.data.message,
						showAlertMessage: true,
						alertMessageType: resp.data.error ? 'error' : 'success',
					},
				});
				if (!resp.data.error && resp.data.data['data'].length > 0) {
					dispatch({
						type: 'GET_ALL_PRODUCTS',
						payload: resp.data.data['data'],
					});
				}
			});
	};
};

export const getAllProducts = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_products`, config)
			.then(({ data }) => {
				//if (data.data.length > 0) {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: data.data,
				});
				//}
			})
			.catch(error => {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: [],
				});
			});
	};
};
