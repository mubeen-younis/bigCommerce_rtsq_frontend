import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllProducts } from '../Actions/Action';
import { submitProductSettings } from '../Actions/ProductSettings';
import {
	Table,
	Button,
	Space,
	Form,
	Input,
	Drawer,
	Col,
	Row,
	Select,
	Checkbox,
	Skeleton,
} from 'antd';
import axios from 'axios';

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
		products: [],
		productDetail: {},
		postData: [],
	});

	const [selectedProductDetail, setselectedProductDetail] = useState({});

	useEffect(() => {
		if (props.allProducts == null) {
			props.getAllProducts();
		}

		if (props.allProducts != null && props.allProducts !== undefined) {
			setLoading(false);
		}
	}, []);

	const showProductDetails = async (id, product) => {
		setLoadProduct(true);
		setState({
			...state,
			visible: true,
			// productDetail: JSON.parse(product.settings),
		});

		const config = {
			headers: {
				authorization: `Bearer eyJpdiI6Inl2aERGVi9td2dvTzlaRTl0aGFxelE9PSIsInZhbHVlIjoiMjJIZXF0ekdQUzB5d1M4ZXAyZTBYZz09IiwibWFjIjoi`,
			}, //Authorization: `Bearer ${token}`
			params: {
				product_id: id,
			},
		};

		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_product`, config)
			.then((res) => {
				console.log(res.data.data[0].settings);
				setselectedProductDetail(JSON.parse(res.data.data[0].settings));
				console.log(selectedProductDetail);
				setLoadProduct(false);
			});
	};

	const onClose = () => {
		setState({
			...state,
			visible: false,
		});
	};

	const saveSettings = () => {
		console.log(state.productDetail);
		props.submitProductSettings({}, props.token);
	};

	const onChange = (e) => {
		console.log(`checked = ${e.target.name}`);
		console.log(state.productDetail);
		setState({
			...state,
			//[e.target.name]:e.target.value
			//productDetail.insurance: !state.productDetail.insurance
			productDetail: {
				...state.productDetail,
				[e.target.name]: state.productDetail[e.target.value],
			},
		});
	};

	const handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
		setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		});
	};

	const clearFilters = () => {
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
	};

	const onSelectChange = (selectedRowKeys) => {
		setState({ ...state, selectedRowKeys });
	};

	const { selectedRowKeys } = state;
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	let { sortedInfo, filteredInfo } = state;
	sortedInfo = sortedInfo || {};
	filteredInfo = filteredInfo || {};
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
	const onFinish = (values) => {
		console.log('Received values of form: ', values);
	};

	if (
		loading &&
		(props.allProducts === undefined || props.allProducts === null)
	) {
		return (
			<>
				<Skeleton active />
			</>
		);
	}

	return (
		<Fragment>
			<Space className={'mb-2'}>
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
			</Space>
			<Table
				className='custom-table'
				rowSelection={rowSelection}
				columns={columns}
				dataSource={props.allProducts}
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
						<Button onClick={onClose} style={{ marginRight: 8 }}>
							Cancel
						</Button>
						<Button onClick={saveSettings} type='primary'>
							Save
						</Button>
					</div>
				}
			>
				{loadProduct ? (
					<Skeleton active />
				) : (
					<Form
						layout='vertical'
						hideRequiredMark
						initialValues={selectedProductDetail}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='freight_enabled'>
									<Checkbox
										name='freight_enabled'
										onChange={(e) =>
											setselectedProductDetail({
												...selectedProductDetail,
												freight_enabled: !selectedProductDetail.freight_enabled,
											})
										}
										checked={selectedProductDetail.freight_enabled}
									>
										Quote as an LTL shipment
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='freight_class'
									label='Freight Class'
									rules={[
										{ required: false, message: 'Please select an owner' },
									]}
								>
									<Select placeholder='Freight Class'>
										<Option value=''>No Freight Class</Option>
										<Option value='50'>50</Option>
										<Option value='55'>55</Option>
										<Option value='60'>60</Option>
										<Option value='65'>65</Option>
										<Option value='70'>70</Option>
										<Option value='85'>85</Option>
										<Option value='92.5'>92.5</Option>
										<Option value='100'>100</Option>
										<Option value='110'>110</Option>
										<Option value='125'>125</Option>
										<Option value='150'>150</Option>
										<Option value='175'>175</Option>
										<Option value='200'>200</Option>
										<Option value='225'>225</Option>
										<Option value='300'>300</Option>
										<Option value='400'>400</Option>
										<Option value='500'>500</Option>
										<Option value='density_based'>Density Based</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='weight' label='Weight (lbs)'>
									<Input
										placeholder='Weight (lbs)'
										value={selectedProductDetail.weight}
										onChange={(e) =>
											setselectedProductDetail({
												...selectedProductDetail,
												weight: e.target.value,
											})
										}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item name='length' label='Length (inches)'>
									<Input
										placeholder='Length (inches)'
										value={selectedProductDetail.length}
										onChange={(e) =>
											setselectedProductDetail({
												...selectedProductDetail,
												length: e.target.value,
											})
										}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name='width' label='Width (inches)'>
									<Input
										placeholder='Width (inches)'
										value={selectedProductDetail.width}
										onChange={(e) =>
											setselectedProductDetail({
												...selectedProductDetail,
												width: e.target.value,
											})
										}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name='height' label='Height (inches)'>
									<Input
										placeholder='Height (inches)'
										value={selectedProductDetail.height}
										onChange={(e) =>
											setselectedProductDetail({
												...selectedProductDetail,
												height: e.target.value,
											})
										}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Checkbox
									onChange={(e) =>
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
						{state.showDropship ? (
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item name='dropship_location' label='Dropship Location'>
										{console.log('props.locations ', props.dropships)}
										<Select placeholder='Dropship Location'>
											{props.dropships !== null
												? props.dropships.map((value, index) => {
														if (value.type === 2) {
															return (
																<Option
																	value={index}
																>{`${value.city} ${value.state} ${value.zip_code}`}</Option>
															);
														}
												  })
												: null}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						) : null}
						<Row gutter={16}>
							<Col span={12}>
								<Checkbox
									onChange={(e) =>
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

const mapStateToProps = (state) => {
	return {
		allProducts: state.allProducts,
		token: state.token,
		dropships: state.dropships,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getAllProducts: () => dispatch(getAllProducts()),
		submitProductSettings: (data, token) =>
			dispatch(submitProductSettings(data, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProductSettingsComponent);
