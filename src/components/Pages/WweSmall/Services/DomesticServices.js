import React from 'react';
import { Row, Col, Typography, Form, Checkbox, Input } from 'antd';
import { blockSpecialChar, handlingFeeMarkup } from '../../../../Utilities/numberValidation';

const { Title } = Typography;

const LabelAs = () => (
	<Col className='gutter-row mb-2' xs={14} sm={14} md={14} lg={14} xl={14}>
	  <label className={'text-gray'}>
		Service name displays by default. Enter an alternative if you prefer
		something different.
	  </label>
	</Col>
);

const DomesticServices = ({
  quoteSettingsState,
  checkAll,
  allCheckHandler,
  onCheck,
  onChange,
}) => {
  return (
    <Col span={12}>
      <Row gutter={30} align='middle' className={'mb-2'}>
        <Col
          className='gutter-row middle'
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <Title level={5} style={{ textAlign: 'center' }}>
            US Domestic Services
          </Title>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>Select All Services</label>
        </Col>
        <Col span={6}>
          <Form.Item className='mb-0'>
            <Checkbox
              name='select_all'
              value={true}
              checked={checkAll}
              onChange={allCheckHandler}
            ></Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS Ground</label>
        </Col>
        <Col span={6}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_ground'
              value={true}
              checked={
                quoteSettingsState?.carrier_services?.ups_ground ? true : null
              }
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_ground_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_ground_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS Ground'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              name={'ups_ground_markup'}
              value={quoteSettingsState?.carrier_services?.ups_ground_markup}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS 3 Day Select</label>
        </Col>
        <Col span={6}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_3_day_select'
              value={true}
              checked={quoteSettingsState?.carrier_services?.ups_3_day_select}
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_3_day_select_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_3_day_select_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS 3 Day Select'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              value={
                quoteSettingsState?.carrier_services?.ups_3_day_select_markup
              }
              name={'ups_3_day_select_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS 2nd Day Air</label>
        </Col>
        <Col span={6}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_2nd_day_air'
              value={true}
              checked={quoteSettingsState?.carrier_services?.ups_2nd_day_air}
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_2nd_day_air_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS 2nd Day Air'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              value={
                quoteSettingsState?.carrier_services?.ups_2nd_day_air_markup
              }
              name={'ups_2nd_day_air_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS 2nd Day Air Early</label>
        </Col>
        <Col span={12}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_2nd_day_air_am'
              value={true}
              checked={quoteSettingsState?.carrier_services?.ups_2nd_day_air_am}
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_2nd_day_air_early_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_early_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS 2nd Day Air Early'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              value={
                quoteSettingsState?.carrier_services?.ups_2nd_day_air_am_markup
              }
              name={'ups_2nd_day_air_am_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS 2nd Day Air Saver</label>
        </Col>
        <Col span={6}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_2nd_day_air_saver'
              value={true}
              checked={
                quoteSettingsState?.carrier_services?.ups_2nd_day_air_saver
              }
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_2nd_day_air_saver_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_2nd_day_air_saver_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS 2nd Day Air Saver'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              value={
                quoteSettingsState?.carrier_services
                  ?.ups_2nd_day_air_saver_markup
              }
              name={'ups_2nd_day_air_saver_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS Next Day Air Saver</label>
        </Col>
        <Col span={6}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_next_day_air_saver'
              value={true}
              checked={
                quoteSettingsState?.carrier_services?.ups_next_day_air_saver
              }
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_next_day_air_saver_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_saver_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS Next Day Air Saver'
							maxLength={50}
						/>
					</Form.Item>
				</Col>
				<LabelAs />

        <Col span={14}>
          <Form.Item className={'mb-0'}>
            <Input
              value={
                quoteSettingsState?.carrier_services
                  ?.ups_next_day_air_saver_markup
              }
              name={'ups_next_day_air_saver_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS Next Day Air</label>
        </Col>
        <Col span={12}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_next_day_air'
              value={true}
              checked={quoteSettingsState?.carrier_services?.ups_next_day_air}
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_next_day_air_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS Next Day Air'
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
                quoteSettingsState?.carrier_services?.ups_next_day_air_markup
              }
              //pattern='[0-9.?(0-9){2}?]+%?$'
              name={'ups_next_day_air_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>

      <Row gutter={24} align='middle' className={'mb-2'}>
        <Col span={12}>
          <label className={'text-gray'}>UPS Next Day Air Early</label>
        </Col>
        <Col span={12}>
          <Form.Item className={'mb-0'}>
            <Checkbox
              name='ups_next_day_air_early'
              value={true}
              checked={
                quoteSettingsState?.carrier_services?.ups_next_day_air_early
              }
              onChange={onCheck}
            ></Checkbox>
          </Form.Item>
        </Col>

        <Col span={14}>
					<Form.Item className='mb-0'>
						<Input
							name='ups_next_day_air_early_label'
							value={
								quoteSettingsState?.carrier_services
									?.ups_next_day_air_early_label
							}
							onChange={onChange}
							onKeyDown={blockSpecialChar}
							type='text'
							placeholder='UPS Next Day Air Early'
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
                quoteSettingsState?.carrier_services
                  ?.ups_next_day_air_early_markup
              }
              //pattern='[0-9.?(0-9){2}?]+%?$'
              name={'ups_next_day_air_early_markup'}
              onChange={onChange}
              onKeyDown={handlingFeeMarkup}
              maxLength='7'
              type='text'
            />
          </Form.Item>
        </Col>

        <Col className='gutter-row' xs={14} sm={14} md={14} lg={14} xl={14}>
          <label className={'text-gray'}>
            Markup (e.g Currency 1.00 or percentage 5%)
          </label>
        </Col>
      </Row>
    </Col>
  );
};

export default DomesticServices;
