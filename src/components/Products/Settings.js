import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Form, Button, Col, Row, Select, Checkbox, Input } from 'antd'

const { Option } = Select
const smallCarriers = ['small-package', 'ups-small', 'fedex-small']

function Settings({
	count,
	product,
	index,
	copyShippingMethod,
	copyShippingParams,
	onChangeVariant,
	addonCheck,
	setProductVariants,
}) {
	const { dropships, insuranceStatus, sbsPlans, carrierId, installedCarriers } =
		useSelector(state => state)
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
			c => c.id === +carrierId && smallCarriers.includes(c.slug)
		)
			? true
			: false
	const isSbsSuspended =
		(sbsPlans && sbsPlans?.currentPackage?.status === 3) ?? false

	return (
		<Fragment key={index}>
			<div className='sepSettings'>
				<Row gutter={16}>
					<Col span={24}>
						<h2>{product?.sku ? 'SKU: ' + product?.sku : ''}</h2>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item style={{ marginBottom: '0px' }}>
							<Checkbox
								name='freight_enabled'
								id={'freight_enabled' + index}
								onChange={e => {
									onChangeVariant(
										index,
										'freight_enabled',
										!product?.freight_enabled
									)
									onChangeVariant(index, 'parcel_enabled', false)
								}}
								checked={product?.freight_enabled}>
								Quote as an LTL shipment
							</Checkbox>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item>
							<Checkbox
								name='parcel_enabled'
								id={'parcel_enabled' + index}
								onChange={e => {
									onChangeVariant(
										index,
										'parcel_enabled',
										e.target.checked
									)
									onChangeVariant(index, 'freight_enabled', false)
								}}
								checked={product?.parcel_enabled}>
								Quote as a parcel shipment
							</Checkbox>
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
					<Col span={12}>
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
					<Col span={12}>
						<Form.Item
							label='Weight (lbs)'
							rules={[
								{ required: true, message: 'Weight is required' },
							]}>
							<Input
								id={'weight' + index}
								name='weight'
								placeholder='Weight (lbs)'
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
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label='Length (inches)'>
							<Input
								type='number'
								id={'length' + index}
								name='length'
								placeholder='Length (inches)'
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
						<Form.Item label='Width (inches)'>
							<Input
								type='number'
								name='width'
								id={'width' + index}
								placeholder='Width (inches)'
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
						<Form.Item label='Height (inches)'>
							<Input
								type='number'
								id={'height' + index}
								name='height'
								placeholder='Height (inches)'
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
					{insuranceStatus && (
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
					)}
					<Col span={24} style={{ marginTop: '7px' }}>
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

					{/** Box Size setting start */}
					{addonCheck && isSmallCarrier && (
						<>
							<Col span={24} style={{ marginTop: '7px' }}>
								<Checkbox
									onChange={e => {
										onChangeVariant(
											index,
											'allow_vertical',
											e.target.checked
										)
										onChangeVariant(
											index,
											'ship_own_package',
											false
										)
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
									Allow item to be rotated vertically when placing
									it in a box
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
										onChangeVariant(
											index,
											'allow_vertical',
											false
										)
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
										onChangeVariant(
											index,
											'allow_vertical',
											false
										)
										onChangeVariant(
											index,
											'ship_own_package',
											false
										)
									}}
									name='ship_multiple_package'
									id={'ship_multiple_package' + index}
									checked={product?.ship_multiple_package}
									disabled={isSbsSuspended}>
									This item ships as multiple packages
								</Checkbox>
							</Col>
						</>
					)}
					{/** Box Size setting End */}

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
							}}
							name='dropship_enabled'
							id={'dropship_enabled' + index}
							checked={product?.dropship_enabled || false}>
							Dropship this product
						</Checkbox>
					</Col>
				</Row>

				{product?.dropship_enabled ? (
					<Row gutter={16}>
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
													key={value.id}>{`${
													value.city + ','
												} ${value.state} ${
													value.zip_code
												}`}</Option>
										  ))
										: null}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				) : null}

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
