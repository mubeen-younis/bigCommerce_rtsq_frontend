import React, {Fragment} from 'react';
import { connect } from "react-redux";

import { 
  Table,
  Button,
  Space,
  Form,
  Input,
  Drawer,
  Col,
  Row,
  Select,
  DatePicker
} from 'antd';

const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}

class ProductSettingsComponent extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    selectedRowKeys: []
  };

  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setSkuSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'product_sku',
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const data = [
      {
        key: '1',
        image: <img style={{ height: '30px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'CTC',
        product_name: 'New York No. 1 Lake Park',
        price: '125'
      },
      {
        key: '2',
        image: <img style={{ height: '30px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'FCSB',
        product_name: 'London No. 1 Lake Park',
        price: '125'
      },
      {
        key: '3',
        image: <img style={{ height: '30px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'FCSBB',
        product_name: 'Sidney No. 1 Lake Park',
        price: '125'
      },
      {
        key: '4',
        image: <img style={{ height: '30px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'CLGB',
        product_name: 'London No. 2 Lake Park',
        price: '125'
      },
    ];


    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        sorter: (a, b) => a.image.length - b.image.length,
        sortOrder: sortedInfo.columnKey === 'image' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Product SKU',
        dataIndex: 'product_sku',
        key: 'product_sku',
        sorter: (a, b) => a.product_sku - b.product_sku,
        sortOrder: sortedInfo.columnKey === 'product_sku' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Product Name',
        dataIndex: 'product_name',
        key: 'product_name',
        sorter: (a, b) => a.product_name.length - b.product_name.length,
        sortOrder: sortedInfo.columnKey === 'product_name' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
        <Space size="middle">
            <Button onClick={this.showDrawer}>Edit</Button>
        </Space>
        )
      },
    ];

    const onFinish = values => {
      console.log('Received values of form: ', values);
    };
    
    return (
        <Fragment>
          <Space className={"mb-2"}>
            <Button onClick={this.setSkuSort}>Sort Product SKU</Button>
            <Button onClick={this.clearFilters}>Clear filters</Button>
            <Button onClick={this.clearAll}>Clear filters and sorters</Button>
            <Select defaultValue="Category" style={{ width: 120 }} onChange={handleChange}>
              <Option value="category_1">category 1</Option>
              <Option value="category_2">category 2</Option>
              <Option value="category_3">category 3</Option>
            </Select>
            <Form
              name="customized_form_controls"
              layout="inline"
              onFinish={onFinish}
              initialValues={{
                price: {
                  number: 0,
                  currency: 'rmb',
                },
              }}
            >
              <Form.Item>
                <Input placeholder={"Search"} type="text"/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Search</Button>
              </Form.Item>
            </Form>
          </Space>
          <Table className="custom-table" rowSelection={rowSelection} columns={columns} dataSource={data} onChange={this.handleChange} />

          {/* ================ */}
          <Drawer
          title="Create a new account"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Save
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter user name' }]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="Please enter url"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="owner"
                  label="Owner"
                  rules={[{ required: true, message: 'Please select an owner' }]}
                >
                  <Select placeholder="Please select an owner">
                    <Option value="xiao">Xiaoxiao Fu</Option>
                    <Option value="mao">Maomao Zhou</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please choose the type' }]}
                >
                  <Select placeholder="Please choose the type">
                    <Option value="private">Private</Option>
                    <Option value="public">Public</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="approver"
                  label="Approver"
                  rules={[{ required: true, message: 'Please choose the approver' }]}
                >
                  <Select placeholder="Please choose the approver">
                    <Option value="jack">Jack Ma</Option>
                    <Option value="tom">Tom Liu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter url description" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
          {/* ================ */}

        </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
   
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSettingsComponent);