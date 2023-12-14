import React from 'react'
import { Row, Col, Form, Typography, Radio } from 'antd'

const { Title } = Typography

const PackageRatingMethod = ({
	quoteSettingsState,
	setQuoteSettingsState,
}) => {
	return (
		<Row align='middle' className={'mb-4'}>
			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={8}>
				<Title level={4}>Package rating method when Standard Box Sizes isn't in use</Title>
			</Col>
			<Row gutter={30} align='middle'>
			<Col className='gutter-row mb-1'  xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Quote each item as shipping as its own package
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='packageRatingMethod'
						value={true}
						checked={quoteSettingsState?.packageRatingMethod === 1}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								packageRatingMethod: 1,
							})
						}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row mb-1' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Quote shipping as all items are in one package
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='packageRatingMethod'
						checked={quoteSettingsState.packageRatingMethod === 3}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								packageRatingMethod: 3,
							})
						}
					/>
				</Form.Item>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={6}>
				<label className={'text-gray'}>
					Combine the weight of all items without dimensions and quote them as one package while quoting each item with dimensions as shipping as its own package
				</label>
			</Col>
			<Col className='gutter-row' xs={24} sm={12} md={12} lg={12} xl={18}>
				<Form.Item className={'mb-0'}>
					<Radio
						name='packageRatingMethod'
						checked={quoteSettingsState?.packageRatingMethod === 2}
						onChange={() =>
							setQuoteSettingsState({
								...quoteSettingsState,
								packageRatingMethod: 2,
							})
						}
					/>
				</Form.Item>
			</Col>
			</Row>
			
		</Row>
	)
}

export default PackageRatingMethod
