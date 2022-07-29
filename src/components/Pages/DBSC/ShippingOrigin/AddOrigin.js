import React, { useCallback, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Radio, Space } from 'antd'
import AddZone from '../ShippingZone/AddZone'

const { Option } = Select

const AddOrigin = ({ visible, toggleAddProfileModal }) => {
	const [shippingClass, setShippingClass] = useState(false)
	const [form] = Form.useForm()

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', form.getFieldsValue())
	}, [])

	return (
		<>
			<Row gutter={30}>
				<Modal
					title='Add shipping origin'
					visible={visible}
					onCancel={() => toggleAddProfileModal(false)}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					okText='Save'
					footer={[
						<Button
							key='back'
							onClick={() => toggleAddProfileModal(false)}>
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
						// initialValues={{}}
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
			<Row gutter={30}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<AddZone />
				</Col>
			</Row>
		</>
	)
}

export default AddOrigin
