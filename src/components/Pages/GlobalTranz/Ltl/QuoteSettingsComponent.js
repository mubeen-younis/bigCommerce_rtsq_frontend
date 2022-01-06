import React, { Fragment, useState, useEffect } from 'react'
import {
	Row,
	Col,
	Space,
	Button,
	Form,
	Input,
	/* Checkbox, */ Skeleton,
} from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import { getQuoteSettings } from '../../../../Actions/Settings'
import {
	handlingFeeMarkup,
	validateHandlingFeeMarkup,
	LableAsLimit
} from '../../../../Utilities/numberValidation'
import GlobalTranz from './QuoteSettings/GlobalTranz'
import Cerasis from './QuoteSettings/Cerasis'

function QuoteSettingsComponentWwe(props) {
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState({
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
		handling_free_markup: '',
		returnRates: false,
	})
	const { carrier_type } = useSelector(state => state)

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
			...data,
			...quoteSettingsState,
			carrierId: +props.carrierId,
		}

		let errormsg = ''
		if (
			!quoteSettingsState?.quickest_service &&
			quoteSettingsState?.method === 0 &&
			carrier_type === 'GTZ'
		) {
			errormsg = 'Please select at least one service option.'
		}

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.weight_of_handling_unit,
				'Weight of Handling Unit',
				true
			)
		}

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.max_weight_per_handling_unit,
				'Maximum Weight per Handling Unit',
				true
			)
		}

		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.handling_free_markup,
				'Handling fee'
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
				{carrier_type === 'GTZ' && (
					<GlobalTranz
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
						radStatus={radStatus}
					/>
				)}

				{carrier_type === 'CRS' && (
					<Cerasis
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
						radStatus={radStatus}
					/>
				)}

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
								type='number'
								min='0'
								step='0.01'
								max='20000'
								onKeyDown={handlingFeeMarkup}
								value={
									quoteSettingsState.weight_of_handling_unit
								}
								onChange={e => {
									setQuoteSettingsState(prevState => ({
										...prevState,
										weight_of_handling_unit: e.target.value,
									}))
								}}
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
								onChange={e => {
									setQuoteSettingsState(prevState => ({
										...prevState,
										max_weight_per_handling_unit:
											e.target.value,
									}))
								}}
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
								value={quoteSettingsState?.handling_free_markup}
								onKeyDown={handlingFeeMarkup}
								onChange={e => {
									setQuoteSettingsState(prevState => ({
										...prevState,
										handling_free_markup: e.target.value,
									}))
								}}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount, e.g 3.75, or a
							percentage, e.g, 5%. Leave blank to disable.
						</div>
					</Col>
				</Row>

				{/*}<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						//style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>
							Do not return rates if the shipping address appears to be a
							post office box
						</label>
					</Col>
					<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
						<Form.Item className={'mb-0'} name='returnRates'>
							<Checkbox
								name='return_rates'
								checked={quoteSettingsState.returnRates || false}
								onChange={() =>
									setQuoteSettingsState({
										...quoteSettingsState,
										returnRates: !quoteSettingsState.returnRates,
									})
								}
							/>
						</Form.Item>
					</Col>
							</Row>{*/}

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
