import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography
const contract_services = [
	'UPS SurePost Less than 1LB',
	'UPS SurePost 1LB or greater',
	'UPS SurePost Bound Printed Matter',
	'UPS SurePost Media Mail',
	'UPS Ground with Freight Pricing',
]

const LabelAs = () => (
	<Col className='gutter-row mb-2' xs={14} sm={14} md={14} lg={14} xl={14}>
	  <label className={'text-gray'}>
		Service name displays by default. Enter an alternative if you prefer
		something different.
	  </label>
	</Col>
);

const ContractServices = ({ quoteSettingsState, onChange, onCheck }) => {
	return (
		<>
			<Row gutter={24} align='middle' className={'mb-4'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>UPS Contract Services </Title>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<label className={'text-black'}>
						To have access to UPS contract services, they must be enabled
						on your account.
					</label>
				</Col>
			</Row>
			{contract_services.map((cs) => (
				<Row gutter={30} className={'mb-2'}>
					<Col span={12}>
						<Row gutter={24} align='middle' className={'mb-2'}>
							<Col span={12}>
								<label className={'text-gray'}>{cs}</label>
							</Col>

							<Col span={12}>
								<Form.Item className={'mb-0'}>
									<Checkbox
										name={cs
											.toLowerCase()
											.trim()
											.replaceAll(' ', '_')}
										value={true}
										checked={
											quoteSettingsState?.carrier_services?.[
												cs
													.toLowerCase()
													.trim()
													.replaceAll(' ', '_')
											] || ''
										}
										onChange={onCheck}></Checkbox>
								</Form.Item>
							</Col>
							<Col span={14}>
								<Form.Item className='mb-0'>
									<Input
										value={
											quoteSettingsState?.carrier_services?.[
											cs
												.toLowerCase()
												.trim()
												.replaceAll(' ', '_') + '_label'
											]
										}
										name={
											cs.toLowerCase().trim().replaceAll(' ', '_') +
											'_label'
										}
										onChange={onChange}
										type='text'
										placeholder={cs}
										maxLength={50}
									/>
								</Form.Item>
							</Col>
							<LabelAs />
							<Col span={14}>
								<Form.Item className={'mb-0'}>
									<Input
										//maxLength='7'
										value={
											quoteSettingsState?.carrier_services?.[
												cs
													.toLowerCase()
													.trim()
													.replaceAll(' ', '_') + '_markup'
											]
										}
										//pattern='[0-9.?(0-9){2}?]+%?$'
										name={
											cs
												.toLowerCase()
												.trim()
												.replaceAll(' ', '_') + '_markup'
										}
										onChange={onChange}
										onKeyDown={handlingFeeMarkup}
										maxLength='7'
										type='text'
									/>
								</Form.Item>
							</Col>

							<Col
								className='gutter-row'
								xs={14}
								sm={14}
								md={14}
								lg={14}
								xl={14}>
								<label className={'text-gray'}>
									Markup (e.g Currency 1.00 or percentage 5%)
								</label>
							</Col>
						</Row>
					</Col>
				</Row>
			))}
		</>
	)
}

export default ContractServices
