import { Button, Modal } from 'antd'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteDbscData, setConfirmModalData } from '../../../../Actions/DbscActions'

const ConfirmDeleteModal = ({ id }) => {
	const dispatch = useDispatch()
	const { modalData, alertMessageType, token } = useSelector(state => state)

	const handleConfirm = useCallback(() => {
		dispatch(
			deleteDbscData(
				modalData.url,
				{ id: modalData.data },
				modalData.action,
				token
			)
		)
	}, [dispatch, modalData?.action, modalData?.data, modalData?.url, token])

	return (
		<Modal
			title='Delete confirmation'
			visible={modalData.visible && modalData.data && +modalData.data === +id}
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
				<Button
					key='submit'
					type='primary'
					onClick={handleConfirm}
					loading={alertMessageType === 'loading'}>
					Confirm
				</Button>,
			]}>
			<p>Are you sure you want to delete this {modalData.title}?</p>
		</Modal>
	)
}

export default ConfirmDeleteModal
