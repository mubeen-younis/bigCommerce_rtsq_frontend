import { useDispatch, useSelector } from 'react-redux'
import { getFDOCouponCarrierInfo } from '../Actions/FDOActions'

const useCouponCarrier = () => {
	const dispatch = useDispatch()
	const { installedCarriers, token } = useSelector(state => state)

	const getCouponCarrierInfo = ({ carrierId = '', testType = false }) => {
		const carrierName =
			(installedCarriers &&
				installedCarriers.find(carr => +carr.id === +carrierId)?.slug) ??
			''

		if (!testType && carrierName)
			dispatch(getFDOCouponCarrierInfo(token, carrierName))
	}

	return getCouponCarrierInfo
}

export default useCouponCarrier
