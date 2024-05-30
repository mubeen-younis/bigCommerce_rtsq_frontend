import React from 'react';
import { Row, Col, Form, Select } from 'antd';

const { Option } = Select;

const ProviderComponent = ({ installedCarriers, handleProviderServices, filterProvider }) => {
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
        <div id='country_dropdown'>
          <Form.Item
            className={'mb-2'}
            label='Provider'
            name='filter_provider'
            rules={[
              {
                required: true,
                message: 'Provider is required',
              },
            ]}
          >
            <Select
              placeholder='Select Provider'
              value={filterProvider || undefined}
              onChange={handleProviderServices}
              getPopupContainer={() => document.getElementById('country_dropdown')}
            >
              {installedCarriers?.map((carrier) => (
                <Option value={carrier?.slug} key={carrier?.slug}>
                  {carrier.carrier_type === 1
                    ? `${carrier.name} (LTL Freight Providers)`
                    : carrier.carrier_type === 2
                    ? `${carrier.name} (Parcel & Postal Providers)`
                    : null}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
};

export default ProviderComponent;
