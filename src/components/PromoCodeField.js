import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd'
import { useSelector } from 'react-redux'

const PromoCodeField = () => {
	const { fdoCouponInfo, fdoCouponCarrierInfo, connectionSettings } = useSelector(
		state => state
	)
	const [state, setState] = useState({
		promoCode: '',
		readOnly: false,
	})

	useEffect(() => {
		setState(prevState => ({
			...prevState,
			promoCode: fdoCouponInfo
				? fdoCouponInfo?.code ?? ''
				: connectionSettings
				? connectionSettings?.promo_code ?? ''
				: '',
			readOnly: fdoCouponCarrierInfo && fdoCouponCarrierInfo?.is_enabled,
		}))
	}, [fdoCouponInfo, fdoCouponCarrierInfo, connectionSettings])

	return (
		<Form.Item label='Promo Code' name='promo_code'>
			<Input placeholder='Promo Code' readOnly={state.readOnly} />
		</Form.Item>
	)
}

export default PromoCodeField
