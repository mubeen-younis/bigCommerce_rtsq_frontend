import { Fragment, useEffect } from 'react'
import {
	Select,
	Typography,
	Row,
	Col,
	Form,
	Input,
	Checkbox,
	Radio,
} from 'antd'
import {
	LableAsLimit
} from '../../../../../Utilities/numberValidation'
const { Option } = Select
const { Title } = Typography

const initialSettings = {
	shipping_service: 'standard_ltl',
	rating_method: '1',
	number_of_options: '1',
	cheapest_label: '',
	average_rate_label: '',
	label_as: '',
	final_mile_service_level: 'threshold',
	threshold_label: '',
	room_of_choice_label: '',
	premium_label: '',
}

const Cerasis = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
	quoteSettings,
}) => {
	useEffect(() => {
		setQuoteSettingsState(prevState => ({
			...initialSettings,
			...prevState,
		}))
	}, [setQuoteSettingsState])

	return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Shipping Service</label>
				</Col>

				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'} name='shipping_service'>
						<Select
							defaultValue='standard_ltl'
							value={quoteSettingsState?.shipping_service}
							onChange={opt =>
								setQuoteSettingsState(prevState => ({
									...prevState,
									shipping_service: opt,
								}))
							}>
							<Option value='standard_ltl'>
								Standard LTL Freight Services
							</Option>
							<Option value='final_mile'>
								Final Mile Services
							</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>

			{quoteSettingsState?.shipping_service === 'standard_ltl' ? (
				<Fragment>
					<Row gutter={30} className={'mb-3'}>
						<Col
							className='gutter-row'
							style={{ paddingTop: '11px' }}
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={6}>
							<label className={'text-gray'}>Rating Method</label>
						</Col>

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={18}>
							<Form.Item className={'mb-0'} name='rating_method'>
								<Select
									defaultValue='1'
									value={quoteSettingsState?.rating_method}
									onChange={opt =>
										setQuoteSettingsState(prevState => ({
											...prevState,
											rating_method: opt,
										}))
									}>
									<Option value='1'>Cheapest</Option>
									<Option value='2'>Cheapest Options</Option>
									<Option value='3'>Average Rate</Option>
								</Select>
							</Form.Item>
							<div className={'text-gray'}>
								{quoteSettingsState?.rating_method === '1' &&
									'Displays a least expensive option.'}
								{quoteSettingsState?.rating_method === '2' &&
									'Displays a list of a specified number of least expensive options.'}
								{quoteSettingsState?.rating_method === '3' &&
									'Displays a single rate based on an average of a specified number of least expensive options.'}
							</div>
						</Col>
					</Row>

					{['2', '3'].includes(quoteSettingsState?.rating_method) && (
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
									Number Of Options
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
									name='number_of_options'>
									<Select
										defaultValue='1'
										value={
											quoteSettingsState?.number_of_options
										}
										onChange={opt =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													number_of_options: opt,
												})
											)
										}>
										{Array.from({ length: 10 }, (_, i) => (
											<Option
												value={(i + 1).toString()}
												key={i}>
												{(i + 1).toString()}
											</Option>
										))}
									</Select>
								</Form.Item>
								<div className={'text-gray'}>
								
								{quoteSettingsState?.rating_method === '2' &&
									'Number of options to display in the shopping cart.'}
								{quoteSettingsState?.rating_method === '3' &&
									'Number of options to include in the calculation of the average.'}
								</div>
							</Col>
						</Row>
					)}

					{['1', '3'].includes(quoteSettingsState?.rating_method) && (
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
								{+quoteSettingsState?.rating_method === 1 && 
									<Form.Item className={'mb-0'} name='cheapest_label'>
										<Input
											value={
												quoteSettingsState?.cheapest_label || ''
											}
											onKeyDown={LableAsLimit}
											onChange={e => setQuoteSettingsState(prevState => ({
												...prevState,
												cheapest_label: e.target.value,	
											}))}
											/>
									</Form.Item>
								}
								{+quoteSettingsState?.rating_method === 3 && 
									<Form.Item className={'mb-0'} name='average_rate_label'>
										<Input
											value={
												quoteSettingsState?.average_rate_label || ''
											}
											onKeyDown={LableAsLimit}
											onChange={e => setQuoteSettingsState(prevState => ({
												...prevState,
												average_rate_label: e.target.value,	
											}))}
											/>
									</Form.Item>
								}
								<div className={'text-gray'}>
								{quoteSettingsState?.rating_method === '1' &&
									'What the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.'}
								{quoteSettingsState?.rating_method === '3' &&
									'What the user sees during checkout, e.g. "Freight". If left blank will default to "Freight".'}
								</div>
							</Col>
						</Row>
					)}
				</Fragment>
			) : (
				<Fragment>
					<Row gutter={30} className={'mb-3'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Title level={4}>Final Mile Services</Title>
						</Col>

						<Col
							className='gutter-row'
							style={{ paddingTop: '11px' }}
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={6}>
							<label className={'text-gray'}>Threshold</label>
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
								name='final_mile_service_level'>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<Radio
										style={{ marginRight: '2em' }}
										checked={
											quoteSettingsState?.final_mile_service_level ===
											'threshold'
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													final_mile_service_level:
														'threshold',
												})
											)
										}
									/>
									<Input
										name='threshold_label'
										value={
											quoteSettingsState?.threshold_label ||
											''
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													threshold_label:
														e.target.value,
												})
											)
										}
										onKeyDown={LableAsLimit}
									/>
								</div>
							</Form.Item>
							<div
								className={'text-gray'}
								style={{ marginLeft: '3.2em' }}>
								Label As
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
								Room of Choice
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
								name='final_mile_service_level'>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<Radio
										style={{ marginRight: '2em' }}
										checked={
											quoteSettingsState?.final_mile_service_level ===
											'room_of_choice'
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													final_mile_service_level:
														'room_of_choice',
												})
											)
										}
									/>
									<Input
										name='room_of_choice_label'
										value={
											quoteSettingsState?.room_of_choice_label ||
											''
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													room_of_choice_label:
														e.target.value,
												})
											)
										}
										onKeyDown={LableAsLimit}
									/>
								</div>
							</Form.Item>
							<div
								className={'text-gray'}
								style={{ marginLeft: '3.2em' }}>
								Label As
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
							<label className={'text-gray'}>Premium</label>
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
								name='final_mile_service_level'>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<Radio
										style={{ marginRight: '2em' }}
										checked={
											quoteSettingsState?.final_mile_service_level ===
											'premium'
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													final_mile_service_level:
														'premium',
												})
											)
										}
									/>
									<Input
										name='premium_label'
										value={
											quoteSettingsState?.premium_label ||
											''
										}
										onChange={e =>
											setQuoteSettingsState(
												prevState => ({
													...prevState,
													premium_label:
														e.target.value,
												})
											)
										}
										onKeyDown={LableAsLimit}
									/>
								</div>
							</Form.Item>
							<div
								className={'text-gray'}
								style={{ marginLeft: '3.2em' }}>
								Label As
							</div>
						</Col>
					</Row>
				</Fragment>
			)}

			{quoteSettingsState.shipping_service === 'standard_ltl' && (
				<Fragment>
					{['1', '2'].includes(quoteSettingsState?.rating_method) && (
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
										name='show_delivery_estimate'
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
										Show Delivery Estimates With Shipping
										Services.
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>
					)}

					<Row gutter={30} align='middle' className={'mb-4'}>
						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}>
							<Title level={4}>
								Residential address settings
							</Title>
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
												Click <a href='/'>here</a> to
												add the Residential Address
												Detection add-on.
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
									checked={
										quoteSettingsState.alwaysLiftGateDelivery
									}
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
									checked={
										quoteSettingsState.offerLiftGateDelivery
									}
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
								Always include lift gate delivery when a
								residential address is detected
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
				</Fragment>
			)}
		</>
	)
}

export default Cerasis
