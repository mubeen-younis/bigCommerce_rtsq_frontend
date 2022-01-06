import React, { useCallback } from 'react'
import { Row, Col, Form, Input, Checkbox, Typography } from 'antd'

const { Title } = Typography

const CutOffTime = ({ quoteSettingsState, setQuoteSettingsState, handleChange }) => {
	const weekDaysMarkup = useCallback(
		() =>
			['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
				(day, i) => (
					<Checkbox
						style={{ marginLeft: '0px' }}
						checked={
							(quoteSettingsState?.week_days &&
								quoteSettingsState?.week_days.includes(day)) ||
							false
						}
						onChange={e => {
							const wd = quoteSettingsState?.week_days || []
							const dayIndex = wd.indexOf(day)

							if (dayIndex < 0 && e.target.checked) {
								wd.push(day)
							}

							if (dayIndex >= 0 && !e.target.checked) {
								wd.splice(dayIndex, 1)
							}

							setQuoteSettingsState(prevState => ({
								...prevState,
								week_days: wd.sort(),
								select_all_week_days: wd.length === 5 ?? false,
							}))
						}}>
						{day}
					</Checkbox>
				)
			),
		[quoteSettingsState?.week_days, setQuoteSettingsState]
	)

	const selectAllWeekDays = useCallback(
		e => {
			setQuoteSettingsState(prevState => ({
				...prevState,
				week_days: e.target.checked
					? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
					: [],
				select_all_week_days: e.target.checked,
			}))
		},
		[setQuoteSettingsState]
	)

	return (
		<div>
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
								handleChange('order_cut_off_time', e.target.value)
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
					<label className={'text-gray'}>Fulfillment Offset Days</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Input
							type='number'
							maxLength={3}
							value={quoteSettingsState.fulfillment_offset_days}
							onChange={e =>
								handleChange(
									'fulfillment_offset_days',
									e.target.value
								)
							}
						/>
					</Form.Item>
					<div className={'text-gray mb-3'}>
						The number of days the ship date needs to be moved to allow
						for the processing of the order.
					</div>
				</Col>

				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						What days do you ship orders?
					</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.select_all_week_days}
							onChange={checked => selectAllWeekDays(checked)}>
							Select All
						</Checkbox>
						{weekDaysMarkup()}
					</Form.Item>
				</Col>
			</Row>
		</div>
	)
}

export default CutOffTime
