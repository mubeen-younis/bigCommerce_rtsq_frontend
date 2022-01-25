import React from 'react'
import { Row, Col, Form, Checkbox, Input, Typography } from 'antd'

const { Title } = Typography

export const one_rate_services = [
	{ label: '' },
	{ label: '' },
	/*{ label: '' },
	{ label: '' },
	{ label: '' },*/
	{ label: 'Express Saver' },
	{ label: '2 Day' },
	{ label: '2 Day AM' },
	{ label: 'Standard Overnight' },
	{ label: 'Priority Overnight' },
	{ label: 'First Overnight' },
	{ label: '' },
]

const OneRateServices = ({
	quoteSettingsState,
	allCheckHandler,
	oneRatecheckAll,
	setOneRateCheckAll,
	onCheck,
}) => {
	return (
		<Col span={4} align='middle' className={'mb-2'}>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={5} style={{ textAlign: 'center' }}>
						One Rate
					</Title>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col span={24}>
					<Form.Item className='mb-0'>
						<Checkbox
							name='select_all'
							checked={oneRatecheckAll}
							onChange={e =>
								allCheckHandler(
									setOneRateCheckAll,
									e.target.checked,
									one_rate_services,
									'one_rate_'
								)
							}></Checkbox>
					</Form.Item>
				</Col>
			</Row>

			{one_rate_services.map(is =>
				is.label.length ? (
					<Row gutter={30} align='middle' className={'mb-2'}>
						<Col span={24}>
							<Form.Item className={'mb-0'}>
								<Checkbox
									name={
										'one_rate_' +
										is.label
											.toLowerCase()
											.trim()
											.replaceAll(' ', '_')
									}
									value={true}
									checked={
										quoteSettingsState?.carrier_services?.[
											'one_rate_' +
												is.label
													.toLowerCase()
													.trim()
													.replaceAll(' ', '_')
										]
									}
									onChange={onCheck}></Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} style={{ visibility: 'hidden' }}>
							<Form.Item className={'mb-0'}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<label
								className={'text-gray'}
								style={{ visibility: 'hidden' }}>
								SmartPost
							</label>
						</Col>
					</Row>
				) : (
					<Row
						gutter={30}
						align='middle'
						className={'mb-2'}
						style={{ visibility: 'hidden' }}>
						<Col span={20}>
							<label className={'text-gray'}>SmartPost</label>
						</Col>
						<Col span={4}>
							<Form.Item className={'mb-0'}>
								<Checkbox></Checkbox>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item className={'mb-0'}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<label className={'text-gray'}>SmartPost</label>
						</Col>
					</Row>
				)
			)}
		</Col>
	)
}

export default OneRateServices
