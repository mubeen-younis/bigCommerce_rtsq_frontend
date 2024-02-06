import React, { Fragment } from "react";
import { Typography, Row, Col, Space, Button, Table } from "antd";
const { Title } = Typography;

function PaymentsTabComponent(props) {
  const columns = [
    {
      key: "amount",
      title: "Amount",
      dataIndex: "amount",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
    },
    {
      key: "action",
      title: "Manage",
      render: (text) => (
        <Space size="middle">
          <Button>View Receipt</Button>
        </Space>
      ),
    },
  ];
  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
        <Row gutter={30} className="m-3">
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>Payments</Title>
            <Table className={"custom-table"} columns={columns} />
          </Col>
        </Row>
      </Space>
    </Fragment>
  );
}

export default PaymentsTabComponent;
