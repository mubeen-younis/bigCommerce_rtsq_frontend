import React, { Fragment, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
import {handlingFeeMarkup, validateHandlingFeeMarkup, blockInvalidChar, LableAsLimit} from '../../../Utilities/numberValidation'
import CutOffTime from '../../CutOffTime';
import DeliveryEstimateOptions from '../../DeliveryEstimateOptions';
import RAD from '../../RAD';
import LiftGateDelivery from '../../LiftGateDelivery';

const { Option } = Select;
const { Title } = Typography;

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		delivery_estimate_options: 1,
		order_cut_off_time: '',
		fulfillment_offset_days: '',
		all_week_days_select: true,
		week_days: [1, 2, 3, 4, 5],
		showDeliveryEstimate: false,
		residentialPickup: false,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		alwaysLiftGatePickup: false,
		alwaysLiftGateDelivery: false,
		offerLiftGateDelivery: false,
		autoDetectedResidentialAddressesLfg: false,
		returnRates: false,
		shipper_relationship: 'shipper',
		third_party_country: 'US',
		third_party_city: null,
		third_party_state: null
	});

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings();
		}
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
		setQuoteSettingsState({
			...quoteSettingsState,
			...props.quoteSettings,
		});

		setLoading(false);
	};

	const onFinish = data => {
		data = {
			...quoteSettingsState,
			...data,
			carrierId: +props.carrierId,
		};
		var errormsg = '';
		if(data?.shipper_relationship === "third_party"){
			if(data?.third_party_zip?.length === 0){
				errormsg = "Third party postal code is required.";
			}else if(data?.third_party_zip?.length !== 5){
				errormsg = "Third party postal code should be 5 digit number.";
			}
		}
		if(errormsg === ''){
			errormsg = validateHandlingFeeMarkup(data?.handling_free_markup, 'Handling fee');
		}
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
	const getGoogleLocation = zip_code => {
		if (zip_code.length > 4) {
			setLoading(true)
			axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zip_code}`, {
				headers: {
					authorization: `Bearer ${props.token}`,
				},
			})
			.then(({ data }) => {
				if (!data.error) {
					form.setFieldsValue({
						third_party_city: data?.data?.city[0],
						third_party_state: data?.data?.state,
					});
				}else{
					form.setFieldsValue({
						third_party_city: null,
						third_party_state: null,
					});
				}
				setLoading(false)
			})
			
		}
	};

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	return loading || !props.quoteSettings ? (
		<Skeleton active />
	) : (
		<Fragment>
			<Form
				layout='vertical'
				name='quote_settings_info'
				className='form-wrp'
				size={'large'}
				form={form}
				onFinish={onFinish}
				initialValues={props.quoteSettings}
			>
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
						What the user sees during checkout, e.g. "LTL Freight". If left blank, "Freight" will display as the shipping method.
						</div>
					</Col>
				</Row>

				<DeliveryEstimateOptions
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
				/>
					
				<CutOffTime
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					handleChange={handleStateChange}
				/>
				
				<RAD
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>

				<LiftGateDelivery
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
					radStatus={radStatus}
				/>
					
				{/* <Row gutter={30} className={'mb-3'}>
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
								Show Delivery Estimate.
							</Checkbox>
						</Form.Item>
					</Col>
				</Row> */}

				{/*}
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Weight of Handling Unit</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='weight_of_handling_unit'>
							<Input maxLength='7' pattern='[0-9.?(0-9){2}?]+%?$' />
						</Form.Item>
						<div className={'text-gray'}>
							Enter in pounds the weight of your pallet, skid, crate, or other types of
							handling unit. Leave blank to disable.
						</div>
					</Col>
				</Row>
				{*/}
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>Weight of Handling Unit</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='weight_of_handling_unit'>
							<Input
								maxLength='7'
								//pattern='[0-9.?(0-9){2}?]+%?$'
								onKeyDown={handlingFeeMarkup}
								value={quoteSettingsState.weight_of_handling_unit}
								onChange={e =>
									setQuoteSettingsState(
										'weight_of_handling_unit',
										e.target.value
									)
								}
								type="number"
								min='0'
								step='0.001'
								max='20000'
								pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter in pounds the weight of your pallet, skid, crate, or
							other types of handling unit. Leave blank to disable.
						</div>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>
							Maximum Weight per Handling Unit
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='max_weight_per_handling_unit'>
							<Input
								maxLength='7'
								//pattern='[0-9.?(0-9){2}?]+%?$'
								onKeyDown={handlingFeeMarkup}
								value={quoteSettingsState.max_weight_per_handling_unit}
								onChange={e =>
									

									setQuoteSettingsState(
										'max_weight_per_handling_unit',
										e.target.value
									)
								}
								type="number"
								min='0'
								step='0.001'
								max='20000'
								pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter in pounds the maximum weight that can be placed on the
							handling unit. Leave blank to disable.
						</div>
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
							//pattern='[0-9.?(0-9){2}?]+%?$' 
							onKeyDown={handlingFeeMarkup}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount, e.g 3.75, or a percentage, e.g, 5%.
							Leave blank to disable.
						</div>
					</Col>
				</Row>

				{/*}
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address appears to be a post office box
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='return_rates'
								checked={
									props?.plansInfo?.plan_type > 1 ? quoteSettingsState.returnRates : false
								}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										returnRates: !quoteSettingsState.returnRates,
									})
								}
								//disabled={props?.plansInfo?.plan_type < 2 ? true : false}
							>
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>
				{*/}

				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Relationship To Shipper</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='shipper_relationship'>
							<Select
								defaultValue={quoteSettingsState.shipper_relationship}
								size={'large'}
								style={{ width: '100%' }}
								onChange={value => {
									setQuoteSettingsState({
										...quoteSettingsState,
										shipper_relationship: value,
									});
								}}
							>
								<Option value='shipper'>Shipper</Option>
								<Option value='third_party'>Third Party</Option>
							</Select>
						</Form.Item>
						<div className={'text-gray'}>
							How you identify yourself when getting quotes on UPS.com
						</div>
					</Col>
				</Row>
				{ quoteSettingsState.shipper_relationship == 'third_party' ? (  
				<>
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Third Party Country or Territory</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='third_party_country'>
						<Select
								defaultValue={quoteSettingsState.third_party_country}
								size={'large'}
								style={{ width: '100%' }}
								onChange={value => {
									setQuoteSettingsState({
										...quoteSettingsState,
										third_party_country: value,
									});
								}}
							>
								<Option value='US'>United States</Option>
								<Option value='CA'>Canada</Option>
								<Option value='GU'>Guam</Option>
								<Option value='MX'>Mexico</Option>
								<Option value='PR'>Puerto Rico</Option>
								<Option value='VI'>US Virgin Islands</Option>
							</Select>
						</Form.Item>
						<div className={'text-gray'}>
							Select the third party country
						</div>
					</Col>
				</Row>
				<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' style={{paddingTop:'11px'}} xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>Third Party Postal Code</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='third_party_zip'>
							<Input 
							pattern="[0-9]*"
							type="number"
							onKeyDown={blockInvalidChar}
							onChange={e => {
								getGoogleLocation(e.target.value);
							}}
							/>
						</Form.Item>
						
						<div className={'text-gray'}>
							Enter the third party postal code. (For US, enter only the 5 digit ZIP code.)
						</div>
						<Form.Item style={{ display: 'none' }} className={'mb-0'} name='third_party_city'>
							<Input type="text"/>
						</Form.Item>
						<Form.Item style={{ display: 'none' }} className={'mb-0'} name='third_party_state'>
							<Input type="text" />
						</Form.Item>
					</Col>
				</Row> 
				</>
				 ) : null }

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
