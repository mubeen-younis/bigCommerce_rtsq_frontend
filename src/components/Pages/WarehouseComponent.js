import React, { Fragment, useState } from 'react';
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
	Checkbox,
	Table,
	Tooltip,
} from 'antd';
import { connect } from 'react-redux';
import { postData } from '../../Actions/Action';
import addKeysToList from './../../Utilities/addKey';
import { getGoogleResponse, getWarehouse, deleteLocation } from '../../Actions/Warehouse';

const { Title } = Typography;

function WarehouseComponent(props) {
	const [getLocationOn, setGetLocationOn] = useState(true);
	const [visible1, setVisibleWarehouse] = useState(false);
	const [warehouseDeleteModal, setDeleteWarehouseModal] = useState(false);
	const [warehouseID, setWarehouseID] = useState(null);
	const [locationDetail, setLocationDetail] = useState({
		enable_instore: false,
		enable_ld: false,
	});

	const {
		postData,
		getGoogleResponse,
		alertMessageType,
		showAlertMessage,
		googleLocationResponse,
		getWarehouse,
		deleteLocation,
		warehouse,
		dropships,
		token,
		plansInfo,
	} = props;

	const onFinish = (values) => {
		const data = { ...locationDetail, location_id: locationDetail['id'] };
		postData(data, 'SAVE_LOCATION', 'save_location', token, setVisibleWarehouse);

		// setVisibleWarehouse(false);
	};

	if (
		alertMessageType !== 'loading' &&
		!showAlertMessage &&
		googleLocationResponse !== null &&
		getLocationOn
	) {
		console.log('googleLocationResponse', googleLocationResponse);
		console.log(locationDetail);

		setLocationDetail({
			...locationDetail,
			city: googleLocationResponse.city[0],
			state: googleLocationResponse.state,
			country: googleLocationResponse.country,
		});
		setGetLocationOn(false);
	}

	const getGoogleLocation = (zip_code) => {
		if (zip_code.length > 4) {
			getGoogleResponse(zip_code, token);
			setGetLocationOn(true);
		}
	};

	const openLocationModal = (location_type) => {
		setLocationDetail({
			location_type: location_type,
		});
		setVisibleWarehouse(true);
	};

	const openDeleteLocationModal = (data) => {
		setDeleteWarehouseModal(true);
		setWarehouseID(data.id);
	};

	const editLocation = (data) => {
		getWarehouse(data.id, setLocationDetail, setVisibleWarehouse, props.token);
	};

	const changeValue = (e) => {
		setLocationDetail({
			...locationDetail,
			[e.target.name]: e.target.value,
		});
	};

	const handleChange = (name, e) => {
		setLocationDetail({
			...locationDetail,
			[name]: e,
		});
	};

	const columns = [
		{
			key: 'nickname',
			title: 'NickName',
			dataIndex: 'nickname',
		},
		{
			key: 'city',
			title: 'City',
			dataIndex: 'city',
		},
		{
			key: 'state',
			title: 'State',
			dataIndex: 'state',
		},
		{
			key: 'zip_code',
			title: 'Zip',
			dataIndex: 'zip_code',
		},
		{
			key: 'Country',
			title: 'Country',
			dataIndex: 'country',
		},
		{
			key: 'zip',
			title: 'Action',
			render: (text, record) => (
				<Space size='middle'>
					<Button onClick={() => editLocation(text)}>Edit</Button>
					<Button onClick={() => openDeleteLocationModal(text)} className={'btn-danger'}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<Fragment>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				{/* <Row gutter={30}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Title level={4}>Shipment Origins</Title>
                        <p>How will your shipment origins be indentified?</p>
                        <Select defaultValue="warehouse" size={"large"} style={{ width: '100%' }} onChange={handleChange}>
                            <Option value="warehouse">Warehouse</Option>
                            <Option value="dropship_location">Dropship Location</Option>
                        </Select>
                    </Col>
                </Row> */}
				<Row gutter={30}>
					<Modal
						title={
							<Title className={'mb-0'} level={4}>
								{locationDetail.location_type === 1 ? 'Warehouse info' : 'Dropship info'}
							</Title>
						}
						centered
						visible={visible1}
						onCancel={() => setVisibleWarehouse(false)}
						footer={null}
						width={800}
					>
						<Form
							layout='vertical'
							name='add_warehouse_info'
							className='form-wrp'
							size={'large'}
							initialValues={locationDetail}
							onFinish={onFinish}
						>
							<Row gutter={30}>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item
										className={'mb-2'}
										label='Nickname'
										rules={[{ required: false, message: 'Nickname' }]}
									>
										<Input
											name='nickname'
											placeholder='Nickname'
											value={locationDetail.nickname}
											onChange={changeValue}
										/>
									</Form.Item>
								</Col>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item
										className={'mb-2'}
										label='Zip Code'
										rules={[{ required: true, message: 'Zip Code' }]}
									>
										<Input
											placeholder='Zip Code'
											name='zip_code'
											value={locationDetail.zip_code}
											onChange={(e) => {
												getGoogleLocation(e.target.value);
												changeValue(e);
											}}
										/>
									</Form.Item>
								</Col>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item
										className={'mb-2'}
										label='City'
										rules={[{ required: true, message: 'City' }]}
									>
										<Input
											name='city'
											placeholder='City'
											value={locationDetail.city}
											onChange={changeValue}
										/>
									</Form.Item>
								</Col>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item
										className={'mb-2'}
										label='State'
										rules={[{ required: true, message: 'State' }]}
									>
										<Input
											name='state'
											placeholder='State'
											value={locationDetail.state}
											onChange={changeValue}
										/>
									</Form.Item>
								</Col>

								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item
										className={'mb-2'}
										label='Country'
										rules={[{ required: true, message: 'Country' }]}
									>
										<Input
											name='country'
											placeholder='Country'
											value={locationDetail.country}
											onChange={changeValue}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30}>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Title level={4}>In-store pick up</Title>
								</Col>
							</Row>
							<Row gutter={30} align='middle'>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Enable in-store pick up</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item name='enable_instore' className={'mb-0'}>
										<Checkbox
											name='enable_instore'
											checked={locationDetail.enable_instore}
											onChange={(e) =>
												setLocationDetail({
													...locationDetail,
													enable_instore: !locationDetail.enable_instore,
												})
											}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										></Checkbox>
										<a href='#!' className='stnd-plan text-danger'>
											Advance plan required
										</a>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>
										Offer if address is within (miles):
									</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[{ required: false, message: 'Email Required' }]}
									>
										<Input
											name='instore_miles'
											value={locationDetail.instore_miles}
											onChange={changeValue}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Offer if postal code matches:</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[{ required: false, message: 'Costal Code Required' }]}
									>
										<Select
											name='instore_zipcodes'
											value={locationDetail.instore_zipcodes}
											mode='tags'
											style={{ width: '100%' }}
											onChange={(e) => handleChange('instore_zipcodes', e)}
											tokenSeparators={[',']}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Checkout description:</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[
											{
												required: false,
												message: 'Checkout Description Required',
											},
										]}
									>
										<Input
											name='instock_description'
											value={locationDetail.instock_description}
											placeholder='In-stock pick up'
											onChange={changeValue}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30}>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Title level={4}>Local Delivery</Title>
								</Col>
							</Row>
							<Row gutter={30} align='middle'>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Enable local delivery</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item className={'mb-0'}>
										<Checkbox
											name='enable_ld'
											checked={locationDetail.enable_ld}
											onChange={(e) =>
												setLocationDetail({
													...locationDetail,
													enable_ld: !locationDetail.enable_ld,
												})
											}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										></Checkbox>
										<a href='#!' className='stnd-plan text-danger'>
											Advance plan required
										</a>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>
										Offer if address is within (miles):
									</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item className={'mb-0'}>
										<Input
											name='ld_miles'
											value={locationDetail.ld_miles}
											onChange={changeValue}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Offer if postal code matches:</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[{ required: false, message: 'Costal Code Required' }]}
									>
										<Select
											name='ld_zipcodes'
											value={locationDetail.ld_zipcodes}
											mode='tags'
											style={{ width: '100%' }}
											onChange={(e) => handleChange('ld_zipcodes', e)}
											tokenSeparators={[',']}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Checkout description:</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[
											{
												required: false,
												message: 'Checkout Description Required',
											},
										]}
									>
										<Input
											name='ld_description'
											value={locationDetail.ld_description}
											placeholder='Local delivery'
											onChange={changeValue}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mb-2'}>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>Local delivery fee</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item
										className={'mb-0'}
										rules={[
											{
												required: false,
												message: 'Local delivery fee Required',
											},
										]}
									>
										<Input
											name='ld_fee'
											value={locationDetail.ld_fee}
											onChange={changeValue}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle'>
								<Col className='gutter-row' xs={24} sm={8} md={8} lg={8} xl={8}>
									<label className={'text-gray'}>
										Suppress other rates
										<Tooltip
											placement='top'
											title={
												'This setting only suppresses rate that would otherwise be returned by this app.'
											}
										>
											<Button className={'text-gray'} type='link'>
												[?]
											</Button>
										</Tooltip>
									</label>
								</Col>
								<Col className='gutter-row' xs={24} sm={16} md={16} lg={16} xl={16}>
									<Form.Item className={'mb-0'}>
										<Checkbox
											name='ld_enable_supress'
											checked={locationDetail.ld_enable_supress}
											onChange={(e) =>
												setLocationDetail({
													...locationDetail,
													ld_enable_supress: !locationDetail.ld_enable_supress,
												})
											}
											disabled={plansInfo && plansInfo.plan_type === 3 ? false : true}
										></Checkbox>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={30} align='middle' className={'mt-3'}>
								<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
									<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
										<Space>
											<Button
												type='link'
												size={'large'}
												onClick={() => setVisibleWarehouse(false)}
											>
												Cancel
											</Button>
											<Button type='primary' size={'large'} htmlType='submit'>
												Save
											</Button>
										</Space>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Modal>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>
							Warehouses{' '}
							<Button type='primary' onClick={() => openLocationModal(1)}>
								Add
							</Button>
						</Title>
						<p>
							Warehouses that inventory all products not otherwise indentified as drop
							shipped items. The warehouse with lowest shipping cost to the destination is
							used for quoting purpose.
						</p>
						<Table
							className={'custom-table'}
							dataSource={warehouse ? addKeysToList(warehouse) : []}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>
			<Space direction='vertical' size={'large'} className={'w-100'}>
				<Row gutter={30}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>
							Drop Ships{' '}
							<Button type='primary' onClick={() => openLocationModal(2)}>
								Add
							</Button>
						</Title>
						<p>
							Location that inventory specific items that are drop shipped to the
							destination. Use the product's settings page to identify it as a drop
							shipped and it associated drop ship location. Orders that includes drop
							shipped items will display a single figure for the shipping rate estimate
							that is equal to the sum of the cheapest option of each shipment required to
							fullfil the order.
						</p>
						<Table
							className={'custom-table'}
							dataSource={dropships ? addKeysToList(dropships) : []}
							columns={columns}
						/>
					</Col>
				</Row>
			</Space>
			<Modal
				title='Confirm Delete'
				visible={warehouseDeleteModal}
				onOk={() => deleteLocation(warehouseID, setDeleteWarehouseModal, token)}
				onCancel={() => setDeleteWarehouseModal(false)}
				okText='Confirm'
				cancelText='Cancel'
			>
				<p>Are you sure you want to delete this?</p>
			</Modal>
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		warehouse: state.warehouse,
		dropships: state.dropships,
		googleLocationResponse: state.googleLocationResponse,
		showAlertMessage: state.showAlertMessage,
		alertMessageType: state.alertMessageType,
		confirmModal: state.confirmModal,
		token: state.token,
		plansInfo: state.plansInfo,
	};
};

const mapDispatchToProps = (dispatch) => ({
	postData: (data, type, url, token, visibility) =>
		dispatch(postData(data, type, url, token, visibility)),
	getGoogleResponse: (data, token) => dispatch(getGoogleResponse(data, token)),
	getWarehouse: (id, locationDetail, visibility, token) =>
		dispatch(getWarehouse(id, locationDetail, visibility, token)),
	deleteLocation: (id, visibility, token) =>
		dispatch(deleteLocation(id, visibility, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseComponent);
