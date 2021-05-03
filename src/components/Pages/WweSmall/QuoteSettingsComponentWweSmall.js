import React, { Fragment, useState, useEffect } from 'react';
import {
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Input,
	Checkbox,
	Skeleton,
	Radio,
} from 'antd';
import { connect } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';

const { Title } = Typography;

function QuoteSettingsComponentWweSmall(props) {
	const [loading, setLoading] = useState(true);
	const [checkAll, setCheckAll] = useState(false);
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		carrier_services: {
			ups_ground: false,
			ups_3_day_select: false,
			ups_2nd_day_air: false,
			ups_2nd_day_air_am: false,
			ups_2nd_day_air_saver: false,
			ups_next_day_air_saver: false,
			ups_next_day_air: false,
			ups_next_day_air_early: false,
			ups_ground_markup: '',
			ups_3_day_select_markup: '',
			ups_2nd_day_air_markup: '',
			ups_2nd_day_air_am_markup: '',
			ups_2nd_day_air_saver_markup: '',
			ups_next_day_air_saver_markup: '',
			ups_next_day_air_markup: '',
			ups_next_day_air_early_markup: '',
		},
		showDeliveryEstimate: false,
		number_of_transit_days: null,
		ground_metric: null,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		returnRates: false,
		ground_service_for_hazardous_material: false,
		ground_hazardous_material_fee: null,
		air_hazardous_material_fee: null,
		handling_fee_markup: null,
		quote_details: null,
	});

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings();
		}
		// eslint-disable-next-line
	}, [props.quoteSettings]);

	const getQuoteSettings = () => {
		const checks = props.quoteSettings.carrier_services;
		if (
			checks?.ups_ground &&
			checks?.ups_3_day_select &&
			checks?.ups_2nd_day_air &&
			checks?.ups_2nd_day_air_am &&
			checks?.ups_2nd_day_air_saver &&
			checks?.ups_next_day_air &&
			checks?.ups_next_day_air_saver &&
			checks?.ups_next_day_air_early
		) {
			setCheckAll(true);
		}

		setQuoteSettingsState(props.quoteSettings);
		setLoading(false);
	};

	const onChange = e => {
		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				[e.target.name]: e.target.value,
			},
		});
	};

	const onCheck = e => {
		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				[e.target.name]: !quoteSettingsState.carrier_services[e.target.name],
			},
		});

		if (checkAll && !e.target.checked) {
			setCheckAll(false);
			return;
		}

		const checks = {
			ups_ground: quoteSettingsState.carrier_services.ups_ground,
			ups_3_day_select: quoteSettingsState.carrier_services.ups_3_day_select,
			ups_2nd_day_air: quoteSettingsState.carrier_services.ups_2nd_day_air,
			ups_2nd_day_air_am: quoteSettingsState.carrier_services.ups_2nd_day_air_am,
			ups_2nd_day_air_saver: quoteSettingsState.carrier_services.ups_2nd_day_air_saver,
			ups_next_day_air: quoteSettingsState.carrier_services.ups_next_day_air,
			ups_next_day_air_saver: quoteSettingsState.carrier_services.ups_next_day_air_saver,
			ups_next_day_air_early: quoteSettingsState.carrier_services.ups_next_day_air_early,
		};
		checks[e.target.name] = e.target.checked;

		const isCheckedAll = Object.values(checks).every(ck => ck);
		setCheckAll(isCheckedAll);
	};

	const allCheckHandler = () => {
		setCheckAll(!checkAll);

		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				ups_ground: !checkAll,
				ups_3_day_select: !checkAll,
				ups_2nd_day_air: !checkAll,
				ups_2nd_day_air_am: !checkAll,
				ups_2nd_day_air_saver: !checkAll,
				ups_next_day_air_saver: !checkAll,
				ups_next_day_air: !checkAll,
				ups_next_day_air_early: !checkAll,
			},
		});
	};

	const onFinish = data => {
		props.postData({ ...quoteSettingsState, carrierId: +props.carrierId }, props.token);
	};

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
						<label className={'text-black'}>
							The services selected will display in the cart if they are available for the
							origin and destination addresses, and if the WWE Small Package Quotes API
							has been enabled for the corresponding shipping zone.
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Select All Services</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className='mb-2 ml-5'>
							<Checkbox
								name='select_all'
								value={true}
								checked={checkAll}
								onChange={allCheckHandler}
							></Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_ground'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_ground}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								name={'ups_ground_markup'}
								maxLength='7'
								pattern='[0-9.?(0-9){2}?]+%?$'
								value={quoteSettingsState.carrier_services.ups_ground_markup}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS 3 Day Select</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_3_day_select'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_3_day_select}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_3_day_select_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_3_day_select_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_2nd_day_air}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_2nd_day_air_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_2nd_day_air_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air A.M.</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air_am'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_2nd_day_air_am}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_2nd_day_air_am_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_2nd_day_air_am_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air Saver</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air_saver'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_2nd_day_air_saver}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_2nd_day_air_saver_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_2nd_day_air_saver_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air Saver</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air_saver'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_next_day_air_saver}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_next_day_air_saver_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_next_day_air_saver_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_next_day_air}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_next_day_air_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_next_day_air_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air Early</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air_early'
								value={true}
								checked={quoteSettingsState.carrier_services.ups_next_day_air_early}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								maxLength='7'
								value={quoteSettingsState.carrier_services.ups_next_day_air_early_markup}
								pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_next_day_air_early_markup'}
								onChange={onChange}
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={24}>
						<label className={'text-gray'}>
							Markup (eg Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Show Delivery Estimate</label>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='showDeliveryEstimate'
								value={true}
								checked={quoteSettingsState.showDeliveryEstimate}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										showDeliveryEstimate: !quoteSettingsState.showDeliveryEstimate,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col>
				</Row>
				{/* END */}

				{/* Ground transit time settings */}

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row mt-4' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Ground Transit time restrictions</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Enter the number of transit days to restrict service , leave blank to
							disable this service
						</label>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='number_of_transit_days'>
							<Input
								type='number'
								min='1'
								step='1'
								value={quoteSettingsState.number_of_transit_days}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										number_of_transit_days: e.target.value,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)}
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Restrict by the carriers in transit days metric
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='ground_metric'
								value='1'
								checked={quoteSettingsState.ground_metric === 1}
								// checked={true}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_metric: 1,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)}
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
								name='ground_metric'
								value='2'
								checked={quoteSettingsState.ground_metric === 2}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_metric: 2,
									})
								}
								disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)}
						</Form.Item>
					</Col>
				</Row>

				{/* End Transit  */}

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always quote as residential delivery</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='alwaysResidentialDelivery'
								value={true}
								checked={quoteSettingsState.alwaysResidentialDelivery}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysResidentialDelivery: !quoteSettingsState.alwaysResidentialDelivery,
										autoDetectedResidentialAddresses: false,
									})
								}
								disabled={
									!props.installedAddons[0] ||
									(props?.installedAddons[0] &&
										props.installedAddons[0].is_enabled === 0) ||
									props?.installedAddons[0]?.is_suspend === 1
										? false
										: true
								}
							></Checkbox>
						</Form.Item>
					</Col>
					{props?.radPlans &&
					props?.radPlans?.current_plan?.severity === 'SUCCESS' &&
					props?.installedAddons[0]?.is_enabled === 0 ? (
						<Fragment>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
								<label className={'text-gray'}>Auto-detect residential delivery</label>
							</Col>
							<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='autoDetectedResidentialAddresses'
										value={true}
										checked={quoteSettingsState.autoDetectedResidentialAddresses}
										onChange={e =>
											setQuoteSettingsState({
												...quoteSettingsState,
												autoDetectedResidentialAddresses: !quoteSettingsState.autoDetectedResidentialAddresses,
												alwaysResidentialDelivery: false,
											})
										}
										disabled={
											props?.plansInfo?.plan_type > 1 &&
											props?.radPlans?.current_plan?.severity === 'SUCCESS' &&
											props?.installedAddons[0]?.is_suspend === 0 &&
											props?.installedAddons[0]?.is_enabled === 1
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
										<i>Auto-detect residential addresses </i>
									</b>{' '}
									feature
								</Form.Item>
							</Col>
						</Fragment>
					) : null}

					{/* <Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address appears to be a post office
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='returnRates'
								checked={
									props.plansInfo && props.plansInfo.plan_type > 1
										? quoteSettingsState.returnRates
										: false
								}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										returnRates: !quoteSettingsState.returnRates,
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
					</Col> */}
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Hazardous material settings</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Only quote ground service for hazardous materials shipments
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-3'}>
							<Checkbox
								name={'ground_service_for_hazardous_material'}
								value={true}
								checked={quoteSettingsState.ground_service_for_hazardous_material}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_service_for_hazardous_material: !quoteSettingsState.ground_service_for_hazardous_material,
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
						<label className={'text-gray'}>Ground Hazardous Material Fee</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='number'
								name={'ground_hazardous_material_fee'}
								maxLength='7'
								pattern='[0-9.?(0-9){2}?]+?$'
								value={quoteSettingsState.ground_hazardous_material_fee}
								disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_hazardous_material_fee: e.target.value,
									})
								}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)}
						</div>
					</Col>

					<Col className='gutter-row mt-3' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Air Hazardous Material Fee</label>
					</Col>
					<Col className='gutter-row mt-3' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='number'
								name={'air_hazardous_material_fee'}
								maxLength='7'
								pattern='[0-9.?(0-9){2}?]+?$'
								value={quoteSettingsState.air_hazardous_material_fee}
								disabled={props.plansInfo && props.plansInfo.plan_type > 1 ? false : true}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										air_hazardous_material_fee: e.target.value,
									})
								}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)}
						</div>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='text'
								name='handling_fee_markup'
								maxLength='7'
								pattern='[0-9.?(0-9){2}?]+%?$'
								value={quoteSettingsState.handling_fee_markup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										handling_fee_markup: e.target.value,
									})
								}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount, e.g 3.75, or a percentage, e.g, 5%.
							Leave blank to disable.
						</div>
					</Col>
				</Row>

				{/* <Row gutter={30}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Quote Details</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								value='1'
								name='qoute_details'
								checked={quoteSettingsState.quote_details === 1}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										quote_details: 1,
									})
								}
							>
								<span className='ml-5'>
									Write the quote details to the Additional Details widget
								</span>
							</Radio>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								value='2'
								name='qoute_details'
								checked={quoteSettingsState.quote_details === 2}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										quote_details: 2,
									})
								}
							>
								Write the quote details to the More Actions {'>'} Shipping quote details
								page
							</Radio>
						</Form.Item>
					</Col>
				</Row> */}

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
		installedAddons: state.installedAddons,
		radPlans: state.radPlans,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuoteSettingsComponentWweSmall);
