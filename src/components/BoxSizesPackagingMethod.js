import React, { useState, useEffect } from 'react'
import { Row, Col, Typography, Radio, Card, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../Utilities/authToken'

const { Title } = Typography

const BoxSizesPackagingMethod = () => {
	const [commonPackagingMethod, setCommonPackagingMethod] = useState(1)
	const [loading, setLoading] = useState(true)
	const dispatch = useDispatch()
	const { token, installedCarriers } = useSelector(state => state)

	// Get all enabled small carriers
	const enabledSmallCarriers = installedCarriers?.filter(carrier =>
		carrier.is_enabled &&
		(carrier.slug?.includes('small') ||
		 carrier.slug === 'fedex-small' ||
		 carrier.slug === 'ups-small' ||
		 carrier.slug === 'usps-small')
	) || []

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
			// Update local state immediately for better UX
			setCommonPackagingMethod(method)

			// Update all enabled small carriers
			const updatePromises = enabledSmallCarriers.map(carrier =>
				axios.post(
					`${process.env.REACT_APP_ENITURE_API_URL}/submit_quote_settings`,
					{
						carrierId: carrier.id,
						packageRatingMethod: method
					},
					{
						headers: { authorization: `Bearer ${token}` }
					}
				)
			)

			await Promise.all(updatePromises)

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
		return null // Don't show if no small carriers are enabled
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