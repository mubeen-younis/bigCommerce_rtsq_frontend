import { Col, Form, Input } from "antd"
import React from "react"

const AccountNumber = props => {
  const { label, name, locationDetail, changeValue } = props
  
  return (

    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
      <Form.Item className={"mb-2"} label={label}>
        <Input
          name={name}
          placeholder={label}
          value={locationDetail?.[name]}
          onChange={changeValue}
        />
      </Form.Item>
    </Col>
  )
}

export default AccountNumber
