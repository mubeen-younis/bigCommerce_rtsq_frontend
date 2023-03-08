import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'
import { useSelector } from 'react-redux'


const { Title } = Typography

const LimitedAccessSettings = ({ quoteSettingsState, setQuoteSettingsState}) => {

	return (
		<Row gutter={30} align='middle' className={'mb-4'}>
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Limited Access Settings</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
                Always quote limited access delivery
                (Commercial addresses only)
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className='mb-0'>
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
                (Commercial addresses only)
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className='mb-0'>
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
	)
}

export default LimitedAccessSettings