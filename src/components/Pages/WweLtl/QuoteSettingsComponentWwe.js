import React, { Fragment, useState, useEffect } from 'react';
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Input,
	Checkbox,
	Skeleton,
} from 'antd';

import { connect, useDispatch } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';
import {handlingFeeMarkup, validateHandlingFeeMarkup, LableAsLimit} from '../../../Utilities/numberValidation'
const { Option } = Select;
const { Title } = Typography;

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		showDeliveryEstimate: false,
		residentialPickup: false,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		alwaysLiftGatePickup: false,
		alwaysLiftGateDelivery: false,
		offerLiftGateDelivery: false,
		autoDetectedResidentialAddressesLfg: false,
		returnRates: false,
		own_arrangement: 0,
		own_arrangement_text: '',
		insurance_category: '84-General Merchandise'
	});
	const [ratingMethod, setRatingMethod] = useState(1);
	
	//const [isRadEnable, setIsRadEnable] = useState(1);

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings();
		}
		
		// eslint-disable-next-line
	}, [props.quoteSettings]);

	const radCheck = props.installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	);
	let radStatus = false;
	if(radCheck !== undefined){
		radStatus = props?.radPlans?.currentPackage === null ? false:
		props?.radPlans?.currentPackage?.status !== 1 ? false : true;
	}
	const getQuoteSettings = () => {
		let ratingMethodInit =
			props.quoteSettings.method !== undefined ? props.quoteSettings.method : 1;
		setRatingMethod(ratingMethodInit);

		setQuoteSettingsState({
			showDeliveryEstimate: props.quoteSettings.showDeliveryEstimate,
			residentialPickup: props.quoteSettings.residentialPickup,
			alwaysResidentialDelivery: props.quoteSettings.alwaysResidentialDelivery,
			autoDetectedResidentialAddresses:
				props.quoteSettings.autoDetectedResidentialAddresses,
			alwaysLiftGatePickup: props.quoteSettings.alwaysLiftGatePickup,
			alwaysLiftGateDelivery: props.quoteSettings.alwaysLiftGateDelivery,
			offerLiftGateDelivery: props.quoteSettings.offerLiftGateDelivery,
			autoDetectedResidentialAddressesLfg:
				props.quoteSettings.autoDetectedResidentialAddressesLfg,
			returnRates: props.quoteSettings.returnRates,
			own_arrangement: props.quoteSettings.own_arrangement,
			own_arrangement_text: props.quoteSettings.own_arrangement_text,
			insurance_category: props.quoteSettings.insurance_category
		});

		setLoading(false);
	};

	const onFinish = data => {
		data = {
			...data,
			...quoteSettingsState,
			carrierId: +props.carrierId,
			own_arrangement_text: quoteSettingsState.own_arrangement_text,
			insurance_category: quoteSettingsState.insurance_category === undefined ? '84-General Merchandise' : quoteSettingsState.insurance_category 
		};
		var errormsg = validateHandlingFeeMarkup(data?.handling_free_markup, 'Handling fee');
		if( errormsg === '' ){
			props.postData(data, props.token);
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
					alertMessage: errormsg,
					alertMessageType: 'error',
				},
			})
		}
	};

	
	

	return loading || props.quoteSettings === undefined || props.quoteSettings === null ? (
		<Skeleton active />
	) : (
		<Fragment>
			<Form
				layout='vertical'
				name='quote_settings_info'
				className='form-wrp'
				size={'large'}
				onFinish={onFinish}
				initialValues={props.quoteSettings}
			>
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Rating Method</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='method'>
							<Select
								defaultValue={
									props.quoteSettings && props.quoteSettings.method !== undefined
										? props.quoteSettings.method
										: 1
								}
								name='method'
								size={'large'}
								style={{ width: '100%' }}
								onChange={value => {
									setRatingMethod(value);
								}}
							>
								<Option value={1}>Cheapest</Option>
								<Option value={2}>Cheapest Options</Option>
								<Option value={3}>Average Rate</Option>
							</Select>
						</Form.Item>
						<div className={'text-gray'}>
							{ratingMethod === 1 && 'Displays a least expensive option.'}
							{ratingMethod === 2 &&
								'Displays a list of specified number of least expensive options.'}
							{ratingMethod === 3 &&
								'Displays a single rate based on an average of a specified number of least expensive options.'}
						</div>
					</Col>
				</Row>

				{ratingMethod === 2 || ratingMethod === 3 ? (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Number Of Options</label>
						</Col>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
							<Form.Item className={'mb-0'} name='number_of_options'>
								<Select
									name='number_of_options'
									defaultValue='1'
									size={'large'}
									style={{ width: '100%' }}
								>
									<Option value='1'>1</Option>
									<Option value='2'>2</Option>
									<Option value='3'>3</Option>
									<Option value='4'>4</Option>
									<Option value='5'>5</Option>
									<Option value='6'>6</Option>
									<Option value='7'>7</Option>
									<Option value='8'>8</Option>
									<Option value='9'>9</Option>
									<Option value='10'>10</Option>
								</Select>
							</Form.Item>
							<div className={'text-gray'}>
								{ratingMethod === 2 &&
									'Number of options to display in the shopping cart.'}
								{ratingMethod === 3 &&
									'Number of options to include in the calculation of the average.'}
							</div>
						</Col>
					</Row>
				) : null}

				{ratingMethod === 1 || ratingMethod === 3 ? (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Label As</label>
						</Col>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
							<Form.Item className={'mb-0'} name='label_as'>
								<Input
									name='label_as'
									value={props.quoteSettings ? props.quoteSettings.label_as : ''}
									onKeyDown={LableAsLimit}
								/>
							</Form.Item>
							<div className={'text-gray'}>
								What the user sees during checkout, e.g. "Freight". {ratingMethod === 1 ? 
									 'Leave blank to display the carrier name.' : ' If left blank will default to "Freight".' }
							</div>
						</Col>
					</Row>
				) : null}

				{ratingMethod === 1 || ratingMethod === 2 ? (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Show Delivery Estimate</label>
						</Col>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name='show_delivery_estimate'
									// value={true}
									checked={quoteSettingsState.showDeliveryEstimate}
									onChange={() => {
										setQuoteSettingsState({
											...quoteSettingsState,
											showDeliveryEstimate: !quoteSettingsState.showDeliveryEstimate,
										});
									}}
								>
									Show Delivery Estimate With Shipping Services.
								</Checkbox>
							</Form.Item>
						</Col>
					</Row>
				) : null}

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always include residential pick up</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='residential_pickup'
								value={true}
								checked={quoteSettingsState.residentialPickup}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										residentialPickup: !quoteSettingsState.residentialPickup,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always quote residential delivery</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='alwaysResidentialDelivery'
								value={true}
								checked={quoteSettingsState.alwaysResidentialDelivery}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysResidentialDelivery: !quoteSettingsState.alwaysResidentialDelivery,
										autoDetectedResidentialAddresses: false,
									})
								}
								disabled={
									radStatus
								}
							></Checkbox>
						</Form.Item>
					</Col>
					
						<Fragment>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
								<label className={'text-gray'}>Auto-detect residential addresses</label>
							</Col>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='autoDetectedResidentialAddresses'
										checked={
											quoteSettingsState.autoDetectedResidentialAddresses	
										}
										onChange={() =>
											setQuoteSettingsState({
												...quoteSettingsState,
												autoDetectedResidentialAddresses: !quoteSettingsState.autoDetectedResidentialAddresses,
												alwaysResidentialDelivery: false,
											})
										}
										disabled={
											!radStatus
										}
									>
										{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
											<a href='#!' className='stnd-plan text-danger'>
												Standard plan required
											</a>
										)*/}
									</Checkbox>
									{ !radStatus &&
									<label className={'ml-4'} style={{'marginLeft':'10px'}}>Click <a href="/">here</a> to add the Residential Address Detection add-on.</label>
										 }
								</Form.Item>
							</Col>
						</Fragment>
					
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Lift gate settings</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always quote lift gate delivery</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_lift_gate_delivery'
								value={true}
								checked={quoteSettingsState.alwaysLiftGateDelivery}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysLiftGateDelivery: !quoteSettingsState.alwaysLiftGateDelivery,
										offerLiftGateDelivery: false,
										autoDetectedResidentialAddressesLfg: false,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Offer lift gate delivery as an option</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='offer_lift_gate_delivery'
								checked={
									 quoteSettingsState.offerLiftGateDelivery
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										offerLiftGateDelivery: !quoteSettingsState.offerLiftGateDelivery,
										alwaysLiftGateDelivery: false,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
							>
								{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)*/}
							</Checkbox>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Always include lift gate delivery when a residential address is detected
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='auto_detected_residential_addresses_lfg'
								checked={
									 quoteSettingsState.autoDetectedResidentialAddressesLfg
										
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddressesLfg: !quoteSettingsState.autoDetectedResidentialAddressesLfg,
										alwaysLiftGateDelivery: false,
									})
								}
								disabled={
									!radStatus
								}
							>
								{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)*/}
							</Checkbox>
							{ !radStatus &&
									<label className={'ml-4'} style={{'marginLeft':'10px'}}>Click <a href="/">here</a> to add the Residential Address Detection add-on.</label>
										 }
							
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Insurance Category</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='insurance_category'>
							
							<Select 
								name='insurance_category'
								defaultValue={
									props.quoteSettings && props.quoteSettings.insurance_category !== undefined
										? props.quoteSettings.insurance_category
										: '84-General Merchandise'
								}
								size={'large'}
								style={{ width: '100%' }}
								
								onChange={value => {
									//setRatingMethod(value);
									setQuoteSettingsState({
										...quoteSettingsState,
										insurance_category: value,
									});
								}}
								>
								<Option value="84-General Merchandise">General Merchandise</Option>
								<Option value="85-Antiques / Art / Collectibles">Antiques / Art / Collectibles</Option>
								<Option value="86-Commercial Electronics (Audio; Computer: Hardware, Servers, Parts &amp; Accessories)">Commercial Electronics (Audio; Computer: Hardware, Servers, Parts &amp; Accessories)</Option>
								<Option value="87-Consumer Electronics (laptops, cellphones, PDAs, iPads, tablets, notebooks, etc.)">Consumer Electronics (laptops, cellphones, PDAs, iPads, tablets, notebooks, etc.)</Option>
								<Option value="88-Fragile Goods (Glass, Ceramic, Porcelain, etc.)">Fragile Goods (Glass, Ceramic, Porcelain, etc.)</Option>
								<Option value="89-Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)">Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)</Option>
								<Option value="90-Machinery, Appliances and Equipment (Medical, Restaurant, Industrial, Scientific)">Machinery, Appliances and Equipment (Medical, Restaurant, Industrial, Scientific)</Option>
								<Option value="91-Miscellaneous / Other / Mixed">Miscellaneous / Other / Mixed</Option>
								<Option value="92-Non-Perishable Foods / Beverages / Commodities / Vitamins">Non-Perishable Foods / Beverages / Commodities / Vitamins</Option>
								<Option value="93-Radioactive / Hazardous / Restricted or Controlled Items">Radioactive / Hazardous / Restricted or Controlled Items</Option>
								<Option value="94-Sewing Machines, Equipment and Accessories">Sewing Machines, Equipment and Accessories</Option>
								<Option value="95-Stone Products (Marble, Tile, Stonework, Granite, etc.)">Stone Products (Marble, Tile, Stonework, Granite, etc.)</Option>
								<Option value="96-Wine / Spirits / Alcohol / Beer">Wine / Spirits / Alcohol / Beer</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input 
							maxLength='7' 
							onKeyDown={handlingFeeMarkup}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount e.g 3.75, or a percentage, e.g, 5%.
							Leave blank to disable.
						</div>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Allow For Own Arrangement</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='own_arrangement'>
							<Select
								defaultValue={quoteSettingsState.own_arrangement ? quoteSettingsState.own_arrangement : 'No' }
								size={'large'}
								style={{ width: '100%' }}
								onChange={value => {
									setQuoteSettingsState({
										...quoteSettingsState,
										own_arrangement: value,
									});
								}}
							>
								<Option value='0'>No</Option>
								<Option value='1'>Yes</Option>
							</Select>
						</Form.Item>
						<div className={'text-gray'}>
							Adds an option in the shipping cart for users to indicate that they will
							make and pay for their own LTL shipping arrangements.
						</div>
					</Col>
				</Row>

				{quoteSettingsState.own_arrangement === '1' && (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Text for Own Arrangement</label>
						</Col>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
							<Form.Item className={'mb-0'} name='own_arrangement_text'>
								<Input
									
									onChange={e =>
										setQuoteSettingsState({
											...quoteSettingsState,
											own_arrangement_text: e.target.value,
										})
									}
									value={quoteSettingsState.own_arrangement_text}
								/>
							</Form.Item>
						</Col>
					</Row>
				)}

				<Row gutter={30} className={'mt-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
							<Space>
								<Button type='primary' size={'large'} htmlType='submit'>
									Save Settings
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		quoteSettings: state.quoteSettings,
		token: state.token,
		carrierId: state.carrierId,
		plansInfo: state.plansInfo,
		alertMessageType: state.alertMessageType,
		radPlans: state.radPlans,
		installedAddons: state.installedAddons,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteSettingsComponentWwe);
