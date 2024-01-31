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
	Tooltip,
	message,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
	getShippingRules,
	saveShippingRule,
	deleteShippingRule,
	getStatesProvinces,
	getCarrServices,
	getCategories,
	getBrands,
} from '../../Actions/ShippingRulesActions'
import addKeysToList from './../../Utilities/addKey'
import { getAllProducts } from '../../Actions/ProductSettings'
import types from '../../Stores/types'
import axios from '../../Utilities/authToken'
import { dispatchAlert } from '../../Utilities/dispatchAlert'
import { shippingRuleTypes } from '../../Utilities/constants'
import { blockInvalidChar, handleKeyCharNumbersOnly, handleNumbersOnly } from '../../Utilities/numberValidation'

const { Title } = Typography
const { Option } = Select
const initialState = {
	rule_name: '',
	filter_country: 'US',
	rule_type: '1',
	apply_rule_to: 1,
	filter_settings: [],
	filter_products: [],
	filter_categories: [],
	filter_brands: [],
	warehouses: [],
	filter_state_province: [],
	filter_postal_code: [],
}

function ShippingRulesComponent() {
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		current: null,
		pageSize: 10000000,
		search: null,
	  });
	
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
	const [applyRuleTo, setApplyRuleTo] = useState(1);
	const [applyTo, setApplyTo] = useState(1);
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { alertMessageType, shippingRules, token , allProducts, installedCarriers, statesProvinces, carrierServices, warehouse, storeCategories, storeBrands} = useSelector(state => state)
	const [selectedServices, setSelectedServices] = useState([]);
	const [carrierId, setCarrierId] = useState();
	const [carrierSlug, setCarrierSlug] = useState();
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [selectedProvinces, setSelectedProvinces] = useState([]);
	const [selectedWarehouses, setSelectedWarehouses] = useState([]);
	const [selectedPostalCodes, setSelectedPostalCodes] = useState([]);
	const [recordId, setRecordId] = useState(null);
	const [isLTL, setIsLTL] = useState();

	useEffect(() => {
		if (!shippingRules) {
			dispatch(getShippingRules(token))
		}

		if(ruleType == 3 || ruleType == 4){
			dispatch(getStatesProvinces(countryCode, token))
		}

		if(!storeCategories){
			dispatch(getCategories(token))
		}
		
		if(!storeBrands){
			dispatch(getBrands(token))
		}

	}, [dispatch, shippingRules, token, countryCode, ruleType])

	useEffect(() => {
		dispatch(getCarrServices(carrierId, token, isLTL, carrierSlug))
		
	}, [dispatch, token, carrierId])

	useEffect(() => {
		dispatch(
			getAllProducts(
			  token,
			  pagination.current,
			  pagination.pageSize,
			  false,
			  setLoading,
			  pagination.search,
			  true
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
	let options = []
	if (applyRuleTo == 3){
		options = allProducts?.map((item) => ({
			key: item.source_product_id.toString(), value: item.name 
		}))
	} 

	const filterOptionsBrands = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedBrands.includes(option.key)
		);
	};

	const filterOptionsProducts = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedProducts.includes(option.key)
		);
	};

	const filterServices = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedServices.includes(option.key)
		);
	};

	const handleChangeServices = (selectedValues) => {
		setSelectedServices(selectedValues);
	};
  
	const filterOptionsCategories = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedCategories.includes(option.key)
		);
	};

	const handleChangeBrands = (selectedValues) => {
		setSelectedBrands(selectedValues);
	};

	const handleChangeProducts = (selectedValues) => {
		setSelectedProducts(selectedValues);
	};

	const handleChangeCategories = (selectedValues) => {
		setSelectedCategories(selectedValues);
	};

	const handleChangeProvinces = (selectedValues) => {
		setSelectedProvinces(selectedValues);
	};

	const handleProviderServices = (slug) => {
		installedCarriers?.map(carrier =>
			carrier?.slug == slug ? [setCarrierId(carrier?.id), setIsLTL(carrier?.carrier_type), setCarrierSlug(slug)] : null
		)
		dispatch(getCarrServices(carrierId, token, isLTL, carrierSlug))
	};
	// Filter out options with false values
	const optionKeys = carrierServices?.map((item) => ({
		key: item.key, value: item.value 
	}))

	const handleChangeWarehouses = (selectedValues) => {
		setSelectedWarehouses(selectedValues);
	};

	const handleSelectChange = (selectedValues) => {
		setSelectedPostalCodes(selectedValues);
	};
	  
	const showMoreItems = key => {
		setRecordId(key)
	}

	const statesProvince = statesProvinces?.map((item) => ({
		key: item.code, value: item.name 
	}))

	const filterOptionsProvinces = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedProvinces.includes(option.key)
		);
	};

	const filterOptionsWarehouses = (input, option) => {
		return (
		  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
		  !selectedWarehouses.includes(option.key)
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
		setCountryCode(text?.filter_country)
		handleProviderServices(text?.filter_provider)
		if(text?.filter_country == undefined || text?.filter_country == ''){
			setCountryCode('US')
			text.filter_country = 'US'
			text.filter_state_province = []
			text.filter_postal_code = []
		}
		setAvailable(text?.available)
		setRuleType(text?.rule_type)
		if(text?.apply_rule_to == 1) {
			text.filter_categories = text?.categories 
		} else if(text?.apply_rule_to == 2){
			text.filter_brands = text?.brands
		} else if(text?.apply_rule_to == 3) {
			text.filter_products = text?.products
		}
		setIsFilterWeight(text?.isFilterWeight)
		setIsFilterPrice(text?.isFilterPrice)
		setIsFilterQuantity(text?.isFilterQuantity)
		setApplyRuleTo(text?.apply_rule_to)	

		editLocation(text)
	}

	const onFinish = useCallback(
		values => {
			values = {...values, apply_to : applyTo, available: available }
			if(values['rule_type'] == 2 || values['rule_type'] == 6){
				values = {...values, isFilterWeight: isFilterWeight, isFilterPrice: isFilterPrice, isFilterQuantity: isFilterQuantity }
			}
			
			let error = false,
				errormsg = '',
				data = {}

			if (modal.open && modal.type === 'edit') {
				data = shippingRules?.find(sg => sg.uuid === shippingRuleId) ?? {}
			}

			if (values['isFilterWeight'] && parseFloat(values['weight_to']) <= parseFloat(values['weight_from'])){
				error = true;
				errormsg = 'From weight cannot be greater than or equal to To weight.'
			} else if(values['isFilterPrice'] && parseFloat(values['price_to']) <= parseFloat(values['price_from'])){
				error = true;
				errormsg = 'From Price cannot be greater than or equal to To Price.'
			} else if(values['isFilterQuantity'] && parseFloat(values['quantity_to']) <= parseFloat(values['quantity_from'])){
				error = true;
				errormsg = 'From Quantity cannot be greater than or equal to To Quantity.'
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
				setSelectedCategories([])
				setSelectedProducts([])
				setSelectedBrands([])
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
		},
		{
			key: 'rule_type',
			title: 'Type',
			dataIndex: 'rule_type',
			render: (rule_type) => (
				<Space size="small">
				  {shippingRuleTypes[rule_type]}
				</Space>
			  ),
		},
		{
			key: 'filter_name',
			title: 'Filters',
			dataIndex: 'filter_name',
			render: (filter_name, record) => (
				<>
				  { record?.rule_type == 2 ? installedCarriers?.map(carrier =>
					carrier.slug == filter_name && (
						carrier.carrier_type == 1 ? carrier.name + ' (LTL Freight Providers)' : carrier.carrier_type == 2 ? carrier.name + ' (Parcel & Postal Providers)' : null
					)) : record?.rule_type == 3 ? <>
					{record.id == recordId ?  (
					  <>
						{record?.filter_state_province?.map((key) => {
						return (
						  <>
							<span> {key} </span>
							<br/>
						  </>
						)})}
					  </>
					): (
					  <>
						{record?.filter_state_province?.map((key, item) => {
						if(item < 5){
						  return (
						  <>
							<span> {key} </span>
							<br/>
						  </>
						)}})}
						{record?.filter_state_province?.length > 5 ? <a className="btn mt-2" onClick={() => showMoreItems(record.id)}>show more</a> : null}
					  </>
					)}
				  </> : record?.rule_type == 4 ? <>
					{record.id == recordId ?  (
					  <>
						{record?.filter_postal_code?.map((key) => {
						return (
						  <>
							<span> {key} </span>
							<br/>
						  </>
						)})}
					  </>
					): (
					  <>
						{record?.filter_postal_code?.map((key, item) => {
						if(item < 5){
						  return (
						  <>
							<span> {key} </span>
							<br/>
						  </>
						)}})}
						{record?.filter_postal_code?.length > 5 ? <a className="btn mt-2" onClick={() => showMoreItems(record.id)}>show more</a> : null}
					  </>
					)}
				  </> : record?.rule_type == 5 ? <>
					{record.id == recordId ?  (
					  <>
						{record?.warehouses?.map((key) => {
						return (
						  <>
							<span> 
								{warehouse ? warehouse?.map(value => (
										value?.zip_code == key && (
											`${value?.city + ','} ${value?.state} ${value?.zip_code}`
										)
									))
								: null} 
							</span>
							<br/>
						  </>
						)})}
					  </>
					): (
					  <>
						{record?.warehouses?.map((key, item) => {
						if(item < 5){
						  return (
							<>
							<span> 
								{warehouse ? warehouse?.map(value => (
										value?.zip_code == key && (
											`${value?.city + ','} ${value?.state} ${value?.zip_code}`
										)
									))
								: null} 
							</span>
							<br/>
						  </>
						)}})}
						{record?.warehouses?.length > 5 ? <a className="btn mt-2" onClick={() => showMoreItems(record.id)}>show more</a> : null}
					  </>
					)}
				  </> : record?.rule_type == 6 ? <>
					{record.id == recordId ?  (
					  <>
						{record?.filter_services?.map((key) => {
							return (
						  	<>
								<span> {key} </span>
								<br/>
						  	</>
						)})}
					  </>
					): (
					  <>
						{record?.filter_services?.map((key, item) => {
						if(item < 5){
							return (
						  	<>
								<span> {key} </span>
								<br/>
						  	</>
						)}})}
						{record?.filter_services?.length > 5 ? <a className="btn mt-2" onClick={() => showMoreItems(record.id)}>show more</a> : null}
					  </>
					)}
					</> : filter_name}
				</>
			)
		},
		{
			key: 'available',
			title: 'Available',
			dataIndex: 'available',
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
									setCountryCode('US')
									setIsFilterWeight(false)
									setIsFilterPrice(false)
									setIsFilterQuantity(false)
									setCarrierSlug()
									setCarrierId()
									setSelectedBrands([])
									setSelectedProducts([])
									setSelectedCategories([])
									hanldeModalToggling(true, 'add')
									setApplyRuleTo(1)
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
						{alertMessageType === 'loading' || !(storeBrands && storeCategories && allProducts)
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
					dispatch({
						type: 'GET_CARRIER_SERVICES',
						payload: [],
					})
				}}
				destroyOnClose={true}
				footer={null}
				width={800}>
				{alertMessageType === 'loading' || !(storeBrands && storeCategories && allProducts) ? (
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
										<Option value={'4'}>Restrict By Postal Codes</Option>
										<Option value={'5'}>Restrict To Origin Locations</Option>
										<Option value={'2'}>Hide Methods</Option>
										<Option value={'6'}>Override Rates</Option>
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
						{(ruleType == 1 || ruleType == 3 || ruleType == 4 || ruleType == 5) && (
							<>
							{(ruleType != 5) && (ruleType != 6) && (
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
												required: false,
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
							)}
							{(ruleType == 3 || ruleType == 4)  && (
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
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder="Select States/Provinces"
        									value={selectedProvinces}
											allowClear
        									onChange={handleChangeProvinces}
        									filterOption={filterOptionsProvinces}
      									>
        									{statesProvince?.map((option) => (
          										<Option key={option.key} value={option.value}>
	            									{option.value}
    	      									</Option>
        									))}
      									</Select>
									</Form.Item>
								</Col>
							</Row>
							)}
							{(ruleType == 4) && (
							<Row gutter={30}>
								<Col
									className='gutter-row'
									xs={24}
									sm={24}
									md={24}
									lg={24}
									xl={24}>
									<Form.Item
										className={'mb-0'}
                        				label="Postal Codes"
				                        name="filter_postal_code"
                				        rules={[
				                        	{
                				            	required: true,
				                            	message: "Enter Postal Codes",
                				          	},
                        				]}
                      				>
										<Select
      										mode="tags"
      										style={{ width: '100%' }}
      										placeholder="Postal Codes"
      										value={selectedPostalCodes}
      										onChange={handleSelectChange}
      										dropdownStyle={{ display: 'none' }}
	  										onInput={e =>
												(e.target.value = (
		  										"" + e.target.value
												).toUpperCase())
											} 
    										>
      										{selectedPostalCodes.map((item) => (
        										<Option key={item} value={item}>
          										{item}
        										</Option>
      										))}
    									</Select>
                      				</Form.Item>
									<div className={'text-gray mb-1'} >
										Postal codes can be entered with exact values (e.g., 90210), 
										containing wildcards (e.g., 902*), or as fully numeric ranges (e.g., 90210...99000).
										Use enter to add the next value.
									</div>
								</Col>
							</Row>	
							)}
							{(ruleType == 5) && (
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
										label='Warehouses'
										name='warehouses'
										rules={[
											{
												required: true,
												message: 'Select Warehouses',
											},
										]}>
										<Select
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder="Select Warehouses"
        									value={selectedWarehouses}
											allowClear
        									onChange={handleChangeWarehouses}
        									filterOption={filterOptionsWarehouses}
      									>
        									
									{warehouse
										? warehouse?.map(value => (
												<Option
													value={value?.zip_code}
													key={value?.zip_code}>{`${
													value?.city + ','
												} ${value?.state} ${
													value?.zip_code
												}`}</Option>
										  ))
										: null}
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
										label='Apply rule to'
										name='apply_rule_to'
										rules={[
											{
												required: false,
												message: 'Apply rule to',
											},
										]}>
										<Select 
											placeholder='Apply rule to'
											onChange={value =>
												setApplyRuleTo(value)
											}
										>
											<Option value={1}>Categories</Option>
											<Option value={2}>Brands</Option>
											<Option value={3}>Individual Products</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							{applyRuleTo == 1 ? (
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
										label={'Apply the rule to these categories'}
										name='filter_categories'
										rules={[
											{
												required: true,
												message: "Select Categories",
											},
										]}>
										<Select
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder={"Select Categories"}
        									value={selectedCategories}
											allowClear
        									onChange={handleChangeCategories}
        									filterOption={filterOptionsCategories}
      									>
        									{storeCategories?.map((option) => (
          										<Option key={option.key} value={option.key}>
	            									{option.value}
    	      									</Option>
        									))}
      									</Select>
									</Form.Item>
								</Col>
							</Row>
							) : applyRuleTo == 2 ? (
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
										label={'Apply the rule to these brands'}
										name='filter_brands'
										rules={[
											{
												required: true,
												message: "Select Brands",
											},
										]}>
										<Select
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder={"Select Brands"}
        									value={selectedBrands}
											allowClear
        									onChange={handleChangeBrands}
        									filterOption={filterOptionsBrands}
      									>
        									{storeBrands?.map((option) => (
          										<Option key={option.key} value={option.key}>
	            									{option.value}
    	      									</Option>
        									))}
      									</Select>
									</Form.Item>
								</Col>
							</Row>
							) : applyRuleTo == 3 ? (
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
										label={'Apply the rule to these products'}
										name='filter_products'
										rules={[
											{
												required: true,
												message: "Select Products",
											},
										]}>
										<Select
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder={"Select Products"}
        									value={selectedProducts}
											allowClear
        									onChange={handleChangeProducts}
        									filterOption={filterOptionsProducts}
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
							) : null}
							</>
						)}

						{(ruleType == 2 || ruleType == 6) && (
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
										<Select 
											placeholder='Select Provider'  
											value={this?.filter_provider || undefined}
											onChange={handleProviderServices}
										>
											{installedCarriers?.map(carrier =>
												<Option value={carrier?.slug}>
													{carrier.carrier_type == 1 ? carrier.name + ' (LTL Freight Providers)' : carrier.carrier_type == 2 ? carrier.name + ' (Parcel & Postal Providers)' : null}
												</Option>
											)}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							{(ruleType == 6) && (
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
										label='Services'
										name='filter_services'
										rules={[
											{
												required: true,
												message: 'Select Services',
											},
										]}>
										<Select
        									mode="multiple"
        									style={{ width: '100%' }}
        									placeholder="Select Services"
        									value={selectedServices}
        									onChange={handleChangeServices}
        									filterOption={filterServices}
											allowClear
      									>
											{optionKeys?.map((option) => (
          										<option key={option?.value} value={option?.value}>
            										{option?.value}
          										</option>
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
										label='Rates(e.g. 5.25)'
										name='service_rates'
										rules={[
											{
												required: true,
												message: 'Enter Rates',
											},
											{
												pattern: /^\d*\.?\d{0,2}$/,
												message: "Only two decimal places are allowed",
											},
										]}>
										<Input type='number' onKeyDown={blockInvalidChar} min="0.01" step="0.01" placeholder='Enter Rates' />
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
                  						Filter by weight (lbs)
                					</Checkbox>
									<Tooltip title='Weight is the total weight of cart items.'>
										<a href='#!'>
											[ i ]
										</a>
									</Tooltip>
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
									<Tooltip title='Price is the total price of cart items.'>
										<a href='#!'>
											[ i ]
										</a>
									</Tooltip>
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
									<Tooltip title='Quantity is the total quantity of cart items.'>
										<a href='#!'>
											[ i ]
										</a>
									</Tooltip>
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
										<Input type='number' onKeyDown={handleNumbersOnly} min="1" step="1" placeholder='Enter quantity from' />
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
										<Input type='number' onKeyDown={handleNumbersOnly} min="1" step="1" placeholder='Enter quantity to' />
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
