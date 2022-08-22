import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Radio, Space } from 'antd'
import RatesList from './RatesList'
import { useDispatch, useSelector } from 'react-redux'
import types from '../../../../Stores/types'
import { addDbscData } from '../../../../Actions/DbscActions'

const { Option } = Select
const { TextArea } = Input

const AddRate = ({ zoneId, rates }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		display_as: '',
		distance_display_preferences: '1',
		description: '',
		address_type: '1',
		default_unknown_address_type: '1',
		rate: '',
		distance_unit: 'Mile',
		distance_measured_by: 'Route',
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
		rating_method: '1',
	})
	const [andOr, setAndOr] = useState('And')
	const [action, setAction] = useState({
		type: 'add',
		payload: null,
	})

	const dispatch = useDispatch()
	const { alertMessageType, token } = useSelector(state => state)

	useEffect(() => {
		if (alertMessageType === 'success') {
			setAction({ type: '', payload: null })
			setIsOpen(false)
			setAndOr('And')
		}
	}, [alertMessageType, form])

	const onFinish = useCallback(
		values => {
			if (action.type === 'edit') {
				dispatch(
					addDbscData(
						'update_dbsc_rates',
						{ ...values, id: action.payload.id, and_or: andOr },
						types.UPDATE_DBSC_RATE,
						token
					)
				)
			} else {
				dispatch(
					addDbscData(
						'add_dbsc_rates',
						{ ...values, dbsc_zone_id: zoneId, and_or: andOr },
						types.ADD_DBSC_RATE,
						token
					)
				)
			}
		},
		[action?.type, action.payload?.id, dispatch, zoneId, andOr, token]
	)

	const editRate = useCallback(
		values => {
			console.log(values)
			setIsOpen(true)
			setAction({
				type: 'edit',
				payload: values,
			})
			setAndOr(values.and_or)

			form.setFieldsValue(values)
		},
		[form]
	)

	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Row gutter={30}>
				<Modal
					title='Add rate'
					visible={isOpen}
					onCancel={() => {
						setIsOpen(false)
						form.resetFields()
					}}
					onOk={() => {}}
					centered
					width={800}
					destroyOnClose
					afterClose={form.resetFields}
					okText='Save'
					footer={[
						<Button key='back' onClick={() => setIsOpen(false)}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
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
											required: true,
											message: 'Display as',
										},
									]}>
									<Input />
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
									name='distance_display_preferences'
									rules={[
										{
											required: false,
											message: 'Distance display preferences:',
										},
									]}>
									<Radio.Group>
										<Space direction='vertical'>
											<Radio value='1'>
												Don't display a description with the
												Display As label.
											</Radio>
											<Radio value='2'>
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

						<Row gutter={30} className='mb-2'>
							<Col
								className='gutter-row'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Form.Item
									className='mb-0'
									label='Address Type'
									name='address_type'
									rules={[
										{
											required: true,
											message: 'Address Type',
										},
									]}>
									<Select>
										<Option value='1'>
											Commercial and residential
										</Option>
										<Option value='2'>Commercial</Option>
										<Option value='3'>Residential</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col
								className='gutter-row'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Space direction='horizontal' size='middle'>
									<Form.Item
										label='Default unknown address type to'
										name='default_unknown_address_type'>
										<Radio.Group>
											<Radio value='1'>Commercial</Radio>
											<Radio value='2'>Residential</Radio>
										</Radio.Group>
									</Form.Item>
								</Space>
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
											required: true,
											message: 'Rate',
										},
									]}>
									<Input />
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
									name='distance_measured_by'
									rules={[
										{
											required: false,
											message: 'Distance measured by',
										},
									]}>
									<Select>
										<Option value='Route'>Route</Option>
										<Option value='Straight Line'>
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
									<Input />
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
									<Input />
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
									<Input />
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
									<Input />
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
								<Radio
									checked={andOr === 'And'}
									value='And'
									onChange={e => setAndOr('And')}>
									And
								</Radio>
							</Col>
							<Col
								className='gutter-row mb-2'
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={12}>
								<Radio
									checked={andOr === 'Or'}
									value='Or'
									onChange={e => setAndOr('Or')}>
									Or
								</Radio>
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
									<Input />
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
									<Input />
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
									<Input />
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
									<Input />
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
									<Input />
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
									<Input />
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
									name='rating_method'
									rules={[
										{
											required: false,
											message: 'Rate calculation method',
										},
									]}>
									<Radio.Group>
										<Space direction='vertical'>
											<Radio value='1'>
												The calculated shipping rate is for
												the contents of the Cart
											</Radio>
											<Radio value='2'>
												Multiply the calculated shipping rate
												by the number of items in the Cart
											</Radio>
											<Radio value='3'>
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

			<Row gutter={30}>
				<Col
					span={24}
					className='mb-0'
					style={{
						marginBottom: '0',
					}}>
					{/* Rates List */}
					<RatesList
						zoneId={zoneId}
						editRate={editRate}
						shippingRates={rates}
					/>
				</Col>

				<Col
					span={24}
					className='mb-0'
					style={{
						marginTop: '0',
					}}>
					<Button
						type='primary'
						className='mt-0 mb-1'
						onClick={() => setIsOpen(!isOpen)}>
						Add rate
					</Button>
				</Col>
			</Row>
		</Space>
	)
}

export default memo(AddRate)
