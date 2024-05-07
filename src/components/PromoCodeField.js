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
			readOnly:
				!fdoCouponInfo ||
				!fdoCouponInfo?.freightdesk_company_id ||
				(fdoCouponCarrierInfo && fdoCouponCarrierInfo?.is_enabled),
		}))
	}, [fdoCouponInfo, fdoCouponCarrierInfo, connectionSettings])

	const inpStyles = {
		backgroundColor: state.readOnly ? 'rgb(240, 232, 232)' : 'initial',
		cursor: state.readOnly ? 'ready-only' : 'initial',
	}

	return (
		<Form.Item label='Promo Code' name='promo_code' style={{ marginTop: '10px' }}>
			<Input
				placeholder={
					!fdoCouponInfo || !fdoCouponInfo?.freightdesk_company_id
						? 'Your store must be connected with FreightDesk Online to apply promo code.'
						: 'Promo Code'
				}
				readOnly={state.readOnly}
				style={inpStyles}
			/>
		</Form.Item>
	)
}

export default PromoCodeField
