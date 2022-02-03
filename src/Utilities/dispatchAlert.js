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
