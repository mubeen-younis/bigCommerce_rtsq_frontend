import axios from 'axios'

export const getFDOCouponInfo = token => async dispatch => {
	try {
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
		const { data } = await axios.get(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_fdo_coupon_info`,
			config
		)

		if (!data.error) {
			dispatch({
				type: 'GET_FDO_COUPON_INFO',
				payload: data.data,
			})
		}
	} catch (err) {
		dispatch({
			type: 'GET_FDO_COUPON_INFO',
			payload: null,
		})
	}
}

export const getFDOCouponCarrierInfo =
	(token, carrier_name, coupon_code) => async dispatch => {
		try {
			const config = {
				headers: { authorization: `Bearer ${token}` },
				params: { carrier_name, coupon_code },
			}
			const { data } = await axios.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_fdo_coupon_carrier_info`,
				config
			)

			if (!data.error) {
				dispatch({
					type: 'GET_FDO_COUPON_CARRIER_INFO',
					payload: data.data,
				})
			}
		} catch (err) {
			dispatch({
				type: 'GET_FDO_COUPON_CARRIER_INFO',
				payload: null,
			})
		}
	}
