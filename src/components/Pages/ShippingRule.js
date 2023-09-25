import React, { Fragment, useState, useCallback, useEffect } from 'react'
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Modal,
	Form,
	Input,
	Table,
	Skeleton,
	Radio,
	Checkbox,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
	getShippingRules,
	saveShippingRule,
	deleteShippingRule,
} from '../../Actions/ShippingRulesActions'
import addKeysToList from './../../Utilities/addKey'
import { getAllProducts } from '../../Actions/ProductSettings'

const { Title } = Typography
const { Option } = Select
const initialState = {
	rule_name: '',
	filter_name: 'US',
	rule_type: 'Restrict By Country',
	filter_settings: [],
}

function ShippingRulesComponent() {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 50,
		search: null,
	  });
	  const [selectedItems, setSelectedItems] = useState([]);
	
	const [modal, setModal] = useState({
		open: false,
		type: '',
	})
	const [shippingRuleId, setShippingRuleId] = useState(null)
	const [available, setAvailable] = useState(true);
	const [applyTo, setApplyTo] = useState(1);
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { alertMessageType, shippingRules, token , allProducts} = useSelector(state => state)
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleChange = (selectedValues) => {
	  setSelectedOptions(selectedValues);
	};
	useEffect(() => {
		if (!shippingRules) {
			dispatch(getShippingRules(token))
		}
		
	}, [dispatch, shippingRules, token])

	useEffect(() => {
		dispatch(
			getAllProducts(
			  token,
			  pagination.current,
			  pagination.pageSize,
			  false,
			  setLoading,
			  pagination.search
			)
		  );
		  
	}, [dispatch, token])

	

	useEffect(() => {
		if (alertMessageType === 'success') {
			setModal({
				open: false,
				type: '',
			})
		}
	}, [alertMessageType])

	const hanldeModalToggling = useCallback(
		(open = false, type = '') =>
			setModal({
				open,
				type,
			}),
		[]
	)

	const options = allProducts?.map((item) => ({
		key: item.id.toString(), value: item.name 
	}))

	const filterOptions = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedOptions.includes(option.key)
		);
	};

	const editLocation = useCallback(
		record => {
			hanldeModalToggling(true, 'edit')
			setShippingRuleId(record.uuid)
			form.setFieldsValue(record)
		},
		[form, hanldeModalToggling]
	)

	const openDeleteLocationModal = useCallback(
		record => {
			hanldeModalToggling(true, 'delete')
			setShippingRuleId(record.uuid)
		},
		[hanldeModalToggling]
	)

	const onFinish = useCallback(
		values => {
			values = {...values, apply_to : applyTo, available: available }
			let error = false,
				errormsg = '',
				data = {}

			if (modal.open && modal.type === 'edit') {
				data = shippingRules?.find(sg => sg.uuid === shippingRuleId) ?? {}
			}

			if (error) {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: false,
						alertMessageType: 'loading',
					},
				})
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: errormsg,
						showAlertMessage: true,
						alertMessageType: 'error',
					},
				})
			} else {
				dispatch(saveShippingRule({ ...data, ...values }, token))
				form.resetFields()
			}
		},
		[
			dispatch,
			form,
			modal.open,
			modal.type,
			shippingRuleId,
			shippingRules,
			token,
			available,
			applyTo
		]
	)

	const columns = [
		{
			key: 'rule_name',
			title: 'Rule Name',
			dataIndex: 'rule_name',
		},
		{
			key: 'rule_type',
			title: 'Type',
			dataIndex: 'rule_type',
		},
		{
			key: 'filter_name',
			title: 'Filters',
			dataIndex: 'filter_name',
		},
		{
			key: 'available',
			title: 'Available',
			dataIndex: 'available',
			render: (available) => (
				<>
				  {available == 1 ? "Yes" : "No"}
				</>
			),
		},
		{
			key: 'action',
			title: 'Action',
			render: text => (
				<>
				<Space size='middle'>
					<Button onClick={() => {
						text.filter_settings = JSON.parse(text?.filter_settings)
						setAvailable(text?.available)
						setSelectedItems(text.filter_settings)
						editLocation(text)
					}}>
						Edit
					</Button>
					<Button
						onClick={() => openDeleteLocationModal(text)}
						className={'btn-danger'}>
						Delete
					</Button>
				</Space>
				</>
			),
		},
	]

	if (!shippingRules) return <Skeleton active />

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row gutter={30}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>
							Shipping Rules{' '}
							<Button
								type='primary'
								onClick={() => {
									form.setFieldsValue(initialState)
									setAvailable(true)
									setSelectedItems([])
									hanldeModalToggling(true, 'add')
								}}>
								Add
							</Button>
						</Title>
						<p>
							Create a "Shipping Group" to define a custom shipping
							rate. Once a "Shipping Group" is defined, you can assign
							it to a product by editing the product's shipping
							parameters. A "Shipping Group" can be assigned to more
							than one product.
						</p>
						<Table
							className={'custom-table'}
							dataSource={
								shippingRules ? addKeysToList(shippingRules) : []
							}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>

			{/* Add/Edit Modal */}
			<Modal
				title={
					<Title className={'mb-0'} level={4}>
						{alertMessageType === 'loading'
							? 'Loading. Please wait...'
							: 'Shipping Rules'}
					</Title>
				}
				centered
				visible={
					modal.open && (modal.type === 'add' || modal.type === 'edit')
				}
				onCancel={() => {
					hanldeModalToggling(false, '')
					form.resetFields()
				}}
				destroyOnClose={true}
				footer={null}
				width={800}>
				{alertMessageType === 'loading' ? (
					<Skeleton active />
				) : (
					<Form
						layout='vertical'
						name='add_shipping_rule_info'
						className='form-wrp'
						size={'large'}
						form={form}
						initialValues={initialState}
						onFinish={onFinish}>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Rule Name'
									name='rule_name'
									rules={[
										{
											required: true,
											message: 'Rule Name',
										},
									]}>
									<Input placeholder='Rule Name' />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Type'
									name='rule_type'
									rules={[
										{
											required: false,
											message: 'Type',
										},
									]}>
									<Select placeholder='Type'>
										<Option value={'Restrict By Country'}>Restrict By Country</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Apply to:'
									rules={[
										{
											required: false,
											message: 'Apply to',
										},
									]}>
									<Radio checked={applyTo == 1}>
										Cart
									</Radio>			
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Restrict By Country'
									name='filter_name'
									placeholder='Restrict By Country'
									rules={[
										{
											required: false,
											message: 'Restrict By Country',
										},
									]}>
									<Select placeholder='Restrict By Country'>
										<Option value={'US'}>US</Option>
										<Option value={'CA'}>CA</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									label='Product Which You Want To Add'
									name='filter_settings'
									rules={[
										{
											required: true,
											message: 'Product Which You Want To Add',
										},
									]}>
									<Select
        								mode="multiple"
        								style={{ width: '100%' }}
        								placeholder="Select Products"
        								value={selectedOptions}
        								onChange={handleChange}
        								filterOption={filterOptions}
      								>
        								{options?.map((option) => (
          									<Option key={option.key} value={option.key}>
            									{option.value}
          									</Option>
        								))}
      								</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									className={'mb-2'}
									rules={[
										{
											required: false,
											message: 'Available',
										},
									]}>
									<Checkbox
                  						name="available"
                  						checked={available}
                  						onChange={e => 
											setAvailable(e.target.checked)	
										}
                					>	
                  						Available
                					</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30} align='middle' className={'mt-3'}>
							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}>
								<Form.Item
									style={{
										textAlign: 'right',
										marginBottom: '0',
									}}>
									<Space>
										<Button
											type='primary'
											size={'large'}
											htmlType='submit'>
											Save
										</Button>
									</Space>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				)}
			</Modal>

			{/* Delete Modal */}
			<Modal
				title='Confirm Delete'
				centered
				visible={modal.open && modal.type === 'delete'}
				onOk={() => dispatch(deleteShippingRule(shippingRuleId, token))}
				onCancel={() => hanldeModalToggling(false, '')}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>Are you sure you want to delete this shipping rule?</p>
			</Modal>
		</Fragment>
	)
}

export default ShippingRulesComponent
