import { Col, Row, Space, Table } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'

const RatesList = () => {
	const dataSource = [
		{
			key: '1',
			name: 'Mike',
			age: 32,
			address: '10 Downing Street',
		},
	]

	const columns = [
		{
			title: 'Display as',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Rate',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Distance measured by',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Distance',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'And / Or',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Length',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Quote',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Action',
			dataIndex: 'address',
			key: 'address',
		},
	]

	return (
		<>
			<Row gutter={30} className='mb-2'>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={5}>Test Zone</Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<p>Africa, Algeria, 8388, 83838, 89383</p>
				</Col>
			</Row>

			<Table
				dataSource={dataSource}
				columns={columns}
				size='large'
				className='custom-table'
				pagination={false}
			/>
		</>
	)
}

export default RatesList
