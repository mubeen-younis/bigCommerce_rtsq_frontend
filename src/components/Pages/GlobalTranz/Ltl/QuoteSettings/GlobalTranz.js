import { Fragment, useEffect, useState } from 'react'
import { Select, Typography, Row, Col, Form, Input, Checkbox } from 'antd'
import {
	LableAsLimit
} from '../../../../../Utilities/numberValidation'
const { Option } = Select
const { Title } = Typography

const initialSettings = {
	quickest_service: false,
	quickest_service_label: '',
	method: 0,
	label_as: '',
	number_of_options: '1',
	showDeliveryEstimate: false,
	show_guaranteed_options: false,
	always_quote_notify: false,
	offer_notify_as_option: false,
	offer_limited_access_delivery: false,
}

const GlobalTranz = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
	quoteSettings,
}) => {
	const [cheapestCheck, setCheapestCheck] = useState(false)

	useEffect(() => {
		setQuoteSettingsState(prevState => ({
			...initialSettings,
			...prevState,
			quickest_service:
				quoteSettingsState.method === 2
					? false
					: prevState.quickest_service,
			quickest_service_label:
				quoteSettingsState.method === 2
					? ''
					: prevState.quickest_service_label,
			label_as: quoteSettingsState.method === 2 ? '' : prevState.label_as,
		}))
		setCheapestCheck(quoteSettingsState.method === 1)
	}, [setQuoteSettingsState])

	return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={4}>Quote Service Options</Title>
				</Col>

				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Quickest</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Checkbox
								style={{ marginRight: '2em' }}
								checked={
									quoteSettingsState?.quickest_service ||
									false
								}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										quickest_service: e.target.checked,
									}))
								}
								disabled={quoteSettingsState?.method === 2}
							/>
							<Input
								value={
									quoteSettingsState?.quickest_service_label ||
									''
								}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										quickest_service_label: e.target.value,
									}))
								}
								placeholder='Label As (Quickest)'
								disabled={
									!quoteSettingsState?.quickest_service ||
									quoteSettingsState?.method === 2
								}
								onKeyDown={LableAsLimit}
							/>
						</div>
					</Form.Item>
					<div className={'text-gray'} style={{ marginLeft: '3em' }}>
						What the user sees during checkout, e.g. "Freight".
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
					<label className={'text-gray'}>Cheapest</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Checkbox
								style={{ marginRight: '2em' }}
								checked={
									quoteSettingsState?.method === 1 ||
									cheapestCheck
								}
								onChange={e => {
									setQuoteSettingsState(prevState => ({
										...prevState,
										method: e.target.checked ? 1 : 0,
									}))
									setCheapestCheck(e.target.checked)
								}}
								disabled={quoteSettingsState?.method === 2}
							/>
							<Input
								value={quoteSettingsState?.label_as || ''}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										label_as: e.target.value,
									}))
								}
								placeholder='Label As (Cheapest)'
								disabled={
									quoteSettingsState?.method === 2 ||
									!cheapestCheck
								}
								onKeyDown={LableAsLimit}
							/>
						</div>
					</Form.Item>
					<div className={'text-gray'} style={{ marginLeft: '3em' }}>
						What the user sees during checkout, e.g. "Freight".
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
					<label className={'text-gray'}>Cheapest Options</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Checkbox
								style={{ marginRight: '2em' }}
								checked={quoteSettingsState?.method === 2}
								onChange={e =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										method: e.target.checked ? 2 : cheapestCheck ? 1 : 0,
									}))
								}
							/>
							<Select
								defaultValue='1'
								value={quoteSettingsState?.number_of_options}
								onChange={opt =>
									setQuoteSettingsState(prevState => ({
										...prevState,
										number_of_options: opt,
									}))
								}
								disabled={quoteSettingsState?.method !== 2}>
								{Array.from({ length: 10 }, (_, i) => (
									<Option value={(i + 1).toString()} key={i}>
										{(i + 1).toString()}
									</Option>
								))}
							</Select>
						</div>
					</Form.Item>
					<div className={'text-gray'} style={{ marginLeft: '3em' }}>
						Number of options to display in the shopping cart.
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
							checked={quoteSettingsState?.showDeliveryEstimate}
							onChange={e => {
								setQuoteSettingsState(prevState => ({
									...prevState,
									showDeliveryEstimate: e.target.checked,
								}))
							}}>
							Show Delivery Estimates With Shipping Services.
						</Checkbox>
					</Form.Item>
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
					<label className={'text-gray'}>Show Guaranteed Options</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='show_guaranteed_options'
							checked={quoteSettingsState?.show_guaranteed_options}
							onChange={e => {
								setQuoteSettingsState({
									...quoteSettingsState,
									show_guaranteed_options: e.target.checked,
								})
							}}
							disabled={!quoteSettingsState?.showDeliveryEstimate}
							onClick={e => console.log(e)}></Checkbox>
						{!quoteSettingsState?.showDeliveryEstimate && (
							<label className={'ml-4'} style={{ marginLeft: '10px' }}>
								To use guaranteed options, you have to enable the delivery
								estimation option.
							</label>
						)}
					</Form.Item>
				</Col>
			</Row>{*/}

			<Row gutter={30} align='middle' className={'mb-4'}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={4}>Residential address settings</Title>
				</Col>

				<Col
					className='gutter-row'
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						Always quote residential delivery
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
							name='alwaysResidentialDelivery'
							value={true}
							checked={
								quoteSettingsState.alwaysResidentialDelivery
							}
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
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={4}>Lift gate settings</Title>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						Always quote lift gate delivery
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
				<Col
					className='gutter-row'
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						Offer lift gate delivery as an option
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

				<Col
					className='gutter-row'
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						Always include lift gate delivery when a residential
						address is detected
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
							<label
								className={'ml-4'}
								style={{ marginLeft: '10px' }}>
								Click <a href='/'>here</a> to add the
								Residential Address Detection add-on.
							</label>
						)}
					</Form.Item>
				</Col>
			</Row>
			{/*}
			<Row gutter={30} align='middle' className={'mb-4'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Notify before delivery settings</Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Always quote notify before delivery
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.always_quote_notify || false}
							onChange={e =>
								setQuoteSettingsState(prevState => ({
									...prevState,
									always_quote_notify: e.target.checked,
									offer_notify_as_option: false,
								}))
							}></Checkbox>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Offer notify before delivery as an option.
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.offer_notify_as_option || false}
							onChange={e =>
								setQuoteSettingsState(prevState => ({
									...prevState,
									offer_notify_as_option: e.target.checked,
									always_quote_notify: false,
								}))
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-4'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Limited access settings</Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Offer limited access delivery as an option.
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={
								quoteSettingsState?.offer_limited_access_delivery || false
							}
							onChange={e =>
								setQuoteSettingsState(prevState => ({
									...prevState,
									offer_limited_access_delivery: e.target.checked,
								}))
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>
						{*/}
		</>
	)
}

export default GlobalTranz
