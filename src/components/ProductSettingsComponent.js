import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
	submitProductSettings,
	importProducts,
	getAllProducts,
	getProduct,
} from '../Actions/ProductSettings'
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
	Skeleton,
	Input,
} from 'antd'
import addKeysToList from '../Utilities/addKey'
import Settings from './Products/Settings'
import { isFireFox } from '../Utilities/browserName';

function ProductSettingsComponent(props) {
	const [loading, setLoading] = useState(true)
	const [loadProduct, setLoadProduct] = useState(false)
	const [syncModel, setSyncModel] = useState(false)
	const [lastPageNo, setLastPageNo] = useState(1);
	const [countSorting, setCountSorting] = useState(0);
	const [emailAddress, setEmailAddress] = useState(props?.store?.admin_email || '')
	const [state, setState] = useState({
		filteredInfo: null,
		sortedInfo: null,
		selectedRowKeys: [],
		showDropship: false,
		visible: false,
	})
	const [selectedProductDetail, setselectedProductDetail] = useState({
		freight_enabled: false,
		parcel_enabled: false,
		freight_class: '',
		hazardous_enabled: false,
		insurance: false,
		dropship_enabled: false,
		allow_vertical: false,
		ship_own_package: false,
		ship_multiple_package: false,
	})
	const [productVariants, setProductVariants] = useState([])
	const [sortProd, setSortProd] = useState(false);
	const [formError, setFormError] = useState('')
	const dispatch = useDispatch()
	const { productsPagination } = useSelector(state => state)
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 50,
		total: productsPagination?.total,
		search: null,
	})
	const addonCheck = props.installedAddons.find(
		add => add.short_code === 'SBS'
	);
	//const searched = dispatch(props.searhed_product)

	useEffect(() => {
		if (props.allProducts === null) {
			dispatch(
				getAllProducts(
					props.token,
					pagination.current,
					pagination.pageSize,
					false,
					setLoading,
					pagination.search
				)
			)
		}
		if (props.allProducts !== null && props.allProducts !== undefined) {
			setLoading(false)
			setPagination({
				...pagination,
				total: productsPagination?.total,
			})
		}
		if (props.productDetail) {
			const variants = props.productDetail.map(variant =>{
				let settings = variant.settings !== '' ? JSON.parse(variant.settings) : {};
				return {
					...variant,
					...settings
				}
			})
			setProductVariants(variants)
		}
		if(countSorting>0){
			setLoading(true)
			setCountSorting(0)
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, sortProd, setLoading, pagination.search))
		}
	}, [productsPagination, props.productDetail, sortProd])

	const showProductDetails = (id, product) => {
		setState({
			...state,
			visible: true,
		})
		dispatch(getProduct(id, setselectedProductDetail, setLoadProduct, props.token))
		setLoadProduct(true)

		/*setselectedProductDetail({
			...selectedProductDetail,
			...product,
			weight: Number(product.weight).toFixed(2),
			height: Number(product.height).toFixed(2),
			width: Number(product.width).toFixed(2),
			length: Number(product.length).toFixed(2),
			...JSON.parse(product?.settings),
			product_id: id,
		});*/

		setTimeout(() => {
			setLoadProduct(false)
		}, 1000)
	}

	const onClose = () => {
		setState({
			...state,
			visible: false,
		})
	}

	const saveSettings = () => {
		const weight = selectedProductDetail['weight'],
			length = selectedProductDetail['length'],
			width = selectedProductDetail['width'],
			height = selectedProductDetail['height']

		if (!weight || weight === '0' || +weight < 0) {
			setFormError('Weight is required and must be greater than 0.')
			setTimeout(() => setFormError(''), 4000)
			return
		} /*  else if (
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
			setFormError('Weight is required and must be greater than 0.')
			setTimeout(() => setFormError(''), 4000)
			return
		} else if (
			selectedProductDetail.dropship_enabled &&
			!selectedProductDetail.dropship_location
		) {
			setFormError('Please select dropship location.')
			setTimeout(() => setFormError(''), 4000)
		} else if (+length < 0 || +width < 0 || +height < 0) {
			setFormError('Length/Width/Height must be greater than or equal to 0.')
			setTimeout(() => setFormError(''), 4000)
			return
		} else {
			delete selectedProductDetail['settings']
			props.submitProductSettings(selectedProductDetail, props.token, setState)
			setFormError('')
		}
	}

	const syncProducts = () => {
		if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(emailAddress)) {
			dispatch(importProducts(emailAddress, props.token))
			setSyncModel(false)
		} else {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: 'Enter valid email address',
					alertMessageType: 'error',
				},
			})
		}
	}

	const openConfirmModel = () => {
		setSyncModel(true)
	}

	const handleChange = (pagination, filters, sorter) => {
		setLoading(true)
		setPagination({
			...pagination,
			current: pagination.current,
			pageSize: pagination.pageSize
		})
		let PaginationPerpage = (productsPagination?.perpage)*10/10;
		if(pagination?.pageSize !== PaginationPerpage){
			setLoading(true);
			dispatch(getAllProducts(props.token,pagination.current,pagination.pageSize,sortProd,setLoading,pagination.search))
			const meta = {
				...productsPagination,
				perpage : pagination?.pageSize
			}
			dispatch({
				type: 'PRODUCT_PAGINATION',
				payload: meta,
			});
		}else{
			if(pagination?.current !== lastPageNo){
				setLastPageNo(pagination?.current)
				dispatch(getAllProducts(props.token,pagination.current,pagination.pageSize,sortProd,setLoading,pagination.search))
			}else{
				setSortProd(!sortProd);
			}
		}
		
		/*dispatch(
			getAllProducts(
				props.token,
				pagination.current,
				pagination.pageSize,
				sortProd,
				setLoading,
				pagination.search,
			)
		)*/
		setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		})
	}

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
		setState({ ...state, selectedRowKeys })
	}

	const { selectedRowKeys } = state
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	}

	const productSearch = () => {
		let search = pagination.search;
		
		if (search && search.length >= 2) {
			setPagination({
				...pagination,
				current: 1,
			})
			dispatch(
				getAllProducts(props.token, 1, pagination.pageSize, sortProd, setLoading, search)
			)
			setLoading(true)
		} else if (search && search.length === 0) {
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, sortProd, setLoading, null))
			setLoading(true)
		}
	}
	const resetSearch = search => {
		setPagination({
			...pagination,
			search: search,
		})
		if (search.length === 0) {
			setLoading(true)
			dispatch(getAllProducts(props.token, pagination.current, pagination.pageSize, sortProd, setLoading))
		}
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			productSearch()
		}
	}

	const copyShippingMethod = useCallback(() => {
		const first_variant = productVariants[0]

		const variants_to_change_array = productVariants.slice(1).map(v => ({
			...v,
			freight_enabled: first_variant?.freight_enabled,
			parcel_enabled: first_variant?.parcel_enabled,
		}))
		setProductVariants([first_variant, ...variants_to_change_array])
	}, [productVariants])

	const copyShippingParams = useCallback(() => {
		const first_variant = productVariants[0]

		
		//let oneProduct = { ...settings, ...product }
		const {
			freight_class,
			weight,
			length,
			width,
			height,
			dropship_enabled,
			dropship_location,
			hazardous_enabled,
			//parcel_enabled,
			//freight_enabled,
			insurance,
			allow_vertical,
			ship_own_package,
			ship_multiple_package,
		} = first_variant

		const variants_to_change_array = productVariants.slice(1).map(v => ({
			...v,
			freight_class,
			weight,
			length,
			width,
			height,
			dropship_enabled,
			dropship_location,
			hazardous_enabled,
			//parcel_enabled,
			//freight_enabled,
			insurance,
			allow_vertical,
			ship_own_package,
			ship_multiple_package,
		}))
		setProductVariants([first_variant, ...variants_to_change_array])
	}, [productVariants])

	const onChangeVariant = useCallback((index, field, val) => {
		setProductVariants(productVariants => {
			const variants = [
				...productVariants.slice(0, index),
				{
					...productVariants[index],
					[field]: val,
				},
				...productVariants.slice(index + 1),
			]
			
			return variants
		})
	}, [])

	const validate = () =>{
		var error = false;
		var msg = "";
		productVariants.map(prd=>{
			if(prd.weight === null || prd.weight <= 0){
				error = true;
				msg = "Weight must be greater than 0.";
			}else if(prd.length === null || prd.length <= 0){
				error = true;
				msg = "Length must be greater than 0.";
			}
			else if(prd.width === null || prd.width <= 0){
				error = true;
				msg = "Width must be greater than 0.";
			}
			else if(prd.height === null || prd.height <= 0){
				error = true;
				msg = "Height must be greater than 0.";
			}
			else if( prd.dropship_enabled !== undefined && prd.dropship_enabled !== null && prd.dropship_enabled !== false){
				if(prd.dropship_location === undefined || prd.dropship_location === null){
					error = true;
					msg = "Dropship location is required";
				}
			}
			
		})
		if(!error){
			onSubmit()//props.submitProductSettings({ products: productVariants }, props.token, setState)
		}else{
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: msg,
					alertMessageType: 'error',
				},
			})
		}
	}
	const onSubmit = useCallback(async () => {
		props.submitProductSettings({ products: productVariants }, props.token, setState)
		
	}, [productVariants])

	let { sortedInfo } = state
	sortedInfo = sortedInfo || {}
	
	const sortProducts = (a,b) => {
		let lastProduct = props.allProducts[props.allProducts.length-1];
		let checkId = isFireFox() ? b?.id : a?.id;
		if(lastProduct?.id === checkId){
			setCountSorting(countSorting+1)
			setSortProd(!sortProd);
			//productSearch()
		}
	}
	const columns = [
		{
			title: 'Product Name',
			dataIndex: 'name',
			key: 'name',
			sorter: sortProducts,
			sortOrder: false,
			//filters:sortProducts,
			/*sorter: (a, b) => a.name.length - b.name.length,
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,*/
			ellipsis: true,
		},
		{
			title: 'Product Id',
			dataIndex: 'source_product_id',
			key: 'source_product_id',
			/*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
		},
		{
			title: 'Variant Id',
			dataIndex: 'variant_id',
			key: 'variant_id',
			/*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
		},
		{
			title: 'Product SKU',
			dataIndex: 'sku',
			key: 'sku',
			/*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
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
					<Button onClick={() => showProductDetails(source_product_id, record)}>
						Edit
					</Button>
				</Space>
			),
		},
	]

	//This is for filter form
	/* const onFinish = values => {
		console.log('Received values of form: ', values);
	}; */

	if (loading /* && (props.allProducts === undefined || props.allProducts === null)*/) {
		return <Skeleton active />
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
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>
					Are you sure you want to synchronize all products? This will
					download all products from your BigCommerce store, might take
					long time.
				</p>
				<p>
					Enter the email address to which you want the product synchronize
					status sent.
				</p>
				<Row gutter={24}>
					<Col span={8} required>
						Email Address
					</Col>
					<Col span={16}>
						<Input
							required
							value={emailAddress}
							name='emailAddress'
							onChange={e => setEmailAddress(e.target.value)}
						/>
					</Col>
				</Row>
			</Modal>

			<Row gutter={24} className='mb-3'>
				<Col span={8}>
					<Input
						placeholder='Search by product name'
						className='col-8'
						onKeyDown={handleKeyDown}
						//value={props.searched_product}

						defaultValue={props.searched_product}
						value={pagination.search ?? props.searched_product}
						onChange={e => resetSearch(e.target.value)}
						size='medium'
					/>
				</Col>
				<Col span={10} style={{ paddingLeft: '0px' }}>
					<Button onClick={productSearch} type='primary' size='medium'>
						Search
					</Button>
				</Col>
				<Col span={6}>
					<Button
						onClick={openConfirmModel}
						type='primary'
						size='medium'
						style={{ width: '100%' }}>
						Sync Products
					</Button>
				</Col>
			</Row>
			<Table
				className='custom-table'
				columns={columns}
				dataSource={addKeysToList(props.filteredProducts ?? props.allProducts)}
				onChange={handleChange}
				pagination={pagination}
				showSorterTooltip={{ title: '' }}
			/>
			<Drawer
				title={`Product Settings ${
					!loadProduct && productVariants.length > 0
						? ' (' + productVariants?.[0]?.name + ')'
						: ''
				}`}
				width={720}
				onClose={onClose}
				visible={state.visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right',
						}}>
						<Button onClick={validate} type='primary'>
							Save
						</Button>
					</div>
				}>
				{loadProduct ? (
					<Skeleton active />
				) : (
					<Form layout='vertical' initialValues={selectedProductDetail}>
						<Row gutter={16}>
							{formError.length ? (
								<Col span={24}>
									<Form.Item className='text-danger'>
										* {formError}
									</Form.Item>
								</Col>
							) : null}
						</Row>
						{productVariants.length > 0
							? productVariants.map((product, index) => {
									/*let settings =
											product.settings != '' ? JSON.parse(product.settings) : {},
										oneProduct = { ...settings, ...product }*/

									return (
										<Settings
											count={productVariants.length}
											key={index}
											index={index}
											copyShippingMethod={copyShippingMethod}
											copyShippingParams={copyShippingParams}
											onChangeVariant={onChangeVariant}
											product={product}
											addonCheck={addonCheck}
										/>
									)
							  })
							: null}
					</Form>
				)}
			</Drawer>
			{/* ================ */}
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		allProducts: state.allProducts,
		token: state.token,
		dropships: state.dropships,
		filteredProducts: state.filteredProducts,
		productDetail: state.productDetail,
		store:state.store,
		searched_product:state.searched_product,
		installedAddons: state.installedAddons,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitProductSettings: (data, token, visibility) =>
			dispatch(submitProductSettings(data, token, visibility)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSettingsComponent)
