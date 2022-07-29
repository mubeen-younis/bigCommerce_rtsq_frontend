import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useState } from 'react'

const { Option } = Select
const { TextArea } = Input

const AddProfile = ({ visible, toggleAddProfileModal }) => {
	const [shippingClass, setShippingClass] = useState(false)

	return (
		<Row gutter={30}>
			<Modal
				title='Add shipping profile'
				visible={visible}
				onCancel={() => toggleAddProfileModal(false)}
				onOk={() => {}}
				centered
				destroyOnClose
				okText='Save'
				// footer={null}
			>
				<Form
					layout='vertical'
					name='add_warehouse_info'
					className='form-wrp'
					size='large'
					// form={form}
					initialValues={{}}
					onFinish={() => {}}>
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

					{/* Add shipping class */}
					{shippingClass && <AddShippingClass />}
				</Form>
			</Modal>
		</Row>
	)
}

const AddShippingClass = () => {
	return (
		<Row>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Form.Item
					className='mb-2'
					label='Shipping class'
					rules={[
						{
							required: false,
							message: 'Shipping class',
						},
					]}>
					<Input
						name='shipping_class'
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
					rules={[
						{
							required: false,
							message: 'Slug',
						},
					]}>
					<Input
						name='slug'
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
