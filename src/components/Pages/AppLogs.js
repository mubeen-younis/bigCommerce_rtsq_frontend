import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Col, Input, Row, Skeleton } from 'antd'
import axios from 'axios'
import Title from 'antd/lib/typography/Title'

const columns = [
	{
		title: 'Id',
		dataIndex: 'id',
		key: 'id',
		sortOrder: true,
		ellipsis: true,
	},
	{
		title: 'Status',
		dataIndex: 'level',
		key: 'level',
	},
	{
		title: 'Type',
		dataIndex: 'level_name',
		key: 'level_name',
	},
	{
		title: 'Environment',
		dataIndex: 'channel',
		key: 'channel',
	},
	{
		title: 'Date Created',
		dataIndex: 'created_at',
		key: 'created_at',
		defaultSortOrder: 'descend',
		sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
		sortDirections: ['descend', 'ascend'],
	},
	{
		title: 'User Agent',
		dataIndex: 'user_agent',
		key: 'user_agent',
	},
	{
		title: 'Origin Address',
		dataIndex: 'remote_addr',
		key: 'remote_addr',
	},
	{
		title: 'Checkout Quotes',
		dataIndex: 'formatted',
		key: 'formatted',
	},
	{
		title: 'Data',
		dataIndex: 'message',
		key: 'message',
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

const AppLogs = () => {
	const [logs, setLogs] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredLogs, setFilteredLogs] = useState([])

	const fetchLogs = async () => {
		try {
			setLoading(true)

			let config = {}
			if (search.trim().length) {
				config = { params: { search } }
			}

			const url = `${process.env.REACT_APP_ENITURE_API_URL}/api_logs`
			const { data } = await axios.get(url, config)
			if (!data.error) {
				search.trim().length
					? setFilteredLogs(data?.data?.data ?? [])
					: setLogs(data?.data?.data ?? [])
			}

			setLoading(false)
		} catch (err) {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLogs()
	}, [])

	if (loading) return <Skeleton active />

	return (
		<>
			<Title
				style={{
					textAlign: 'center',
				}}>
				App Logs
			</Title>
			<Row gutter={30} className='mb-3'>
				<Col span={20}>
					<Input
						placeholder='Search by log id'
						className='col-8'
						type='number'
						pattern='[0-9]*'
						size='large'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</Col>
				<Col span={4} style={{ paddingLeft: '0px' }}>
					<Button type='primary' size='large' onClick={fetchLogs}>
						Search
					</Button>
				</Col>
			</Row>
			<Table
				className='custom-table'
				columns={columns}
				dataSource={filteredLogs?.length > 0 ? filteredLogs : logs}
				pagination={{
					position: ['topRight', 'bottomRight'],
					showSizeChanger: true,
				}}
			/>
		</>
	)
}

export default AppLogs
