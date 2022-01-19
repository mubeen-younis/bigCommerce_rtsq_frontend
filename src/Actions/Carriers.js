import axios from 'axios'

export const getServices = (token, installed_carrier_id, carrier_type = '') => {
	return dispatch => {
		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_services`,
				{
					installed_carrier_id,
					carrier_type,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				if (data.data.length > 0) {
					let carrierServices = []
					let directory =
						carrier_type === 'GTZ'
							? '../../Carrier_Logos/Gtz/'
							: '../../Carrier_Logos/Wwe/'

					directory = carrier_type === 'CRS' ? '' : directory

					const sortedData = data.data.sort((a, b) => {
						let fa =
								carrier_type === 'GTZ'
									? a.speed_freight_carrierName.toLowerCase()
									: a.speed_freight_carrierSCAC.toLowerCase(),
							fb =
								carrier_type === 'GTZ'
									? a.speed_freight_carrierName.toLowerCase()
									: a.speed_freight_carrierSCAC.toLowerCase()

						if (fa < fb) return -1

						if (fa > fb) return 1

						return 0
					})

					sortedData.map((value, index) =>
						carrierServices.push({
							key:
								carrier_type === 'CRS'
									? value.speed_freight_carrierName
									: value.speed_freight_carrierSCAC,
							sr_no: index + 1,
							carrier_name:
								carrier_type === 'CRS'
									? value.speed_freight_carrierSCAC
									: value.speed_freight_carrierName,
							carrier_logo: (
								<img
									style={{ height: '40px' }}
									src={`${directory}${value.carrier_logo}`}
									alt={value.speed_freight_carrierName}
								/>
							),
						})
					)

					dispatch({
						type: 'GET_SERVICES',
						payload: carrierServices,
					})
				} else {
					dispatch({
						type: 'GET_SERVICES',
						payload: [],
					})
				}
				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				})
			})
			.catch(error => {})
	}
}

export const getAddTabSettings = (token, carrierId, carrier_type = '') => {
	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_add_tab_sett_store/${carrierId}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
				let payload =
					carrier_type.length > 0
						? JSON.parse(data.data[0].value)[carrier_type] ?? []
						: JSON.parse(data.data[0].value) ?? []

				dispatch({
					type: 'SET_GTZ_CARRIERS',
					payload: JSON.parse(data.data[0].value) ?? {
						GTZ: [],
						CRS: [],
					},
				})

				dispatch({
					type: 'SAVE_CARRIER_TAB_SETTINGS',
					payload,
				})

				dispatch({
					type: 'SKELETON_LOADING',
					payload: false,
				})
			})
			.catch(error => {})
	}
}

export const getCarrierDetails = data => {
	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_info`, {
				// data,
				params: {
					...data,
				},
			})
			.then(({ data }) => {
				if (data?.settings && data.settings.length > 0) {
					dispatch({
						type: 'GET_CONNECTION_SETTINGS',
						payload: data.settings,
					})
				}
			})
			.catch(error => {
				console.log(error)
			})
	}
}

export const getInstalledCarrierPlanInfo = (token, carrierId) => {
	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/getInstalledCarrierPlanInfo`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
					params: {
						carrierId,
					},
				}
			)
			.then(({ data }) => {
				if (!data.error) {
					const isExpired =
						new Date() > new Date(data.data.expiry_date)

					dispatch({
						type: 'GET_INSTALLED_CARRIER_PLAN_INFO',
						payload: isExpired
							? {
									...data.data,
									plan_type: '1',
									isExpired,
							  }
							: { ...data.data, isExpired },
					})
				}
			})
			.catch(error => {
				if (error) {
					dispatch({
						type: 'GET_INSTALLED_CARRIER_PLAN_INFO',
						payload: null,
					})
				}
			})
	}
}
