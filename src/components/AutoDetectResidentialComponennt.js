import React, {Fragment, useEffect} from 'react';
import { Row, Col, Button, Checkbox, Radio, Typography, Card, Select } from 'antd';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import TabsLayout from '../tabs_layout/tabs';
import { getCarrierDetails } from "../Actions/Action";

const { Title } = Typography;
const { Meta } = Card;
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

function AutoDetectResidentialComponennt() {
  const [value, setValue] = React.useState(1);

  const onRadioChange = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  return (
    <Fragment>
        <Row gutter={25}>
            <Col className="gutter-row mb-3" xs={24} sm={24} md={24} lg={24} xl={24}>
                <Title level={3} style={{ textAlign: 'center' }}>Residential Address Detection</Title>
            </Col>
        </Row>
        <Row gutter={30} justify="center" className={"mb-3"}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={18} xl={12}>
              <Card style={{ width: "100%" }}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non bibendum enim. Curabitur posuere enim enim, eu ultricies tortor aliquam sed. Integer id cursus tortor. Pellentesque ultrices placerat nibh ac suscipit. Etiam vitae sem dui. Vivamus interdum iaculis elit, id placerat quam volutpat ut. Duis sed neque elit. Sed fringilla nec sapien quis tempus. Fusce ut cursus nisi, aliquam mollis tellus. Duis quam turpis, blandit et posuere in, tincidunt a orci. Nam pharetra scelerisque sodales. Sed id mi porttitor, rhoncus dolor nec, consectetur diam. Nulla leo dui, efficitur nec libero eu, tristique ultrices neque. Praesent lobortis pellentesque aliquam. Ut facilisis nisi nec nulla maximus pulvinar. Duis massa leo, aliquet at tristique a, facilisis non risus. </p>
                <label><strong>Auto-renew</strong></label>
                <Select defaultValue="lucy" style={{ width: "100%", marginBottom: "20px" }} onChange={handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <label><strong>Current plan</strong></label>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <p style={{ marginBottom: "0" }}>100/mo ($5.00)</p>
                  <p style={{ marginBottom: "0" }}>Start date: Jan 13, 2021</p>
                  <p style={{ marginBottom: "0" }}>End date: Feb 13, 2021</p>
                </div>
                <label><strong>Current usage</strong></label>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <p style={{ marginBottom: "0" }}>35/100 35.00% (2021-02-03 05:58:26)</p>
                </div>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Checkbox onChange={onChange}>Suspend Use</Checkbox>
                </div>                  
                <label><strong>Default unconfirmed address types to</strong></label>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Radio.Group onChange={onRadioChange} value={value}>
                    <Radio style={{ display: "block", marginTop: "8px" }} value={"residential"}>Residential</Radio>
                    <Radio style={{ display: "block", marginTop: "8px" }} value={"commercial"}>Commercial</Radio>
                  </Radio.Group>
                </div>
              </Card>
            </Col>
        </Row>
    </Fragment>
  )
}
export default (AutoDetectResidentialComponennt);