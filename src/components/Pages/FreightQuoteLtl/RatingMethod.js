import React from 'react'
import { Row, Col, Form, Select, Input } from 'antd'
import { LableAsLimit } from '../../../Utilities/numberValidation'

const { Option } = Select

const RatingMethod = ({
	props,
	quoteSettingsState,
	handleChange,
	ratingMethod,
	setRatingMethod,
}) => {
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
					<label className={'text-gray'}>Rating Method</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'} name='method'>
						<Select
							defaultValue={
								props.quoteSettings &&
								props.quoteSettings.method !== undefined
									? props.quoteSettings.method
									: 1
							}
							name='method'
							size={'large'}
							style={{ width: '100%' }}
							onChange={value => {
								setRatingMethod(value)
							}}>
							<Option value={1}>Cheapest</Option>
							<Option value={2}>Cheapest Options</Option>
							<Option value={3}>Average Rate</Option>
						</Select>
					</Form.Item>
					<div className={'text-gray'}>
						{ratingMethod === 1 && 'Displays a least expensive option.'}
						{ratingMethod === 2 &&
							'Displays a list of specified number of least expensive options.'}
						{ratingMethod === 3 &&
							'Displays a single rate based on an average of a specified number of least expensive options.'}
					</div>
				</Col>
			</Row>

			{ratingMethod === 2 || ratingMethod === 3 ? (
				<Row gutter={30} className={'mb-3'}>
					<Col
						className='gutter-row'
						style={{ paddingTop: '11px' }}
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={6}>
						<label className={'text-gray'}>Number Of Options</label>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item className={'mb-0'}>
							<Select
								size={'large'}
								style={{ width: '100%' }}
								value={quoteSettingsState?.number_of_options || 1}
								onChange={value =>
									handleChange('number_of_options', value)
								}>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
									<Option key={item} value={item}>
										{item}
									</Option>
								))}
							</Select>
						</Form.Item>
						<div className={'text-gray'}>
							{ratingMethod === 2 &&
								'Number of options to display in the shopping cart.'}
							{ratingMethod === 3 &&
								'Number of options to include in the calculation of the average.'}
						</div>
					</Col>
				</Row>
			) : null}

			{ratingMethod === 1 || ratingMethod === 3 ? (
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
							What the user sees during checkout, e.g. "Freight".{' '}
							{ratingMethod === 1
								? 'Leave blank to display the carrier name.'
								: ' If left blank will default to "Freight".'}
						</div>
					</Col>
				</Row>
			) : null}
		</>
	)
}

export default RatingMethod
