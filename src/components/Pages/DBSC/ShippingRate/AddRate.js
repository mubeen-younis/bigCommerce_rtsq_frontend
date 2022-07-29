import React, { useCallback, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Radio, Space } from 'antd'
import RatesList from './RatesList'

const { Option } = Select
const { TextArea } = Input

const AddRate = ({ visible, toggleAddProfileModal }) => {
	const [shippingClass, setShippingClass] = useState(false)
	const [form] = Form.useForm()

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', form.getFieldsValue())
	}, [])

	return (
		<Space direction='horizontal' size='large' className='w-100'>
			<Row gutter={30}>
				<Modal
					title='Add rate'
					visible={false}
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
								className='gutter-row mb-2'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className='mb-0'
									label='Display as'
									rules={[
										{
											required: false,
											message: 'Display as',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
								<div className='text-gray'>
									Customers will see this at checkout
								</div>
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
									label='Distance display preferences:'
									rules={[
										{
											required: false,
											message: 'Distance display preferences:',
										},
									]}>
									<Radio.Group
										onChange={() => {}}
										// value={value}
									>
										<Space direction='vertical'>
											<Radio value={1}>
												Don't display a description with the
												Display As label.
											</Radio>
											<Radio value={2}>
												Display the distance between the
												ship-from and ship-to address.
											</Radio>
											<Radio value={3}>
												Display the custom description
												entered in the field below.
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
									label='Description'
									rules={[
										{
											required: false,
											message: 'City',
										},
									]}>
									<TextArea className='mb-1' rows={2} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={8}
								sm={8}
								md={8}
								lg={8}
								xl={8}>
								<Form.Item
									className='mb-0'
									label='Rate'
									rules={[
										{
											required: false,
											message: 'Rate',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={8}
								sm={8}
								md={8}
								lg={8}
								xl={8}>
								<Form.Item
									className='mb-0'
									label='Distance unit'
									rules={[
										{
											required: false,
											message: 'Distance unit',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={8}
								sm={8}
								md={8}
								lg={8}
								xl={8}>
								<Form.Item
									className='mb-0'
									label='Distance measured by'
									rules={[
										{
											required: false,
											message: 'Distance measured by',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Minimum distance'
									rules={[
										{
											required: false,
											message: 'Minimum distance',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Maximum distance'
									rules={[
										{
											required: false,
											message: 'Maximum distance',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Minimum weight'
									rules={[
										{
											required: false,
											message: 'Minimum weight',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Maximum weight'
									rules={[
										{
											required: false,
											message: 'Maximum weight',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Minimum length'
									rules={[
										{
											required: false,
											message: 'Minimum length',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Maximum length'
									rules={[
										{
											required: false,
											message: 'Maximum length',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Distance adjustment'
									rules={[
										{
											required: false,
											message: 'Distance adjustment',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Rate adjustment'
									rules={[
										{
											required: false,
											message: 'Rate adjustment',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30} className='mb-2'>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Minimum shipping quote'
									rules={[
										{
											required: false,
											message: 'Minimum shipping quote',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Maximum shipping quote'
									rules={[
										{
											required: false,
											message: 'Maximum shipping quote',
										},
									]}>
									<Input
										name='display_as'
										// value={locationDetail.nickname}
										// onChange={changeValue}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col
								className='gutter-row mb-2'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className='mb-0'
									rules={[
										{
											required: false,
											message: 'Display as',
										},
									]}>
									<Radio.Group
										onChange={() => {}}
										// value={value}
									>
										<Space direction='vertical'>
											<Radio value={1}>
												The calculated shipping rate is for
												the contents of the Cart
											</Radio>
											<Radio value={2}>
												Multiply the calculated shipping rate
												by the number of items in the Cart
											</Radio>
											<Radio value={3}>
												Just show flat rate, do not calculate
												rates based on distance
											</Radio>
										</Space>
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</Row>

			{/* Rates List */}
			<RatesList />
		</Space>
	)
}

export default AddRate
