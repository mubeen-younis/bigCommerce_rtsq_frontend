import { useCallback, useState } from 'react'
import { Select, Row, Col, Form } from 'antd'
import DeliveryEstimateOptions from '../../../../DeliveryEstimateOptions'
import CutOffTime from '../../../../CutOffTime'
import LiftGateDelivery from '../../../../LiftGateDelivery'
import NotifyBeforeDelivery from '../../../../NotifyBeforeDelivery'
import RatingMethod from '../../../WweLtl/RatingMethod'
import LimitedAccessSettings from '../../../../LimitedAccessSettings'
import InsideDeliverySettings from '../../../../InsideDeliverySettings'
import RadPickup from '../../../../RadPickup'
const { Option } = Select

const GtzNewApi = ({
    props,
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
}) => {
    const [ratingMethod, setRatingMethod] = useState(1)

	const handleStateChange = useCallback(
		(name, value) => {
			setQuoteSettingsState(prevState => ({
				...prevState,
				[name]: value,
			}))
		},
		[setQuoteSettingsState]
	)

	return (
		<>
            <RatingMethod
                props={props}
                quoteSettingsState={quoteSettingsState}
                handleChange={handleStateChange}
                ratingMethod={ratingMethod}
                setRatingMethod={setRatingMethod}
            />

			<DeliveryEstimateOptions
				quoteSettingsState={quoteSettingsState}
				setQuoteSettingsState={setQuoteSettingsState}
			/>

			<CutOffTime
				quoteSettingsState={quoteSettingsState}
				setQuoteSettingsState={setQuoteSettingsState}
				handleChange={handleStateChange}
			/>

            <RadPickup
			    quoteSettingsState={quoteSettingsState}
				setQuoteSettingsState={setQuoteSettingsState}
				radStatus={radStatus}
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

            <LimitedAccessSettings
                quoteSettingsState={quoteSettingsState}
                setQuoteSettingsState={setQuoteSettingsState}
                islimitedAccessFee = {true}
            />

            <InsideDeliverySettings
                quoteSettingsState={quoteSettingsState}
                setQuoteSettingsState={setQuoteSettingsState}
            />

            <Row gutter={30} className={'mb-3'}>
          <Col
            className='gutter-row'
            style={{ paddingTop: '11px' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={6}
          >
            <label className={'text-gray'}>Insurance Category</label>
          </Col>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
            <Form.Item className={'mb-0'} name='insurance_category'>
              <Select
                name='insurance_category'
                defaultValue={
                  props.quoteSettings &&
                  props.quoteSettings.insurance_category !== undefined
                    ? props.quoteSettings.insurance_category
                    : '84-General Merchandise'
                }
                size={'large'}
                style={{ width: '100%' }}
                onChange={(value) => {
                  //setRatingMethod(value);
                  setQuoteSettingsState({
                    ...quoteSettingsState,
                    insurance_category: value,
                  })
                }}
              >
                <Option value='84-General Merchandise'>
                  General Merchandise
                </Option>
                <Option value='85-Antiques / Art / Collectibles'>
                  Antiques / Art / Collectibles
                </Option>
                <Option value='86-Commercial Electronics (Audio; Computer: Hardware, Servers, Parts &amp; Accessories)'>
                  Commercial Electronics (Audio; Computer: Hardware, Servers,
                  Parts &amp; Accessories)
                </Option>
                <Option value='87-Consumer Electronics (laptops, cellphones, PDAs, iPads, tablets, notebooks, etc.)'>
                  Consumer Electronics (laptops, cellphones, PDAs, iPads,
                  tablets, notebooks, etc.)
                </Option>
                <Option value='88-Fragile Goods (Glass, Ceramic, Porcelain, etc.)'>
                  Fragile Goods (Glass, Ceramic, Porcelain, etc.)
                </Option>
                <Option value='89-Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)'>
                  Furniture (Pianos, Glassware, Tableware, Outdoor Furniture)
                </Option>
                <Option value='90-Machinery, Appliances and Equipment (Medical, Restaurant, Industrial, Scientific)'>
                  Machinery, Appliances and Equipment (Medical, Restaurant,
                  Industrial, Scientific)
                </Option>
                <Option value='91-Miscellaneous / Other / Mixed'>
                  Miscellaneous / Other / Mixed
                </Option>
                <Option value='92-Non-Perishable Foods / Beverages / Commodities / Vitamins'>
                  Non-Perishable Foods / Beverages / Commodities / Vitamins
                </Option>
                <Option value='93-Radioactive / Hazardous / Restricted or Controlled Items'>
                  Radioactive / Hazardous / Restricted or Controlled Items
                </Option>
                <Option value='94-Sewing Machines, Equipment and Accessories'>
                  Sewing Machines, Equipment and Accessories
                </Option>
                <Option value='95-Stone Products (Marble, Tile, Stonework, Granite, etc.)'>
                  Stone Products (Marble, Tile, Stonework, Granite, etc.)
                </Option>
                <Option value='96-Wine / Spirits / Alcohol / Beer'>
                  Wine / Spirits / Alcohol / Beer
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
		</>
	)
}

export default GtzNewApi
