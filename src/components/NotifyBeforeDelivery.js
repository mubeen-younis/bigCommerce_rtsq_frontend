import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Checkbox, Typography } from 'antd'
import { useSelector } from 'react-redux'

const { Title } = Typography

const NotifyBeforeDelivery = ({ quoteSettingsState, setQuoteSettingsState, isUPS = false }) => {
	const { radSettings, installedCarriers } = useSelector(state => state)
	const [radActive, setRadActive] = useState(false)
	const [carrierActive, setCarrierActive] = useState(false)

	useEffect(() => {
		if(isUPS){
			if(installedCarriers){
				for (const ic of installedCarriers) {
				  if (ic.slug === 'ups-ltl' && ic.is_enabled) {
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
					<Title level={4}>Notify before delivery settings</Title>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Always quote notify before delivery
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.always_quote_notify || false }
							disabled={ radActive && carrierActive}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									always_quote_notify: e.target.checked,
									offer_notify_as_option: false,
								})
							}></Checkbox>
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Offer notify before delivery as an option
					</label>
				</Col>
				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							checked={quoteSettingsState?.offer_notify_as_option || false }
							disabled={ radActive && carrierActive}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									offer_notify_as_option: e.target.checked,
									always_quote_notify: false,
								})
							}></Checkbox>
					</Form.Item>
				</Col>
        </Row>
	)
}

export default NotifyBeforeDelivery
