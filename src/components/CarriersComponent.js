import React from 'react';
import { connect } from "react-redux";
import { postData } from "../Actions/Action";
import { getServices } from "../Actions/Carriers";
import { Form, Table, Button, Space, Skeleton} from 'antd';

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

class CarriersComponent extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: true,
    carrierServices: []
  };
  
  componentDidMount(){
    this.getServices()  
  }

  getServices = () => {
    if (this.props.services === undefined) {
      this.props.getServices() 
    }
    if (this.props.services !== null && this.props.services !== undefined) {
      this.setState({loading: false})
    }
  }

  onSelectChange = selectedRowKeys => {
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
    
    if (this.state.loading && this.props.services === undefined) {
      return (
          <>
              <Skeleton active />
          </>
      )
    }

    return (
        <>
          <Table className="custom-table" rowSelection={rowSelection} columns={columns} dataSource={this.props.services} total={50} />
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
    services: state.services,
    skeleton_loading: state.skeleton_loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      postData: (data, type, url) => dispatch(postData(data, type, url)),
      getServices: () => dispatch(getServices()),
      dismissSkeleton: () => dispatch({type: 'SKELETON_LOADING', payload: true})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarriersComponent);