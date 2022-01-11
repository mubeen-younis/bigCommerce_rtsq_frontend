import React, { Fragment, useState, useEffect, useCallback } from 'react';
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
import { connect, useDispatch } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';
import {handlingFeeMarkup, validateHandlingFeeMarkup, handleKeyDownDecimalNumber} from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions';
import CutOffTime from '../../CutOffTime';
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
		delivery_estimate_options: 1,
		order_cut_off_time: '',
		fulfillment_offset_days: '',
		all_week_days_select: false,
		week_days: [1, 2, 3, 4, 5],
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
	const dispatch = useDispatch()

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

		console.log(quoteSettingsState?.carrier_services?.[e.target.name])
		setQuoteSettingsState({
			...quoteSettingsState,
			carrier_services: {
				...quoteSettingsState.carrier_services,
				[e.target.name]: !quoteSettingsState?.carrier_services?.[e.target.name],
			},
		});

		if (checkAll && !e.target.checked) {
			setCheckAll(false);
			return;
		}

		const checks = {
			ups_ground: quoteSettingsState?.carrier_services?.ups_ground,
			ups_3_day_select: quoteSettingsState?.carrier_services?.ups_3_day_select,
			ups_2nd_day_air: quoteSettingsState?.carrier_services?.ups_2nd_day_air,
			ups_2nd_day_air_am: quoteSettingsState?.carrier_services?.ups_2nd_day_air_am,
			ups_2nd_day_air_saver: quoteSettingsState?.carrier_services?.ups_2nd_day_air_saver,
			ups_next_day_air: quoteSettingsState?.carrier_services?.ups_next_day_air,
			ups_next_day_air_saver: quoteSettingsState?.carrier_services?.ups_next_day_air_saver,
			ups_next_day_air_early: quoteSettingsState?.carrier_services?.ups_next_day_air_early,
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
		let CS = quoteSettingsState?.carrier_services ?? {};
		let checkCS = CS?.ups_2nd_day_air ||
		CS?.ups_2nd_day_air_am ||
		CS?.ups_2nd_day_air_saver ||
		CS?.ups_3_day_select ||
		CS?.ups_ground ||
		CS?.ups_next_day_air ||
		CS?.ups_next_day_air_early ||
		CS?.ups_next_day_air_saver
		console.log(quoteSettingsState); //return false;
		var errormsg = validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_ground_markup, 'UPS Ground markup ', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_3_day_select_markup, 'UPS 3 Day Select markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_2nd_day_air_markup, 'UPS 2nd Day Air markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_2nd_day_air_am_markup, 'UPS 2nd Day Air A.M. markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_2nd_day_air_saver_markup, 'UPS 2nd Day Air Saver markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_next_day_air_saver_markup, 'UPS Next Day Air Saver markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_next_day_air_markup, 'UPS Next Day Air markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.carrier_services?.ups_next_day_air_early_markup, 'UPS Next Day Air Early markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.handling_fee_markup, 'Handling Fee markup', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.air_hazardous_material_fee, 'Air Hazardous Material Fee', true);
		errormsg += validateHandlingFeeMarkup(quoteSettingsState?.ground_hazardous_material_fee, 'Ground Hazardous Material Fee', true);
		if(checkCS && errormsg === ''){
			props.postData({ ...quoteSettingsState, carrierId: +props.carrierId }, props.token);
		}else{
			errormsg = errormsg === '' ? 'Please select at least one service option.' : errormsg;
			errormsg = errormsg.split('exploder')[0];
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
                    alertMessage: errormsg,
                    alertMessageType: 'error',
                },
            });
		}
		
	};

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	const radCheck = props.installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	);
	
	let radStatus = false;
	if(radCheck !== undefined){
		radStatus = props?.radPlans?.currentPackage === null ? false:
		props?.radPlans?.currentPackage?.status !== 1 ? false : true;
	}

	const validateNonNegWholeNumber = (value) =>{
		value = Number(value)
		value = value < 0 ? value*(-1) : value
		return value.toFixed(2);
	}

	const validateWholeNumber = value => {
		value = Number(value)
		return value.toFixed(2);
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
				<Row gutter={24} align='middle' className={'mb-4'}>
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

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>Select All Services</label>
					</Col>
					<Col className='gutter-row'  sm={12} md={12} lg={12} xl={18}>
						<Form.Item className='mb-0 ml-5'>
							<Checkbox
								name='select_all'
								value={true}
								checked={checkAll}
								onChange={allCheckHandler}
							></Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS Ground</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_ground'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_ground ? true : null}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								name={'ups_ground_markup'}
								value={quoteSettingsState?.carrier_services?.ups_ground_markup}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS 3 Day Select</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_3_day_select'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_3_day_select}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.carrier_services?.ups_3_day_select_markup}
								
								name={'ups_3_day_select_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_2nd_day_air}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.carrier_services?.ups_2nd_day_air_markup}
								
								name={'ups_2nd_day_air_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air A.M.</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air_am'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_2nd_day_air_am}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.carrier_services?.ups_2nd_day_air_am_markup}
								name={'ups_2nd_day_air_am_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS 2nd Day Air Saver</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_2nd_day_air_saver'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_2nd_day_air_saver}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.carrier_services?.ups_2nd_day_air_saver_markup}
								name={'ups_2nd_day_air_saver_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air Saver</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air_saver'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_next_day_air_saver}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.carrier_services?.ups_next_day_air_saver_markup}
								
								name={'ups_next_day_air_saver_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_next_day_air}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								//maxLength='7'
								value={quoteSettingsState?.carrier_services?.ups_next_day_air_markup}
								//pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_next_day_air_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>UPS Next Day Air Early</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='ups_next_day_air_early'
								value={true}
								checked={quoteSettingsState?.carrier_services?.ups_next_day_air_early}
								onChange={onCheck}
							></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<Form.Item className={'mb-0'}>
							<Input
								//maxLength='7'
								value={quoteSettingsState?.carrier_services?.ups_next_day_air_early_markup}
								//pattern='[0-9.?(0-9){2}?]+%?$'
								name={'ups_next_day_air_early_markup'}
								onChange={onChange}
								onKeyDown={handlingFeeMarkup}
								maxLength='7'
								type='text'
							/>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<label className={'text-gray'}>
							Markup (e.g Currency 1.0 or percentage 5%)
						</label>
					</Col>
				</Row>

				{/* <Row gutter={24} align='middle' className={'mb-2'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={8} xl={6}>
						<label className={'text-gray'}>Show Delivery Estimate</label>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='showDeliveryEstimate'
								value={true}
								checked={quoteSettingsState?.showDeliveryEstimate}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										showDeliveryEstimate: !quoteSettingsState?.showDeliveryEstimate,
									})
								}
							></Checkbox>
						</Form.Item>
					</Col>
				</Row> */}
				{/* END */}
					
				<DeliveryEstimateOptions
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>
				
				<CutOffTime
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					handleChange={handleStateChange}
				/>

				{/* Ground transit time settings */}

				<Row gutter={30} align='middle' className={'mb-2'}>
					<Col className='gutter-row mt-4' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Ground transit time restrictions</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
						Enter the number of transit days to restrict ground service to. Leave blank to disable this service.
						</label>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={18}>
						<Form.Item className={'mb-0'} name='number_of_transit_days'>
							<Input
								type='number'
								min='1'
								step='1'
								value={quoteSettingsState?.number_of_transit_days}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										number_of_transit_days: e.target.value,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Restrict by the carrier's in transit days metric
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='ground_metric'
								value='1'
								checked={quoteSettingsState?.ground_metric === 1}
								// checked={true}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_metric: 1,
									})
								}
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Restrict by the calendar days in transit
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
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
								//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
							/>
							{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
						</Form.Item>
					</Col>
				</Row>

				{/* End Transit  */}

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Always quote residential delivery</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='alwaysResidentialDelivery'
								value={true}
								checked={quoteSettingsState?.alwaysResidentialDelivery}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										alwaysResidentialDelivery: !quoteSettingsState?.alwaysResidentialDelivery,
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
							<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
								<label className={'text-gray'}>Auto-detect residential delivery</label>
							</Col>
							<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='autoDetectedResidentialAddresses'
										value={true}
										checked={quoteSettingsState?.autoDetectedResidentialAddresses}
										onChange={e =>
											setQuoteSettingsState({
												...quoteSettingsState,
												autoDetectedResidentialAddresses: !quoteSettingsState?.autoDetectedResidentialAddresses,
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

				<Row gutter={24}  align='middle' className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Hazardous material settings</Title>
					</Col>

					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
						<label className={'text-gray'}>
							Only quote ground service for hazardous materials shipments
						</label>
					</Col>
					<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
						<Form.Item  className={'mb-0'}>
							<Checkbox
								name={'ground_service_for_hazardous_material'}
								value={true}
								checked={quoteSettingsState?.ground_service_for_hazardous_material}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_service_for_hazardous_material: !quoteSettingsState?.ground_service_for_hazardous_material,
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
				</Row>

				<Row gutter={24} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}}  xs={24} sm={12} md={12} lg={6} xl={6}>
						<label className={'text-gray'}>Ground Hazardous Material Fee</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								name={'ground_hazardous_material_fee'}
								maxLength='7'
								value={quoteSettingsState?.ground_hazardous_material_fee}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										ground_hazardous_material_fee: e.target.value,
									})
								}
								onKeyDown={ e => handleKeyDownDecimalNumber(e,7,2)}
								type='number'
								min='0'
								step='0.01'
								//pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
						</div>
					</Col>
				</Row>

				<Row gutter={24} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={12} md={12} lg={6} xl={6}>
						<label className={'text-gray'}>Air Hazardous Material Fee</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='number'
								name={'air_hazardous_material_fee'}
								value={quoteSettingsState?.air_hazardous_material_fee}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										air_hazardous_material_fee: e.target.value,
									})
								}
								onKeyDown={ e => handleKeyDownDecimalNumber(e,7,2)}
								min='0'
								step='0.01'
								//pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter an amount, e.g 20. or Leave blank to disable.
							{/*props.plansInfo && props.plansInfo.plan_type < 2 && (
								<a href='#!' className='stnd-plan text-danger'>
									Standard plan required
								</a>
							)*/}
						</div>
					</Col>
				</Row>

				<Row gutter={24} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={6} xl={6}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='text'
								name='handling_fee_markup'
								maxLength='7'
								//pattern='[0-9.?(0-9){2}?]+%?$'
								//pattern="^[\-\+]\s*\d+\s*$"
								//pattern='^[%$][-+]?\d+([,.]\d{1,2})?|^[-+]?\d+([,.]\d{1,2})?[%]?'
								value={quoteSettingsState?.handling_fee_markup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										handling_fee_markup: e.target.value,
									})
								}
								maxLength='7' 
								onKeyDown={handlingFeeMarkup}
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
