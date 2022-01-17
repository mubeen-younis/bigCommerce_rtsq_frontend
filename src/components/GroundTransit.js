import React from 'react'
import { Row, Col, Form, Input, Typography, Radio } from 'antd'

const { Title } = Typography

const GroundTransit = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<>
			<Row gutter={30} align='middle' className={'mb-2'}>
				<Col
					className='gutter-row mt-4'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}>
					<Title level={4}>Ground transit time restrictions</Title>
				</Col>

				<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Enter the number of transit days to restrict ground service
						to. Leave blank to disable this service.
					</label>
				</Col>

				<Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={18}>
					<Form.Item className={'mb-0'} name='number_of_transit_days'>
						<Input
							type='number'
							min='1'
							step='1'
							value={quoteSettingsState?.number_of_transit_days}
							onChange={e =>
								setQuoteSettingsState({
									...quoteSettingsState,
									number_of_transit_days: e.target.value,
								})
							}
							//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
						/>
						{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={30} align='middle' className={'mb-4'}>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Restrict by the carrier's in transit days metric
					</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Radio
							name='ground_metric'
							value='1'
							checked={quoteSettingsState?.ground_metric === 1}
							// checked={true}
							onChange={() =>
								setQuoteSettingsState({
									...quoteSettingsState,
									ground_metric: 1,
								})
							}
							//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
						/>
						{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
					</Form.Item>
				</Col>

				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={6}>
					<label className={'text-gray'}>
						Restrict by the calendar days in transit
					</label>
				</Col>
				<Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={18}>
					<Form.Item className={'mb-0'}>
						<Radio
							name='ground_metric'
							value='2'
							checked={quoteSettingsState.ground_metric === 2}
							onChange={() =>
								setQuoteSettingsState({
									...quoteSettingsState,
									ground_metric: 2,
								})
							}
							//disabled={props.plansInfo && props.plansInfo.plan_type > 2 ? false : true}
						/>
						{/*props.plansInfo && props.plansInfo.plan_type < 3 && (
								<a href='#!' className='stnd-plan text-danger'>
									Advanced plan required
								</a>
							)*/}
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

export default GroundTransit
