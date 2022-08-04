import React, { memo, useCallback, useEffect, useState } from 'react'
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
import Title from 'antd/lib/typography/Title'
import { useDispatch, useSelector } from 'react-redux'
import { addDbscData, getDbscData } from '../../../../Actions/DbscActions'
import types from '../../../../Stores/types'
import ZonesList from './ZonesList'

const { TextArea } = Input

const AddZone = ({ profileId }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues, setInitialValues] = useState({
		zone_name: '',
		define_by_zone: '1',
		selected_region: [],
		postcode: '',
	})
	const dispatch = useDispatch()
	const { dbscBigComZones } = useSelector(state => state)

	useEffect(() => {
		dispatch(getDbscData('get_dbsc_zones', types.GET_DBSC_ZONES))
	}, [])

	const onFinish = useCallback(values => {
		dispatch(
			addDbscData(
				'add_dbsc_zone',
				{ ...values, profile_id: profileId },
				types.ADD_DBSC_ZONE
			)
		)
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

			{/* Zones List */}
			<ZonesList profileId={profileId} />

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
											required: true,
											message: 'Zone name',
										},
									]}>
									<Input />
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
									name='selected_region'
									label='Zone Regions'
									rules={[
										{
											required: true,
											message: 'Zone regions',
										},
									]}>
									<Select
										mode='tags'
										placeholder='Select regions with within this zone'>
										{dbscBigComZones?.map(zone => (
											<Select.Option
												key={zone.id}
												value={zone.id}>
												{zone.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			)}
		</Card>
	)
}

export default memo(AddZone)
