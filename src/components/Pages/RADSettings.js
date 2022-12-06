import React, { Fragment, useState, useCallback, useEffect } from 'react'
import {
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Skeleton,
	Checkbox,
	Card,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getShippingGroups } from '../../Actions/ShippingGroupsActions'
import { submitRADSettings } from '../../Actions/RAD'

const { Title } = Typography
const initialState = {
	alwaysResidentialDelivery: false,
	autoDetectedResidentialAddresses: false,
	retunRates: false,
	unconfirmedAddressType: false,
}

function ShippingGroupsComponent() {
	const [settings, setSettings] = useState(initialState)
	const dispatch = useDispatch()
	const { shippingGroups, token } = useSelector(state => state)

	useEffect(() => {
		if (!shippingGroups) {
			dispatch(getShippingGroups(token))
		}
	}, [dispatch, shippingGroups, token])

	const handleStateChange = useCallback(e => {
		const { name, checked } = e.target

		setSettings(prevSettings => ({
			...prevSettings,
			[name]: checked,
		}))
	}, [])

	const onFinish = useCallback(() => {
		dispatch(submitRADSettings(settings, token))
	}, [dispatch, settings, token])

	if (!shippingGroups) return <Skeleton active />

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Address Type Settings</Title>
					</Col>
				</Row>

				<Card>
					<Row gutter={30}>
						<Col
							className='gutter-row'
							xs={24}
							sm={12}
							md={12}
							lg={12}
							xl={18}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name='alwaysResidentialDelivery'
									checked={settings.alwaysResidentialDelivery}
									onChange={e => handleStateChange(e)}>
									Always quote residential delivery
								</Checkbox>
							</Form.Item>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={12}
							md={12}
							lg={12}
							xl={18}>
							<Form.Item className='mb-0'>
								<Checkbox
									name='retunRates'
									checked={settings.retunRates}
									onChange={e => handleStateChange(e)}>
									Do not return rate if the shipping address
									appears to be a post office box
								</Checkbox>
							</Form.Item>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={12}
							md={12}
							lg={12}
							xl={18}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name='autoDetectedResidentialAddresses'
									checked={
										settings.autoDetectedResidentialAddresses
									}
									onChange={e => handleStateChange(e)}>
									Auto-detect residential addresses{' '}
								</Checkbox>
							</Form.Item>
						</Col>

						<Col
							className='gutter-row mt-1'
							xs={24}
							sm={12}
							md={12}
							lg={12}
							xl={18}>
							<label
								className='text-gray ml-5'
								style={{
									marginLeft: '1.5em',
								}}>
								Default unconfirmed address types to:
							</label>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={18}>
							<Form.Item
								style={{ textAlign: 'right', marginBottom: '0' }}>
								<Space>
									<Button
										onClick={onFinish}
										type='primary'
										size={'medium'}
										htmlType='submit'>
										Save
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Space>
		</Fragment>
	)
}

export default ShippingGroupsComponent
