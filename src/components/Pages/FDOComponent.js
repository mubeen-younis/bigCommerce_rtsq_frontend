import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Row,
	Col,
	Typography,
	Space,
	Button,
	Form,
	Input,
	Skeleton,
	Modal,
} from 'antd'
import axios from 'axios'

const { Title } = Typography

const FDOComponent = () => {
	const [fdoConnected, setfdoConnected] = useState(false)
	const [fdoId, setFdoId] = useState('')
	const [, setFdoData] = useState({})
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const dispatch = useDispatch()
	const { token } = useSelector(state => state)

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
					`${process.env.REACT_APP_ENITURE_API_URL}/get_fdo_info`,
					config
				)

				if (!data.error) {
					setFdoData(data?.data)

					if (data?.data?.freightdesk_company_id?.length) {
						setFdoId(data.data.freightdesk_company_id)
						setfdoConnected(true)
					} else {
						setFdoId('')
						setfdoConnected(false)
					}
				}
				setLoading(false)
			} catch (err) {
				setFdoData({})
				setFdoId('')
				setfdoConnected(false)
				setLoading(false)
			}
		}

		fetchStore()
	}, [token])

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

				const url = `${process.env.REACT_APP_ENITURE_API_URL}/update_fdo_connection`
				const config = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
				const { data } = await axios.post(
					url,
					{ freightdesk_company_id: id },
					config
				)

				if (!data.error) {
					setFdoData(data?.data ?? {})

					if (id && id.length) {
						setFdoId(id)
						setfdoConnected(true)
					} else {
						setFdoId('')
						setfdoConnected(false)
					}
					setVisible(false)
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
					<Title level={4}>Connect to FreightDesk Online</Title>
					<p>
						FreightDesk Online{' '}
						<a
							href='https://freightdesk.online/'
							target='_blank'
							rel='noreferrer'>
							(freightdesk.online)
						</a>{' '}
						is a cloud-based, multi-carrier shipping platform that allows
						its users to create and manage postal, parcel, and LTL
						freight shipments. Connect your store to FreightDesk Online
						and virtually eliminate the need for data entry when shipping
						orders.{' '}
						<a
							href='https://freightdesk.online/'
							target='_blank'
							rel='noreferrer'>
							(Learn more)
						</a>
					</p>

					{!fdoConnected && (
						<div className={'note-bx'}>
							<strong>Note!</strong> To establish a connection, you
							must have a FreightDesk Online account. If you don’t have
							one, click{' '}
							<a
								href='https://freightdesk.online/register?trial=true'
								target='_blank'
								rel='noreferrer'>
								here
							</a>{' '}
							to register
						</div>
					)}
				</Col>
			</Row>

			{fdoConnected ? (
				<Row gutter={30} align='middle'>
					<Col className='gutter-row' span={24}>
						<p style={pStyles}>
							Connected to FreightDesk Online using FreightDesk Online
							Account ID {fdoId}{' '}
							<a
								href='https://support.eniture.com/what-is-my-freightdesk-online-id'
								target='_blank'
								rel='noreferrer'>
								[ ? ]
							</a>
						</p>
						<Button
							danger={fdoConnected}
							style={{ margin: '20px auto', display: 'block' }}
							onClick={() => setVisible(true)}>
							Disconnect
						</Button>
					</Col>
				</Row>
			) : (
				<Row gutter={30} className={'mb-0'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={4}
						lg={4}
						xl={4}>
						<label className={'text-gray'}>
							FreightDesk Online ID{' '}
							<a
								href='https://support.eniture.com/what-is-my-freightdesk-online-id'
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
						md={20}
						lg={20}
						xl={20}>
						<Form.Item className={'mb-3'} name='fdo_id'>
							<Input
								size='large'
								required
								value={fdoId}
								onChange={e => setFdoId(e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={4}
						lg={4}
						xl={4}>
						<label className={'text-gray'}> </label>
					</Col>
					<Col
						className='gutter-row mb-2'
						xs={24}
						sm={24}
						md={20}
						lg={20}
						xl={20}>
						<Button
							onClick={() => submitHandler(fdoId)}
							disabled={!fdoId.length}>
							Connect
						</Button>
					</Col>
				</Row>
			)}
			<hr style={{ borderColor: 'light-gray' }} />
			<Row gutter={30}>
				<Col className='gutter-row' span={24}>
					<Title level={4}>How to connect your BigCommerce store to FreightDesk Online</Title>
					<p>
						First, if you don’t already have one, register for a FreightDesk Online account{' '}
						<a
							href='https://freightdesk.online/register'
							target='_blank'
							rel='noreferrer'>
							(https://freightdesk.online/register)
						</a>.{' '} 
						You can connect multiple online stores to FreightDesk Online, so you don’t
						have to create separate accounts for each one.
						<br/><br/>
						The pricing for FreightDesk Online is á la carte. You’ll be able to pick a separate plan for parcel (and postal) shipments,
						and for LTL freight shipments based on the anticipated volume for each type of shipping. 
						Your monthly subscription rate will be comprised of these two selections. 
						You can begin a 30-day trial of both types of shipping by selecting <b>Trial</b> in the corresponding dropdown fields on the registration form.
						<br/><br/>
						After you complete the registration process, log into 
						{' '}
						<a
							href='https://freightdesk.online/login'
							target='_blank'
							rel='noreferrer'>
							FreightDesk Online
						</a>.{' '} 
						Click on your avatar located in the top right-hand corner of the browser window. 
						Copy your FreightDesk Online ID which will be located below your company name.
						<br/><br/>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      						<img src={"images/freightdesk-online-id.jpg"} alt="freightdesk-online-id" />
    					</div>
						<br/><br/>
						Return to the BigCommerce ADMIN area. Click <b>Apps</b> and then <b>Real-time Shipping Quotes by Eniture Technology</b>. 
						In the app’s navigation menu, select <b>FreightDesk Online</b>. 
						Enter your FreightDesk Online ID and then click the <b>Connect</b> button.
						<br/><br/>
						Now that you’ve connected FreightDesk Online, unfulfilled orders will automatically appear in FreightDesk Online. 
						To view them, log into FreightDesk Online and click on <b>Orders</b> in the navigation menu. 
						You’ll need to connect your shipping providers before you can start shipping. 
						You can find a quick start guide in FreightDesk Online by navigating to <b>Help {'>'} Getting Started</b>.
					</p>
				</Col>
			</Row>

			<Modal
				title='Disconnect Account'
				visible={visible}
				onOk={() => submitHandler('')}
				onCancel={() => setVisible(false)}
				okText='Disconnect'>
				<p>Are you sure that you want to disconnect account?</p>
			</Modal>
		</Space>
	)
}

const pStyles = {
	width: 'fit-content',
	margin: 'auto',
	textAlign: 'center',
	border: '2px solid skyblue',
	padding: '.5rem',
}

export default FDOComponent
