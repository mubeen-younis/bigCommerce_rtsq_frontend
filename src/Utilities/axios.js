import axios from 'axios'

export default function axiosInstance() {
	const token = localStorage.getItem('store')

	const instance = axios.create({
		baseURL: process.env.REACT_APP_ENITURE_API_URL,
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
	})

	return instance
}
