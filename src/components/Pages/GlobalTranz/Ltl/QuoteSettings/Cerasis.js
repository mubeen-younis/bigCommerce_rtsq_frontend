import { Fragment, useEffect, useState } from 'react'
import { Select, Typography, Row, Col, Form, Input, Radio } from 'antd'
import { LableAsLimit } from '../../../../../Utilities/numberValidation'
import DeliveryEstimateOptions from '../../../../DeliveryEstimateOptions'
import CutOffTime from '../../../../CutOffTime'
import LiftGateDelivery from '../../../../LiftGateDelivery'
import LimitedAccessSettings from '../../../../LimitedAccessSettings'
import { useCallback } from 'react'
import NotifyBeforeDelivery from '../../../../NotifyBeforeDelivery'
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
	always_quote_notify: false,
  	offer_notify_as_option: false,
}

const Cerasis = ({
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
	quoteSettings,
}) => {
	const [inputCheapest, setInputCheapest] = useState(quoteSettingsState?.cheapest_label);
	const [inputAverage, setInputAverage] = useState(quoteSettingsState?.average_rate_label);
	const [inputThreshold, setInputThreshold] = useState(quoteSettingsState?.threshold_label);
	const [inputRoomOfChoice, setInputRoomOfChoice] = useState(quoteSettingsState?.room_of_choice_label);
	const [inputPremium, setInputPremium] = useState(quoteSettingsState?.premium_label);
	useEffect(() => {
		setQuoteSettingsState((prevState) => ({
			...initialSettings,
			...prevState,
		}))
	}, [setQuoteSettingsState])

	const handleStateChange = useCallback(
		(name, value) => {
			setQuoteSettingsState((prevState) => ({
				...prevState,
				[name]: value,
			}))
		},
		[setQuoteSettingsState]
	)

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

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'} name='shipping_service'>
						<Select
							defaultValue='standard_ltl'
							value={quoteSettingsState?.shipping_service}
							onChange={(opt) =>
								setQuoteSettingsState((prevState) => ({
									...prevState,
									shipping_service: opt,
								}))
							}>
							<Option value='standard_ltl'>
								Standard LTL Freight Services
							</Option>
							<Option value='final_mile'>Final Mile Services</Option>
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
									onChange={(opt) =>
										setQuoteSettingsState((prevState) => ({
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
										value={quoteSettingsState?.number_of_options}
										onChange={(opt) =>
											setQuoteSettingsState((prevState) => ({
												...prevState,
												number_of_options: opt,
											}))
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
								{+quoteSettingsState?.rating_method === 1 && (
									<Form.Item
										className={'mb-0'}
										name='cheapest_label'>
										<Input
											value={
												quoteSettingsState?.cheapest_label ||
												''
											}
											onKeyDown={LableAsLimit}
											addonAfter={inputCheapest ? <span>{`${inputCheapest?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
											onChange={(e) => {
												setQuoteSettingsState(
													(prevState) => ({
														...prevState,
														cheapest_label:
															e.target.value,
													})
												)
												setInputCheapest(e.target.value)
											}}
										/>
									</Form.Item>
								)}
								{+quoteSettingsState?.rating_method === 3 && (
									<Form.Item
										className={'mb-0'}
										name='average_rate_label'>
										<Input
											value={
												quoteSettingsState?.average_rate_label ||
												''
											}
											onKeyDown={LableAsLimit}
											addonAfter={inputAverage ? <span>{`${inputAverage?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
											onChange={(e) => {
												setQuoteSettingsState(
													(prevState) => ({
														...prevState,
														average_rate_label:
															e.target.value,
													})
												)
												setInputAverage(e.target.value)
											}}
										/>
									</Form.Item>
								)}
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
										onChange={(e) =>
											setQuoteSettingsState((prevState) => ({
												...prevState,
												final_mile_service_level:
													'threshold',
											}))
										}
									/>
									<Input
										name='threshold_label'
										value={
											quoteSettingsState?.threshold_label || ''
										}
										onChange={(e) => {
											setQuoteSettingsState((prevState) => ({
												...prevState,
												threshold_label: e.target.value,
											}))
											setInputThreshold(e.target.value)
										}}
										onKeyDown={LableAsLimit}
										addonAfter={inputThreshold ? <span>{`${inputThreshold?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
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
							<label className={'text-gray'}>Room of Choice</label>
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
										onChange={(e) =>
											setQuoteSettingsState((prevState) => ({
												...prevState,
												final_mile_service_level:
													'room_of_choice',
											}))
										}
									/>
									<Input
										name='room_of_choice_label'
										value={
											quoteSettingsState?.room_of_choice_label ||
											''
										}
										onChange={(e) => {
											setQuoteSettingsState((prevState) => ({
												...prevState,
												room_of_choice_label: e.target.value,
											}))
											setInputRoomOfChoice(e.target.value)
										}}
										onKeyDown={LableAsLimit}
										addonAfter={inputRoomOfChoice ? <span>{`${inputRoomOfChoice?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
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
										onChange={(e) =>
											setQuoteSettingsState((prevState) => ({
												...prevState,
												final_mile_service_level: 'premium',
											}))
										}
									/>
									<Input
										name='premium_label'
										value={
											quoteSettingsState?.premium_label || ''
										}
										onChange={(e) => {
											setQuoteSettingsState((prevState) => ({
												...prevState,
												premium_label: e.target.value,
											}))
											setInputPremium(e.target.value)
										}}
										onKeyDown={LableAsLimit}
										addonAfter={inputPremium ? <span>{`${inputPremium?.length}/${20}`}</span> : <span>{`${0}/${20}`}</span>}
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
					{/* {['1', '2'].includes(quoteSettingsState?.rating_method) && (
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
					)} */}

					<DeliveryEstimateOptions
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
					/>

					<CutOffTime
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
						handleChange={handleStateChange}
					/>

					<LiftGateDelivery
						quoteSettingsState={quoteSettingsState}
						setQuoteSettingsState={setQuoteSettingsState}
						radStatus={radStatus}
					/>

					<NotifyBeforeDelivery
						quoteSettingsState={quoteSettingsState}
				  		setQuoteSettingsState={setQuoteSettingsState}
			  		/>

					{/* <LimitedAccessSettings
          				quoteSettingsState={quoteSettingsState}
          				setQuoteSettingsState={setQuoteSettingsState}
          				islimitedAccessFee = {true}
        			/> */}

				</Fragment>
			)}
		</>
	)
}

export default Cerasis
