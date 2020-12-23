import React from 'react';
import { connect } from "react-redux";
import { postData } from "../Actions/Action";
import { Form, Table, Button, Space} from 'antd';

const columns = [
  {
    title: 'Sr#',
    dataIndex: 'sr_no',
  },
  {
    title: 'Name',
    dataIndex: 'carrier_name',
  },
  {
    title: 'Logo',
    dataIndex: 'carrier_logo',
  },
];

const data = [];
for (let i = 1; i < 30; i++) {
  data.push({
    key: i,
    sr_no: i,
    carrier_name: `UPS Freight`,
    carrier_logo: <img style={{ height: '70px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
  });
}

class CarriersComponent extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  saveCarriers = () => {
    this.props.postData(this.state.selectedRowKeys,'GET_CARRIERS','submit_carriers')
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
        <>
          <Table className="custom-table" rowSelection={rowSelection} columns={columns} dataSource={data} total={50} />
          <Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
                    <Space>
                        <Button type="primary" size={"large"} htmlType="submit" name={`test`} onClick={this.saveCarriers}>Save Settings</Button>
                    </Space>
                </Form.Item>
        </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    carrriers: state.carrriers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      postData: (data, type, url) => dispatch(postData(data, type, url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarriersComponent);