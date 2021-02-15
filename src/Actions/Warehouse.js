import axios from 'axios';
const config = {
	headers: {
		authorization: `Bearer eyJpdiI6Inl2aERGVi9td2dvTzlaRTl0aGFxelE9PSIsInZhbHVlIjoiMjJIZXF0ekdQUzB5d1M4ZXAyZTBYZz09IiwibWFjIjoi`,
	}, //Authorization: `Bearer ${token}`
};
export const getGoogleResponse = (zipcode) => {
	return (dispatch) => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipcode}`,
				config
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_GOOGLE_LOCATION_RESPONSE',
						payload: data.data,
					});
				}
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: data.error,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch((error) => {});
	};
};

export const getWarehouse = (id, setLocationDetail, setVisibleWarehouse) => {
	const config = {
		headers: {
			authorization: `Bearer eyJpdiI6IlIyWC9zeUZBTnBXeE50ODd0aFlqdnc9PSIsInZhbHVlIjoiS0RLOGNlUUN0Z1ZTTEdFRmpibWFaUT09IiwibWFjIjoi`,
		},
		params: {
			location_id: id,
		},
	};

	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_location`, config)
		.then((res) => {
			const { data } = res.data;
			let additional = JSON.parse(data.additionals);
			setLocationDetail({
				id: data.id ?? '',
				city: data.city ?? '',
				state: data.state ?? '',
				country: data.country ?? '',
				nickname: data.nickname ?? '',
				zip_code: data.zip_code ?? '',
				location_type: data.type ?? '',

				enable_instore: additional.instore_pickup ?? false,
				instore_miles: additional.instore_pickup_data.miles ?? null,
				instore_zipcodes: additional.instore_pickup_data.postalCodes
					? additional.instore_pickup_data.postalCodes.split(',')
					: null,
				instock_description:
					additional.instore_pickup_data.checkout_description ?? null,

				enable_ld: additional.local_delivery ?? false,
				ld_miles: additional.local_delivery_data.miles ?? null,
				ld_zipcodes: additional.local_delivery_data.postalCodes
					? additional.local_delivery_data.postalCodes.split(',')
					: null,
				ld_description:
					additional.local_delivery_data.checkout_description ?? null,
				ld_fee: additional.local_delivery_data.local_delivery_fee ?? null,

				ld_enable_supress: additional.suppress_rates ?? false,
			});
			setVisibleWarehouse(true);
		});
};

export const deleteWarehouse = (id, setDeleteWarehouseModal) => {
	console.log(id);

	return (dispatch) => {
		const config = {
			headers: {
				authorization: `Bearer eyJpdiI6IlIyWC9zeUZBTnBXeE50ODd0aFlqdnc9PSIsInZhbHVlIjoiS0RLOGNlUUN0Z1ZTTEdFRmpibWFaUT09IiwibWFjIjoi`,
			},
		};

		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/delete_location`,
				{
					location_id: id,
				},
				config
			)
			.then(({ data }) => {
				console.log(data);
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: data.error,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});

				dispatch({
					type: 'DELETE_LOCATION',
					payload: id,
				});

				setDeleteWarehouseModal(false);
			});
	};
};
