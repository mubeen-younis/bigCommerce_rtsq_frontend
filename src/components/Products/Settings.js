import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Col, Row, Select, Checkbox, Input, Typography } from 'antd'
import { getLocations } from '../../Actions/Warehouse'
import { fieldValueLimit, handleNumbersOnly, handleNumbersWithDecimalOnly, handleNumbersWithHyphenOnly, handlingFeeMarkup, numberFieldLimit } from '../../Utilities/numberValidation'
import { getShippingGroups } from '../../Actions/ShippingGroupsActions'

const { Option } = Select
const smallCarriers = [
	'small-package',
	'ups-small',
	'fedex-small',
	'unishippers-small',
	'usps-small',
	'purolator-small',
]

const { Title } = Typography

const Settings = ({
	count,
	product,
	index,
	copyShippingMethod,
	copyShippingParams,
	onChangeVariant,
	addonCheck,
}) => {
	const {
		dropships,
		shippingGroups,
		insuranceStatus,
		sbsPlans,
		carrierId,
		installedCarriers,
		installedAddons,
		token,
		store,
		shippingClasses,
		palletPlans,
	} = useSelector(state => state)
	const dispatch = useDispatch()

	const validateNumber = value => {
		/* value = value.replace(/\D/g, "");

		console.log('bweight: '+product.weight);
		console.log('value: '+value)
		product.weight = value;
		console.log('aweight: '+product.weight);*/
	}

	const isSmallCarrier =
		installedCarriers &&
			installedCarriers?.find(
				c => c.carrier_type === 2 && c.is_enabled === 1
			)
			? true
			: false

	const isLtlCarrier =
		installedCarriers &&
			installedCarriers?.find(
				c => c.carrier_type === 1 && c.is_enabled === 1
			)
			? true
			: false
	const isSbsSuspended = installedAddons?.find(
		add => add.short_code === 'SBS' && add.is_enabled === 1
	) && !(sbsPlans && sbsPlans?.currentPackage?.status === 3)
		? false
		: true

	const isPalletPkgSuspended = installedAddons?.find(
		add => add.short_code === 'PLT' && add.is_enabled === 1
	) && !(palletPlans && palletPlans?.currentPackage?.status === 3)
		? false
		: true

	const isDbscEnabled = installedCarriers?.find(
		ic => ic?.slug === 'dbsc' && ic?.is_enabled
	)
		? true
		: false

	useEffect(() => {
		if (isSbsSuspended) {
			onChangeVariant(index, 'allow_vertical', false)
			onChangeVariant(index, 'ship_own_package', false)
			onChangeVariant(index, 'ship_multiple_package', false)
		}

		if (isPalletPkgSuspended) {
			onChangeVariant(index, 'pallet_vertical_rotation', false)
			onChangeVariant(index, 'own_pallet', false)
		}
	}, [
		dispatch,
		index,
		isSbsSuspended,
		onChangeVariant,
		token,
		isPalletPkgSuspended,
	])

	return (
		<Fragment key={index}>
			<div className='sepSettings'>
				<Row gutter={16}>
					<Col span={24}>
						<h2>{product?.sku ? 'SKU: ' + product?.sku : ''}</h2>
					</Col>
				</Row>
				<Row gutter={16} className='mb-0'>
					<Title level={5}>Default shipping method</Title>
					<Col span={24}>
						<Form.Item style={{ marginBottom: '0px' }}>
							<Checkbox
								name='parcel_enabled'
								id={'parcel_enabled' + index}
								disabled={!isSmallCarrier}
								onChange={e => {
									onChangeVariant(
										index,
										'parcel_enabled',
										e.target.checked
									)
									onChangeVariant(index, 'freight_enabled', false)
									onChangeVariant(index, 'quote_as_instore', false)
									onChangeVariant(index, 'quote_as_local', false)
								}}
								checked={product?.parcel_enabled}>
								Quote as a parcel shipment
							</Checkbox>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item>
							<Checkbox
								name='freight_enabled'
								id={'freight_enabled' + index}
								disabled={!isLtlCarrier}
								onChange={e => {
									onChangeVariant(
										index,
										'freight_enabled',
										e.target.checked
									)
									onChangeVariant(index, 'parcel_enabled', false)
									onChangeVariant(index, 'quote_as_instore', false)
									onChangeVariant(index, 'quote_as_local', false)
								}}
								checked={product?.freight_enabled}>
								Quote as an LTL shipment
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row
					gutter={16}
					style={{
						marginTop: '-1.1rem',
					}}>
					<Col span={24} className='mb-0'>
						<Form.Item>
							<Checkbox
								name='quote_as_local'
								id={'quote_as_local' + index}
								onChange={e => {
									onChangeVariant(
										index,
										'quote_as_local',
										e.target.checked
									)
									onChangeVariant(index, 'freight_enabled', false)
									onChangeVariant(index, 'parcel_enabled', false)
									onChangeVariant(index, 'quote_as_instore', false)
								}}
								checked={product?.quote_as_local}>
								Only show options for in-store pickup and/or local
								delivery
							</Checkbox>
							<br></br>
							<p
								style={{
									'font-size': '11px',
									'margin-left': '25px',
								}}>
								In-store pickup and/or local delivery must be enabled
								for the warehouse/drop-ship location.
								Carrier-provided shipping rates will not be
								presented.
							</p>
						</Form.Item>
					</Col>
				</Row>

				{count > 1 && index === 0 && (
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item>
								<Button
									type='primary'
									onClick={() => copyShippingMethod()}>
									Copy shipping method to all variants
								</Button>
							</Form.Item>
						</Col>
					</Row>
				)}
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							label='Freight Class'
							rules={[
								{
									required: false,
									message: 'Please select an owner',
								},
							]}>
							<Select
								id={'freight_class' + index}
								name='freight_class'
								defaultValue={''}
								placeholder='Freight Class'
								value={
									product?.freight_class === null
										? ''
										: product?.freight_class
								}
								onChange={val =>
									onChangeVariant(index, 'freight_class', val)
								}>
								<Option value=''>No Freight Class</Option>
								<Option value='50'>50</Option>
								<Option value='55'>55</Option>
								<Option value='60'>60</Option>
								<Option value='65'>65</Option>
								<Option value='70'>70</Option>
								<Option value='77.5'>77.5</Option>
								<Option value='85'>85</Option>
								<Option value='92.5'>92.5</Option>
								<Option value='100'>100</Option>
								<Option value='110'>110</Option>
								<Option value='125'>125</Option>
								<Option value='150'>150</Option>
								<Option value='175'>175</Option>
								<Option value='200'>200</Option>
								<Option value='250'>250</Option>
								<Option value='300'>300</Option>
								<Option value='400'>400</Option>
								<Option value='500'>500</Option>
								<Option value='DensityBased'>Density Based</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label={`Weight (${store?.weight_units?.toLowerCase() ?? 'lbs'
								})`}
							rules={[
								{ required: true, message: 'Weight is required' },
							]}>
							<Input
								id={'weight' + index}
								name='weight'
								placeholder={`Weight (${store?.weight_units?.toLowerCase() ?? 'lbs'
									})`}
								type='number'
								value={product?.weight}
								onChange={e => {
									onChangeVariant(index, 'weight', e.target.value)
									validateNumber(e.target.value)
								}}
								min={1}
								pattern='^[1-9]'
								step='0.01'
								stringMode
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='NMFC'>
							<Input
								id={'nmfc' + index}
								name='nmfc'
								placeholder='e.g 100 or 132-597'
								value={product?.nmfc}
								onKeyDown={handleNumbersWithHyphenOnly}
								onChange={e =>
									onChangeVariant(index, 'nmfc', e.target.value)
								}
								min='0'
								pattern='^[1-9]'
								step='0.01'
								stringMode
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							label={`Length (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
								})`}
						>
							<Input
								type='number'
								id={'length' + index}
								name='length'
								placeholder={`Length (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
									})`}
								value={product?.length}
								onChange={e =>
									onChangeVariant(index, 'length', e.target.value)
								}
								min='0'
								pattern='^[1-9]'
								step='0.01'
								stringMode
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label={`Width (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
								})`}
						>
							<Input
								type='number'
								name='width'
								id={'width' + index}
								placeholder={`Width (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
									})`}
								value={product?.width}
								onChange={e =>
									onChangeVariant(index, 'width', e.target.value)
								}
								min='0'
								pattern='^[1-9]'
								step='0.01'
								stringMode
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label={`Height (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
								})`}
						>
							<Input
								type='number'
								id={'height' + index}
								name='height'
								placeholder={`Height (${store?.dimension_units === 'Centimeters' ? 'cm' : store?.dimension_units?.toLowerCase() ?? 'inches'
									})`}
								value={product?.height}
								onChange={e =>
									onChangeVariant(index, 'height', e.target.value)
								}
								min='0'
								pattern='^[1-9.0-9]'
								step='0.01'
								stringMode
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label='HS Code' >
							<Input
								maxLength='20'
								id={'hs_code' + index}
								name='hs_code'
								onKeyDown={handleNumbersWithDecimalOnly}
								placeholder='e.g 1234.12.4456'
								value={product?.hs_code}
								onChange={e =>
									onChangeVariant(index, 'hs_code', e.target.value)
								}
							/>
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item label='Markup' >
							<Input
								maxLength='7'
								id={'product_markup' + index}
								name='product_markup'
								onKeyDown={handlingFeeMarkup}
								placeholder='e.g Currency 1.00 or percentage 5%'
								value={product?.product_markup}
								onChange={e =>
									onChangeVariant(index, 'product_markup', e.target.value)
								}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24}>
						<Checkbox
							onChange={e =>
								onChangeVariant(
									index,
									'insurance',
									e.target.checked
								)
							}
							name='insurance'
							id={'insurance' + index}
							checked={product?.insurance}>
							Insurance
						</Checkbox>
					</Col>
					<Col span={24} className='mt-1'>
						<Checkbox
							onChange={e =>
								onChangeVariant(
									index,
									'hazardous_enabled',
									e.target.checked
								)
							}
							name='hazardous_enabled'
							id={'hazardous_enabled' + index}
							checked={product?.hazardous_enabled}>
							Hazardous Material
						</Checkbox>
					</Col>
					{/* Nesting items start*/}
					<Col span={24} className='mt-1'>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'showNestingItems',
									e.target.checked
								)
								onChangeVariant(
									index,
									'is_nesting_enabled',
									!product?.is_nesting_enabled
								)
							}}
							name='is_nesting_enabled'
							id={'is_nesting_enabled' + index}
							checked={product?.is_nesting_enabled}>
							Nested item
						</Checkbox>
					</Col>

					{product?.is_nesting_enabled ? (
						<>
							<Col span={12} className='mt-1 mb-0'>
								<Form.Item label='Nested dimension'>
									<Select
										name='dimension_type'
										id={'dimension_type' + index}
										defaultValue={product?.dimension_type ?? 0}
										value={product?.dimension_type ?? 0}
										onChange={location =>
											onChangeVariant(
												index,
												'dimension_type',
												location
											)
										}>
										<Option value={0}>Length</Option>
										<Option value={1}>Width</Option>
										<Option value={2}>Height</Option>
									</Select>
								</Form.Item>
							</Col>

							<Col span={12} className='mt-1'>
								<Form.Item
									label='Nesting %'
									validateStatus={
										product?.nesting_percentage !== '' &&
											(product?.nesting_percentage < 0 || product?.nesting_percentage > 100)
											? 'error'
											: ''
									}
									help={
										product?.nesting_percentage !== '' &&
											(product?.nesting_percentage < 0 || product?.nesting_percentage > 100)
											? 'Value must be between 0 and 100'
											: ''
									}
								>
									<Input
										id={'nesting_percentage' + index}
										name='nesting_percentage'
										onKeyDown={handleNumbersOnly}
										placeholder='Nesting (%) e.g. 80'
										value={product?.nesting_percentage}
										onChange={(e) => {
											onChangeVariant(index, 'nesting_percentage', e.target.value);
										}}
										type='number'
									/>
								</Form.Item>
							</Col>

							<Col span={12} className='mt-0'>
								<Form.Item
									label='Maximum nested items'
									validateStatus={
										product?.max_nested_items && product?.max_nested_items.toString().length > 7
											? 'error'
											: ''
									}
									help={
										product?.max_nested_items && product?.max_nested_items.toString().length > 7
											? 'Value must be 7 digits or less'
											: ''
									}
								>
									<Input
										id={'max_nested_items' + index}
										name='max_nested_items'
										onKeyDown={handleNumbersOnly}
										placeholder='e.g. 5'
										value={product?.max_nested_items}
										onChange={(e) => {
											onChangeVariant(index, 'max_nested_items', e.target.value);
										}}
										type='number'
									/>
								</Form.Item>
							</Col>


							<Col span={12}>
								<Form.Item label='Stacking property'>
									<Select
										name='stacked_type'
										id={'stacked_type' + index}
										defaultValue={product?.stacked_type ?? 0}
										value={product?.stacked_type ?? 0}
										onChange={location =>
											onChangeVariant(
												index,
												'stacked_type',
												location
											)
										}>
										<Option value={0}>Evenly</Option>
										<Option value={1}>Maximized</Option>
									</Select>
								</Form.Item>
							</Col>
						</>
					) : null}
					{/* Nesting items end*/}

					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'showDropship',
									e.target.checked
								)
								onChangeVariant(
									index,
									'dropship_enabled',
									!product?.dropship_enabled
								)
								onChangeVariant(
									index,
									'shipping_group_enabled',
									false
								)
								onChangeVariant(index, 'shipping_group', null)
							}}
							name='dropship_enabled'
							id={'dropship_enabled' + index}
							checked={product?.dropship_enabled}
							disabled={product?.shipping_group_enabled}>
							Dropship this product
						</Checkbox>
					</Col>

					{product?.dropship_enabled ? (
						<Col span={24} style={{ marginTop: '7px' }}>
							<Form.Item label='Dropship Location'>
								<Select
									placeholder='Dropship Location'
									size={'large'}
									style={{ width: '100%' }}
									name='dropship_location'
									id={'dropship_location' + index}
									defaultValue={product?.dropship_location ?? null}
									value={product?.dropship_location ?? null}
									onChange={location =>
										onChangeVariant(
											index,
											'dropship_location',
											location
										)
									}>
									{dropships && (
										<Option value={null}>Select Dropship</Option>
									)}
									{dropships
										? dropships.map(value => (
											<Option
												value={value.id}
												key={value.id}>
												{
													value.nickname == value.city + ', ' + value.state + ' ' + value.zip_code ? value.nickname : value.nickname + ' - ' + value.city + ', ' + value.state + ' ' + value.zip_code
												}
											</Option>
										))
										: null}
								</Select>
							</Form.Item>
						</Col>
					) : null}

					{/* Shipping Group Check */}
					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'shipping_group_enabled',
									e.target.checked
								)
								onChangeVariant(index, 'dropship_enabled', false)
								onChangeVariant(index, 'dropship_location', null)
							}}
							name='shipping_group_enabled'
							id={'shipping_group_enabled' + index}
							checked={product?.shipping_group_enabled}
							disabled={product?.dropship_enabled}>
							Assign this product to a shipping group
						</Checkbox>
					</Col>

					{product?.shipping_group_enabled ? (
						<Col span={24} style={{ marginTop: '7px' }}>
							<Form.Item label='Shipping Group'>
								<Select
									placeholder='Shipping Group'
									size={'large'}
									style={{ width: '100%' }}
									name='shipping_group'
									id={'shipping_group' + index}
									defaultValue={product?.shipping_group ?? null}
									value={product?.shipping_group ?? null}
									onChange={location =>
										onChangeVariant(
											index,
											'shipping_group',
											location
										)
									}>
									{shippingGroups && (
										<Option value={null}>
											Select Shipping Group
										</Option>
									)}
									{shippingGroups &&
										shippingGroups.map(value => (
											<Option value={value.id} key={value.id}>
												{value.nickname}
											</Option>
										))}
								</Select>
							</Form.Item>
						</Col>
					) : null}
				</Row>

				{/* Shipping Classes */}
				{isDbscEnabled && (
					<>
						<Title level={5} className='mt-3'>
							Used by the Distance Based Shipping Rates integration
						</Title>
						<Col span={24} style={{ marginTop: '7px' }}>
							<Checkbox
								onChange={e => {
									onChangeVariant(
										index,
										'shipping_class_enabled',
										e.target.checked
									)
								}}
								name='shipping_class_enabled'
								id={'shipping_class_enabled' + index}
								checked={product?.shipping_class_enabled}>
								Assign this product to a shipping class
							</Checkbox>
						</Col>
					</>
				)}

				{product?.shipping_class_enabled ? (
					<Row gutter={16}>
						<Col span={24} style={{ marginTop: '7px' }}>
							<Form.Item label='Shipping Class'>
								<Select
									placeholder='Shipping Class'
									size={'large'}
									style={{ width: '100%' }}
									name='shipping_class'
									id={'shipping_class' + index}
									defaultValue={product?.shipping_class ?? null}
									value={product?.shipping_class ?? null}
									onChange={location =>
										onChangeVariant(
											index,
											'shipping_class',
											location
										)
									}>
									{shippingClasses && (
										<Option value={null}>
											Select Shipping Class
										</Option>
									)}
									{shippingClasses &&
										shippingClasses.map(value => (
											<Option value={value.id} key={value.id}>
												{value.class_name}
											</Option>
										))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				) : null}

				{/** Box Size setting start */}
				<>
					<Title level={5} className='mt-3'>
						Boxing Properties
					</Title>
					These settings are only active when the Standard Box Sizes
					feature is enabled.
					<Col span={24} style={{ marginTop: '10px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'allow_vertical',
									e.target.checked
								)
								onChangeVariant(index, 'ship_own_package', false)
								onChangeVariant(
									index,
									'ship_multiple_package',
									false
								)
							}}
							name='allow_vertical'
							id={'allow_vertical' + index}
							checked={product?.allow_vertical}
							disabled={isSbsSuspended}>
							Allow item to be rotated vertically when placing it in a
							box
						</Checkbox>
					</Col>
					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'ship_own_package',
									e.target.checked
								)
								onChangeVariant(index, 'allow_vertical', false)
								onChangeVariant(
									index,
									'ship_multiple_package',
									false
								)
							}}
							name='ship_own_package'
							id={'ship_own_package' + index}
							checked={product?.ship_own_package}
							disabled={isSbsSuspended}>
							This item ships as its own package
						</Checkbox>
					</Col>
					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'ship_multiple_package',
									e.target.checked
								)
								onChangeVariant(index, 'allow_vertical', false)
								onChangeVariant(index, 'ship_own_package', false)
							}}
							name='ship_multiple_package'
							id={'ship_multiple_package' + index}
							checked={product?.ship_multiple_package}
							disabled={isSbsSuspended}>
							This item ships as multiple packages
						</Checkbox>
					</Col>
				</>

				{/** Box Size setting End */}

				<>
					<Title level={5} className='mt-3'>
						Pallet Packing Properties
					</Title>
					<p>
						These settings are only active when the Pallet feature is
						enabled.
					</p>
					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'pallet_vertical_rotation',
									e.target.checked
								)
								onChangeVariant(index, 'own_pallet', false)
							}}
							name='pallet_vertical_rotation'
							id={'pallet_vertical_rotation' + index}
							checked={product?.pallet_vertical_rotation}
							disabled={isPalletPkgSuspended}>
							Allow vertical rotation on pallet
						</Checkbox>
					</Col>
					<Col span={24} style={{ marginTop: '7px' }}>
						<Checkbox
							onChange={e => {
								onChangeVariant(
									index,
									'own_pallet',
									e.target.checked
								)
								onChangeVariant(index, 'pallet_vertical_rotation', false)
							}}
							name='own_pallet'
							id={'own_pallet' + index}
							checked={product?.own_pallet}
							disabled={isPalletPkgSuspended}>
							Ship as own pallet
						</Checkbox>
					</Col>
				</>

				{count > 1 && index === 0 && (
					<Row gutter={24} style={{ marginTop: '20px' }}>
						<Col span={24}>
							<Form.Item>
								<Button
									type='primary'
									onClick={() => copyShippingParams()}>
									Copy shipping params to all variants
								</Button>
							</Form.Item>
						</Col>
					</Row>
				)}
			</div>
		</Fragment>
	)
}

export default Settings
