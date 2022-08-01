import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

const { Option } = Select
const { TextArea } = Input

const AddProfile = ({ visible, toggleAddProfileModal }) => {
	const [shippingClass, setShippingClass] = useState(false)
	const [form] = Form.useForm()
	const [initialValues, setInitialValues] = useState({
		nickname: '',
		shipping_class: [],
		class_name: '',
		class_slug: '',
		class_description: '',
	})

	useEffect(() => {}, [])

	const setModalTitle = useCallback(() => {
		const postfix = shippingClass ? ' class' : ' profile'
		return `Add shipping ${postfix}`
	}, [shippingClass])

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', values)
	}, [])

	return (
		<Row gutter={30}>
			<Modal
				title={setModalTitle()}
				visible={visible}
				onCancel={() => toggleAddProfileModal(false)}
				onOk={() => form.submit()}
				centered
				destroyOnClose
				okText='Save'
				footer={[
					<Button key='back' onClick={() => toggleAddProfileModal(false)}>
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
					name='add_profile_info'
					className='form-wrp'
					size='large'
					form={form}
					initialValues={initialValues}
					onFinish={onFinish}>
					{!shippingClass ? (
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
										placeholder='Nickname'
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
									label='Shipping class'
									name='shipping_class'
									rules={[
										{
											required: false,
											message: 'Shipping class',
										},
									]}>
									<Select
										showSearch
										placeholder='Search shipping classes'
										optionFilterProp='children'
										mode='tags'
										// onChange={onChange}
										// onSearch={onSearch}
										filterOption={(input, option) =>
											option.children
												.toLowerCase()
												.includes(input.toLowerCase())
										}>
										<Option value='jack'>Jack</Option>
										<Option value='lucy'>Lucy</Option>
										<Option value='tom'>Tom</Option>
									</Select>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item>
									<Button
										type='text'
										htmlType='button'
										onClick={() =>
											setShippingClass(prevState => !prevState)
										}>
										Add a new shipping class
									</Button>
								</Form.Item>
							</Col>
						</Row>
					) : (
						/* Add shipping class */
						<AddShippingClass />
					)}
				</Form>
			</Modal>
		</Row>
	)
}

const AddShippingClass = () => {
	return (
		<Row gutter={30}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Shipping class'
					name='class_name'
					rules={[
						{
							required: false,
							message: 'Shipping class',
						},
					]}>
					<Input
						name='class_name'
						placeholder='Class name'
						// value={locationDetail.nickname}
						// onChange={changeValue}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Slug'
					name='class_slug'
					rules={[
						{
							required: false,
							message: 'Slug',
						},
					]}>
					<Input
						name='class_slug'
						placeholder='Class slug'
						// value={locationDetail.nickname}
						// onChange={changeValue}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Description'
					name='class_description'
					rules={[
						{
							required: false,
							message: 'Description',
						},
					]}>
					<TextArea
						name='description'
						// value={locationDetail.nickname}
						// onChange={changeValue}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default AddProfile
