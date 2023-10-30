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
import types from '../../Stores/types'
import axios from '../../Utilities/authToken'
import { dispatchAlert } from '../../Utilities/dispatchAlert'
import { blockInvalidChar } from '../../Utilities/numberValidation'
import { countryStates } from '../../Utilities/constants'

const { Title } = Typography
const { Option } = Select
const initialState = {
	rule_name: '',
	filter_country: 'US',
	rule_type: '1',
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
	const [countryCode, setCountryCode] = useState('US');
	const [isFilterWeight, setIsFilterWeight] = useState(false);
	const [isFilterPrice, setIsFilterPrice] = useState(false);
	const [isFilterQuantity, setIsFilterQuantity] = useState(false);
	const [ruleType, setRuleType] = useState(1);
	const [applyTo, setApplyTo] = useState(1);
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { alertMessageType, shippingRules, token , allProducts, installedCarriers} = useSelector(state => state)
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
		key: item.source_product_id.toString(), value: item.name 
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

	const isAvailable = async (uuid, available) => {
	
	try {
		dispatch(dispatchAlert(true, 'loading'))
		const url = `${process.env.REACT_APP_ENITURE_API_URL}/updateAvaiableStatus`,
		
		  config = {
			headers: {
			  authorization: `Bearer ${token}`,
			},
		  }
		const reqData = {'uuid' : uuid, 'available' : available}
		const {
			data: { error, data, message },
		}  = await axios.post(url, reqData, config)

		if (!data.error) {
			dispatch({
				type: types.UPDATE_SHIPPING_RULE,
				payload: data.shippingRule,
			})
		}
		dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
	  } catch (err) {
		dispatch(dispatchAlert(false, null))
	  }
	}

	const updateFormFields = async (text) => 
	{
		setAvailable(text?.available)
		setRuleType(text?.rule_type)
		setSelectedItems(text?.filter_products)
		setIsFilterWeight(text?.isFilterWeight)
		setIsFilterPrice(text?.isFilterPrice)
		setIsFilterQuantity(text?.isFilterQuantity)

		editLocation(text)
	}

	const onFinish = useCallback(
		values => {
			values = {...values, apply_to : applyTo, available: available }
			if(values['rule_type'] == 2){
				values = {...values, isFilterWeight: isFilterWeight, isFilterPrice: isFilterPrice, isFilterQuantity: isFilterQuantity }
			}
			
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
			isFilterWeight,
			isFilterPrice,
			isFilterQuantity,
			applyTo
		]
	)

	const columns = [
		{
			key: 'rule_name',
			title: 'Rule Name',
			dataIndex: 'rule_name',
			align: "center",
		},
		{
			key: 'rule_type',
			title: 'Type',
			dataIndex: 'rule_type',
			align:"center",
			render: (rule_type) => (
				<Space size="small">
				  {rule_type == 1 ? 'Restrict By Country' : rule_type == 2 ? 'Hide Methods' : null}
				</Space>
			  ),
		},
		{
			key: 'filter_name',
			title: 'Filters',
			dataIndex: 'filter_name',
			align: "center",
			render: (filter_name) => (
				<Space size="small">
				  {installedCarriers?.map(carrier =>
					carrier.slug == filter_name ? (
						carrier.carrier_type == 1 ? carrier.name + ' (LTL Freight Providers)' : carrier.carrier_type == 2 ? carrier.name + ' (Parcel & Postal Providers)' : null
					) : null)}
				</Space>
			)
		},
		{
			key: 'available',
			title: 'Available',
			dataIndex: 'available',
			align: "center",
			render: (available, record) => (
				<Space size="small">
				  <a href="#!" onClick={() => isAvailable(record.uuid, record.available)}>
					{available ? "Yes" : "No"}
					
				  </a>
				</Space>
			  ),
		},
		{
			key: 'action',
			title: 'Action',
			align: "center",
			render: text => (
				<>
				<Space size='middle'>
					<Button onClick={() => updateFormFields(text)}>
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
									setRuleType(1)
									setIsFilterWeight(false)
									setIsFilterPrice(false)
									setIsFilterQuantity(false)
									setSelectedItems([])
									hanldeModalToggling(true, 'add')
								}}>
								Add
							</Button>
						</Title>
						<p>
							The Shipping Rules gives you an opportunity to customize the behavior of the app.
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
									<Select 
										placeholder='Type'
										onChange={value =>
											setRuleType(value)
										}
									>
										<Option value={'1'}>Restrict By Country</Option>
										<Option value={'3'}>Restrict By State</Option>
										<Option value={'2'}>Hide Methods</Option>
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
						{(ruleType == 1 || ruleType == 3) && (
							<>
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
										label='Countries'
										name='filter_country'
										rules={[
											{
												required: true,
												message: 'Select Countries',
											},
										]}>
										<Select 
											placeholder='Select Countries' 
											value={this?.filter_country || undefined}
											onChange={value =>
												setCountryCode(value)
											}
										>
											<Option value={'US'}>US</Option>
											<Option value={'CA'}>CA</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							{(ruleType == 3)  && (
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
										label='States/Provinces'
										name='filter_state_province'
										rules={[
											{
												required: true,
												message: 'Select States/Provinces',
											},
										]}>
										<Select 
											placeholder='Select States/Provinces' 
											value={this?.filter_state_province || undefined}
										>
											{countryStates[countryCode]?.map((option) => (
          										<Option key={option?.code} value={option?.code}>
	            									{option?.name}
    	      									</Option>
        									))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							)}
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
										label='Apply the rule to these products'
										name='filter_products'
										rules={[
											{
												required: true,
												message: 'Select Products',
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
							</>
						)}

						{(ruleType == 2) && (
							<>
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
										label='Provider'
										name='filter_provider'
										rules={[
											{
												required: true,
												message: 'Select Provider',
											},
										]}>
										<Select placeholder='Select Provider'  value={this?.filter_provider || undefined}>
											{installedCarriers?.map(carrier =>
												carrier.is_enabled ? (
												<Option value={carrier?.slug}>
													{carrier.carrier_type == 1 ? carrier.name + ' (LTL Freight Providers)' : carrier.carrier_type == 2 ? carrier.name + ' (Parcel & Postal Providers)' : null}
												</Option>
											) : null
											)}
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
									xl={24}
								>
									<Form.Item
										className={'mb-0'}
										name='is_filter_weight'
									>
									<Checkbox
                  						name="is_filter_weight"
                  						checked={isFilterWeight}
                  						onChange={e => 
											setIsFilterWeight(e.target.checked)	
										}
                					>	
                  						Filter by weight
                					</Checkbox>
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='From'
										name='weight_from'
										rules={[
											{
												required: isFilterWeight,
												message: 'Enter weight from',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter weight from' />
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='To'
										name='weight_to'
										rules={[
											{
												required: isFilterWeight,
												message: 'Enter weight to',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter weight to' />
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
									xl={24}
								>
									<Form.Item
										className={'mb-0'}
										name='is_filter_price'
									>
									<Checkbox
                  						name="is_filter_price"
                  						checked={isFilterPrice}
                  						onChange={e => 
											setIsFilterPrice(e.target.checked)	
										}
                					>	
                  						Filter by price
                					</Checkbox>
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='From'
										name='price_from'
										rules={[
											{
												required: isFilterPrice,
												message: 'Enter price from',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter price from' />
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='To'
										name='price_to'
										rules={[
											{
												required: isFilterPrice,
												message: 'Enter price to',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter price to' />
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
									xl={24}
								>
									<Form.Item
										className={'mb-0'}
										name='is_filter_quantity'
									>
									<Checkbox
                  						name="is_filter_quantity"
                  						checked={isFilterQuantity}
                  						onChange={e => 
											setIsFilterQuantity(e.target.checked)	
										}
                					>	
                  						Filter by quantity
                					</Checkbox>
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='From'
										name='quantity_from'
										rules={[
											{
												required: isFilterQuantity,
												message: 'Enter quantity from',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter quantity from' />
									</Form.Item>
								</Col>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={12}
									lg={12}
									xl={12}>
									<Form.Item
										label='To'
										name='quantity_to'
										rules={[
											{
												required: isFilterQuantity,
												message: 'Enter quantity to',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter quantity to' />
									</Form.Item>
								</Col>
							</Row>
							</>
						)}
						
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
