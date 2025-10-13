import React, { Fragment, useState, useEffect, useCallback } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import ReactJson from "react-json-view"
import { getAllLogs } from "../../Actions/DisplayLogs"
import { Table, Space, Drawer, Skeleton, Typography } from "antd"
import addKeysToList from "../../Utilities/addKey"
import { isFireFox } from "../../Utilities/browserName"

const { Title } = Typography

const makeColumns = (sortLogs, showLogDetails, showMoreItems, recordId) => {
  const columns = [
    {
      title: "Log ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Integration",
      dataIndex: "carrier_name",
      key: "carrier_name",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Request Time",
      dataIndex: "requestTime",
      key: "requestTime",
      sorter: sortLogs,
      align: "center",
      ellipsis: true,
      sortOrder: false,
      width: 150,
    },
    {
      title: "Response Time",
      dataIndex: "responseTime",
      key: "responseTime",
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      ellipsis: true,
      align: "center",
      width: 80,
    },
    {
      title: "Items",
      dataIndex: "Items",
      align: "left",
      key: "Items",
      ellipsis: true,
      width: 200,
      render: (items, record) => (
        <>
          {record.key == recordId ? (
            <>
              {items?.map((key) => {
                return (
                  <>
                    <span> {key} </span>
                    <br />
                  </>
                )
              })}
            </>
          ) : (
            <>
              {items?.map((key, item) => {
                if (item < 5) {
                  return (
                    <>
                      <span> {key} </span>
                      <br />
                    </>
                  )
                }
              })}
              {items?.length > 5 ? (
                <a className="btn mt-2" onClick={() => showMoreItems(record.key)}>
                  show more
                </a>
              ) : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "DIMs (L x W x H)",
      dataIndex: "dimension",
      key: "dimension",
      align: "left",
      ellipsis: true,
      width: 150,
      render: (dim, record) => (
        <>
          {record.key == recordId ? (
            <>
              {dim?.map((key) => {
                return (
                  <>
                    <span> {key} </span>
                    <br />
                  </>
                )
              })}
            </>
          ) : (
            <>
              {dim?.map((key, item) => {
                if (item < 5) {
                  return (
                    <>
                      <span> {key} </span>
                      <br />
                    </>
                  )
                }
              })}
              {dim?.length > 5 ? <br /> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      ellipsis: true,
      align: "center",
      width: 80,
      render: (quantity, record) => (
        <>
          {record.key == recordId ? (
            <>
              {quantity?.map((key) => {
                return (
                  <>
                    <span> {key} </span>
                    <br />
                  </>
                )
              })}
            </>
          ) : (
            <>
              {quantity?.map((key, item) => {
                if (item < 5) {
                  return (
                    <>
                      <span> {key} </span>
                      <br />
                    </>
                  )
                }
              })}
              {quantity?.length > 5 ? <br /> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "Sender Address",
      dataIndex: "sender",
      key: "sender",
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Receiver Address",
      dataIndex: "receiver",
      align: "center",
      key: "receiver",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      ellipsis: true,
      width: 100,
      render: (response, record) => (
        <Space size="small">
          <a
            href="#!"
            onClick={() => showLogDetails(response, record)}
            style={{
              color: record?.response == "success" ? "#1890ff" : "#ff4d4f"
            }}
          >
            {record?.response == "success" ? "Success" : "Error"}
          </a>
        </Space>
      ),
    },
  ]

  return columns
}

function AllProvidersLogsPage(props) {
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(true)
  const [loadProduct, setLoadProduct] = useState(false)
  const [lastPageNo, setLastPageNo] = useState(1)
  const [countSorting, setCountSorting] = useState(0)
  const [state, setState] = useState({
    showLogsData: false,
  })

  const [sortProd, setSortProd] = useState(false)
  const [logDetail, setLogDetail] = useState("")
  const dispatch = useDispatch()
  const [recordId, setRecordId] = useState(null)
  const { logsPagination, allLogs } = useSelector((state) => state)

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: logsPagination?.total,
    search: null,
  })

  useEffect(() => {
    if (allLogs !== null && allLogs !== undefined) {
      setLoading(false)
    }
  }, [allLogs])

  useEffect(() => {
    // Fetch all providers logs (no carrier slug filter)
    dispatch(
      getAllLogs(
        props.token,
        pagination.current,
        pagination.pageSize,
        false,
        setLogsLoading,
        pagination.search,
        null // null carrier slug to get all providers
      )
    )

    if (allLogs !== null && allLogs !== undefined) {
      setLoading(false)
      setPagination({
        ...pagination,
        total: logsPagination?.total,
      })
    }

    if (countSorting > 0) {
      setLoading(true)
      setCountSorting(0)
      dispatch(
        getAllLogs(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLogsLoading,
          pagination.search,
          null
        )
      )
    }
    // eslint-disable-next-line
  }, [sortProd, dispatch, props.token])

  const showMoreItems = (key) => {
    setRecordId(key)
  }

  const showLogDetails = (id, log) => {
    setState({
      ...state,
      showLogsData: true,
    })

    setLogDetail(JSON.parse(log?.responseData))
    setLoadProduct(true)

    setTimeout(() => {
      setLoadProduct(false)
    }, 1000)
  }

  const onClose = () => {
    setState({
      ...state,
      showLogsData: false,
    })
    setLoadProduct(true)
  }

  const handleChange = (pagination, filters, sorter) => {
    setLoading(true)
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })

    let PaginationPerpage = (logsPagination?.perpage * 10) / 10

    if (pagination?.pageSize !== PaginationPerpage) {
      setLoading(true)
      dispatch(
        getAllLogs(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLogsLoading,
          pagination.search,
          null
        )
      )
      const meta = {
        ...logsPagination,
        perpage: pagination?.pageSize,
      }
      dispatch({
        type: "LOGS_PAGINATION",
        payload: meta,
      })
    } else {
      if (pagination?.current !== lastPageNo) {
        setLastPageNo(pagination?.current)
        dispatch(
          getAllLogs(
            props.token,
            pagination.current,
            pagination.pageSize,
            sortProd,
            setLogsLoading,
            pagination.search,
            null
          )
        )
      } else {
        setSortProd(!sortProd)
      }
    }

    setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  const sortLogs = useCallback(
    (a, b) => {
      let lastProduct = allLogs[allLogs?.length - 1]
      let checkId = isFireFox() ? b?.id : a?.id
      if (lastProduct?.id === checkId) {
        setCountSorting(countSorting + 1)
        setSortProd(!sortProd)
      }
    },
    [countSorting, allLogs, sortProd]
  )

  if (loading || logsLoading) {
    return <Skeleton active />
  }

  return (
    <Fragment>
      <Title level={3} style={{ marginBottom: 20 }}>
        Logs
      </Title>

      {allLogs && allLogs.length > 0 ? (
        <Table
          className="custom-table"
          columns={makeColumns(sortLogs, showLogDetails, showMoreItems, recordId)}
          dataSource={addKeysToList(allLogs)}
          onChange={handleChange}
          pagination={pagination}
          showSorterTooltip={{ title: "" }}
          scroll={{ x: 1500 }}
        />
      ) : (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Title level={4}>No logs available</Title>
          <p>Logs will appear here once quote requests are made through the enabled providers.</p>
        </div>
      )}

      {/* =======Logs Response Model========= */}
      <Drawer
        title={`Response`}
        width={720}
        onClose={onClose}
        visible={state.showLogsData}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
              paddingBottom: 30,
            }}
          ></div>
        }
      >
        {loadProduct ? (
          <Skeleton active />
        ) : (
          <ReactJson
            src={logDetail}
            theme="shapeshifter:inverted"
            displayDataTypes={false}
            enableClipboard={false}
            iconStyle="square"
          />
        )}
      </Drawer>
    </Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    allLogs: state.allLogs,
    token: state.token,
    store: state.store,
  }
}

export default connect(mapStateToProps)(AllProvidersLogsPage)
