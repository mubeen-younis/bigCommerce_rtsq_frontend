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
				<Row gutter={30} className={'mb-3'}>
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
						className='gutter-row mb-3'
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
