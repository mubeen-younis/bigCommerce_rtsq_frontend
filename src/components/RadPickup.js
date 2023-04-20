import React from "react"
import { Row, Col, Form, Typography, Checkbox } from "antd"

const { Title } = Typography

const RadPickup = ({
  quoteSettingsState,
  setQuoteSettingsState,
  radStatus,
}) => {
  return (
    <Row gutter={30} align="middle" className={"mb-4"}>
      <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
        <Title level={4}>Residential address settings</Title>
      </Col>
      <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={6}>
        <label className={"text-gray"}>
          Always quote residential pickup
        </label>
      </Col>
      <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={18}>
        <Form.Item className={"mb-0"}>
          <Checkbox
            name="residentialPickup"
            checked={quoteSettingsState.residentialPickup}
            onChange={e =>
              setQuoteSettingsState({
                ...quoteSettingsState,
                residentialPickup: e.target.checked,
              })
            }
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default RadPickup
