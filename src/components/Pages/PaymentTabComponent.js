import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Typography, Row, Col, Space, Button, Table } from "antd";
import { getPaymentsDetial } from "../../Actions/PaymentsAction";
import addKeysToList from "./../../Utilities/addKey";
import { useDispatch, useSelector } from "react-redux";
const { Title } = Typography;

function PaymentsTabComponent(props) {

  const dispatch = useDispatch();
  const { alertMessageType, getPayments, token } = useSelector(
    (state) => state
  );

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  
  useEffect(() => {
    if (!getPayments) {
      dispatch(getPaymentsDetial(token));
    }
  }, [dispatch, getPayments, token]);

  const columns = [
    {
      key: "amount",
      title: "Amount",
      dataIndex: "amount",
      render: amount => "$" + amount
    },
    {
      key: "invoice_id",
      title: "Description",
      dataIndex: "invoice_id",
    },
    {
      key: "is_addon",
      title: "Plan / Addon name",
      dataIndex: "is_addon",
      render: (is_addon, data) =>
        is_addon ? data.addon_name : data.product_name,
    },
    {
      key: "created_at",
      title: "Date",
      dataIndex: "created_at",
    },
    {
      key: "action",
      title: "Manage",
      render: (text) => (
        <Space size="middle">
            <Button  onClick={() => openInNewTab(text.receipt_url)}>View Receipt</Button>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
        <Row gutter={30} className="m-3">
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}> Payments {' '} </Title>
            <Table
              className={"custom-table"}
              dataSource={getPayments ? addKeysToList(getPayments) : []}
              columns={columns}
            />
          </Col>
        </Row>
      </Space>
    </Fragment>
  );
}

export default PaymentsTabComponent;
