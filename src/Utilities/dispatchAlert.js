export const dispatchAlert = (
	showAlertMessage = false,
	alertMessageType = '',
	alertMessage = ''
) => ({
	type: 'ALERT_MESSAGE',
	payload: {
		alertMessage,
		showAlertMessage,
		alertMessageType,
	},
})

export const setModalData = (
	title = '',
	visible = false,
	url = '',
	data = null,
	action = ''
) => ({
	type: 'SET_MODAL_DATA',
	payload: {
		title,
		visible,
		url,
		data,
		action,
	},
})
