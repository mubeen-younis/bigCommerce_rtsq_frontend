import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Row,
	Col,
	Typography,
	Space,
	Skeleton,
	Button,
	Form,
	Input,
	Modal,
} from 'antd'
import axios from 'axios'

const { Title } = Typography

const FDOComponent = () => {
	const [avData, setAVData] = useState({})
	const [loading, setLoading] = useState(false)
	const [avId, setAVId] = useState('')
	const [visible, setVisible] = useState(false)

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
				if (!data.error) setAVData(data?.data)

				setLoading(false)
			} catch (err) {
				setAVData({})
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
			if (!data.error) setAVData(data?.data ?? {})

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

	const submitHandler = useCallback(
		async (id = '') => {
			try {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: true,
						alertMessageType: 'loading',
					},
				})

				const url = `${process.env.REACT_APP_ENITURE_API_URL}/update_va_connection`
				const config = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
				const { data } = await axios.post(url, { av_company_id: id }, config)

				if (!data.error) {
					setAVData(data?.data ?? {})
					setVisible(false)(id && id?.length > 0)
						? setAVId(id)
						: setAVId('')
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
		},
		[dispatch, token]
	)

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

					{/* Message display */}
					{avData?.message && (
						<p
							className='note-bx'
							dangerouslySetInnerHTML={{
								__html: avData?.message,
							}}
						/>
					)}

					{/* Promo Code section */}
					{+avData?.used < 1 && (
						<>
							{+avData?.is_already_user === 1 && (
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

			{/* Company Id check */}
			{avData?.av_company_id?.length > 0 ? (
				<Row gutter={30} align='middle'>
					<Col className='gutter-row' span={24}>
						<Button
							danger={avData?.av_company_id?.length > 0}
							style={{ margin: '20px auto', display: 'block' }}
							onClick={() => setVisible(true)}>
							Disconnect
						</Button>
					</Col>
				</Row>
			) : (
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={7}
						lg={4}
						xl={3}>
						<label className={'text-gray'}>
							Validate Addresses ID{' '}
							<a
								href='https://validate-addresses.com/'
								target='_blank'
								rel='noreferrer'>
								[ ? ]
							</a>{' '}
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={17}
						lg={20}
						xl={21}>
						<Form.Item className={'mb-3'} name='fdo_id'>
							<Input
								size='large'
								required
								value={avId}
								onChange={e => setAVId(e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={7}
						lg={4}
						xl={3}>
						<label className={'text-gray'}> </label>
					</Col>
					<Col
						className='gutter-row mb-3'
						xs={24}
						sm={24}
						md={17}
						lg={20}
						xl={21}>
						<Button
							onClick={() => submitHandler(avId)}
							disabled={!avId.length}>
							Connect
						</Button>
					</Col>
				</Row>
			)}

			<Modal
				title='Disconnect account'
				visible={visible}
				onOk={() => submitHandler('')}
				onCancel={() => setVisible(false)}
				okText='Disconnect'>
				<p>Are you sure that you want to disconnect account?</p>
			</Modal>
		</Space>
	)
}

export default FDOComponent
