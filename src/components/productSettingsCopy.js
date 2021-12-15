import React, { Fragment, useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
	submitProductSettings,
	importProducts,
	getAllProducts,
	getProduct,
} from '../Actions/ProductSettings';
import {
	Table,
	Button,
	Space,
	Form,
	// Input,
	Modal,
	Drawer,
	Col,
	Row,
	Select,
	Checkbox,
	Skeleton,
	Input
} from 'antd';
import addKeysToList from '../Utilities/addKey';
import Settings from './Products/Settings';

const { Option } = Select;

function ProductSettingsComponent(props) {
	const [loading, setLoading] = useState(true);
	const [loadProduct, setLoadProduct] = useState(false);
	const [syncModel, setSyncModel] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');
	const [state, setState] = useState({
		filteredInfo: null,
		sortedInfo: null,
		selectedRowKeys: [],
		showDropship: false,
		visible: false,
	});
	const [selectedProductDetail, setselectedProductDetail] = useState({
		freight_enabled: false,
		parcel_enabled: false,
		freight_class: '',
		hazardous_enabled: false,
		insurance: false,
		dropship_enabled: false,
	});
	
	const [formError, setFormError] = useState('');
	const dispatch = useDispatch();
	const {productsPagination, productDetail} = useSelector(state => state);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize:50,
		total:productsPagination?.total,
		search: null,
	});
	useEffect(() => {
		if (props.allProducts === null) {
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, pagination.search))
		}
		if (props.allProducts !== null && props.allProducts !== undefined) {
			setLoading(false);
			setPagination({
				...pagination,
				total: productsPagination?.total
			})
		}
		console.log(props.productDetail);
	}, [productsPagination, productDetail]);

	const showProductDetails = (id, product) => {
		dispatch(getProduct(id, setselectedProductDetail, setLoadProduct, props.token));
		
		setLoadProduct(true);
		setState({
			...state,
			visible: true,
		});

		setselectedProductDetail({
			...selectedProductDetail,
			...product,
			weight: Number(product.weight).toFixed(2),
			height: Number(product.height).toFixed(2),
			width: Number(product.width).toFixed(2),
			length: Number(product.length).toFixed(2),
			...JSON.parse(product?.settings),
			product_id: id,
		});

		setTimeout(() => {
			setLoadProduct(false);
		}, 1000);
	};

	const onClose = () => {
		setState({
			...state,
			visible: false,
		});
	};

	const saveSettings = () => {
		const weight = selectedProductDetail['weight'],
			length = selectedProductDetail['length'],
			width = selectedProductDetail['width'],
			height = selectedProductDetail['height'];

		if (!weight || weight === '0' || +weight < 0) {
			setFormError('Weight is required and must be greater than 0.');
			setTimeout(() => setFormError(''), 4000);
			return;
		}/*  else if (
			!selectedProductDetail['freight_class'] &&
			(!length || !width || !height)
		) {
			setFormError('Please specify freight_class or provide dimensions instead.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else if (+length < 0 || +width < 0 || +height < 0) {
			setFormError('Length/Width/Height must be greater then or equal to 0.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else if (
			selectedProductDetail.dropship_enabled &&
			!selectedProductDetail.dropship_location
		) {
			setFormError('Please select dropship location.');
			setTimeout(() => setFormError(''), 4000);
		} else {
			delete selectedProductDetail['settings'];
			props.submitProductSettings(selectedProductDetail, props.token);
			setFormError('');
		} */

		/* if (!selectedProductDetail['freight_class']) {
			setFormError('Please specify Freight Class.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else */ if (+weight < 0) {
			setFormError('Weight is required and must be greater than 0.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else if (
			selectedProductDetail.dropship_enabled &&
			!selectedProductDetail.dropship_location
		) {
			setFormError('Please select dropship location.');
			setTimeout(() => setFormError(''), 4000);
		} else if (+length < 0 || +width < 0 || +height < 0) {
			setFormError('Length/Width/Height must be greater then or equal to 0.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else {
			delete selectedProductDetail['settings'];
			props.submitProductSettings(selectedProductDetail, props.token, setState);
			setFormError('');
		}
	};

	const syncProducts = () => {
		console.log(emailAddress)
		//props.importProducts(props.token);
		

		if(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(emailAddress)){
            dispatch(importProducts(emailAddress, props.token));
            setSyncModel(false)
        }else{
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: false,
                },
            });
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: true,
                    alertMessage: 'Enter valid email address',
                    alertMessageType: 'error',
                },
            });
        }
	};

	const openConfirmModel = () => {
		setSyncModel(true)
	}

	const handleChange = (pagination, filters, sorter) => {
		setPagination({
			...pagination,
			current: pagination.current,
			pageSize: pagination.pageSize
		})
		setLoading(true);
		dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, pagination.search))
		setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		});
	};
	

	/* const clearFilters = () => {
		setState({ ...state, filteredInfo: null });
	};

	const clearAll = () => {
		setState({
			...state,
			filteredInfo: null,
			sortedInfo: null,
		});
	};

	const setSkuSort = () => {
		setState({
			...state,
			sortedInfo: {
				order: state?.sortedInfo.order === 'descend' ? 'ascend' : 'descend',
				columnKey: 'sku',
			},
		});
	}; */

	const onSelectChange = selectedRowKeys => {
		setState({ ...state, selectedRowKeys });
	};

	const { selectedRowKeys } = state;
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const productSearch = () => {
		let search = pagination.search;
		if(search.length >= 2){
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, search))
			setLoading(true)
		}else if( search.length == 0){
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize))
			setLoading(true)
		}
	}
	const resetSearch = (search) => {
		setPagination({
			...pagination,
			search: search
		})
		if(search.length == 0){
			setLoading(true)
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize))
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			productSearch()
		}
	}

	let { sortedInfo /* filteredInfo */ } = state;
	sortedInfo = sortedInfo || {};
	// filteredInfo = filteredInfo || {};

	const columns = [
		/*{
			title: 'Image',
			dataIndex: 'image_src',
			key: 'image',
			render: (id, record) => (
				<img
					src={record?.image_src || 'images/product-image-dummy.jpg'}
					alt={record.name}
					style={{ width: '50px' }}
				/>
			),
		},*/
		{
			title: 'Product Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.length - b.name.length,
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
			ellipsis: true,
		},
		{
			title: 'Product SKU',
			dataIndex: 'sku',
			key: 'sku',
			sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,
		},
		
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			/*sorter: (a, b) => +a.price.substring(1) - +b.price.substring(1),
			sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
			ellipsis: true,*/
		},
		{
			title: 'Action',
			dataIndex: 'source_product_id',
			key: 'source_product_id',
			render: (source_product_id, record) => (
				<Space size='middle'>
					<Button onClick={() => showProductDetails(source_product_id, record)}>Edit</Button>
				</Space>
			),
		},
	];

	//This is for filter form
	/* const onFinish = values => {
		console.log('Received values of form: ', values);
	}; */

	if (loading /* && (props.allProducts === undefined || props.allProducts === null)*/) {
		return <Skeleton active />;
	}

	return (
		<Fragment>
			{/* <Space className={'mb-2'}>
				<Button onClick={setSkuSort}>Sort Product SKU</Button>
				<Button onClick={clearFilters}>Clear filters</Button>
				<Button onClick={clearAll}>Clear filters and sorters</Button>
				<Select defaultValue='Category' style={{ width: 120 }} onChange={handleChange}>
					<Option value='category_1'>category 1</Option>
					<Option value='category_2'>category 2</Option>
					<Option value='category_3'>category 3</Option>
				</Select>
				<Form
					name='customized_form_controls'
					layout='inline'
					onFinish={onFinish}
					initialValues={{
						price: {
							number: 0,
							currency: 'rmb',
						},
					}}
				>
					<Form.Item>
						<Input placeholder={'Search'} type='text' />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Search
						</Button>
					</Form.Item>
				</Form>
			</Space> */}
			<Modal
				title='Confirm Synchronization'
				visible={syncModel}
				onOk={syncProducts}
				onCancel={() => setSyncModel(false)}
				okText='Confirm'
				cancelButtonProps={{ style: { display: 'none' } }}
			>
				<p>Are you sure you want to synchronize all products? This will download all products from your BigCommerce store, might take long time.</p>
				<p>Enter the email address to which you want the product synchronize status sent.</p>
                <Row gutter={24}>
                    <Col span={8} required>Email Address</Col>
                    <Col span={16}><Input required value={emailAddress} required name="emailAddress" onChange={e => setEmailAddress(e.target.value)}
                    /></Col>
                </Row>
			</Modal>
			

			<Row gutter={24} className='mb-3'>
				<Col span={8}>
					<Input
						placeholder='Search by product name'
						className='col-8'
						onKeyDown={handleKeyDown}
						value={pagination.search}
						onChange={e => 
							resetSearch( e.target.value)
							/*dispatch({
								type: 'FILTER_PRODUCTS',
								payload: e.target.value,
							})*/
						}
						size='medium'
					/>
				</Col>
				<Col span={10} style={{paddingLeft:"0px"}}>
					<Button 
					onClick={productSearch} 
					type='primary'
					size='medium'
					>
						Search
					</Button>
				</Col>
				<Col span={6} >
					<Button
						onClick={openConfirmModel}
						type='primary'
						size='medium'
						style={{ width: '100%' }}
					>
						Sync Products
					</Button>
				</Col>
			</Row>
			<Table
				className='custom-table'
				//rowSelection={rowSelection}
				columns={columns}
				dataSource={addKeysToList(props.filteredProducts ?? props.allProducts)}
				onChange={handleChange}
				//{console.log()}
				pagination={pagination}
      			//onChange={handleTableChange}
			/>

			{/* ================ */}
			<Drawer
				title={`Product Settings ${
					!loadProduct ? ' (' + selectedProductDetail?.name + ')' : ''
				}`}
				width={720}
				onClose={onClose}
				visible={state.visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right',
						}}
					>
						<Button onClick={saveSettings} type='primary'>
							Save
						</Button>
					</div>
				}
			>
				{loadProduct ? (
					<Skeleton active />
				) : (
					<Form layout='vertical' initialValues={selectedProductDetail}>
						<Row gutter={16}>
							{formError.length ? (
								<Col span={24}>
									<Form.Item className='text-danger'>* {formError}</Form.Item>
								</Col>
							) : null}
						</Row>
						
						<Settings product={productDetail} />
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='freight_enabled'>
									<Checkbox
										name='freight_enabled'
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												freight_enabled: !selectedProductDetail.freight_enabled,
												parcel_enabled: false,
											})
										}
										checked={selectedProductDetail.freight_enabled}
									>
										Quote as LTL shipment
									</Checkbox>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='parcel_enabled'>
									<Checkbox
										name='parcel_enabled'
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												parcel_enabled: !selectedProductDetail.parcel_enabled,
												freight_enabled: false,
											})
										}
										checked={selectedProductDetail.parcel_enabled}
									>
										Quote as parcel shipment
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='freight_class'
									label='Freight Class'
									rules={[{ required: false, message: 'Please select an owner' }]}
								>
									<Select
										placeholder='Freight Class'
										onChange={val =>
											setselectedProductDetail({
												...selectedProductDetail,
												freight_class: val,
											})
										}
									>
										<Option value=''>No Freight Class</Option>
										<Option value='50'>50</Option>
										<Option value='55'>55</Option>
										<Option value='60'>60</Option>
										<Option value='65'>65</Option>
										<Option value='70'>70</Option>
										<Option value='77.5'>77.5</Option>
										<Option value='85'>85</Option>
										<Option value='92.5'>92.5</Option>
										<Option value='100'>100</Option>
										<Option value='110'>110</Option>
										<Option value='125'>125</Option>
										<Option value='150'>150</Option>
										<Option value='175'>175</Option>
										<Option value='200'>200</Option>
										<Option value='225'>225</Option>
										<Option value='250'>250</Option>
										<Option value='300'>300</Option>
										<Option value='400'>400</Option>
										<Option value='500'>500</Option>
										<Option value='density_based'>Density Based</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='weight'
									label='Weight (lbs)'
									rules={[{ required: true, message: 'Weight is required' }]}
									
								>
									<Input
										placeholder='Weight (lbs)'
										type='number'
										value={selectedProductDetail.weight}
										
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												weight: e.target.value,
											})
										}
										min='1'
										pattern='^[1-9]'
										step='0.01'
										stringMode
										
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item name='length' label='Length (inches)'>
									<Input
										type='number'
										placeholder='Length (inches)'
										value={selectedProductDetail.length}
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												length: e.target.value,
											})
										}
										min='0'
										pattern='^[1-9]'
										step='0.01'
										stringMode
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name='width' label='Width (inches)'>
									<Input
										type='number'
										placeholder='Width (inches)'
										value={selectedProductDetail.width}
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												width: e.target.value,
											})
										}
										min='0'
										pattern='^[1-9]'
										step='0.01'
										stringMode
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name='height' label='Height (inches)'>
									<Input
										type='number'
										placeholder='Height (inches)'
										value={selectedProductDetail.height}
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												height: e.target.value,
											})
										}
										min='0'
										pattern='^[1-9.0-9]'
										step='0.01'
										stringMode
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Checkbox
									onChange={() => {
										setState({
											...state,
											showDropship: !state.showDropship,
										});

										setselectedProductDetail({
											...selectedProductDetail,
											dropship_enabled: !selectedProductDetail.dropship_enabled,
										});
									}}
									name='dropship_enabled'
									checked={selectedProductDetail.dropship_enabled}
								>
									Dropship this product
								</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox
									onChange={e =>
										setselectedProductDetail({
											...selectedProductDetail,
											hazardous_enabled: !selectedProductDetail.hazardous_enabled,
										})
									}
									name='hazardous_enabled'
									checked={selectedProductDetail.hazardous_enabled}
								>
									Hazardous Material
								</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox
									onChange={e =>
										setselectedProductDetail({
											...selectedProductDetail,
											insurance: !selectedProductDetail.insurance,
										})
									}
									name='insurance'
									checked={selectedProductDetail.insurance}
								>
									Insurance
								</Checkbox>
							</Col>
						</Row>
						
						{selectedProductDetail.dropship_enabled ? (
							<Row gutter={16}>
								<Col span={24}>
									<Form.Item name='dropship_location' label='Dropship Location'>
										<Select
											placeholder='Dropship Location'
											size={'large'}
											style={{ width: '100%' }}
											name='dropship_location'
											defaultValue={selectedProductDetail.dropship_location}
											onChange={location => {
												setselectedProductDetail({
													...selectedProductDetail,
													dropship_location: location,
												});
											}}
										>
											{props.dropships
												? props.dropships.map(value => (
														<Option
															value={value.id}
															key={value.id}
														>{`${value.city} ${value.state} ${value.zip_code}`}</Option>
												  ))
												: null}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						) : null}
						
					</Form>
				)}
			</Drawer>
			{/* ================ */}
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		allProducts: state.allProducts,
		token: state.token,
		dropships: state.dropships,
		filteredProducts: state.filteredProducts,
		productDetail:state.productDetail
	};
};

const mapDispatchToProps = dispatch => {
	return {
		//importProducts: token => dispatch(importProducts(token)),
		submitProductSettings: (data, token, visibility) =>
			dispatch(submitProductSettings(data, token, visibility)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSettingsComponent);
