import { useCallback, useEffect, useState } from 'react'
import { Select, Row, Col, Form, Input } from 'antd'
import DeliveryEstimateOptions from '../../../../DeliveryEstimateOptions'
import CutOffTime from '../../../../CutOffTime'
import LiftGateDelivery from '../../../../LiftGateDelivery'
import NotifyBeforeDelivery from '../../../../NotifyBeforeDelivery'
import LimitedAccessSettings from '../../../../LimitedAccessSettings'
import InsideDeliverySettings from '../../../../InsideDeliverySettings'
import RadPickup from '../../../../RadPickup'
import { LableAsLimit } from '../../../../../Utilities/numberValidation'
const { Option } = Select

const initialSettings = {
	new_api_rating_method: '1',
	number_of_options: '1',
	label_as: '',
	own_arrangement: 0,
  	own_arrangement_text: '',
}

const GtzNewApi = ({
    props,
	quoteSettingsState,
	setQuoteSettingsState,
	radStatus,
}) => {

    useEffect(() => {
      setQuoteSettingsState((prevState) => ({
        ...initialSettings,
        ...prevState,
      }))
    }, [setQuoteSettingsState])

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

						<Col
							className='gutter-row'
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={18}>
							<Form.Item className={'mb-0'} name='new_api_rating_method'>
								<Select
									defaultValue='1'
									onChange={(opt) =>
										setQuoteSettingsState((prevState) => ({
											...prevState,
											new_api_rating_method: opt,
										}))
									}>
									<Option value='1'>Cheapest</Option>
									<Option value='2'>Cheapest Options</Option>
									<Option value='3'>Average Rate</Option>
								</Select>
							</Form.Item>
							<div className={'text-gray'}>
								{quoteSettingsState?.new_api_rating_method === '1' &&
									'Displays a least expensive option.'}
								{quoteSettingsState?.new_api_rating_method === '2' &&
									'Displays a list of a specified number of least expensive options.'}
								{quoteSettingsState?.new_api_rating_method === '3' &&
									'Displays a single rate based on an average of a specified number of least expensive options.'}
							</div>
						</Col>
					</Row>

          {['2', '3'].includes(quoteSettingsState?.new_api_rating_method) && (
						<Row gutter={30} className={'mb-3'}>
							<Col
								className='gutter-row'
								style={{ paddingTop: '11px' }}
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={6}>
								<label className={'text-gray'}>
									Number Of Options
								</label>
							</Col>

							<Col
								className='gutter-row'
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={18}>
								<Form.Item
									className={'mb-0'}
									name='number_of_options'>
									<Select
										defaultValue='1'
										value={quoteSettingsState?.number_of_options}
										onChange={(opt) =>
											setQuoteSettingsState((prevState) => ({
												...prevState,
												number_of_options: opt,
											}))
										}>
										{Array.from({ length: 10 }, (_, i) => (
											<Option
												value={(i + 1).toString()}
												key={i}>
												{(i + 1).toString()}
											</Option>
										))}
									</Select>
								</Form.Item>
								<div className={'text-gray'}>
									{quoteSettingsState?.new_api_rating_method === '2' &&
										'Number of options to display in the shopping cart.'}
									{quoteSettingsState?.new_api_rating_method === '3' &&
										'Number of options to include in the calculation of the average.'}
								</div>
							</Col>
						</Row>
					)}

					{['1', '3'].includes(quoteSettingsState?.new_api_rating_method) && (
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
								{(+quoteSettingsState?.new_api_rating_method === 1 || +quoteSettingsState?.new_api_rating_method === 3) && (
									<Form.Item
										className={'mb-0'}
										name='label_as'>
										<Input
											value={
												quoteSettingsState?.label_as ||
												''
											}
											onKeyDown={LableAsLimit}
											onChange={(e) =>
												setQuoteSettingsState(
													(prevState) => ({
														...prevState,
														label_as:
															e.target.value,
													})
												)
											}
										/>
									</Form.Item>
								)}
								<div className={'text-gray'}>
									{quoteSettingsState?.new_api_rating_method === '1' &&
										'What the user sees during checkout, e.g. "Freight". Leave blank to display the carrier name.'}
									{quoteSettingsState?.new_api_rating_method === '3' &&
										'What the user sees during checkout, e.g. "Freight". If left blank will default to "Freight".'}
								</div>
							</Col>
						</Row>
					)}

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
				showLiftGatePickup={true}
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
