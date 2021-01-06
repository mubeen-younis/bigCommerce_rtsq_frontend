import React, {Fragment} from 'react';
import { connect } from "react-redux";
import { Table, Button, Space, Form, Input} from 'antd';



class ProductSettingsComponent extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    selectedRowKeys: []
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
        image: <img style={{ height: '70px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'CTC',
        product_name: 'New York No. 1 Lake Park',
        price: '125'
      },
      {
        key: '2',
        image: <img style={{ height: '70px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'FCSB',
        product_name: 'London No. 1 Lake Park',
        price: '125'
      },
      {
        key: '3',
        image: <img style={{ height: '70px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
        product_sku: 'FCSBB',
        product_name: 'Sidney No. 1 Lake Park',
        price: '125'
      },
      {
        key: '4',
        image: <img style={{ height: '70px' }} src={"../../images/fedex.png"} alt={"text alt"} />,
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
            <Button>Edit</Button>
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
        </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
   
  }
}

export default connect(mapStateToProps)(ProductSettingsComponent);