import React, {Fragment, useState} from 'react';
import { connect } from "react-redux";
import { postData } from "../../Actions/Action";
import { 
    Select,
    Typography,
    Row,
    Col,
    Space,
    Button,
    Form,
    Checkbox,
    Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;
const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    }
  };

function ImportCsvComponent(){
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };
    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }
    return(
        <Fragment>
            <Form
            layout="vertical"
            name="import_csv"
            className="form-wrp important-csv"
            size={"large"}
            onFinish={onFinish}
            >
                <Row gutter={30} justify="center" className={"mb-3"}>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Title className={"mt-3"} level={3}>Import CSV - Step 1</Title>
                        <div className={"gray-text-block mb-3"}>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean posuere euismod turpis, a aliquam nulla ullamcorper eget. Curabitur ultrices neque at arcu bibendum, quis cursus massa rutrum. Sed ipsum tellus, condimentum mollis aliquam eget, convallis non purus. Duis vel mi rhoncus, malesuada orci eget, facilisis felis.</p>
                            <p>Aliquam metus velit, volutpat vel est pretium, pulvinar luctus turpis. Sed vestibulum euismod consequat. Aliquam in turpis eleifend, egestas tellus fermentum, euismod ex.</p>
                            <p>Suspendisse sit amet cursus libero. Morbi ac consequat est, a dictum diam. Nunc in libero ligula. Vivamus sem risus, rhoncus a arcu non, eleifend ornare risus. Integer eu felis id arcu rhoncus commodo. Cras sollicitudin leo nec consectetur posuere. Suspendisse mi nunc, ullamcorper eget risus ullamcorper, euismod ullamcorper nisi. Phasellus ullamcorper dapibus elementum. Ut feugiat libero cursus quam porta varius. Etiam cursus magna in lobortis condimentum. Pellentesque blandit dictum lacinia.</p>
                            <p>Integer sollicitudin sagittis molestie. Mauris pharetra velit non molestie lobortis. Vivamus aliquam, orci sed vulputate egestas, turpis arcu volutpat purus, vel condimentum dui metus at sem.</p>
                        </div>
                        <Title className={"mb-0"} level={5}>Heading</Title>
                        <Form.Item
                            className={"mb-2"}
                            name="city"
                        >
                            <Checkbox onChange={onChange}>The first row contains column headers</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Title className={"mb-0"} level={5}>CSV</Title>
                        <Upload {...props} className={"mb-3 w-100"}>
                            <Button icon={<UploadOutlined />}>Upload CSV</Button>
                        </Upload>
                    </Col>
                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={18}>
                        <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                            <Space>
                                <Button type="primary" size={"large"} htmlType="submit">Submit</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
      token: state.token
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data, type, url, token) => dispatch(postData(data, type, url, token))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(ImportCsvComponent);