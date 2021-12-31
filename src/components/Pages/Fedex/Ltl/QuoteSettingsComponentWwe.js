import React, { Fragment, useState, useEffect, useCallback } from 'react'
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
	Tooltip,
} from 'antd'

import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
	handleKeyDownDecimalNumber,
	LableAsLimit
} from '../../../../Utilities/numberValidation'

const { Title } = Typography

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		fedex_select_all: false,
		fedex_freight_economy: false,
		fedex_freight_priority: false,
		delivery_estimate_options: 1,
		order_cut_off_time: '',
		fulfillment_offset_days: '',
		hold_at_terminal: false,
		hold_at_terminal_price: '',
		account_discount_price:60,
		account_discount: 1,
		incentive_discount_percentage: '',
		showDeliveryEstimate: false,
		residentialPickup: false,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		alwaysLiftGatePickup: false,
		alwaysLiftGateDelivery: false,
		offerLiftGateDelivery: false,
		autoDetectedResidentialAddressesLfg: false,
		weight_of_handling_unit: '',
		max_weight_per_handling_unit: '',
		returnRates: false,
		quote_details: 1,
	})

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings()
		}
	}, [props.quoteSettings])
	const radCheck = props.installedAddons.find(
		add => add.short_code === 'RAD' && add.is_enabled === 1
	)
	let radStatus = false
	if (radCheck !== undefined) {
		radStatus =
			props?.radPlans?.currentPackage === null
				? false
				: props?.radPlans?.currentPackage?.status !== 1
				? false
				: true
	}
	const getQuoteSettings = () => {
		setQuoteSettingsState({
			...quoteSettingsState,
			...props.quoteSettings,
		})

		setLoading(false)
	}

	const onFinish = data => {
		data = {
			...quoteSettingsState,
			...data,
			carrierId: +props.carrierId,
		}
		console.log(data)
		let checkCS = data?.fedex_freight_priority || data?.fedex_freight_economy;
		if(!data?.hold_at_terminal){
			data = {
				...data,
				hold_at_terminal_price: props?.quoteSettings?.hold_at_terminal_price
			}
		}
		let errormsg = ''

		/*errormsg = validateHandlingFeeMarkup(
			data?.weight_of_handling_unit,
			'Weight of Handling Unit'
		)*/
		

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.handling_free_markup,
				'Handling fee'
			)
		}
		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.hold_at_terminal_price,
				'Hold at terminal fee'
			)
		}
		if (data?.account_discount === 2){
			if ( data?.account_discount_price === null || data?.account_discount_price === "" ) {
				errormsg = 'Promotional discount format should be 10 or 60.5, not allow to put negative value greater than 100. Only 4 digits are allowed after decimal point.';
			}
		}else{
			data.account_discount_price = props?.quoteSettings?.account_discount_price
		}
		
		if (checkCS && errormsg === '') {
			props.postData(data, props.token)
		} else {
			errormsg = errormsg === '' ? 'Please select at least one service option.' : errormsg;
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
	}

	const handleStateChange = useCallback((name, value) => {
		setQuoteSettingsState(prevState => ({
			...prevState,
			[name]: value,
		}))
	}, [])

	const selectAllQuoteOptions = useCallback(
		checked => {
			handleStateChange('fedex_select_all', checked)

			if (checked) {
				handleStateChange('fedex_freight_economy', true)
				handleStateChange('fedex_freight_priority', true)
			} else {
				handleStateChange('fedex_freight_economy', false)
				handleStateChange('fedex_freight_priority', false)
			}
		},
		[handleStateChange]
	)

	const toggleOptions = useCallback(
		(checked, field) => {
			if (checked && quoteSettingsState[field] === true) {
				handleStateChange('fedex_select_all', checked)
			} else {
				handleStateChange('fedex_select_all', false)
			}
		},
		[handleStateChange, quoteSettingsState]
	)

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
				initialValues={props.quoteSettings}>
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>Label As</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='label_as'>
							<Input
								name='label_as'
								value={
									props.quoteSettings
										? props.quoteSettings.label_as
										: ''
								}
								onKeyDown={LableAsLimit}
							/>
						</Form.Item>
						<div className={'text-gray'}>
						What the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.
						</div>
					</Col>
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Quote Service Options</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Select All</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='fedex_select_all'
								checked={quoteSettingsState.fedex_select_all}
								onChange={e => {
									selectAllQuoteOptions(e.target.checked)
								}}></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Fedex Freight Economy</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='offer_lift_gate_delivery'
								checked={quoteSettingsState.fedex_freight_economy}
								onChange={e => {
									handleStateChange(
										'fedex_freight_economy',
										e.target.checked
									)
									toggleOptions(
										e.target.checked,
										'fedex_freight_priority'
									)
								}}></Checkbox>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>Fedex Freight Priority</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='fedex_freight_priority'
								checked={quoteSettingsState.fedex_freight_priority}
								onChange={e => {
									handleStateChange(
										'fedex_freight_priority',
										e.target.checked
									)
									toggleOptions(
										e.target.checked,
										'fedex_freight_economy'
									)
								}}></Checkbox>
						</Form.Item>
					</Col>
				</Row>

				{/*}<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Delivery Estimate Options</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>fedex_freight_priority</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='delivery_estimate_options'
								value={true}
								checked={
									quoteSettingsState.delivery_estimate_options === 1
								}
								onChange={() =>
									handleStateChange('delivery_estimate_options', 1)
								}></Radio>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Display estimated number of days
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='delivery_estimate_options'
								checked={
									quoteSettingsState.delivery_estimate_options === 2
								}
								onChange={() =>
									handleStateChange('delivery_estimate_options', 2)
								}></Radio>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Display estimated delivery date
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Radio
								name='delivery_estimate_options'
								checked={
									quoteSettingsState.delivery_estimate_options === 3
								}
								onChange={() =>
									handleStateChange('delivery_estimate_options', 3)
								}></Radio>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Cut Off Time & Ship Date Offset</Title>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>Order Cut Off Time</label>
					</Col>
					<Col
						className='gutter-row mb-3'
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='time'
								value={quoteSettingsState.order_cut_off_time}
								onChange={e =>
									handleStateChange(
										'order_cut_off_time',
										e.target.value
									)
								}
								disabled={
									quoteSettingsState.delivery_estimate_options === 1
								}
							/>
							<div className={'text-gray'}>
								Enter the cut off time (e.g. 2:00) for orders. Orders
								placed after this time will be quoted as shipping the next
								business day.
							</div>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={12}
						md={12}
						lg={12}
						xl={6}>
						<label className={'text-gray'}>Fulfillment Offset Days</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='number'
								value={quoteSettingsState.fulfillment_offset_days}
								onChange={e =>
									handleStateChange(
										'fulfillment_offset_days',
										e.target.value
									)
								}
								disabled={
									quoteSettingsState.delivery_estimate_options === 1
								}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							The number of days the ship date needs to be moved to allow
							for the processing of the order.
						</div>
					</Col>
				</Row>{*/}

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Residential address settings</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Always quote residential delivery
						</label>
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
										alwaysResidentialDelivery:
											!quoteSettingsState.alwaysResidentialDelivery,
										autoDetectedResidentialAddresses: false,
									})
								}
								disabled={radStatus}></Checkbox>
						</Form.Item>
					</Col>
					
						<Fragment>
							<Col
								className='gutter-row'
								xs={24}
								sm={12}
								md={12}
								lg={12}
								xl={6}>
								<label className={'text-gray'}>
									Auto-detect residential addresses
								</label>
							</Col>
							<Col
								className='gutter-row'
								xs={24}
								sm={12}
								md={12}
								lg={12}
								xl={18}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name='autoDetectedResidentialAddresses'
										checked={
											quoteSettingsState.autoDetectedResidentialAddresses
										}
										onChange={() =>
											setQuoteSettingsState({
												...quoteSettingsState,
												autoDetectedResidentialAddresses:
													!quoteSettingsState.autoDetectedResidentialAddresses,
												alwaysResidentialDelivery: false,
											})
										}
										disabled={!radStatus}></Checkbox>
									{!radStatus && (
										<label
											className={'ml-4'}
											style={{ marginLeft: '10px' }}>
											Click <a href='/'>here</a> to add the
											Residential Address Detection add-on.
										</label>
									)}
								</Form.Item>
							</Col>
						</Fragment>
					
				</Row>

				<Row gutter={30} align='middle' className={'mb-4'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Lift gate settings</Title>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Always quote lift gate delivery
						</label>
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
										alwaysLiftGateDelivery:
											!quoteSettingsState.alwaysLiftGateDelivery,
										offerLiftGateDelivery: false,
										autoDetectedResidentialAddressesLfg: false,
									})
								}></Checkbox>
						</Form.Item>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Offer lift gate delivery as an option
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='offer_lift_gate_delivery'
								checked={quoteSettingsState.offerLiftGateDelivery}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										offerLiftGateDelivery:
											!quoteSettingsState.offerLiftGateDelivery,
										alwaysLiftGateDelivery: false,
									})
								}></Checkbox>
						</Form.Item>
					</Col>

					<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
						<label className={'text-gray'}>
							Always include lift gate delivery when a residential address
							is detected
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
										autoDetectedResidentialAddressesLfg:
											!quoteSettingsState.autoDetectedResidentialAddressesLfg,
										alwaysLiftGateDelivery: false,
									})
								}
								disabled={!radStatus}></Checkbox>
							{!radStatus && (
								<label className={'ml-4'} style={{ marginLeft: '10px' }}>
									Click <a href='/'>here</a> to add the Residential
									Address Detection add-on.
								</label>
							)}
						</Form.Item>
					</Col>
				</Row>

				{/*}<Row gutter={30} className={'mb-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Hold At Terminal</Title>
					</Col>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>
							Offer Hold At Terminal as an option
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-3'}>
							<Checkbox
								name='hold_at_terminal'
								checked={quoteSettingsState.hold_at_terminal}
								onChange={e =>
									handleStateChange(
										'hold_at_terminal',
										e.target.checked
									)
								}
							/>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState.hold_at_terminal_price}
								onChange={e =>
									handleStateChange(
										'hold_at_terminal_price',
										e.target.value
									)
								}
								maxLength={7}
								disabled={!quoteSettingsState.hold_at_terminal}
							/>
						</Form.Item>
						<label className={'text-gray'}>
							Adjust the price of the Hold At Terminal option. Enter an
							amount, e.g. 3.75, or a percentage, e.g. 5%. Leave blank to
							use the price returned by the carrier.
						</label>
					</Col>
				</Row>{*/}

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
									handleStateChange(
										'weight_of_handling_unit',
										e.target.value
									)
								}
								type="number"
								min='-20000'
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
									handleStateChange(
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
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
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
							Amount excluding tax. Enter an amount, e.g 3.75, or a
							percentage, e.g, 5%. Leave blank to disable.
						</div>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Discounts</Title>
					</Col>

					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className='mb-0'>
							<Radio
								checked={quoteSettingsState.account_discount === 1}
								onChange={e => handleStateChange('account_discount', 1)}>
								My account has negotiated LTL rates{' '}
								<Tooltip title='Choose this option if you have negotiated LTL rates with Fedex.'>
									<a href='#!' style={{ marginLeft: '10px' }}>
										[ ? ]
									</a>
								</Tooltip>
							</Radio>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						// style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col
						className='gutter-row'
						style={{ marginTop: '-10px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className='mb-0'>
							<Radio
								checked={quoteSettingsState.account_discount === 2}
								onChange={e => handleStateChange('account_discount', 2)}>
								My account receives an incentive discount{' '}
								<Tooltip
									title='Choose this option if you don’t have negotiated LTL freight rates with
								Fedex and instead receive an incentive discount. To verify, sign into Fedex.com and
								retrieve an LTL freight quote. Under the rate estimates will be a note with the heading, “More information about your results:�? The note will confirm that your rates are not negotiated, and identify the incentive discount used to generate the rate estimates.
								Enter the incentive discount as an integer into the app settings. Otherwise the rates returned to the shopping cart will be list price. Sixty (60) percent is a common
								incentive discount.'>
									<a href='#!' style={{ marginLeft: '10px' }}>
										[ ? ]
									</a>
								</Tooltip>
							</Radio>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								value={quoteSettingsState?.account_discount_price}
								defaultValue='60'
								onChange={e =>
									handleStateChange(
										'account_discount_price',
										e.target.value
									)
								}
								onKeyDown={ e => handleKeyDownDecimalNumber(e,10,4)}
								type="number"
								min='0'
								step='0.0001'
								max='100'
								pattern='[0-9.?(0-9){2}?]+%?$'
								disabled={quoteSettingsState.account_discount === 1}
							/>
						</Form.Item>
						<label className={'text-gray mb-3'}>
							Incentive discount percentage
						</label>
					</Col>
				</Row>

				{/*}<Row gutter={30} className={'mb-3 mt-3'}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address appears to be a
							post office box
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='shipper_relationship'>
							<Checkbox
								checked={quoteSettingsState.returnRates}
								onChange={e =>
									handleStateChange('returnRates', e.target.checked)
								}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
						<Title level={4}>Quote Details</Title>
					</Col>

					<Col
						className='gutter-row'
						// style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item>
							<Radio
								checked={quoteSettingsState.quote_details === 1}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										quote_details: 1,
									}))
								}>
								Write the quote details to the Additional Details widget
							</Radio>
						</Form.Item>
					</Col>

					<Col
						className='gutter-row'
						// style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col
						className='gutter-row'
						style={{ marginTop: '-10px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item>
							<Radio
								checked={quoteSettingsState.quote_details === 2}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										quote_details: 2,
									}))
								}>
								Write the quote details to the More Actions {'>'} Shipping
								quote details page
							</Radio>
						</Form.Item>
					</Col>
				</Row> {*/}

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
	)
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
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(data, 'GET_QUOTE_SETTINGS', 'submit_quote_settings', token)
			),
		getSettings: (token, carrier_id) => dispatch(getQuoteSettings(token, carrier_id)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(QuoteSettingsComponentWwe)
