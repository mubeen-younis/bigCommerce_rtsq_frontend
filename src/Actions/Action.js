import axios from 'axios'
import types from '../Stores/types'

export const postData = (data, type, url, token, setVisibleWarehouse = null) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		const isTestConnection = type === 'GET_CONNECTION_SETTINGS' && data.testType
		Object.keys(data).map(
			elem =>
				(data[elem] =
					typeof data[elem] == 'string' ? data[elem].trim() : data[elem])
		)

		// If we are in install flow, add is_installing=1
		try {
			const state = window?.store?.getState ? window.store.getState() : null
			if (state?.isInstalling && (url === 'submit_connection_settings')) {
				data = { ...data, is_installing: 1 }
			}
		} catch (e) {}

		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, data, config)
			.then(({ data: responseData }) => {
				if (!responseData.error) {
					if (responseData?.data?.value) {
						dispatch({
							type: type,
							payload: JSON.parse(responseData?.data?.value),
						})

						if (
							url === 'submit_connection_settings' &&
							responseData?.data['fdoCouponCarrierInfo'] !== undefined
						) {
							dispatch({
								type: 'GET_FDO_COUPON_CARRIER_INFO',
								payload: responseData?.data?.fdoCouponCarrierInfo,
							})
						}
					} else if (responseData?.data && !isTestConnection) {
						dispatch({
							type: type,
							payload: responseData?.data,
						})
					}

					if (type === 'SAVE_LOCATION') {
						setVisibleWarehouse(false)
					}

					// Handle carrier installation success
					if (url === 'submit_connection_settings' && data.is_installing === 1 && !isTestConnection && !responseData.error) {
						try {
							const state = window?.store?.getState ? window.store.getState() : null
							const availableCarrierId = state?.availableCarrierId

							// Get available carrier info
							let availableCarrierInfo = {}
							if (state?.availableCarriers && availableCarrierId) {
								const matchingCarrier = state.availableCarriers.find(ac => ac.id === availableCarrierId)
								if (matchingCarrier) {
									availableCarrierInfo = {
										name: matchingCarrier.name,
										slug: matchingCarrier.slug,
										logo: matchingCarrier.logo,
										carrier_type: matchingCarrier.carrier_type
									}
								}
							}

							const newCarrier = {
								id: responseData.data.id,
								carrier_id: responseData.data.carrier_id || availableCarrierId,
								nickname: responseData.data.nickname,
								is_enabled: responseData.data.is_enabled !== undefined ? responseData.data.is_enabled : 1,
								name: availableCarrierInfo.name || responseData.data.nickname || 'New Carrier',
								slug: availableCarrierInfo.slug || '',
								logo: availableCarrierInfo.logo || '',
								carrier_type: availableCarrierInfo.carrier_type,
								...responseData.data
							}

							dispatch({
								type: 'CARRIER_INSTALLATION_SUCCESS',
								payload: {
									carrierId: availableCarrierId,
									newCarrier: newCarrier
								}
							})
						} catch (e) {
							console.error('Error handling carrier installation success:', e)
						}
					}
				}

				if(url !== 'submit_threshold_settings' && url !== 'submit_staffnote_settings'){
					dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							alertMessage: responseData.message,
							showAlertMessage: true,
							alertMessageType: responseData.error ? 'error' : 'success',
						},
					})
				}
			})
			.catch(error => {})
	}
}

export const dismissAlert = () => dispatch => {
	dispatch({
		type: 'ALERT_MESSAGE',
		payload: {
			alertMessage: null,
			showAlertMessage: false,
			alertMessageType: null,
		},
	})
}

export const setStore = store => {
	//localStorage.setItem('store', store)
	const config = {
		headers: {
			authorization: `Bearer ${store}`,
		},
	}
	return dispatch => {
		axios
			.get('store', {
				...config,
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'STORE',
						payload: data.data,
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
}

export const getPlansInfo = data => {
	const config = {
		headers: {
			authorization: `Bearer ${data.store}`,
		},
	}

	return dispatch => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_plans_info`, {
				...config,
				params: { store: 'stores/uann2u' },
			})
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_PLANS_INFO',
						payload: JSON.parse(data.data[0].value),
					})
				} else {
					dispatch({
						type: 'ALERT_MESSAGE',
						showAlertMessage: true,
						alertMessage: data.message,
						alertMessageType: 'error',
					})
				}
			})
			.catch(error => {})
	}
}

export const getCurrentPlanInfo = store => {
	const config = {
		headers: {
			authorization: `Bearer ${store}`,
		},
	}

	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get-subscription-details`,
				config
			)
			.then(({ data }) => {
				if (!data.error) {
					dispatch({
						type: 'GET_CURRENT_PLAN',
						payload: data.data,
					})
				} else {
					dispatch({
						type: 'ALERT_MESSAGE',
						showAlertMessage: true,
						alertMessage: data.message,
						alertMessageType: 'error',
					})
				}
			})
			.catch(error => {})
	}
}

export const installCarrierAndSaveSettings = (data, token, availableCarrierId) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}

	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		// Prepare data for nickname-based installation
		const installData = {
			...data,
			carrierId: availableCarrierId,
			installed_carrier_id: availableCarrierId,
			is_installing: 1, // Flag for backend to handle installation via nickname
		}

		// Remove the test flag since we're saving, not testing
		delete installData.testType


		// Save connection settings with installation flag and nickname
		return axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/submit_connection_settings`,
				installData,
				config
			)
			.then(({ data: settingsData }) => {
				if (!settingsData.error) {

					// Update connection settings in store
					if (settingsData?.data?.value) {
						dispatch({
							type: 'GET_CONNECTION_SETTINGS',
							payload: JSON.parse(settingsData.data.value),
						})
					}

					// Dispatch success event for modal close and optimistic update

					// Create carrier object from installation response
					// Try to get additional info from available carriers if possible
					let availableCarrierInfo = {}
					try {
						const state = window?.store?.getState ? window.store.getState() : null
						const availableCarriers = state?.availableCarriers || []
						const matchingAvailableCarrier = availableCarriers.find(ac => ac.id === availableCarrierId)
						if (matchingAvailableCarrier) {
							availableCarrierInfo = {
								name: matchingAvailableCarrier.name,
								slug: matchingAvailableCarrier.slug,
								logo: matchingAvailableCarrier.logo
							}
						}
					} catch (e) {
						// Silent fallback
					}

					const newCarrier = {
						id: settingsData.data.id,
						carrier_id: settingsData.data.carrier_id,
						nickname: settingsData.data.nickname,
						is_enabled: settingsData.data.is_enabled,
						name: availableCarrierInfo.name || settingsData.data.nickname || 'New Carrier',
						slug: availableCarrierInfo.slug || '',
						logo: availableCarrierInfo.logo || '',
						...settingsData.data // Include any other fields from response
					}

					console.log('🔍 NICKNAME DEBUG: Carrier installed with nickname:', newCarrier.nickname);

					dispatch({
						type: 'CARRIER_INSTALLATION_SUCCESS',
						payload: {
							carrierId: availableCarrierId,
							newCarrier: newCarrier
						}
					})

					dispatch({
						type: 'ALERT_MESSAGE',
						payload: {
							alertMessage: 'Carrier installed and configured successfully',
							showAlertMessage: true,
							alertMessageType: 'success',
						},
					})
				} else {
					throw new Error(settingsData.message || 'Failed to save connection settings')
				}
			})
			.catch(error => {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: error.message || 'Failed to install and configure carrier',
						showAlertMessage: true,
						alertMessageType: 'error',
					},
				})
				throw error
			})
	}
}

export const submitCompareRates = (values, token, setLoading = false, handleClick) => async dispatch => {
	try {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		})

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}

		const { data } = await axios.post(
			`${process.env.REACT_APP_ENITURE_API_URL}/get_compare_rates`,
			values,
			config
		)

		if (!data.error) {
			const carrdata = []
			if(data.data.small_package !== []){
				carrdata['small_package'] = data.data.small_package
			}
			if(data.data.ups_ship_engine !== []){
				carrdata['ups_ship_engine'] = data.data.ups_ship_engine
			}
			dispatch({
				type: types.SET_COMPARE_RATES,
				payload: carrdata,
			})
			setLoading(true)
			handleClick()
		}

		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessage: data.message,
				alertMessageType: data.error ? 'error' : 'success',
			},
		})
	} catch (err) {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
				alertMessageType: '',
			},
		})
	}
}
