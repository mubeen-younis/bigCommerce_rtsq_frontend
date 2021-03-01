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

import { connect } from 'react-redux';
import { postData, getQuoteSettings } from '../../../Actions/Action';

const { Option } = Select;
const { Title } = Typography;

function QuoteSettingsComponentWwe(props) {
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
	});
	const [ratingMethod, setRatingMethod] = useState(1);

	useEffect(() => {
		if (props.quoteSettings === null) {
			getQuoteSettings();
		}
	}, [props.quoteSettings]);

	const getQuoteSettings = () => {
		console.log('props.quoteSettings ', props.quoteSettings);

		if (props.quoteSettings === null || props.quoteSettings === undefined) {
			props.getSettings(props.token, props.carrierId);
			setLoading(false);
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
			});
		}
	};

	const onFinish = (data) => {
		//data.method = ratingMethod
		data = { ...data, ...quoteSettingsState, carrierId: +props.carrierId };
		props.postData(data, props.token);
	};

	return props.quoteSettings === undefined || props.quoteSettings === null ? (
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
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
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
								onChange={(value) => {
									console.log(value);
									setRatingMethod(value);
								}}
							>
								<Option value={1}>Cheapest</Option>
								<Option value={2}>Cheapest Options</Option>
								<Option value={3}>Average</Option>
							</Select>
						</Form.Item>
						<div className={'text-gray'}>Display a least expensive option.</div>
					</Col>
				</Row>

				{ratingMethod === 2 || ratingMethod === 3 ? (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
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
								Number of options to display in the shopping cart.
							</div>
						</Col>
					</Row>
				) : null}

				{ratingMethod === 1 || ratingMethod === 3 ? (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
							<label className={'text-gray'}>Label as</label>
						</Col>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
							<Form.Item className={'mb-0'} name='label_as'>
								<Input
									name='label_as'
									value={props.quoteSettings ? props.quoteSettings.label_as : ''}
								/>
							</Form.Item>
							<div className={'text-gray'}>
								what the user sees during checkout, e.g. "Freight". Leave blank to display
								the carrier name.
							</div>
						</Col>
					</Row>
				) : null}

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
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

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always residential pick up</label>
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
								name='always_residential_delivery'
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
							Automatically detected residential addresses
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='auto_detected_residential_addresses'
								checked={
									props.plansInfo && props.plansInfo.plan_type === 2
										? quoteSettingsState.autoDetectedResidentialAddresses
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddresses: !quoteSettingsState.autoDetectedResidentialAddresses,
									})
								}
								disabled={
									props.plansInfo && props.plansInfo.plan_type === 2 ? false : true
								}
							>
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
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
									props.plansInfo && props.plansInfo.plan_type === 2
										? quoteSettingsState.offerLiftGateDelivery
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										offerLiftGateDelivery: !quoteSettingsState.offerLiftGateDelivery,
									})
								}
								disabled={
									props.plansInfo && props.plansInfo.plan_type === 2 ? false : true
								}
							>
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
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
									props.plansInfo && props.plansInfo.plan_type === 2
										? quoteSettingsState.autoDetectedResidentialAddressesLfg
										: false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										autoDetectedResidentialAddressesLfg: !quoteSettingsState.autoDetectedResidentialAddressesLfg,
									})
								}
								disabled={
									props.plansInfo && props.plansInfo.plan_type === 2 ? false : true
								}
							>
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Handling Free / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='handling_free_markup'>
							<Input />
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
						<Form.Item className={'mb-0'} name='own_arrangment'>
							<Select
								name='own_arrangment'
								defaultValue='0'
								size={'large'}
								style={{ width: '100%' }}
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

const mapStateToProps = (state) => {
	return {
		quoteSettings: state.quoteSettings,
		token: state.token,
		carrierId: state.carrierId,
		plansInfo: state.plansInfo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		postData: (data, token) =>
			dispatch(postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteSettingsComponentWwe);
