export const dispatchAlert = (
	showAlertMessage = false,
	alertMessageType = '',
	alertMessage = ''
) => ({
	type: alertMessageType,
	payload: {
		alertMessage,
		showAlertMessage,
		alertMessageType,
	},
})
