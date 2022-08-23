import { Button, Modal } from 'antd'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteDbscData, setConfirmModalData } from '../../../../Actions/DbscActions'

const ConfirmDeleteModal = () => {
	const dispatch = useDispatch()
	const { modalData } = useSelector(state => state)

	const handleConfirm = useCallback(() => {
		dispatch(
			deleteDbscData(modalData.url, { id: modalData.data }, modalData.action)
		)
	}, [dispatch, modalData?.action, modalData?.data, modalData?.url])

	return (
		<Modal
			title='Delete confirmation'
			visible={modalData.visible}
			onCancel={() => dispatch(setConfirmModalData('', false, '', null, ''))}
			onOk={handleConfirm}
			centered
			width={500}
			destroyOnClose
			okText='Save'
			footer={[
				<Button
					key='back'
					onClick={() =>
						dispatch(setConfirmModalData('', false, '', null, ''))
					}>
					Cancel
				</Button>,
				<Button key='submit' type='primary' onClick={handleConfirm}>
					Confirm
				</Button>,
			]}>
			<p>Are you sure you want to delete this {modalData.title}?</p>
		</Modal>
	)
}

export default ConfirmDeleteModal
