import React from 'react'
import { Row, Col, Form, Radio, Typography } from 'antd'

const { Title } = Typography

const ErrorManagment = ({ quoteSettingsState, handleChange }) => {
	return (
		<Row gutter={30}>
			<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={24}>
				<Title level={4}>Error Managment</Title>
			</Col>

			<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col className='gutter-row mb-0' xs={24} sm={24} md={24} lg={24} xl={18}>
				<Form.Item className='mb-0'>
					<Radio
						checked={quoteSettingsState.error_managment === 1}
						onChange={e => handleChange('error_managment', 1)}>
						Quote shipping using known shipping parameters, even if other items <br></br> 
						are missing shipping parameters.
					</Radio>
				</Form.Item>
			</Col>

			<Col
				className='gutter-row'
				// style={{ paddingTop: '11px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={6}>
				<label className={'text-gray'}></label>
			</Col>
			<Col
				className='gutter-row'
				style={{ marginTop: '10px' }}
				xs={24}
				sm={24}
				md={24}
				lg={24}
				xl={18}>
				<Form.Item className='mb-0'>
					<Radio
						checked={quoteSettingsState.error_managment === 2}
						onChange={e => handleChange('error_managment', 2)}>
						Don't quote shipping if one or more items are missing the required <br></br> 
						shipping parameters.
					</Radio>
				</Form.Item>
			</Col>
		</Row>
	)
}

export default ErrorManagment
