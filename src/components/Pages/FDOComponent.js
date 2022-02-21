import React, { useCallback, useState } from 'react'
import { Row, Col, Typography, Space, Button, Form, Input } from 'antd'

const { Title } = Typography

const FDOComponent = () => {
	const [fdoConnected, setfdoConnected] = useState(false)
	const [fdoId, setFdoId] = useState('')

	const submitHandler = useCallback(() => {
		console.log(fdoId)
	}, [fdoId])

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
					<div className={'note-bx'}>
						<strong>Note!</strong> To establish a connection, you must
						have a FreightDesk Online account. If you don’t have one,
						click{' '}
						<a
							href='https://freightdesk.online/register?trial=true'
							target='_blank'
							rel='noreferrer'>
							here
						</a>{' '}
						to register
					</div>
				</Col>
			</Row>

			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={3}>
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
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={21}>
					<Form.Item className={'mb-3'} name='fdo_id'>
						<Input
							size='large'
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
					md={24}
					lg={24}
					xl={3}>
					<label className={'text-gray'}> </label>
				</Col>
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={21}>
					<Button onClick={submitHandler}>Connect</Button>
				</Col>
			</Row>
		</Space>
	)
}

export default FDOComponent
