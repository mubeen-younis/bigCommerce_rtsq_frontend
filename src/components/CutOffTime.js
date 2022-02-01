import React, { useCallback } from 'react'
import { Row, Col, Form, Input, Checkbox, Typography, TimePicker } from 'antd'
import moment from 'moment'

const { Title } = Typography

const CutOffTime = ({ quoteSettingsState, setQuoteSettingsState, handleChange }) => {
	const weekDaysMarkup = useCallback(
		() =>
			['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
				(day, i) => (
					<Checkbox
						key={i}
						style={{ margin: '0' }}
						checked={
							(quoteSettingsState?.week_days &&
								quoteSettingsState?.week_days.includes(day)) ||
							false
						}
						disabled={
							quoteSettingsState?.delivery_estimate_options === 1
						}
						onChange={(e) => {
							const wd = quoteSettingsState?.week_days || []
							const dayIndex = wd.indexOf(day)

							if (dayIndex < 0 && e.target.checked) {
								wd.push(day)
							}

							if (dayIndex >= 0 && !e.target.checked) {
								wd.splice(dayIndex, 1)
							}

							setQuoteSettingsState((prevState) => ({
								...prevState,
								week_days: wd.sort(),
								all_week_days_select: wd.length === 5 ?? false,
							}))
						}}>
						{day}
					</Checkbox>
				)
			),
		[
			quoteSettingsState?.delivery_estimate_options,
			quoteSettingsState?.week_days,
			setQuoteSettingsState,
		]
	)

	const selectAllWeekDays = useCallback(
		(e) => {
			setQuoteSettingsState((prevState) => ({
				...prevState,
				week_days: e.target.checked
					? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
					: [],
				all_week_days_select: e.target.checked,
			}))
		},
		[setQuoteSettingsState]
	)

	return (
		<div>
			<Row gutter={30} className='mb-3'>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Cut off time & ship date offset</Title>
				</Col>

				<Col
					className='gutter-row'
					style={{ paddingTop: '11px' }}
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>Order cut off time</label>
				</Col>
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={12}
					md={12}
					lg={12}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<TimePicker
							style={{ width: '100%' }}
							use24Hours
							value={
								quoteSettingsState?.order_cut_off_time === '' ||
								quoteSettingsState?.order_cut_off_time === null
									? ''
									: moment(
											quoteSettingsState?.order_cut_off_time,
											'HH:mm:ss'
									  )
							}
							onChange={(time, timeString) =>
								handleChange('order_cut_off_time', timeString)
							}
							disabled={
								!quoteSettingsState?.delivery_estimate_options ||
								quoteSettingsState?.delivery_estimate_options === 1
							}
						/>
						<div className={'text-gray'}>
							Enter the cut off time (e.g. 2:00) for orders. Orders
							placed after this time will be quoted as shipping the
							next business day.
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
					<label className={'text-gray'}>Fulfillment offset days</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Input
							type='number'
							min={1}
							max={8}
							maxLength={1}
							pattern='/^[0-8]*$/'
							placeholder='Fulfillment offset days e.g. 2'
							value={quoteSettingsState.fulfillment_offset_days}
							onChange={(e) => {
								handleChange(
									'fulfillment_offset_days',
									e.target.value
								)
							}}
							disabled={
								!quoteSettingsState?.delivery_estimate_options ||
								quoteSettingsState?.delivery_estimate_options === 1
							}
						/>
					</Form.Item>
					<div className={'text-gray mb-3'}>
						The number of days the ship date needs to be moved to allow
						for the processing of the order.
					</div>
				</Col>

				<Col
					className='gutter-row'
					style={{ paddingTop: '8px' }}
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={6}>
					<label className={'text-gray'}>
						What days do you ship orders?
					</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns:
									'repeat(auto-fill, minmax(100px, 1fr))',
								gap: '10px',
								justifyContent: 'space-between',
							}}>
							<Checkbox
								checked={quoteSettingsState?.all_week_days_select}
								onChange={(checked) => selectAllWeekDays(checked)}
								disabled={
									quoteSettingsState?.delivery_estimate_options ===
									1
								}>
								Select All
							</Checkbox>
							{weekDaysMarkup()}
						</div>
					</Form.Item>
				</Col>
			</Row>
		</div>
	)
}

export default CutOffTime
