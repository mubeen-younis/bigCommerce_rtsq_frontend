import React, { useCallback, useEffect, useState } from 'react'
import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Radio,
	Space,
	Card,
} from 'antd'
import AddZone from '../ShippingZone/AddZone'
import Title from 'antd/lib/typography/Title'

const { Option } = Select

const AddOrigin = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues, setInitialValues] = useState({
		nickname: '',
		street_address: '',
		city: '',
		state: '',
		postal_code: '',
		country_code: '',
		shipping_origin: '',
		shipping_origin_type: '',
	})

	useEffect(() => {}, [])

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', form.getFieldsValue())
	}, [])

	return (
		<Card>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={4}>Shipping from</Title>
				</Col>
				<Col
					className='gutter-row'
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={12}
					style={{ textAlign: 'right' }}>
					<Button type='link' onClick={() => setIsOpen(true)}>
						Add shipping origin
					</Button>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<p className='mb-0'>trx</p>
					<p>8865 White Ibis Way , Navarre FL 32566 ,United States</p>
				</Col>
			</Row>

			<Row gutter={30}>
				<Modal
					title='Add shipping origin'
					visible={isOpen}
					onCancel={() => setIsOpen(false)}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					okText='Save'
					footer={[
						<Button key='back' onClick={() => setIsOpen(false)}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
							// loading={loading}
							onClick={() => form.submit()}>
							Save
						</Button>,
					]}>
					<Form
						layout='vertical'
						name='add_warehouse_info'
						className='form-wrp'
						size='large'
						form={form}
						initialValues={initialValues}
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
									className='mb-2'
									label='Nickname'
									name='nickname'
									rules={[
										{
											required: false,
											message: 'Nickname',
										},
									]}>
									<Input
										name='nickname'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='Street address'
									name='street_address'
									rules={[
										{
											required: false,
											message: 'Street address',
										},
									]}>
									<Input
										name='Street_address'
										placeholder='6180 Buffington Road'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='City'
									name='city'
									rules={[
										{
											required: false,
											message: 'City',
										},
									]}>
									<Input
										name='city'
										placeholder='Atlanta'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='State or Province'
									name='state'
									rules={[
										{
											required: false,
											message: 'State or Province',
										},
									]}>
									<Input
										name='state'
										placeholder='GA'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='Postal Code'
									name='postal_code'
									rules={[
										{
											required: false,
											message: 'Postal Code',
										},
									]}>
									<Input
										name='postal_code'
										placeholder='30349'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='Country code'
									name='country_code'
									rules={[
										{
											required: false,
											message: 'Country code',
										},
									]}>
									<Input
										name='country_code'
										placeholder='US'
										// value={locationDetail.nickname}
										// onChange={changeValue}
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
									className='mb-2'
									label='Add the shipping origin'
									name='shipping_origin'
									rules={[
										{
											required: false,
											message: 'Add the shipping origin',
										},
									]}>
									<Radio.Group onChange={() => {}} value={1}>
										<Space direction='vertical'>
											<Radio value={1}>
												To this Shipping From profile
											</Radio>
											<Radio value={2}>
												As a new Shipping From profile
											</Radio>
										</Space>
									</Radio.Group>
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
									className='mb-2'
									label='Availability in other plugins by Eniture Technology'
									name='shipping_origin_type'
									rules={[
										{
											required: false,
											message:
												'Availability in other plugins by Eniture Technology',
										},
									]}>
									<Select>
										<Option>Not available</Option>
										<Option>Available as a warehouse</Option>
										<Option>Available as a dropship</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</Row>

			{/* Add Shipping Zone */}
			<AddZone />
		</Card>
	)
}

export default AddOrigin
