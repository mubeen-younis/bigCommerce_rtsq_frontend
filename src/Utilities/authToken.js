import axios from 'axios'

const token = localStorage.getItem('store') ?? ''

export default axios.create({
	baseURL: process.env.REACT_APP_ENITURE_API_URL,
	headers: {
		authorization: `Bearer ${token}`,
	},
})
