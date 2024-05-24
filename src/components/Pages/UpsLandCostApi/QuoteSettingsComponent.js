import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Row, Col, Form, Input, Skeleton, Typography } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import {
	validateHandlingFeeMarkup,
	LableAsLimit,
	handlingFeeMarkup,
} from '../../../Utilities/numberValidation'
import SaveButton from '../../SaveButton'
import ErrorManagment from '../../ErrorManagment'
import StaffNoteSettings from '../../StaffNoteSettings'
import EnableLogs from '../../EnableLogs'
import CurrencyAndComodityCode from './CurrencyAndComodityCode'
import TransportationModes from './TransportationModes'
import ShipmentType from './ShipmentType'
const { Title } = Typography;

const initialState = {
	label_as: '',
	handling_fee_markup: null,
	error_managment:1,
	currencyCode:'USD',
	TransportationModes:'',
	ShipmentType:''
}

function QuoteSettingsComponent(props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(true)
	const [quoteSettingsState, setQuoteSettingsState] = useState(initialState)
	const dispatch = useDispatch()
	const { thresholdSetting, staffNoteSettings } = useSelector(state => state)
	const [inputValue, setInputValue] = useState(props?.quoteSettings?.label_as);

	useEffect(() => {
		if (props.quoteSettings !== null && props.quoteSettings !== undefined) {
			getQuoteSettings()
		}
		// eslint-disable-next-line
	}, [props.quoteSettings])


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

		let errormsg = ''
		if (errormsg === '') {
			errormsg = validateHandlingFeeMarkup(
				data?.handling_free_markup,
				'Handling fee'
			)
		}

		if (errormsg === '') {
			dispatch(
				postData(
					data,
					'GET_QUOTE_SETTINGS',
					'submit_quote_settings',
					props.token
				)
			)
			dispatch(
				postData(
					thresholdSetting,
					'GET_THRESHOLD_SETTINGS',
					'submit_threshold_settings',
					props.token
				)
			)
			dispatch(
				postData(
					staffNoteSettings,
					'GET_STAFFNOTE_SETTINGS',
					'submit_staffnote_settings',
					props.token
				)
			)
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
								value={props?.quoteSettings?.label_as ?? ''}
								onKeyDown={LableAsLimit}
								onChange={(e) => setInputValue(e.target.value)}
								addonAfter={inputValue ? <span>{`${inputValue?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							What the user sees during checkout, e.g. "Freight". If
							left blank will default to "Freight".
						</div>
					</Col>
				</Row>

				<CurrencyAndComodityCode
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				<TransportationModes
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>

				<ShipmentType
					quoteSettingsState={quoteSettingsState}
					setQuoteSettingsState={setQuoteSettingsState}
				/>
				
				{/* Other Settings */}
				<Row gutter={24} className={'mb-2'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}>
						<Title level={4}>Other settings</Title>
					</Col>
				</Row>

				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={6}
						xl={6}
						style={{ paddingTop: '11px' }}>
						<label className={'text-gray'}>Handling Fee / Markup</label>
					</Col>
					<Col
						className='gutter-row mb-2'
						xs={24}
						sm={24}
						md={24}
						lg={18}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Input
								type='text'
								name='handling_fee_markup'
								maxLength='7'
								value={quoteSettingsState?.handling_fee_markup}
								onChange={e =>
									setQuoteSettingsState({
										...quoteSettingsState,
										handling_fee_markup: e.target.value,
									})
								}
								onKeyDown={handlingFeeMarkup}
							/>
						</Form.Item>
						<div className={'text-gray'}>
							Amount excluding tax. Enter an amount, e.g 3.75, or a
							percentage, e.g, 5%. Leave blank to disable.
						</div>
					</Col>
				</Row>

				<EnableLogs 
				quoteSettingsState={quoteSettingsState} 
				setQuoteSettingsState={setQuoteSettingsState}
				/>

				<StaffNoteSettings
					quoteSettingsState={quoteSettingsState}
					handleChange={handleStateChange}
				/>

				<ErrorManagment
          			quoteSettingsState={quoteSettingsState}
          			handleChange={handleStateChange}
        		/>

				<SaveButton />
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

export default connect(mapStateToProps)(QuoteSettingsComponent)
