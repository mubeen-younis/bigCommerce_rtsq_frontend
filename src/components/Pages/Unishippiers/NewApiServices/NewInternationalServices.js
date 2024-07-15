import React from 'react';
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd';
import { blockSpecialChar, handlingFeeMarkup } from '../../../../Utilities/numberValidation';

const { Title } = Typography;

const international_services = [
  'UPS Worldwide Express',
  'UPS Worldwide Expedited',
  'UPS Worldwide Saver',
  'UPS Standard',
  'UPS Worldwide Express Plus',
];

const LabelAs = () => (
	<Col className='gutter-row mb-2' xs={14} sm={14} md={14} lg={14} xl={14}>
	  <label className={'text-gray'}>
		Service name displays by default. Enter an alternative if you prefer
		something different.
	  </label>
	</Col>
);

const InternationalServices = ({
  quoteSettingsState,
  internationalcheckAll,
  internationalAllCheckHandler,
  onChange,
  onCheck,
}) => {
  return (
    <Col span={12}>
      <Row gutter={30} align='middle' className={'mb-2'}>
        <Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12}>
          <Title level={5} style={{ textAlign: 'center' }}>
            International Services
          </Title>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>Select All Services</label>
        </Col>
        <Col span={12}>
          <Form.Item className='mb-0'>
            <Checkbox
              name='select_all'
              value={true}
              checked={internationalcheckAll}
              onChange={(e) => internationalAllCheckHandler(e.target.checked)}
            ></Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {international_services.map((is) => (
        <Row gutter={24} align='middle' className={'mb-2'}>
          <Col span={12}>
            <label className={'text-gray'}>{is}</label>
          </Col>
          <Col span={12}>
            <Form.Item className={'mb-0'}>
              <Checkbox
                name={is.toLowerCase().trim().replaceAll(' ', '_')}
                value={true}
                checked={
                  quoteSettingsState?.carrier_services?.[
                    is.toLowerCase().trim().replaceAll(' ', '_')
                  ]
                }
                onChange={onCheck}
              ></Checkbox>
            </Form.Item>
          </Col>
          <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name={is.toLowerCase().trim().replaceAll(' ', '_') + '_label'}
							value={
                quoteSettingsState?.carrier_services?.[
                  is.toLowerCase().trim().replaceAll(' ', '_') + '_label'
                ]
              }
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder={is}
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />
          <Col span={14}>
            <Form.Item className={'mb-0'}>
              <Input
                //maxLength='7'
                value={
                  quoteSettingsState?.carrier_services?.[
                    is.toLowerCase().trim().replaceAll(' ', '_') + '_markup'
                  ]
                }
                //pattern='[0-9.?(0-9){2}?]+%?$'
                name={is.toLowerCase().trim().replaceAll(' ', '_') + '_markup'}
                onChange={onChange}
                onKeyDown={handlingFeeMarkup}
                maxLength='7'
                type='text'
              />
            </Form.Item>
          </Col>

          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className={'text-gray'}>
              Markup (e.g Currency 1.00 or percentage 5%)
            </label>
          </Col>
        </Row>
      ))}
    </Col>
  );
};

export default InternationalServices;
