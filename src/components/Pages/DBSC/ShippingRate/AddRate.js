import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Radio, Space } from 'antd'
import RatesList from './RatesList'
import { useDispatch, useSelector } from 'react-redux'

const { Option } = Select
const { TextArea } = Input

const AddRate = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues, setInitialValues] = useState({
		display_as: '',
		distance_preference: 1,
		description: '',
		rate: '',
		distance_unit: 'mile',
		distance_measurement: 'route',
		minimum_distance: '',
		maximum_distance: '',
		minimum_weight: '',
		maximum_weight: '',
		minimum_length: '',
		maximum_length: '',
		distance_adjustment: '',
		rate_adjustment: '',
		minimum_shipping_quote: '',
		maximum_shipping_quote: '',
		rate_calculation_method: 1,
	})

	const dispatch = useDispatch()
	const { shippingZones } = useSelector(state => state)

	useEffect(() => {}, [])

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', form.getFieldsValue())
	}, [])

	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Row gutter={30}>
				<Modal
					title='Add rate'
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
								className='gutter-row mb-2'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className='mb-0'
									label='Display as'
									name='display_as'
									rules={[
										{
											required: false,
											message: 'Display as',
										},
									]}>
									<Input

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
									name='distance_preference'
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
									name='description'
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
									name='rate'
									rules={[
										{
											required: false,
											message: 'Rate',
										},
									]}>
									<Input

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
									name='distance_unit'
									rules={[
										{
											required: false,
											message: 'Distance unit',
										},
									]}>
									<Select>
										<Option value='mile'>Mile</Option>
										<Option value='kilometer'>Kilometer</Option>
									</Select>
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
									name='distance_measurement'
									rules={[
										{
											required: false,
											message: 'Distance measured by',
										},
									]}>
									<Select>
										<Option value='route'>Route</Option>
										<Option value='straight_line'>
											Staright Line
										</Option>
									</Select>
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
									name='minimum_distance'
									rules={[
										{
											required: false,
											message: 'Minimum distance',
										},
									]}>
									<Input

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
									name='maximum_distance'
									rules={[
										{
											required: false,
											message: 'Maximum distance',
										},
									]}>
									<Input

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
									name='minimum_weight'
									rules={[
										{
											required: false,
											message: 'Minimum weight',
										},
									]}>
									<Input

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
									name='maximum_weight'
									rules={[
										{
											required: false,
											message: 'Maximum weight',
										},
									]}>
									<Input

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
								xl={12}
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
								}}>
								<Radio>And</Radio>
							</Col>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Radio>Or</Radio>
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
									name='minimum_length'
									rules={[
										{
											required: false,
											message: 'Minimum length',
										},
									]}>
									<Input

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
									name='maximum_length'
									rules={[
										{
											required: false,
											message: 'Maximum length',
										},
									]}>
									<Input

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
									name='distance_adjustment'
									rules={[
										{
											required: false,
											message: 'Distance adjustment',
										},
									]}>
									<Input

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
									name='rate_adjustment'
									rules={[
										{
											required: false,
											message: 'Rate adjustment',
										},
									]}>
									<Input

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
									name='minimum_shipping_quote'
									rules={[
										{
											required: false,
											message: 'Minimum shipping quote',
										},
									]}>
									<Input
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
									name='maximum_shipping_quote'
									rules={[
										{
											required: false,
											message: 'Maximum shipping quote',
										},
									]}>
									<Input
										name='maximum_shipping_quote'
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
									name='rate_calculation_method'
									rules={[
										{
											required: false,
											message: 'Rate calculation method',
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
			<Button type='primary' onClick={() => setIsOpen(!isOpen)}>
				Add rate
			</Button>
		</Space>
	)
}

export default AddRate
