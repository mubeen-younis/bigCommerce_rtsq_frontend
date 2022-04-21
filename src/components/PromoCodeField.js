import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd'
import { useSelector } from 'react-redux'

const PromoCodeField = () => {
	const { fdoCouponInfo, fdoCouponCarrierInfo } = useSelector(state => state)
	const [state, setState] = useState({
		promoCode: '',
		readOnly: false,
	})

	useEffect(() => {
		setState(prevState => ({
			...prevState,
			promoCode: fdoCouponInfo ? fdoCouponInfo?.code ?? '' : '',
			readOnly: fdoCouponCarrierInfo && fdoCouponCarrierInfo?.is_enabled,
		}))
	}, [fdoCouponInfo, fdoCouponCarrierInfo])

	return (
		<Form.Item label='Promo Code'>
			<Input
				placeholder='Promo Code'
				readOnly={state.readOnly}
				onChange={e => setState({ ...state, promoCode: e.target.value })}
			/>
		</Form.Item>
	)
}

export default PromoCodeField
