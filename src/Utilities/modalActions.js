export const setModalTitle = (type = 'add', shippingClass = false, postfix = '') => {
	const act = type === 'edit' ? 'Edit' : 'Add'
	const newPostfix =
		postfix.trim().length > 0 ? postfix : shippingClass ? ' class' : ' profile'
	return `${act} shipping ${newPostfix}`
}
