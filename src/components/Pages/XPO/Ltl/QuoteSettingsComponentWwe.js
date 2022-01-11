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
} from 'antd'

import { connect, useDispatch } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
	LableAsLimit
} from '../../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../../DeliveryEstimateOptions'
import CutOffTime from '../../../CutOffTime'
import RAD from '../../../RAD'
import LiftGateDelivery from '../../../LiftGateDelivery'

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState({
		label_as: '',
		showDeliveryEstimate: false,
		delivery_estimate_options: 1,
		order_cut_off_time: '',
		fulfillment_offset_days: '',
		all_week_days_select: true,
		week_days: [1, 2, 3, 4, 5],
		residentialPickup: false,
		alwaysResidentialDelivery: false,
		autoDetectedResidentialAddresses: false,
		alwaysLiftGatePickup: false,
		alwaysLiftGateDelivery: false,
		offerLiftGateDelivery: false,
		autoDetectedResidentialAddressesLfg: false,
		hold_at_terminal: false,
		hold_at_terminal_price: '',
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

		if (!data?.hold_at_terminal) {
			data = {
				...data,
				hold_at_terminal_price:
					props?.quoteSettings?.hold_at_terminal_price,
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

		if (errormsg === '') {
			props.postData(data, props.token)
		} else {
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
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
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
							What the user sees during checkout, e.g. "Freight". If left blank will default to "Freight".
						</div>
					</Col>
				</Row>

				{/* <Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>
							Show Delivery Estimate
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name='show_delivery_estimate'
								// value={true}
								checked={
									quoteSettingsState.showDeliveryEstimate
								}
								onChange={() => {
									setQuoteSettingsState({
										...quoteSettingsState,
										showDeliveryEstimate:
											!quoteSettingsState.showDeliveryEstimate,
									})
								}}>
								Show Delivery Estimates With Shipping Services.
							</Checkbox>
						</Form.Item>
					</Col>
				</Row> */}

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
				
				{/*}
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
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
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
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
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								value={
									quoteSettingsState.hold_at_terminal_price
								}
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
							Adjust the price of the Hold At Terminal option.
							Enter an amount, e.g. 3.75, or a percentage, e.g.
							5%. Leave blank to use the price returned by the
							carrier.
						</label>
					</Col>
							</Row> {*/}
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
							Weight of Handling Unit
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item
							className={'mb-0'}
							name='weight_of_handling_unit'>
							<Input
								maxLength='7'
								//pattern='[0-9.?(0-9){2}?]+%?$'
								onKeyDown={handlingFeeMarkup}
								value={
									quoteSettingsState.weight_of_handling_unit
								}
								onChange={e =>
									handleStateChange(
										'weight_of_handling_unit',
										e.target.value
									)
								}
								type='number'
								min='0'
								step='0.001'
								max='20000'
								pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter in pounds the weight of your pallet, skid,
							crate, or other types of handling unit. Leave blank
							to disable.
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
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item
							className={'mb-0'}
							name='max_weight_per_handling_unit'>
							<Input
								maxLength='7'
								//pattern='[0-9.?(0-9){2}?]+%?$'
								onKeyDown={handlingFeeMarkup}
								value={
									quoteSettingsState.max_weight_per_handling_unit
								}
								onChange={e =>
									handleStateChange(
										'max_weight_per_handling_unit',
										e.target.value
									)
								}
								type='number'
								min='0'
								step='0.001'
								max='20000'
								pattern='[0-9.?(0-9){2}?]+%?$'
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Enter in pounds the maximum weight that can be
							placed on the handling unit. Leave blank to disable.
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
							Handling Fee / Markup
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item
							className={'mb-0'}
							name='handling_free_markup'>
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
{/*}
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
							Do not return rates if the shipping address appears
							to be a post office box
						</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className={'mb-0'} name='returnRates'>
							<Checkbox
								checked={
									quoteSettingsState.returnRates || false
								}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										returnRates: e.target.checked,
									}))
								}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col
						className='gutter-row mb-0'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Quote Details</Title>
					</Col>

					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}></label>
					</Col>
					<Col
						className='gutter-row mb-0'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className='mb-0'>
							<Radio
								checked={quoteSettingsState.quote_details === 1}
								onChange={e =>
									handleStateChange('quote_details', 1)
								}>
								Write the quote details to the More Actions{' '}
								{'>'} Shipping quote details page
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
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className='mb-0'>
							<Radio
								checked={quoteSettingsState.quote_details === 2}
								onChange={e =>
									handleStateChange('quote_details', 2)
								}>
								Write the quote details to the Additional
								Details widget
							</Radio>
						</Form.Item>
					</Col>
				</Row>
				{*/}
				<Row gutter={30} className={'mt-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Form.Item
							style={{ textAlign: 'right', marginBottom: '0' }}>
							<Space>
								<Button
									type='primary'
									size={'large'}
									htmlType='submit'>
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
				postData(
					data,
					'GET_QUOTE_SETTINGS',
					'submit_quote_settings',
					token
				)
			),
		getSettings: (token, carrier_id) =>
			dispatch(getQuoteSettings(token, carrier_id)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuoteSettingsComponentWwe)
