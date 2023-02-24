import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Typography, Checkbox } from 'antd'
import { useSelector } from 'react-redux'


const { Title } = Typography

const LimitedAccessSettings = ({ quoteSettingsState, setQuoteSettingsState , isYRC}) => {
	const { radSettings, installedCarriers } = useSelector(state => state)
	const [radActive, setRadActive] = useState(false)
	const [carrierActive, setCarrierActive] = useState(false)

	useEffect(() => {
		if(isYRC){
			if(installedCarriers){
				for (const ic of installedCarriers) {
				  if (ic.slug === 'yrc-ltl' && ic.is_enabled) {
					setCarrierActive(true)
				  }
				}
			}
	
			if (radSettings) {
				if(radSettings?.settings){
					const settings = JSON.parse(radSettings?.settings) ?? null
	
					if (settings && (settings.residential_delivery_auto_detect || settings.always_quote_residential_delivery) ) {
						setRadActive(true)
					}
				}
			}	
		}
		
	}, [radSettings, radActive])

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
						disabled={ radActive && carrierActive}
						checked={quoteSettingsState?.always_limited_access_delivery}
						onChange={e =>
							setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								always_limited_access_delivery: e.target.checked,
								offer_limited_access_delivery: false,
								alwaysResidentialDelivery: false,
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
						disabled={ radActive && carrierActive}
						checked={quoteSettingsState?.offer_limited_access_delivery}
						onChange={e =>
							setQuoteSettingsState(prevSettings => ({
								...prevSettings,
								offer_limited_access_delivery: e.target.checked,
								always_limited_access_delivery: false,
								alwaysResidentialDelivery: false,
							}))
						}
					/>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default LimitedAccessSettings