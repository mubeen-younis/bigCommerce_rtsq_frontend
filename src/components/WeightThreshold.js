import React from 'react';
import { Row, Col, Form, Typography, Input, Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
const { Title } = Typography;

const WeightThreshold = ({ quoteSettingsState, handleStateChange }) => {
  const { thresholdSetting } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <Row gutter={30} className={'mb-4'}>
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
        <label className={'text-gray'}>Weight threshold (lbs)</label>
      </Col>
      <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={18}>



        <Form.Item className={'mb-0'}
          validateStatus={
            quoteSettingsState.weight_threshold &&
            !/^(?:[1-9]\d{0,4}|20000)(\.\d{1,3})?$/.test(quoteSettingsState.weight_threshold)
              ? 'error'
              : ''
          }
          help={
            quoteSettingsState.weight_threshold &&
            !/^(?:[1-9]\d{0,4}|20000)(\.\d{1,3})?$/.test(quoteSettingsState.weight_threshold)
              ? 'Value must be > 0, ≤ 20000, and max 3 decimal digits'
              : ''
          }
        >
          <Input
            maxLength='7'
            value={quoteSettingsState.weight_threshold}
            type='number'
            min='0'
            step='0.001'
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty value to let user delete input
              if (
                value === '' ||
                (/^(?:[1-9]\d{0,4}|20000)(\.\d{0,3})?$/.test(value) && parseFloat(value) <= 20000)
              ) {
                handleStateChange('weight_threshold', value);
              }
            }}
            />
        </Form.Item>

        

        <div className={'text-gray'}>
          When the total weight of the products in the shopping cart in the
          shipment exceed this value, LTL freight quotes will be included in the
          shipping options. Default weight threshold is 150 lbs.
        </div>
        <Form.Item className={'mb-0'}>
          <Radio
            checked={thresholdSetting?.parcel_rates === 1}
            onChange={(e) =>
              dispatch({
                type: 'TOGGLE_THRESHOLD_SETTINGS',
                payload: 1,
              })
            }
          >
            Continue to display parcel rates when the weight threshold is met.
          </Radio>
        </Form.Item>
        <Form.Item className={'mb-0'}>
          <Radio
            checked={thresholdSetting?.parcel_rates === 2}
            onChange={(e) =>
              dispatch({
                type: 'TOGGLE_THRESHOLD_SETTINGS',
                payload: 2,
              })
            }
          >
            Suppress parcel rates when the weight threshold is met.
          </Radio>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default WeightThreshold;
