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

	useEffect(() => {}, [])

	if (loading) return <Skeleton active />

	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Row gutter={30}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>
						Shipping Profiles{' '}
						<Button
							type='primary'
							onClick={() => {
								setVisible(true)
							}}>
							Add
						</Button>
					</Title>
				</Col>
			</Row>

			<Modal
				title='Add shipping profile'
				visible={visible}
				onOk={() => {}}
				onCancel={() => setVisible(false)}
				okText='Save'>
				<Form
					layout='vertical'
					name='add_warehouse_info'
					className='form-wrp'
					size={'large'}
					form={form}
					initialValues={locationDetail}
					onFinish={onFinish}>
					<Row gutter={30}>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item
								className={'mb-2'}
								label='Nickname'
								rules={[
									{
										required: false,
										message: 'Nickname',
									},
								]}>
								<Input
									name='nickname'
									placeholder='Nickname'
									value={locationDetail.nickname}
									onChange={changeValue}
								/>
							</Form.Item>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Form.Item
								className={'mb-2'}
								label='Street Address'

								//rules={[{ required: true, message: 'Street Address' }]}
							>
								<Input
									placeholder='320 W. Lanier Ave, Ste 200'
									name='address'
									value={locationDetail.address}
									onChange={e => {
										changeValue(e)
									}}
									onKeyDown={e => handleKeyAddress(e, 6, 2)}
								/>
							</Form.Item>
						</Col>



					<Row gutter={30} align='middle'>
						<Col
							className='gutter-row'
							xs={24}
							sm={8}
							md={8}
							lg={8}
							xl={8}>
							<label className={'text-gray'}>
								Enable in-store pick up
							</label>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={16}
							md={16}
							lg={16}
							xl={16}>
							<Form.Item name='enable_instore' className={'mb-0'}>
								<Checkbox
									name='enable_instore'
									checked={locationDetail.enable_instore}
									onChange={e =>
										setLocationDetail({
											...locationDetail,
											enable_instore:
												!locationDetail.enable_instore,
										})
									}
									//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
								></Checkbox>
								{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
												<a href='#!' className='stnd-plan text-danger'>
													Advance plan required
												</a>
											)*/}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={8}
							md={8}
							lg={8}
							xl={8}>
							<label className={'text-gray'}>
								Offer if address is within (miles):
							</label>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={16}
							md={16}
							lg={16}
							xl={16}>
							<Form.Item
								className={'mb-0'}
								rules={[
									{
										required: false,
										message: 'Email Required',
									},
								]}>
								<Input
									name='instore_miles'
									value={locationDetail.instore_miles}
									onChange={changeValue}
									maxLength='6'
									onKeyDown={e =>
										handleKeyDownDecimalNumber(e, 6, 2)
									}
									step='0.01'
									type='number'
									min='0'
									pattern='[0-9.?(0-9){2}?]+%?$'
									//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={8}
							md={8}
							lg={8}
							xl={8}>
							<label className={'text-gray'}>
								Offer if postal code matches:
							</label>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={16}
							md={16}
							lg={16}
							xl={16}>
							<Form.Item
								className={'mb-0'}
								rules={[
									{
										required: false,
										message: 'Postal Code Required',
									},
								]}>
								<Select
									name='instore_zipcodes'
									value={locationDetail.instore_zipcodes}
									mode='tags'
									style={{ width: '100%' }}
									onChange={tags =>
										handleChange('instore_zipcodes', tags)
									}
									tokenSeparators={[',']}
									//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
									onInputKeyDown={key => {
										if (
											key.code !== 'Backspace' &&
											key.code !== 'ArrowLeft' &&
											key.code !== 'ArrowRight' &&
											(key.code === 'Space' ||
												key.target.value.length > 6)
										) {
											key.preventDefault()
											return
										}
									}}
									maxTagTextLength='7'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={8}
							md={8}
							lg={8}
							xl={8}>
							<label className={'text-gray'}>
								Checkout description:
							</label>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={16}
							md={16}
							lg={16}
							xl={16}>
							<Form.Item
								className={'mb-0'}
								rules={[
									{
										required: false,
										message: 'Checkout Description Required',
									},
								]}>
								<Input
									name='instock_description'
									value={locationDetail.instock_description}
									placeholder='In-store pick up'
									onChange={e =>
										e.target.value.length < 21 && changeValue(e)
									}
									//disabled={plansInfo && plansInfo.plan_type > 2 ? false : true}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={8}
							md={8}
							lg={8}
							xl={8}>
							<label className={'text-gray'}>Phone number:</label>
						</Col>
						<Col
							className='gutter-row'
							xs={24}
							sm={16}
							md={16}
							lg={16}
							xl={16}>
							<Form.Item className={'mb-0'}>
								<Input
									placeholder='404-369-0680'
									name='phone'
									value={locationDetail.phone}
									onChange={e =>
										e.target.value.length < 17 && changeValue(e)
									}
									onKeyDown={e => handleKeyPhoneNumber(e)}
									maxLength='20'
								/>
							</Form.Item>
						</Col>
					</Row>

					{locationDetail.location_type === 1 && (
						<Row gutter={30} align='middle' className={'mb-2'}>
							<Col
								className='gutter-row'
								xs={24}
								sm={8}
								md={8}
								lg={8}
								xl={8}>
								<label className={'text-gray'}>
									Origin for shipping rates:
								</label>
							</Col>
							<Col
								className='gutter-row'
								xs={24}
								sm={16}
								md={16}
								lg={16}
								xl={16}>
								<Form.Item className={'mb-0'}>
									<Select
										name='default_location_id'
										defaultValue='default'
										value={locationDetail.default_location_id}
										onChange={opt =>
											setLocationDetail({
												...locationDetail,
												default_location_id: opt,
											})
										}
										options={listLocations()}
									/>
								</Form.Item>
							</Col>
						</Row>
					)}


				</Form>
			</Modal>
		</Space>
	)
}

export default FDOComponent
