import React from 'react'
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd'
import { handlingFeeMarkup } from '../../../../Utilities/numberValidation'

const { Title } = Typography

const LabelAs = () => (
	<Col className='gutter-row mb-2' xs={14} sm={14} md={14} lg={14} xl={14}>
	  <label className={'text-gray'}>
		Service name displays by default. Enter an alternative if you prefer
		something different.
	  </label>
	</Col>
);

const international_services = [
	'Worldwide Express',
	'Worldwide Expedited',
	'Worldwide Saver',
	'Standard (Canada)',
]

const InternationalServices = ({
	quoteSettingsState,
	internationalcheckAll,
	internationalAllCheckHandler,
	onChange,
	onCheck,
}) => {
	const makeServiceIndex = service_name =>
		service_name.includes('Canada')
			? 'ups_standard'
			: `ups_${service_name.toLowerCase().trim().replaceAll(' ', '_')}`

	return (
		<Col span={12}>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
					<Title level={5} style={{ textAlign: 'center' }}>
						International Services
					</Title>
				</Col>
			</Row>

			<Row gutter={24} align='middle' className={'mb-2'}>
				<Col span={12}>
					<label className={'text-gray'}>
						All International Services Levels
					</label>
				</Col>
				<Col span={12}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							value={true}
							checked={internationalcheckAll}
							onChange={e =>
								internationalAllCheckHandler(e.target.checked)
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>
			{international_services.map(srvc => (
				<Row gutter={24} align='middle' className={'mb-2'}>
					<Col span={12}>
						<label className={'text-gray'}>{srvc}</label>
					</Col>
					<Col span={12}>
						<Form.Item className={'mb-0'}>
							<Checkbox
								name={makeServiceIndex(srvc)}
								checked={
									quoteSettingsState?.carrier_services?.[
										makeServiceIndex(srvc)
									]
								}
								onChange={onCheck}></Checkbox>
						</Form.Item>
					</Col>
					<Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							value={
								quoteSettingsState?.carrier_services?.[
									makeServiceIndex(srvc) + '_label'
								]
							}
							name={makeServiceIndex(srvc) + '_label'}
							onChange={onChange}
							type='text'
							placeholder={srvc}
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
										makeServiceIndex(srvc) + '_markup'
									]
								}
								//pattern='[0-9.?(0-9){2}?]+%?$'
								name={makeServiceIndex(srvc) + '_markup'}
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
			))}
		</Col>
	)
}

export default InternationalServices
