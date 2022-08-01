import React, { useCallback, useState } from 'react'
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
import AddRate from '../ShippingRate/AddRate'
import Title from 'antd/lib/typography/Title'

const { Option } = Select
const { TextArea } = Input

const AddZone = ({ visible, toggleAddProfileModal }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues, setInitialValues] = useState({
		zone_name: '',
		define_by_zone: 1,
		zone_regions: [],
	})

	const onFinish = useCallback(values => {
		console.log('Received values of form: ', form.getFieldsValue())
	}, [])

	return (
		<Card>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={4}>Shipping To</Title>
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
						Add shipping zone
					</Button>
				</Col>
			</Row>

			{/* Add New Shipping Zone */}
			{isOpen && (
				<Modal
					title='Create zone'
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
						name='add_zone_info'
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
									label='Zone name'
									name='zone_name'
									rules={[
										{
											required: false,
											message: 'Zone name',
										},
									]}>
									<Input
										name='zone_name'
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
									label='Define by zone'
									name='define_by_zone'
									rules={[
										{
											required: false,
											message: 'Define by zone',
										},
									]}>
									<Radio.Group
										onChange={e => {
											setInitialValues(prevVal => ({
												...prevVal,
												define_by_zone: +e.target.value,
											}))
										}}>
										<Radio value={1}>
											Country and/or State / Province
										</Radio>
										<Radio value={2}>
											Postal Code by Country
										</Radio>
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
									name='zone_regions'
									rules={[
										{
											required: false,
											message: 'Zone regions',
										},
									]}>
									<Select mode='tags'></Select>
								</Form.Item>
							</Col>

							{initialValues.define_by_zone === 2 && (
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={24}
									lg={24}
									xl={24}>
									<Form.Item
										className='mb-2'
										rules={[
											{
												required: false,
												message: 'postal_codes',
											},
										]}>
										<TextArea
											className='mb-1'
											rows={4}
											placeholder='List 1 postcode per line'
										/>
										<p>
											Postcodes containing wildcards (e.g.
											CB23*) or fully numeric ranges (e.g.
											90210...99000) are also supported. Please
											see the shipping zones{' '}
											<a
												href='https://docs.woocommerce.com/document/setting-up-shipping-zones/#section-3'
												target='_blank'
												rel='noopener noreferrer'>
												documentation
											</a>{' '}
											for more information.
										</p>
									</Form.Item>
								</Col>
							)}
						</Row>
					</Form>
				</Modal>
			)}

			{/* Shipping Rates */}
			<AddRate />
		</Card>
	)
}

export default AddZone
