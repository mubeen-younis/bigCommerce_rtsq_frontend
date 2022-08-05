import React, { memo } from 'react'
import { Button, Space, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const columns = [
	{
		title: 'Name',
		dataIndex: 'class_name',
		key: 'class_name',
	},
	{
		title: 'Slug',
		dataIndex: 'slug',
		key: 'slug',
	},
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
	},

	{
		title: 'Action',
		key: 'action',
		render: (_, record) => (
			<Space size='middle'>
				<Button type='link'>Edit</Button>
				<Button type='link'>Delete</Button>
			</Space>
		),
	},
]

const App = () => {
	const dispatch = useDispatch()
	const { shippingClasses } = useSelector(state => state)

	return <Table columns={columns} dataSource={shippingClasses} />
}

export default memo(App)
