import React from 'react'
import { useSelector } from 'react-redux'

const PromoCodeNote = ({ carrierName }) => {
	const FDO_REGISTRATION_URL =
		process?.env?.NODE_ENV === 'production'
		
			? 'https://freightdesk.online/register'
			: 'https://freightdesk.eniture-qa.com/register'
	const FDO_LEARN_MORE_URL = 'https://freightdesk.online/'
	const { fdoCouponInfo, fdoCouponCarrierInfo } = useSelector(state => state)

	const isCarrPromoExpire = () => {
		return fdoCouponCarrierInfo && fdoCouponCarrierInfo['isCarrPromoExpire'] ? fdoCouponCarrierInfo['isCarrPromoExpire'] : false 
	}
	
	return (
		<div className={'note-bx'}>
			{fdoCouponCarrierInfo &&
			fdoCouponCarrierInfo?.is_enabled === 1 &&
			fdoCouponInfo ? (
				<span>
					<strong>Congratulations! </strong>You have activated your Promo
					Code <strong>[{fdoCouponInfo?.code ?? ''}]</strong> with
					FreightDesk Online account{' '}
					<strong>[{fdoCouponInfo?.freightdesk_company_id ?? ''}]</strong>.
					Now you can enjoy free shipments with FreightDesk Online for two
					months.
				</span>
			) : fdoCouponCarrierInfo &&
			    fdoCouponCarrierInfo?.is_enabled === 2 &&
			    fdoCouponInfo  || isCarrPromoExpire() ? (
					<span>
						<strong>Note! </strong>Your Promo Code <strong>[{fdoCouponInfo?.code ?? ''}] </strong> has expired.
					</span>
			)  : (
				<>
					<h3
						style={{
							textAlign: 'center',
						}}>
						<strong>Free Offer!</strong>
					</h3>
					<p>
						Process your {carrierName} shipments free for two months by
						using promo code{' '}
						<strong>
							{' '}
							{fdoCouponInfo && fdoCouponInfo?.code
								? fdoCouponInfo?.code
								: 'promo_code'}{' '}
						</strong>{' '}
						in your connection settings. You must have a FreightDesk
						Online account connected to this app to take advantage of
						this promotion. If you don't have a FreightDesk Online
						account,{' '}
						<a
							href={
								fdoCouponCarrierInfo?.registerUrl ??
								FDO_REGISTRATION_URL
							}
							target='_blank'
							rel='noreferrer'>
							click here
						</a>{' '}
						to register for one.{' '}
						<a
							href={FDO_LEARN_MORE_URL}
							target='_blank'
							rel='noreferrer'>
							Learn more about FreightDesk Online.
						</a>{' '}
					</p>
					<p>
						<i>
							This offer only applies to charges that otherwise would
							be billed by Eniture Technology for the use of
							FreightDesk Online. Charges invoiced by the shipping
							provider (or by any other shipping provider) are not
							included in this offer. A paid subscription to
							FreightDesk Online is still required to process shipments
							for other shipping providers not included in this
							promotion.
						</i>
					</p>
				</>
			)}
		</div>
	)
}

export default PromoCodeNote
