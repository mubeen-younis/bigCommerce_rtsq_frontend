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
        <Form.Item className={'mb-0'}>
          <Input
            maxLength='7'
            value={quoteSettingsState.weight_threshold}
            type='number'
            min='0'
            step='0.001'
            onChange={(e) =>
              handleStateChange('weight_threshold', e.target.value)
            }
            pattern='[0-9.?(0-9){2}?]+%?$'
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
