import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Typography, Space, Skeleton } from 'antd'
import axios from 'axios'

const { Title } = Typography

const FDOComponent = () => {
	const [fdoConnected, setfdoConnected] = useState(false)
	const [fdoData, setFdoData] = useState({})
	const [loading, setLoading] = useState(false)
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
					{+fdoData?.used < 1 && (
						<div
							className={'note-bx'}
							dangerouslySetInnerHTML={{ __html: fdoData?.message }}
						/>
					)}
				</Col>
			</Row>

			<Row gutter={30}>
				<Col className='gutter-row' span={24}>
					<p>
						FreightDesk Online shipment processing applies for the
						following shipping providers for 1-year:
					</p>
					<ul>
						<li>GlobalTranz (LTL)</li>
						<li>Unishippers (parcel and LTL)</li>
						<li>Worldwide Express (parcel and LTL)</li>
					</ul>
				</Col>
				<Col className='gutter-row' span={24}>
					<p>
						<i>
							This offer only applies to charges that otherwise would
							be billed by Eniture Technology for the use of
							FreightDesk Online. Charges invoiced by the shipping
							providers listed above (or by any other shipping
							provider) are not included in this offer. A paid
							subscription to FreightDesk Online is still be required
							to process shipments for shipping providers not listed
							above.
						</i>
					</p>
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
