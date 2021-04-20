import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	submitProductSettings,
	importProducts,
	getAllProducts,
} from '../Actions/ProductSettings';
import {
	Table,
	Button,
	Space,
	Form,
	// Input,
	Drawer,
	Col,
	Row,
	Select,
	Checkbox,
	Skeleton,
} from 'antd';
import addKeysToList from '../Utilities/addKey';

const { Option } = Select;

function ProductSettingsComponent(props) {
	const [loading, setLoading] = useState(true);
	const [loadProduct, setLoadProduct] = useState(false);
	const [state, setState] = useState({
		filteredInfo: null,
		sortedInfo: null,
		selectedRowKeys: [],
		showDropship: false,
		visible: false,
	});
	const [selectedProductDetail, setselectedProductDetail] = useState({});
	const [formError, setFormError] = useState('');

	useEffect(() => {
		if (props.allProducts === null) {
			props.getAllProducts(props.token);
		}

		if (props.allProducts !== null && props.allProducts !== undefined) {
			setLoading(false);
		}

		// eslint-disable-next-line
	}, []);

	const showProductDetails = (id, product) => {
		setLoadProduct(true);
		setState({
			...state,
			visible: true,
		});

		setselectedProductDetail({
			...product,
			...JSON.parse(product.settings),
			product_id: id,
		});

		setTimeout(() => {
			setLoadProduct(false);
		}, 2);
	};

	const onClose = () => {
		setState({
			...state,
			visible: false,
		});
	};

	const saveSettings = () => {
		/* const weight = selectedProductDetail['weight'],
			length = selectedProductDetail['length'],
			width = selectedProductDetail['width'],
			height = selectedProductDetail['height'];

		if (!weight || weight === '0' || +weight < 0) {
			setFormError('Weight is required and must be greater than 0.');
			setTimeout(() => setFormError(''), 4000);
			return;
		} else if (
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
		} else */ if (
			selectedProductDetail.dropship_enabled &&
			!selectedProductDetail.dropship_location
		) {
			setFormError('Please select dropship location.');
			setTimeout(() => setFormError(''), 4000);
		} else {
			delete selectedProductDetail['settings'];
			props.submitProductSettings(selectedProductDetail, props.token);
			setFormError('');
		}
	};

	const syncProducts = () => {
		props.importProducts(props.token);
	};

	const handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
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
				order: 'descend',
				columnKey: 'product_sku',
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

	let { sortedInfo /* filteredInfo */ } = state;
	sortedInfo = sortedInfo || {};
	// filteredInfo = filteredInfo || {};

	const columns = [
		{
			title: 'Image',
			dataIndex: 'image',
			key: 'image',
			sorter: (a, b) => a.image.length - b.image.length,
			sortOrder: sortedInfo.columnKey === 'image' && sortedInfo.order,
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
			title: 'Product Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.length - b.name.length,
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
			ellipsis: true,
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Action',
			dataIndex: 'id',
			key: 'id',
			render: (id, record) => (
				<Space size='middle'>
					<Button onClick={() => showProductDetails(id, record)}>Edit</Button>
				</Space>
			),
		},
	];

	//This is for filter form
	/* const onFinish = (values) => {
		console.log('Received values of form: ', values);
	}; */

	if (loading && (props.allProducts === undefined || props.allProducts === null)) {
		return <Skeleton active />;
	}

	return (
		<Fragment>
			{/* <Space className={'mb-2'}>
				<Button onClick={setSkuSort}>Sort Product SKU</Button>
				<Button onClick={clearFilters}>Clear filters</Button>
				<Button onClick={clearAll}>Clear filters and sorters</Button>
				<Select
					defaultValue='Category'
					style={{ width: 120 }}
					onChange={handleChange}
				>
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
			<Space className={'mb-2'} style={{ textAlign: 'right' }}>
				<Button onClick={syncProducts} type='primary'>
					Sync Products
				</Button>
			</Space>
			<Table
				className='custom-table'
				rowSelection={rowSelection}
				columns={columns}
				dataSource={addKeysToList(props.allProducts)}
				onChange={handleChange}
			/>

			{/* ================ */}
			<Drawer
				title='Product Settings'
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
					<Form layout='vertical' hideRequiredMark initialValues={selectedProductDetail}>
						<Row gutter={16}>
							{formError.length ? (
								<Col span={24}>
									<Form.Item className='text-danger'>* {formError}</Form.Item>
								</Col>
							) : null}
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='freight_enabled'>
									<Checkbox
										name='freight_enabled'
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												freight_enabled: !selectedProductDetail.freight_enabled,
											})
										}
										checked={selectedProductDetail.freight_enabled}
									>
										Quote as LTL shipment
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
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
							{/* <Col span={12}>
								<Form.Item
									name='weight'
									label='Weight (lbs)'
									rules={[{ required: true, message: 'Weight is required' }]}
								>
									<Input
										placeholder='Weight (lbs)'
										type='number'
										value={selectedProductDetail.weight}
										required
										onChange={e =>
											setselectedProductDetail({
												...selectedProductDetail,
												weight: e.target.value,
											})
										}
										min='1'
										pattern='^[1-9]'
										step='0.5'
									/>
								</Form.Item>
							</Col> */}
						</Row>
						{/* <Row gutter={16}>
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
										step='0.5'
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
										step='0.5'
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
										pattern='^[1-9]'
										step='0.5'
									/>
								</Form.Item>
							</Col>
						</Row> */}
						<Row gutter={16}>
							<Col span={12}>
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
						</Row>
						<Row gutter={16}>
							<Col span={12}>
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
						<Row gutter={16}>
							<Col span={12}>
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
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getAllProducts: token => dispatch(getAllProducts(token)),
		importProducts: token => dispatch(importProducts(token)),
		submitProductSettings: (data, token) => dispatch(submitProductSettings(data, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSettingsComponent);
