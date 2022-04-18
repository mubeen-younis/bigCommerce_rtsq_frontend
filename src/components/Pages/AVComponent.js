import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Typography, Space, Skeleton, Button } from 'antd'
import axios from 'axios'

const { Title } = Typography

const FDOComponent = () => {
	const [fdoConnected, setfdoConnected] = useState(false)
	const [fdoData, setFdoData] = useState({})
	const [loading, setLoading] = useState(false)
	const { token } = useSelector(state => state)
	const dispatch = useDispatch()

	useEffect(() => {
		const fetchStore = async () => {
			const config = {
				headers: {
					authorization: `Bearer ${token}`,
				},
			}
			setLoading(true)
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_ENITURE_API_URL}/get_av_info`,
					config
				)

				if (!data.error) {
					setFdoData(data?.data)

					if (data?.data?.freightdesk_company_id?.length) {
						setfdoConnected(true)
					} else {
						setfdoConnected(false)
					}
				}
				setLoading(false)
			} catch (err) {
				setFdoData({})
				setfdoConnected(false)
				setLoading(false)
			}
		}

		fetchStore()
	}, [token])

	const applyPromoCode = useCallback(async () => {
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
		try {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessageType: 'loading',
				},
			})

			const url = `${process.env.REACT_APP_ENITURE_API_URL}/apply_promo_code?type=av`
			const { data } = await axios.post(url, {}, config)
			if (!data.error) setFdoData(data?.data)

			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					alertMessage: data.message,
					showAlertMessage: data.error,
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
	}, [dispatch, token])

	if (loading) return <Skeleton active />

	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Row gutter={30}>
				<Col className='gutter-row' span={24}>
					<Title level={4}>Connect to Validate Addresses</Title>
					<p>
						Validate Addresses{' '}
						<a
							href='https://validate-addresses.com/'
							target='_blank'
							rel='noreferrer'>
							(validate-addresses.com)
						</a>{' '}
						is a cloud-based platform that verifies an order’s address
						details after the order is placed. It is also the most
						economical way. You won’t be paying to validate an address
						every time someone enters the checkout process and then
						abandons the cart. Connect your store to Validate Address and
						virtually eliminate to avoid spending your time validating
						addresses.{' '}
						<a
							href='https://validate-addresses.com/'
							target='_blank'
							rel='noreferrer'>
							(Learn more)
						</a>
					</p>

					{+fdoData?.used < 1 && (
						<>
							<div
								className={'note-bx'}
								dangerouslySetInnerHTML={{
									__html: fdoData?.message,
								}}
							/>
							{+fdoData?.is_already_user === 1 && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Button onClick={applyPromoCode} type='primary'>
										Apply Promo Code
									</Button>
								</div>
							)}
						</>
					)}
				</Col>
			</Row>

			{fdoConnected && +fdoData?.used >= 1 && (
				<Row gutter={30} align='middle'>
					<Col className='gutter-row' span={24}>
						{fdoData?.coupon_code?.length && +fdoData?.used >= 1 && (
							<>
								<p
									style={{ textAlign: 'center' }}
									dangerouslySetInnerHTML={{
										__html: fdoData?.message,
									}}
								/>
							</>
						)}
					</Col>
				</Row>
			)}
		</Space>
	)
}

export default FDOComponent
