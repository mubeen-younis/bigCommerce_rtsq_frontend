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
	Radio 
} from 'antd';

import { connect } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';

const { Option } = Select;
const { Title } = Typography;

function QuoteSettingsComponentWweSmall(props) {
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
		ground_metric:1
	});
	const [ratingMethod, setRatingMethod] = useState(1);

	useEffect(() => {
		getQuoteSettings();
		// eslint-disable-next-line
	}, [props.quoteSettings]);

	const getQuoteSettings = () => {
		// console.log('props.quoteSettings ', props.quoteSettings);

		if (props.quoteSettings === null || props.quoteSettings === undefined) {
			props.getSettings(props.token, props.carrierId);
			// setLoading(false);
		}

		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			setLoading(false);
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
				ground_metric:1
			});
		}
	};

	const onFinish = data => {
		data = {
			...data,
			...quoteSettingsState,
			carrierId: +props.carrierId,
			own_arrangement_text: quoteSettingsState.own_arrangement_text,
		};
		props.postData(data, props.token);
	};
	const onChangeRadio=e=>{
		setQuoteSettingsState({
			...quoteSettingsState,
			ground_metric:e.target.value
		});
	}

	return loading &&
		(props.quoteSettings === undefined || props.quoteSettings === null) ? (
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


			{/* UPS SERVICES */}
			<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>WWE Services</Title>
					</Col>
					
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-black'}>The services selected will display in the cart if they are available for the origin and destination addresses, and if the WWE Small Package Quotes API has been enabled for the corresponding shipping zone.</label>
					</Col>
</Row>
					<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>Markup (eg Currency 1.0 or percentage 5%)</label>
					</Col>
					
					</Row>


					<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>Markup (eg Currency 1.0 or percentage 5%)</label>
					</Col>
					
					</Row>



					<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>Markup (eg Currency 1.0 or percentage 5%)</label>
					</Col>
					
					</Row>



					<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>Markup (eg Currency 1.0 or percentage 5%)</label>
					</Col>
					
					</Row>



					<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>Markup (eg Currency 1.0 or percentage 5%)</label>
					</Col>
					
					</Row>

			{/* END */}


			{/* Ground transit timw settings */}


			<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Ground Transit time restrictions</Title>
					</Col>
					
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Enter the number of transit days to restrict service , leave blank to disable this service</label>
					</Col>
					
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
					
					</Col>
					</Row>


					<Row gutter={30} align='middle' className={'mb-4'}>

					<Radio.Group onChange={onChangeRadio} name='ground_metric' value={quoteSettingsState.ground_metric}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Restrict by the carriers in transit days metric
						</label>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
						value={1}
							></Radio>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
						Restrict by the calendar days in transit
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								value={2}
							>
								{props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)}
							</Radio>
						</Form.Item>
					</Col>
					</Radio.Group>
				</Row>


			{/* End Transit  */}
		
				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always quote residential delivery</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_residential_delivery'
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
						<label className={'text-gray'}>Automatically detect residential delivery</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='auto_detected_residential_addresses'
								value={true}
								checked={quoteSettingsState.alwaysResidentialDelivery}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysResidentialDelivery: !quoteSettingsState.alwaysResidentialDelivery,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address appears to be a post office
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='check_post_office_address'
								checked={
									props.plansInfo && props.plansInfo.plan_type > 1
										? quoteSettingsState.autoDetectedResidentialAddresses
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddresses: !quoteSettingsState.autoDetectedResidentialAddresses,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
							>
								{props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)}
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Lift gate settings</Title>
					</Col>
					{/* <Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Always include lift gate pick up
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='always_lift_gate_pickup'
								value={true}
								checked={quoteSettingsState.alwaysLiftGatePickup}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysLiftGatePickup: !quoteSettingsState.alwaysLiftGatePickup,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col> */}
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
									props.plansInfo && props.plansInfo.plan_type > 1
										? quoteSettingsState.offerLiftGateDelivery
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										offerLiftGateDelivery: !quoteSettingsState.offerLiftGateDelivery,
										alwaysLiftGateDelivery: false,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
							>
								{props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)}
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
									props.plansInfo && props.plansInfo.plan_type > 1
										? quoteSettingsState.autoDetectedResidentialAddressesLfg
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddressesLfg: !quoteSettingsState.autoDetectedResidentialAddressesLfg,
										alwaysLiftGateDelivery: false,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
							>
								{props.plansInfo && props.plansInfo.plan_type < 2 && (
									<a href='#!' className='stnd-plan text-danger'>
										Standard plan required
									</a>
								)}
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount e.g 3.75, or a percentage, e.g, 5%.
							Leave blank to disable.
						</div>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Allow For Own Arrangement</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='own_arrangement'>
							<Select
								defaultValue={quoteSettingsState.own_arrangement}
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
							make and pay for their own LTL shipping arrangments.
						</div>
					</Col>
				</Row>

				{quoteSettingsState.own_arrangement === '1' && (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Text for Own Arragement</label>
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
	};
};

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteSettingsComponentWweSmall);
