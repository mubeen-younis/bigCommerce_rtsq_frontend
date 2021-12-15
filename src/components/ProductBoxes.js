import { useDispatch, useSelector } from 'react-redux'
import { Space, Table, Button, Col, Row, Checkbox, Modal } from 'antd'
import Form from 'rc-field-form/es/Form'

const ProductBoxes = () => {
	const dispatch = useDispatch()
	const {} = useSelector(state => state)

	const confirmDeleteBox = id => {
		// setRecordId(id);
		// setDeleteBoxModal(true);
	}

	const columns = [
		{
			key: 'quantity',
			title: 'Quantity',
			dataIndex: 'quantity',
		},
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			key: 'length',
			title: 'Length(inches)',
			dataIndex: 'length',
		},
		{
			key: 'width',
			title: 'Width(inches)',
			dataIndex: 'width',
		},
		{
			key: 'height',
			title: 'Height(inches)',
			dataIndex: 'height',
		},
		{
			key: 'Weight',
			title: 'Weight (LBS)',
			dataIndex: 'max_weight',
		},
		{
			key: 'actions',
			title: 'Actions',
			render: (text, record) => (
				<Space size='middle'>
					<a href='#!' onClick={() => 'editBoxSize(record)'}>
						Edit
					</a>
					<a
						href='#!'
						className={'btn-danger'}
						onClick={
							() => confirmDeleteBox(record.id)
							/*props.deleteBoxSize(record.id, props.token)*/
						}>
						Delete
					</a>
				</Space>
			),
		},
	]

	return (
		<>
			<h3>SKU:</h3>
			<p>small 1</p>
			<Table
				className={'custom-table mt-3'}
				dataSource={[
					{
						id: 1,
						quantity: 2,
						nickname: 'Box 1',
						length: 5,
						width: 10,
						height: 6,
						max_weight: 20,
					},
				]}
				columns={columns}
				pagination={false}
			/>
			<br />
			<Button style={{ width: '100px' }} type='primary' onClick={() => {}}>
				Add Box
			</Button>
		</>
	)
}

export default ProductBoxes
