import axios from 'axios';

export const submitProductSettings = (data, token) => {
	const config = {
		headers: {
			authorization: `Bearer eyJpdiI6IlIyWC9zeUZBTnBXeE50ODd0aFlqdnc9PSIsInZhbHVlIjoiS0RLOGNlUUN0Z1ZTTEdFRmpibWFaUT09IiwibWFjIjoi`,
		},
	};

	return (dispatch) => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/update_product`,
				{
					...data,
					product_id: data.product_id,
				},
				config
			)
			.then(({ data }) => {
				console.log(data);
			})
			.catch((error) => {});
	};
};

export const getProduct = (id, setselectedProductDetail, setLoadProduct) => {
	const config = {
		headers: {
			authorization: `Bearer eyJpdiI6Inl2aERGVi9td2dvTzlaRTl0aGFxelE9PSIsInZhbHVlIjoiMjJIZXF0ekdQUzB5d1M4ZXAyZTBYZz09IiwibWFjIjoi`,
		},
		params: {
			product_id: id,
		},
	};

	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_product`, config)
		.then((res) => {
			let data = JSON.parse(res.data.data[0].settings);
			data = { ...data, product_id: id };

			setselectedProductDetail(data);
			setLoadProduct(false);
		});
};
