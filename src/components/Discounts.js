import React from 'react'
import { Row, Col, Form, Input, Radio, Tooltip, Typography } from 'antd'
import { handleKeyDownDecimalNumber } from '../Utilities/numberValidation'

const { Title } = Typography

const Discounts = ({ quoteSettingsState, handleChange }) => {
	return (
		<Row gutter={30}>
			<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Discounts</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={18}>
				<Form.Item className='mb-0'>
					<Radio
						checked={quoteSettingsState.account_discount === 1}
						onChange={e => handleChange('account_discount', 1)}>
						My account has negotiated LTL rates{' '}
						<Tooltip title='Choose this option if you have negotiated LTL rates with Fedex.'>
							<a href='#!' style={{ marginLeft: '10px' }}>
								[ ? ]
							</a>
						</Tooltip>
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
				style={{ marginTop: '-10px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={18}>
				<Form.Item className='mb-0'>
					<Radio
						checked={quoteSettingsState.account_discount === 2}
						onChange={e => handleChange('account_discount', 2)}>
						My account receives an incentive discount{' '}
						<Tooltip
							title='Choose this option if you don’t have negotiated LTL freight rates with
                    Fedex and instead receive an incentive discount. To verify, sign into Fedex.com and
                    retrieve an LTL freight quote. Under the rate estimates will be a note with the heading, “More information about your results:�? The note will confirm that your rates are not negotiated, and identify the incentive discount used to generate the rate estimates.
                    Enter the incentive discount as an integer into the app settings. Otherwise the rates returned to the shopping cart will be list price. Sixty (60) percent is a common
                    incentive discount.'>
							<a href='#!' style={{ marginLeft: '10px' }}>
								[ ? ]
							</a>
						</Tooltip>
					</Radio>
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
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
				<Form.Item className={'mb-0'}>
					<Input
						value={quoteSettingsState?.account_discount_price}
						defaultValue='60'
						onChange={e =>
							handleChange('account_discount_price', e.target.value)
						}
						onKeyDown={e => handleKeyDownDecimalNumber(e, 10, 4)}
						type='number'
						min='0'
						step='0.0001'
						max='100'
						pattern='[0-9.?(0-9){2}?]+%?$'
						disabled={quoteSettingsState.account_discount === 1}
					/>
				</Form.Item>
				<label className={'text-gray mb-3'}>
					Incentive discount percentage
				</label>
			</Col>
		</Row>
	)
}

export default Discounts
