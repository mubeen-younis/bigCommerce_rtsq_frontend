import React, { Fragment, useState, useEffect, useCallback } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import ReactJson from "react-json-view"
import { getAllLogs } from "../Actions/DisplayLogs"
import { Table, Space, Drawer, Skeleton, Col, Row, Button, Form } from "antd"
import addKeysToList from "../Utilities/addKey"
import { isFireFox } from "../Utilities/browserName"
import Title from "antd/lib/typography/Title"
import axios from "axios"

const makeColumns = (
  sortLogs,
  showLogDetails,
  showPackagingDetails,
  packaging,
  isSmallCarr,
  showMoreItems,
  recordId,
) => {
  const columns = [
    {
      title: "Date and Time",
      dataIndex: "dateTime",
      key: "dateTime",
      sorter: sortLogs,
      ellipsis: true,
      sortOrder: false,
      render: item => <span> {item} </span>,
    },
    {
      title: "Items",
      dataIndex: "Items",
      key: "Items",
      ellipsis: true,
      render: (items, record) => (
        
        <>
          {record.key == recordId ?  (
            <>
              {items?.map((key) => {
              return (
                <>
                  <span> {key} </span>
                  <br/>
                </>
              )})}
            </>
          ): (
            <>
              {items?.map((key, item) => {
              if(item < 5){
                return (
                <>
                  <span> {key} </span>
                  <br/>
                </>
              )}})}
              {items?.length > 5 ? <a className="btn mt-2" onClick={() => showMoreItems(record.key)}>show more</a> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "DIMs (L x W x H)",
      dataIndex: "dimension",
      key: "dimension",
      ellipsis: true,
      render: (dim, record) => (

        <>
          {record.key == recordId ?  (
            <>
              {dim?.map((key) => {
                return (
                  <>
                    <span> {key} </span>
                    <br/>
                  </>
                )})}
            </>
          ): (
            <>
              {dim?.map((key, item) => {
                if(item < 5){
                  return (
                    <>
                      <span> {key} </span>
                      <br/>
                    </>
              )}})}
              {dim?.length > 5 ? <br/> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (

        <>
          {record.key == recordId ?  (
            <>
              {quantity?.map((key) => {
                return (
                  <>
                    <span> {key} </span>
                    <br/>
                  </>
              )})}
            </>
          ): (
            <>
              {quantity?.map((key, item) => {
                if(item < 5){
                  return (
                    <>
                      <span> {key} </span>
                      <br/>
                    </>
              )}})}
             {quantity?.length > 5 ? <br/> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: "Sender Address",
      dataIndex: "sender",
      key: "sender",
      width: 170,
    },
    {
      title: "Receiver Address",
      dataIndex: "receiver",
      key: "receiver",
      width: 170,
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      render: (response, record) => (
        <Space size="small">
          <a href="#!" onClick={() => showLogDetails(response, record)}>
            {record?.response == "success" ? "Success" : "Error"}
          </a>
          {record?.is_packaging && isSmallCarr ? (
            <>
              <span>|</span>
              <a
                href="#!"
                onClick={() => showPackagingDetails(response, record)}
              >
                <img
                  src={"images/box-icon.png"}
                  width={30}
                  height={30}
                  alt="box-image"
                />
              </a>
            </>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ]

  return columns
}

let aloneItem = 0,
  weightBasedItem = 0

function DisplayLogsPage(props) {
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(true)
  const [loadProduct, setLoadProduct] = useState(false)
  const [isSmallCarr, setIsSmallCarr] = useState(false)
  const [lastPageNo, setLastPageNo] = useState(1)
  const [countSorting, setCountSorting] = useState(0)
  const [state, setState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    selectedRowKeys: [],
    showDropship: false,
    showLogsData: false,
    showPackageData: false,
  })

  const [sortProd, setSortProd] = useState(false)
  const [logDetail, setLogDetail] = useState("")
  const dispatch = useDispatch()
  const [recordId, setRecordId] = useState(null);
  const {
    logsPagination,
    carrierId,
    installedCarriers,
    carrier_type,
    packaging,
    allLogs,
  } = useSelector(state => state)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: logsPagination?.total,
    search: null,
  })
  let slug = ""

  useEffect(() => {
    if (allLogs !== null && allLogs !== undefined) {
      setLoading(false)
    }
  }, [allLogs])

  useEffect(() => {
    installedCarriers.map(carr => {
      if (carr?.id == carrierId) {
        slug = carr.slug
        const isSmall = carr?.carrier_type === 2 ? true : false
        setIsSmallCarr(isSmall)

        if (carrier_type === "CRS") {
          slug = "cltl"
        }
      }
    })

    dispatch(
      getAllLogs(
        props.token,
        pagination.current,
        pagination.pageSize,
        false,
        setLogsLoading,
        pagination.search,
        slug
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
          slug
        )
      )
    }
    // eslint-disable-next-line
  }, [sortProd, dispatch, props.token])

  const showMoreItems = key => {
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

  const showPackagingDetails = async (id, log) => {
    setState({
      ...state,
      showPackageData: true,
    })

    const packaging_id = log["packaging_id"]
    const location_id = log["location_id"]
    console.log(12,log)

    try {
      const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_packaging`,
        config = {
          headers: {
            authorization: `Bearer ${props.token}`,
          },
          params: {
            packaging_id,
            location_id,
          },
        }
      setLoadProduct(true)

      const { data } = await axios.get(url, config)
      if (!data.error) {
        dispatch({
          type: "GET_PACKAGE_DETAIL",
          payload: data?.data,
        })
      }
      setLoadProduct(false)
    } catch (err) {
      if (err.response.data && err.response.data.error) {
        dispatch({
          type: "GET_PACKAGE_DETAIL",
          payload: err.response.data.data,
        })
      }
      setLoadProduct(false)
    }
  }

  const onClose = () => {
    setState({
      ...state,
      showLogsData: false,
      showPackageData: false,
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
          slug
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
            slug
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

  const widgetData = (widget, isPalletWidget = false) => {
    let showShipOwnTitle = 0
    let numBoxes = countBoxes(widget, isPalletWidget)
    const types = ["item", "weight_based"]
    const sbs = isPalletWidget ? widget?.pallet ?? [] : widget?.sbs ?? []

    return sbs?.map((bin, count) => {
      const type = bin?.type ?? ""
      showShipOwnTitle = 0

      if (type === types[0]) {
        return repeatItemAlone(bin, ++showShipOwnTitle, isPalletWidget)
      } else if (type === types[1] && !isPalletWidget) {
        return showWeightBasedItem(bin, ++showShipOwnTitle)
      } else {
        return (
          <Row gutter={24}>
            <Col span={24}>
              <Row gutter={24} className={"mt-2"}>
                <Col span={8} style={{ marginTop: "0px" }}>
                  <strong>
                    {isPalletWidget ? "Pallet" : "Box"} {count + 1} of{" "}
                    {numBoxes} <br />
                    {bin?.nickname} <br />
                    {bin?.d}
                    {bin?.w}
                    {bin?.h}
                  </strong>
                </Col>
                <Col span={16}>
                  <img src={bin?.image_complete} alt={bin?.image_complete} />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={24}>
                <Col span={24}>
                  <strong>Steps:</strong>
                </Col>
                {widget?.sbs?.type !== "item"
                  ? bin?.items.map(box => (
                      <>
                        <Col span={6} style={{ textAlign: "center" }}>
                          <img
                            src={box?.image_sbs}
                            style={{ margin: "5px" }}
                            alt={box?.image_sbs}
                          />
                          <br />
                          <span>
                            {box?.product_name} <br /> {box?.d + " x "}
                            {box?.w + " x "}
                            {box?.h}
                          </span>
                          <br />
                        </Col>
                      </>
                    ))
                  : ""}
              </Row>
            </Col>
          </Row>
        )
      }
    })
  }

  const countBoxes = (widget, isPalletWidget = false) => {
    let countBoxes = 0

    if (isPalletWidget) {
      widget?.pallet?.forEach(
        pallet =>
          pallet?.type !== "item" &&
          pallet?.type !== "weight_based" &&
          ++countBoxes
      )
    } else {
      widget?.sbs?.forEach(
        bin =>
          bin?.type !== "item" && bin?.type !== "weight_based" && ++countBoxes
      )
    }

    return countBoxes
  }

  const repeatItemAlone = (bin, showShipOwnTitle, isPalletWidget = false) => {
    let data = [<br />]
    aloneItem = isPalletWidget && aloneItem === 0 ? 0 : aloneItem

    for (let i = 0; i < bin?.quantity; i++) {
      data.push(
        <div>
          {showShipOwnTitle === 1 && aloneItem === 0 && (
            <h3
              style={{
                textAlign: "center",
                marginTop: "15px",
                width: "100%",
              }}
              className="alone-title"
            >
              These items were quoted as shipping as their own{" "}
              {isPalletWidget ? "pallet" : "package"}.
            </h3>
          )}
          <Col
            span={6}
            style={{
              textAlign: "center",
              float: "left",
              marginTop: "10px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
            <h4>{bin?.items[0]?.["product_name"] ?? ""}</h4>
            <span style={{ width: "100%", float: "left" }}>
              {bin?.d}
              {bin?.w}
              {bin?.h}
            </span>
            <img src={bin?.image_complete} alt={bin?.image_complete} />
          </Col>
          {(showShipOwnTitle = "")}
        </div>
      )
    }

    aloneItem = 1

    return (
      <>
        <div style={{ clear: "both" }}>
          <div style={{ width: "100%" }}> </div>
          {data}
        </div>
      </>
    )
  }

  const showWeightBasedItem = (bin, showShipOwnTitle) => {
    let data = [<br />]

    for (let i = 0; i < bin?.quantity; i++) {
      data.push(
        <div>
          {showShipOwnTitle === 1 && weightBasedItem === 0 && (
            <h3
              style={{
                textAlign: "center",
                marginTop: "15px",
                width: "100%",
              }}
              className="weight-title"
            >
              These items were quoted as weight based.
            </h3>
          )}
          <Col
            span={6}
            style={{
              textAlign: "center",
              float: "left",
              marginTop: "10px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
            <span style={{ width: "100%", float: "left" }}>{bin?.weight}</span>
            <img src={bin?.image_complete} alt={bin?.image_complete} />
          </Col>
          {(showShipOwnTitle = "")}
        </div>
      )
    }

    weightBasedItem = 1
    return (
      <div style={{ clear: "both" }}>
        <div style={{ width: "100%" }}> </div>
        {data}
      </div>
    )
  }

  const sortLogs = useCallback(
    (a, b) => {
      let lastProduct = allLogs[allLogs.length - 1]
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
      <Table
        className="custom-table"
        columns={makeColumns(
          sortLogs,
          showLogDetails,
          showPackagingDetails,
          packaging,
          isSmallCarr,
          showMoreItems,
          recordId
        )}
        dataSource={addKeysToList(allLogs)}
        onChange={handleChange}
        pagination={pagination}
        showSorterTooltip={{ title: "" }}
      />

      {/* ======Packaging Details Model========== */}
      <Drawer
        title={`Packaging Details`}
        width={720}
        onClose={onClose}
        visible={state.showPackageData}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          ></div>
        }
      >
        {loadProduct ? (
          <Skeleton active />
        ) : (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24} className="mb-3 float-left">
              {!packaging?.widget ? (
                <Fragment>
                  <Title
                    level={3}
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    No Packaging details found
                  </Title>
                </Fragment>
              ) : (
                packaging?.widget?.map((widget, key) => (
                  <Fragment>
                    <Col span={24}>
                      <div>
                        <strong>
                          Total boxes pack : {countBoxes(widget)}
                        </strong>
                        <br></br>
                        <strong>
                          Total items pack : {widget?.totalPackedItems}
                        </strong>
                      </div>
                      <br/>
                      <hr style={{backgroundColor: '#eaeaea'}}/>
                    </Col>
                    
                    <Col span={24}>{widgetData(widget)}</Col>
                    {/* use for pallet packaging */}
                    {/* <Col span={24}>
											{widgetData(widget, true)}
										</Col> */}
                  </Fragment>
                ))
              )}
            </Row>
          </Form>
        )}
      </Drawer>

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
      {/* ================ */}
    </Fragment>
  )
}

const mapStateToProps = state => {
  return {
    allLogs: state.allLogs,
    token: state.token,
    store: state.store,
  }
}

export default connect(mapStateToProps)(DisplayLogsPage)
