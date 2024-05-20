import React from 'react'
import { Row, Col, Form, Input } from 'antd'
import { handleNumbersOnly } from '../Utilities/numberValidation'

const LargeCartSettings = () => {
	return (
		<>
			<Row gutter={30}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}
				>
					<div className={'mb-2'}>
						This rule impacts parcel quoting apps only. <br /><br />
						The packaging algorithm identifies the ideal packaging solution via an iterative process.
						If the Cart contains a large number of items, the time the packaging algorithm requires to
						identify the ideal packaging solution can exceed the window of time BigCommerce allows for shipping quotes to be returned.
						In these cases, the packaging algorithm needs to be bypassed. Use the settings below to specify your preferences for when
						the packaging algorithm is to be bypassed. Test the results to make sure results (shipping quotes) are returned when a
						large number of items is in the Cart. The number of boxes you define and the diversity of the items in your product catalog
						will influence the time the packaging algorithm requires. Therefore, your settings will differ from those of other merchants.
					</div>
				</Col>
			</Row>

			<Row gutter={30}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}
				>
					<Form.Item
						className={'mb-0'}
						label='Max items'
						name='max_items'
						rules={[
							{
								required: true,
								message: 'Max items cannot be empty.',
							},
							{
								pattern: /^(?!0$)[1-9][0-9]*$/,
								message: 'Max items should be a natural number.',
							},
						]}
					>
						<Input
							type='number'
							onKeyDown={handleNumbersOnly}
							step='1'
							placeholder='Enter Max items'
						/>
					</Form.Item>
					<div className={'text-gray mb-1'}>
						When the Cart contains more than this number of items,
						the packaging algorithm will be bypassed and rates will be calculated
						exclusively on the basis of weight.
					</div>

				</Col>
			</Row>

			<Row gutter={30}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}
				>
					<Form.Item
						className={'mb-0'}
						label='Max weight per package'
						name='max_package_weight'
						rules={[
							{
								required: true,
								message: 'Max weight per package cannot be empty.',
							},
							{
								pattern: /^(?!0$)[1-9][0-9]*$/,
								message: 'Max weight per package should be a natural number.',
							},
							{
								pattern: /^(150(?:\.0{0,2})?|(?:[1-9]?[0-9]|1[0-4][0-9])(?:\.[0-9]{1,2})?)$/,
								message: 'Max weight per package cannot be greater than 150 lbs.',
							},
						]}
					>
						<Input
							type='number'
							onKeyDown={handleNumbersOnly}
							step='1'
							placeholder='Enter Max weight per package'
						/>
					</Form.Item>
					<div className={'text-gray mb-1'}>
						Specify the maximum weight allowed per package when the packaging
						algorithm is bypassed. The maximum permitted value is 150 LB.
					</div>
				</Col>
			</Row>
		</>
	)
}

export default LargeCartSettings
