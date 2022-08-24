import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal, Space, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setConfirmModalData, updateDbscData } from '../../../Actions/DbscActions'
import types from '../../../Stores/types'
import ConfirmDeleteModal from './Modals/ConfirmDeleteModal'
import { AddShippingClass } from './ShippingProfile/AddProfile'

const App = () => {
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
		if (alertMessageType === 'success') {
			setIsOpen(false)
			setClassId(null)
		}
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
							setIsOpen(true)
							setClassId(record.id)
							form.setFieldsValue(record)
						}}>
						Edit
					</Button>
					<Button
						type='link'
						onClick={() => {
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
			dispatch(
				updateDbscData(
					'update_shipping_class',
					{ ...values, id: classId },
					types.UPDATE_DBSC_CLASS,
					token
				)
			)
		},
		[classId, dispatch, token]
	)

	return (
		<>
			<Table columns={columns} dataSource={shippingClasses} />
			<ConfirmDeleteModal />
			{isOpen && (
				<Modal
					title='Edit shipping class'
					visible={isOpen}
					onCancel={() => {
						setIsOpen(false)
						form.resetFields()
					}}
					onOk={() => form.submit()}
					centered
					destroyOnClose
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
