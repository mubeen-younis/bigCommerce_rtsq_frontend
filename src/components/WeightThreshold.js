import React from 'react'
import { Row, Col, Form, Typography, Checkbox, Input } from 'antd'

const { Title } = Typography

const WeightThreshold = ({ quoteSettingsState, handleStateChange }) => {
  return (
    <Row gutter={30} align='middle' className={'mb-4'}>
      <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
        <Title level={4}>Other settings</Title>
      </Col>
      <Col
        className='gutter-row'
        style={{ paddingTop: '11px' }}
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={6}
      >
        <label className={'text-gray'}>
          Weight threshold for LTL Freight Quotes
        </label>
      </Col>
      <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>
        <Form.Item className={'mb-0'}>
          <Input
            maxLength='7'
            value={quoteSettingsState.weight_threshold}
            type='number'
            min='0'
            step='0.001'
            max='150'
            onChange={(e) =>
              handleStateChange('weight_threshold', e.target.value)
            }
            pattern='[0-9.?(0-9){2}?]+%?$'
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default WeightThreshold
