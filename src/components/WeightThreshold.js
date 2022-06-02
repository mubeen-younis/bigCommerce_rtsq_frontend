import React from 'react'
import { Row, Col, Form, Input, Checkbox } from 'antd'

const WeightThreshold = ({ quoteSettingsState, handleStateChange }) => {
  return (
    <>
      <Row gutter={30} className='mb-3'>
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
            Return LTL quotes when an order parcel shipment weight exceeds the
            weight threshold
          </label>
        </Col>
        <Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={18}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              checked={quoteSettingsState.return_rates_threshold}
              onChange={(e) =>
                handleStateChange('return_rates_threshold', e.target.checked)
              }
            />
          </Form.Item>
          <div className={'text-gray'}>
            Return LTL quotes when an order parcel shipment weight exceeds the
            weight threshold When checked, the LTL Freight Quote will return
            quotes when an order’s total weight exceeds the weight threshold
            (the maximum permitted by WWE and UPS), even if none of the products
            have settings to indicate that it will ship LTL Freight. To increase
            the accuracy of the returned quote(s), all products should have
            accurate weights and dimensions.
          </div>
        </Col>
      </Row>

      {quoteSettingsState.return_rates_threshold && (
        <Row gutter={30} className={'mb-3'}>
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
            <Form.Item
              className={'mb-0'}
              name='weight_threshold'
              rules={[
                {
                  require: quoteSettingsState.return_rates_threshold,
                },
              ]}
            >
              <Input
                maxLength='7'
                value={quoteSettingsState.weight_threshold}
                type='number'
                min='0'
                step='0.001'
                max='150'
                pattern='[0-9.?(0-9){2}?]+%?$'
                required={quoteSettingsState.return_rates_threshold}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  )
}

export default WeightThreshold
