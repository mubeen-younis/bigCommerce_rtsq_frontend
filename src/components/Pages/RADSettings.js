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
	Radio,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { submitRADSettings, getRADSettings } from '../../Actions/RAD'

const { Title } = Typography
const initialState = {
	always_quote_residential_delivery: false,
	return_rates: false,
	residential_delivery_auto_detect: false,
	unconfirmed_address_type: 1,
}

function ShippingGroupsComponent() {
	const [settings, setSettings] = useState(initialState)
	const dispatch = useDispatch()
	const { token, radSettings } = useSelector(state => state)

	useEffect(() => {
		if (!radSettings) {
			dispatch(getRADSettings(token))
		}

		if (radSettings) {
			const newSettings = JSON.parse(radSettings?.settings) ?? {}
			setSettings(prevSettings => ({
				...prevSettings,
				...newSettings,
			}))
		}
	}, [dispatch, radSettings, token])

	const handleStateChange = useCallback(e => {
		const { name, checked } = e.target

		setSettings(prevSettings => ({
			...prevSettings,
			[name]: checked,
		}))
	}, [])

	const onFinish = useCallback(() => {
		dispatch(
			submitRADSettings(
				{
					...radSettings,
					settings,
				},
				token
			)
		)
	}, [dispatch, radSettings, settings, token])

	if (!radSettings) return <Skeleton active />

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
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name='always_quote_residential_delivery'
									checked={
										settings.always_quote_residential_delivery
									}
									onChange={e => handleStateChange(e)}>
									Always quote residential delivery
								</Checkbox>
							</Form.Item>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item className='mb-0'>
								<Checkbox
									name='return_rates'
									checked={settings.return_rates}
									onChange={e => handleStateChange(e)}>
									Do not return rate if the shipping address
									appears to be a post office box
								</Checkbox>
							</Form.Item>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name='residential_delivery_auto_detect'
									checked={
										settings.residential_delivery_auto_detect
									}
									onChange={e => handleStateChange(e)}>
									Auto-detect residential addresses{' '}
								</Checkbox>
							</Form.Item>
						</Col>

						{settings.residential_delivery_auto_detect && (
							<>
								<Col
									className='gutter-row mt-1'
									xs={12}
									sm={12}
									md={12}
									lg={12}
									xl={6}>
									<label
										className='text-gray ml-5'
										style={{
											marginLeft: '1.5em',
										}}>
										Default unconfirmed address types to:
									</label>
								</Col>

								<Radio.Group
									className='mt-1'
									onChange={e =>
										setSettings(prevSettings => ({
											...prevSettings,
											unconfirmed_address_type:
												+e.target.value,
										}))
									}
									value={settings.unconfirmed_address_type}>
									<Space direction='vertical'>
										<Radio value={1}>Residential</Radio>
										<Radio value={2}>Commercial</Radio>
									</Space>
								</Radio.Group>
							</>
						)}

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item
								style={{ textAlign: 'right', marginBottom: '0' }}>
								<Space>
									<Button
										onClick={onFinish}
										type='primary'
										size='medium'
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
