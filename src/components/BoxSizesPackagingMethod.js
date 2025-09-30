import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Typography, Radio, Card, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../Utilities/authToken'

const { Title } = Typography

const BoxSizesPackagingMethod = () => {
	const [commonPackagingMethod, setCommonPackagingMethod] = useState(1)
	const [loading, setLoading] = useState(true)
	const dispatch = useDispatch()
	const { token, installedCarriers } = useSelector(state => state)

	// Get all enabled small carriers - memoized to prevent unnecessary recalculations
	const enabledSmallCarriers = useMemo(() => {
		console.log('🔍 Filtering carriers...')
		console.log('📦 All installedCarriers:', installedCarriers?.map(c => ({
			id: c.id,
			name: c.name,
			slug: c.slug,
			is_enabled: c.is_enabled,
			carrier_type: c.carrier_type
		})))

		const filtered = installedCarriers?.filter(carrier => {
			const isEnabled = carrier.is_enabled === 1
			// Small/Parcel carriers have carrier_type === 2
			const isSmallCarrier = carrier.carrier_type === 2

			console.log(`🔍 Checking carrier ${carrier.name} (${carrier.slug}):`, {
				is_enabled: carrier.is_enabled,
				carrier_type: carrier.carrier_type,
				isEnabled: isEnabled,
				isSmallCarrier: isSmallCarrier,
				qualifies: isEnabled && isSmallCarrier
			})

			return isEnabled && isSmallCarrier
		}) || []

		// Debug logging
		console.log('BoxSizesPackagingMethod Debug:')
		console.log('- installedCarriers count:', installedCarriers?.length)
		console.log('- enabledSmallCarriers count:', filtered.length)
		console.log('- enabledSmallCarriers:', filtered.map(c => ({
			id: c.id,
			name: c.name,
			slug: c.slug,
			carrier_type: c.carrier_type
		})))

		return filtered
	}, [installedCarriers])

	useEffect(() => {
		if (enabledSmallCarriers.length > 0) {
			loadPackagingSettings()
		} else {
			setLoading(false)
		}
	}, [enabledSmallCarriers.length, token])

	const loadPackagingSettings = async () => {
		try {
			setLoading(true)
			// Load settings from the first enabled small carrier to show current state
			if (enabledSmallCarriers.length > 0) {
				const firstCarrier = enabledSmallCarriers[0]
				const response = await axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_qoute_settings/${firstCarrier.id}`, {
					headers: { authorization: `Bearer ${token}` }
				})

				if (response.data && !response.data.error && response.data.data?.value) {
					const parsedData = JSON.parse(response.data.data.value)
					setCommonPackagingMethod(parsedData.packageRatingMethod || 1)
				} else {
					setCommonPackagingMethod(1)
				}
			}
		} catch (error) {
			console.error('Error loading packaging settings:', error)
			setCommonPackagingMethod(1)
		} finally {
			setLoading(false)
		}
	}

	const updatePackagingMethod = async (method) => {
		try {
			console.log('🔄 updatePackagingMethod called with method:', method)

			// Log ALL installed carriers to see what we're working with
			console.log('🔍 ALL INSTALLED CARRIERS:', installedCarriers?.map(c => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
				is_enabled: c.is_enabled,
				carrier_type: c.carrier_type
			})))

			console.log('📋 enabledSmallCarriers FULL DATA:', enabledSmallCarriers)
			console.log('📋 enabledSmallCarriers COUNT:', enabledSmallCarriers.length)
			console.log('📤 Will send to carriers:', enabledSmallCarriers.map(c => ({ id: c.id, name: c.name, slug: c.slug })))

			if (enabledSmallCarriers.length === 0) {
				console.error('❌ No enabled small carriers found!')
				return
			}

			// Update local state immediately for better UX
			setCommonPackagingMethod(method)

			// Update all enabled small carriers
			const updatePromises = enabledSmallCarriers.map(carrier => {
				console.log(`📡 Sending to carrier ${carrier.name} (ID: ${carrier.id})`)
				return axios.post(
					`${process.env.REACT_APP_ENITURE_API_URL}/submit_quote_settings`,
					{
						carrierId: carrier.id,
						packageRatingMethod: method
					},
					{
						headers: { authorization: `Bearer ${token}` }
					}
				)
			})

			console.log('🚀 Created', updatePromises.length, 'promises for carriers')
			const results = await Promise.all(updatePromises)
			console.log('✅ All requests completed:', results.map(r => r.data))

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage: 'Packaging method updated for all small carriers',
					showAlertMessage: true,
					alertMessageType: 'success',
				},
			})

			// Hide success message after 2 seconds
			setTimeout(() => {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: false,
					},
				})
			}, 2000)

		} catch (error) {
			console.error('Error updating packaging method:', error)
			// Revert local state on error
			loadPackagingSettings()

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage: 'Failed to update packaging method',
					showAlertMessage: true,
					alertMessageType: 'error',
				},
			})
		}
	}

	if (enabledSmallCarriers.length === 0) {
		console.log('⚠️  No enabled small carriers found - component will not render')
		console.log('Available carriers:', installedCarriers?.map(c => ({ name: c.name, slug: c.slug, enabled: c.is_enabled })))
		return (
			<Row gutter={24} justify="center" className="mb-3">
				<Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={22}>
					<Card>
						<Title level={4}>Packaging method when standard box sizes is disabled</Title>
						<p style={{ color: 'orange' }}>
							⚠️ No enabled small carriers detected. Enable at least one small carrier (UPS Small, FedEx Small, USPS Small, etc.) to use this feature.
						</p>
					</Card>
				</Col>
			</Row>
		)
	}

	if (loading) {
		return <Skeleton active />
	}

	return (
		<Row gutter={24} justify="center" className="mb-3">
			<Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={22}>
				<Card>
					<Title level={4}>Packaging method when standard box sizes is disabled</Title>
					<p style={{ marginBottom: '20px', color: '#666' }}>
						These settings apply to all small carriers when standard box sizes are disabled.
					</p>

					<Row gutter={24}>
						<Col xs={24} sm={24} md={24} lg={24} xl={24}>
							<div style={{ marginBottom: '16px' }}>
								<Radio
									checked={commonPackagingMethod === 1}
									onChange={() => updatePackagingMethod(1)}
								>
									Quote each item as shipping as its own package
								</Radio>
							</div>

							<div style={{ marginBottom: '16px' }}>
								<Radio
									checked={commonPackagingMethod === 3}
									onChange={() => updatePackagingMethod(3)}
								>
									Quote shipping as all items are in one package
								</Radio>
							</div>

							<div style={{ marginBottom: '16px' }}>
								<Radio
									checked={commonPackagingMethod === 2}
									onChange={() => updatePackagingMethod(2)}
								>
									Combine the weight of all items without dimensions and quote them as one package while quoting each item with dimensions as shipping as its own package
								</Radio>
							</div>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	)
}

export default BoxSizesPackagingMethod