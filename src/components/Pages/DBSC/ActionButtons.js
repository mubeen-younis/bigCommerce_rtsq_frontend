import React, { useCallback, useState } from 'react'
import { Button, Popover } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import types from '../../../Stores/types'

const ActionButtons = ({ children }) => {
	const [actionId, setActionId] = useState(null)
	const dispatch = useDispatch()
	const { actionButtons } = useSelector(state => state)

	const handleVisibleChange = useCallback(
		(visible = false) => {
			const id = Math.random() * 5000 + 1

			dispatch({
				type: types.SET_ACTION_BUTTONS_VISIBILITY,
				payload: {
					visible,
					id,
				},
			})
			setActionId(id)
		},
		[dispatch]
	)

	return (
		<Popover
			trigger='click'
			visible={actionButtons.visible && actionButtons.id === actionId}
			content={children}
			onVisibleChange={handleVisibleChange}
			showArrow
			align='center'>
			<Button
				type='link'
				onClick={() => handleVisibleChange(!actionButtons.visible)}>
				...
			</Button>
		</Popover>
	)
}

export default ActionButtons
