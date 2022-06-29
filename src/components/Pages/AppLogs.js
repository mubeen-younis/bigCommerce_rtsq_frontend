import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Col, Input, Row, Skeleton } from 'antd'
import axios from 'axios'

const columns = [
	{
		title: 'Log Id',
		dataIndex: 'id',
		key: 'id',
		sortOrder: false,
		ellipsis: true,
	},
	{
		title: 'Data',
		dataIndex: 'log',
		key: 'log',
	},
	{
		title: 'Date Created',
		dataIndex: 'date_created',
		key: 'date_created',
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: 'Action',
		dataIndex: 'id',
		key: 'id',
		render: (id, record) => (
			<Space size='middle'>
				<Button onClick={() => {}}>Action</Button>
			</Space>
		),
	},
]

const data = [
	{
		id: '1',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'success',
	},
	{
		id: '2',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'success',
	},
	{
		id: '3',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'error',
	},
	{
		id: '4',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'success',
	},
	{
		id: '5',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'error',
	},
	{
		id: '6',
		log: 'this is log data',
		date_created: '2020-01-01',
		status: 'success',
	},
]

const AppLogs = () => {
	const [logs, setLogs] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredLogs, setFilteredLogs] = useState([])

	const fetchLogs = async (search = '') => {
		try {
			setLoading(true)

			const url = `${process.env.REACT_APP_ENITURE_API_URL}/api_logs?${search}`
			const response = await axios.get(url)
			const data = await response.json()
			if (!data.error) {
				setLogs(data)
			}

			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLogs()
	}, [])

	const handleSearch = e => {
		setSearch(e.target.value)
		const searchValue = Number(e.target.value)
		const filteredLogs = data.filter(log => log.id.includes(searchValue))
		setFilteredLogs(filteredLogs)
	}

	if (loading) return <Skeleton active />

	return (
		<>
			<Row gutter={30} className='mb-3'>
				<Col span={20}>
					<Input
						placeholder='Search by log id'
						className='col-8'
						type='number'
						pattern='[0-9]*'
						size='large'
						value={search}
						onChange={handleSearch}
					/>
				</Col>
				<Col span={4} style={{ paddingLeft: '0px' }}>
					<Button type='primary' size='large'>
						Search
					</Button>
				</Col>
			</Row>
			<Table
				className='custom-table'
				columns={columns}
				dataSource={filteredLogs?.length > 0 ? filteredLogs : logs}
				pagination={{
					pageSize: 10,
				}}
			/>
		</>
	)
}

export default AppLogs
