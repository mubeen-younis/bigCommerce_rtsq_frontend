import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Space, Table, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
	addDbscData,
	setConfirmModalData,
	updateDbscData,
} from '../../../Actions/DbscActions'
import types from '../../../Stores/types'
import ConfirmDeleteModal from './Modals/ConfirmDeleteModal'
import { AddShippingClass } from './ShippingProfile/AddProfile'

const { Title } = Typography

const App = () => {
	const [action, setAction] = useState('add')
	const [isOpen, setIsOpen] = useState(false)
	const [form] = Form.useForm()
	const [initialValues] = useState({
		class_name: '',
		slug: '',
		description: '',
	})
	const [classId, setClassId] = useState(null)
	const dispatch = useDispatch()
	const { shippingClasses, alertMessageType, token } = useSelector(state => state)

	useEffect(() => {
		if (alertMessageType === 'success') clearStates()
	}, [alertMessageType])

	const columns = [
		{
			title: 'Name',
			dataIndex: 'class_name',
			key: 'class_name',
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},

		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button
						type='link'
						onClick={() => {
							setAction('edit')
							setIsOpen(true)
							setClassId(record.id)
							form.setFieldsValue(record)
						}}>
						Edit
					</Button>
					<Button
						type='link'
						onClick={() => {
							setClassId(record.id)
							dispatch(
								setConfirmModalData(
									'class',
									true,
									'delete_shipping_class',
									record.id,
									types.DELETE_DBSC_CLASS,
									''
								)
							)
						}}>
						Delete
					</Button>
				</Space>
			),
		},
	]

	const onFinish = useCallback(
		values => {
			if (action === 'edit') {
				dispatch(
					updateDbscData(
						'update_shipping_class',
						{ ...values, id: classId },
						types.UPDATE_DBSC_CLASS,
						token
					)
				)

				return
			}

			dispatch(
				addDbscData(
					'add_shipping_class',
					values,
					types.ADD_DBSC_CLASS,
					token
				)
			)
		},
		[classId, dispatch, token, action]
	)

	const handleAddClass = useCallback(() => {
		setClassId(false)
		form.resetFields()
		form.setFieldsValue(initialValues)
		setAction('add')
	}, [form, initialValues])

	const clearStates = useCallback(() => {
		setIsOpen(false)
		handleAddClass()
	}, [handleAddClass])

	return (
		<>
			<Row gutter={30} className='mb-2'>
				<Col span={12}>
					<Title level={4}>Shipping Classes </Title>
				</Col>
				<Col
					span={12}
					style={{
						textAlign: 'right',
					}}>
					<Button
						type='primary'
						onClick={() => {
							setIsOpen(true)
							handleAddClass()
						}}>
						Add Shipping Class
					</Button>
				</Col>
			</Row>

			<Table columns={columns} dataSource={shippingClasses} />
			<ConfirmDeleteModal id={classId} />
			{isOpen && (
				<Modal
					title={`${action === 'edit' ? 'Edit' : 'Add'} shipping class`}
					visible={isOpen}
					onCancel={clearStates}
					onOk={() => form.submit()}
					centered
					destroyOnClose
					afterClose={clearStates}
					okText='Save'
					footer={[
						<Button key='back' onClick={() => setIsOpen(false)}>
							Cancel
						</Button>,
						<Button
							key='submit'
							type='primary'
							loading={alertMessageType === 'loading'}
							onClick={() => form.submit()}>
							Save
						</Button>,
					]}>
					<Form
						layout='vertical'
						name='add_class_info'
						className='form-wrp'
						size='large'
						form={form}
						initialValues={initialValues}
						onFinish={onFinish}>
						<AddShippingClass shippingClass={isOpen} />
					</Form>
				</Modal>
			)}
		</>
	)
}

export default memo(App)
