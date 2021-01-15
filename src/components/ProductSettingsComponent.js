import React, {Fragment, useState} from 'react';
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
  Checkbox
} from 'antd';

const { Option } = Select;

function ProductSettingsComponent(props){
  const [state, setState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    selectedRowKeys: [],
    showDropship: false,
    visible: false
  })

  const showDrawer = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onClose = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const saveSettings = () => {
    alert('DAta submit')
  }

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  }

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  const clearFilters = () => {
    setState({ ...state, filteredInfo: null });
  };

  const clearAll = () => {
    setState({
      ...state,
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  const setSkuSort = () => {
    setState({
      ...state,
      sortedInfo: {
        order: 'descend',
        columnKey: 'product_sku',
      },
    });
  };

  const onSelectChange = selectedRowKeys => {
    setState({ ...state, selectedRowKeys });
  };
  
    const { selectedRowKeys } = state;
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
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


    let { sortedInfo, filteredInfo } = state;
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
            <Button onClick={showDrawer}>Edit</Button>
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
            <Button onClick={setSkuSort}>Sort Product SKU</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
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
          <Table className="custom-table" rowSelection={rowSelection} columns={columns} dataSource={data} onChange={handleChange} />

          {/* ================ */}
          <Drawer
          title="Product Settings"
          width={720}
          onClose={onClose}
          visible={state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={saveSettings} type="primary">
                Save
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Checkbox onChange={onChange}>Quote as an LTL shipment</Checkbox>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="freight_class"
                  label="Freight Class"
                  rules={[{ required: false, message: 'Please select an owner' }]}
                >
                  <Select placeholder="Freight Class">
                    <Option value="">No Freight Class</Option>
                    <Option value="50">50</Option>
                    <Option value="55">55</Option>
                    <Option value="60">60</Option>
                    <Option value="65">65</Option>
                    <Option value="70">70</Option>
                    <Option value="85">85</Option>
                    <Option value="92.5">92.5</Option>
                    <Option value="density_based">Density Based</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  name="weight"
                  label="Weight (lbs)"
                >
                  <Input placeholder="Weight (lbs)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="length"
                  label="Length (inches)"
                >
                  <Input placeholder="Length (inches)" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="width"
                  label="Width (inches)"
                >
                  <Input placeholder="Width (inches)" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="height"
                  label="Height (inches)"
                >
                  <Input placeholder="Height (inches)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Checkbox onChange={onChange}>Hazardous Material</Checkbox>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Checkbox onChange={() => setState({showDropship: !state.showDropship})}>Dropship this product</Checkbox>
              </Col>
            </Row>
            {
              state.showDropship ?
              <Row gutter={16}>
              <Col span={12}>
              <Form.Item
                  name="dropship_location"
                  label="Dropship Location"
                >
                  <Select placeholder="Dropship Location">
                    <Option value="1">ds name 1</Option>
                    <Option value="2">ds name 2</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            : null
            }
            <Row gutter={16}>
              <Col span={12}>
                <Checkbox onChange={onChange}>Insurance</Checkbox>
              </Col>
            </Row>
            
          </Form>
        </Drawer>
          {/* ================ */}

        </Fragment>
    );
  
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