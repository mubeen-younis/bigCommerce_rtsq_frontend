import React from 'react'
import { Row, Col, Form, Typography, Checkbox, Input } from 'antd'
import { handlingFeeMarkup, numberFieldLimit } from '../Utilities/numberValidation'

const { Title } = Typography

const LimitedAccessSettings = ({ quoteSettingsState, setQuoteSettingsState, islimitedAccessFee = false }) => {

	return (<>
		<Row gutter={30} align='middle' className={islimitedAccessFee ? 'mb-1' : 'mb-3'}>
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Limited access settings</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
 				<label className={'text-gray'}>
                	Always quote limited access delivery
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='always_limited_access_delivery'
						checked={quoteSettingsState?.always_limited_access_delivery}
						onChange={e =>
							setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								always_limited_access_delivery: e.target.checked,
								offer_limited_access_delivery: false,
							}))
						}
					/>
				</Form.Item>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
                	Offer limited access delivery as an option 
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Checkbox
						name='offer_limited_access_delivery'
						checked={quoteSettingsState?.offer_limited_access_delivery}
						onChange={e =>
							setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								offer_limited_access_delivery: e.target.checked,
								always_limited_access_delivery: false,
							}))
						}
					/>
				</Form.Item>
			</Col>
		</Row>
		{islimitedAccessFee && ( 
			<>
			<Row gutter={30} className={'mb-4'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6} style={{ paddingTop: '11px' }}>
					<label className={'text-gray'}>
						Limited access delivery fee
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
					<Form.Item className={'mb-0'} name='limited_access_fee'>
						<Input
							maxLength={7}
							onKeyDown={(e) => { handlingFeeMarkup(e); numberFieldLimit(e); }}
							placeholder='Limited access delivery fee'
							value={quoteSettingsState.limited_access_fee}
							onChange={e =>
								setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								limited_access_fee: e.target.value,
							}))
							}
							type='number'
							min={0.01}
							step={0.01}
							disabled={!quoteSettingsState.always_limited_access_delivery && !quoteSettingsState.offer_limited_access_delivery}
						/>
					</Form.Item>
					<div className={'text-gray'}>
						The limited access delivery fees may differ depending on the type of facility. 
						The app can't prompt for the type of facility. So, enter the amount you'd like to collect regardless of the facility type.
					</div>
				</Col>
			</Row>
			</> 
		)}
		</>
	)
}

export default LimitedAccessSettings