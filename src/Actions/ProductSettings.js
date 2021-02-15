import axios from 'axios';

const config = {
	headers: {
		authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
	},
};

export const submitProductSettings = (data, token) => {
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
	axios
		.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_product`, {
			...config,
			params: {
				product_id: id,
			},
		})
		.then((res) => {
			let data = JSON.parse(res.data.data[0].settings);
			data = { ...data, product_id: id };

			setselectedProductDetail(data);
			setLoadProduct(false);
		});
};
