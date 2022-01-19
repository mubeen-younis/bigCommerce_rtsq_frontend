import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Input, Skeleton } from 'antd';
import { connect, useDispatch } from 'react-redux';
import { postData } from '../../../Actions/Action';
import { getQuoteSettings } from '../../../Actions/Settings';
import { handlingFeeMarkup, validateHandlingFeeMarkup } from '../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions';
import CutOffTime from '../../CutOffTime';
import GroundTransit from '../../GroundTransit'
import HazardousMaterial from '../../HazardousMaterial';
import RAD from '../../RAD';
import SaveButton from '../../SaveButton';
import Services from './Services';

const initialState = {
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
	all_week_days_select: true,
	week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
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
}

function QuoteSettingsComponentWweSmall(props) {
	const [loading, setLoading] = useState(true);
	const [checkAll, setCheckAll] = useState(false);
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState);
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
				{/* WWE SERVICES */}
				<Services
					quoteSettingsState={quoteSettingsState}
					checkAll={checkAll}
					allCheckHandler={allCheckHandler}
					onChange={onChange}
					onCheck={onCheck}
				/>

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
				<GroundTransit
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				<RAD
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				<HazardousMaterial
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

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

				<SaveButton />
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
