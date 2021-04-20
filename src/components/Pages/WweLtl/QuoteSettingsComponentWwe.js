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
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';

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
		own_arrangement: 0,
		own_arrangement_text: '',
	});
	const [ratingMethod, setRatingMethod] = useState(1);

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings();
		}
		// eslint-disable-next-line
	}, [props.quoteSettings]);

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
		});

		setLoading(false);
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
								onChange={value => {
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
				{ratingMethod === 1 || ratingMethod === 2 ? (
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
				) : null}

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
									props.installedAddons[0] && props.installedAddons[0].is_suspend === 1
										? false
										: true
								}
							></Checkbox>
						</Form.Item>
					</Col>
					{props.radPlans &&
					props.radPlans.current_plan.severity === 'SUCCESS' &&
					props.installedAddons[0] &&
					props.installedAddons[0].is_suspend === 1 ? (
						<Fragment>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
								<label className={'text-gray'}>
									Automatically detected residential addresses
								</label>
							</Col>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='autoDetectedResidentialAddresses'
										checked={
											props.plansInfo && props.plansInfo.plan_type > 1
												? quoteSettingsState.autoDetectedResidentialAddresses
												: false
										}
										onChange={() =>
											setQuoteSettingsState({
												...quoteSettingsState,
												autoDetectedResidentialAddresses: !quoteSettingsState.autoDetectedResidentialAddresses,
												alwaysResidentialDelivery: false,
											})
										}
										disabled={
											props?.plansInfo?.plan_type > 1 &&
											props?.radPlans?.current_plan?.severity === 'SUCCESS' &&
											props?.installedAddons[0]?.is_suspend === 0
												? false
												: true
										}
									>
										{props.plansInfo && props.plansInfo.plan_type < 2 && (
											<a href='#!' className='stnd-plan text-danger'>
												Standard plan required
											</a>
										)}
									</Checkbox>
									Requires{' '}
									<b>
										<i>Automatically detect residential addresses </i>
									</b>{' '}
									feature
								</Form.Item>
							</Col>
						</Fragment>
					) : null}
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

					{props?.radPlans?.current_plan?.severity === 'SUCCESS' &&
					props?.installedAddons[0]?.is_suspend === 1 ? (
						<Fragment>
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
										disabled={
											props?.plansInfo?.plan_type > 1 &&
											props?.radPlans?.current_plan?.severity === 'SUCCESS' &&
											props?.installedAddons[0]?.is_suspend === 0
												? false
												: true
										}
									>
										{props.plansInfo && props.plansInfo.plan_type < 2 && (
											<a href='#!' className='stnd-plan text-danger'>
												Standard plan required
											</a>
										)}
									</Checkbox>
									Requires{' '}
									<b>
										<i>Automatically detect residential addresses </i>
									</b>{' '}
									feature
								</Form.Item>
							</Col>
						</Fragment>
					) : null}
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
							make and pay for their own LTL shipping arrangements.
						</div>
					</Col>
				</Row>

				{quoteSettingsState.own_arrangement === '1' && (
					<Row gutter={30} className={'mb-3'}>
						<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
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
