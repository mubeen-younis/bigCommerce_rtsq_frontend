import { Col, Form, Input, Row } from "antd"
import React from "react"
import {numberFieldLimit } from "../Utilities/numberValidation"

const ServiceRate = props => {
  const { label, name, placeholder, required, message} = props

  return (

    <Row gutter={30}>
      <Col
        className='gutter-row'
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
      >
        <Form.Item
          label={label}
          name={name}
          rules={[
            {
              required: required,
              message:message,
            },
            {
              pattern: /^\d*\.?\d{0,2}$/,
              message: 'Only two decimal places are allowed',
            },
          ]}
        >
          <Input
            type='number'
            onKeyDown={numberFieldLimit}
            min='0'
            step='0.01'
            placeholder={placeholder}
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default ServiceRate
