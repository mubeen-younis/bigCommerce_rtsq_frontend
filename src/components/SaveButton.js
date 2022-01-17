import React from 'react'
import { Row, Col, Form, Button, Space } from 'antd'

const SaveButton = () => (
	<Row gutter={30} className={'mt-3'}>
		<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
			<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
				<Space>
					<Button type='primary' size={'large'} htmlType='submit'>
						Save Settings
					</Button>
				</Space>
			</Form.Item>
		</Col>
	</Row>
)

export default SaveButton
