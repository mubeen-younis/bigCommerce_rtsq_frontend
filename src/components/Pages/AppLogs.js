import React, { useEffect, useState } from "react";
import { Space, Button, Table, Col, Input, Row, Skeleton, Tag } from "antd";
import axios from "axios";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";

const AppLogs = () => {
  const [sortOrderCreated, setSortOrderCreated] = useState("descend");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    showSizeChanger: true,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: ["20", "30", "50", "100"],
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params =
        `search=` +
        search +
        `&page=` +
        pagination.current +
        `&page_size=` +
        pagination.pageSize +
        `&sort_order=` +
        sortOrderCreated;
      const url = `${process.env.REACT_APP_ENITURE_API_URL}/api_logs?` + params;
      const { data } = await axios.get(url);
      updateTableState(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const updateTableState = (data) => {
    setFilteredLogs(data?.data?.data ?? []);
    setPagination({
      ...pagination,
      total: data?.data?.total,
    });
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    if (sorter.field === "level_name") {
      sorter.order == undefined
        ? sortOrderCreated === "ascend"
          ? setSortOrderCreated("descend")
          : setSortOrderCreated("ascend")
        : setSortOrderCreated(sorter.order);
    }
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  useEffect(() => {
    fetchLogs();
  }, [sortOrderCreated, pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: "Details",
      dataIndex: "level_name",
      key: "level_name",
      render: (_, { level_name, remote_addr, created_at }) => (
        <Tag color={level_name === "INFO" ? "green" : "red"}>
          {level_name} | {remote_addr} | {created_at}
        </Tag>
      ),
      sorter: true,
      sortOrder: sortOrderCreated,
    },

    {
      title: "LOG",
      dataIndex: "formatted",
      key: "formatted",
      render: (_, { level_name, formatted }) => (
        <>
          <Text type={level_name === "INFO" ? "disabled" : "danger"}>
            {formatted}
          </Text>
        </>
      ),
      responsive: ["lg"],
    },
  ];

  if (loading) return <Skeleton active />;

  return (
    <>
      <Title
        style={{
          textAlign: "center",
        }}
      >
        RTSQ Logs
      </Title>
      <Row gutter={30} className="mb-3">
        <Col span={20}>
          <Input
            placeholder="Search by Context or Message"
            className="col-8"
            type="text"
            pattern="[0-9]*"
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col span={4} style={{ paddingLeft: "0px" }}>
          <Button type="primary" size="large" onClick={() => fetchLogs()}>
            Search
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={filteredLogs?.length > 0 ? filteredLogs : []}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        size="small"
      />
    </>
  );
};

export default AppLogs;
