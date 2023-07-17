import React, { Fragment, useState, useCallback } from "react"
import {
  Typography,
  Row,
  Col,
  Space,
  Button,
  Form,
  Skeleton,
  Checkbox,
  Card,
  Input,
  Select,
} from "antd"
import { useDispatch, useSelector } from "react-redux"
import { submitCompareRates } from "../../Actions/Action"
import {
  checkDigitsAfterDecimal,
  checkValueLimit,
} from "../../Utilities/numberValidation"
import axios from "axios"

const { Title } = Typography
const initialState = {
  enable_instore: false,
  enable_ld: false,
  origin_zip: [],
  ld_zipcodes: [],
  default_location_id: "default",
  location_type: 0,
}

const carrName = [
  {
    index: "small_package",
    value: "Worldwide Express (WWEX (Small Package & LTL))",
  },
  { index: "ups_ship_engine", value: "UPS (ShipEngine_UPS)" },
]

function ShippingGroupsComponent() {
  const [locationDetail, setLocationDetail] = useState(initialState)
  const [originRatesCity, setOriginRatesCity] = useState([])
  const [carriers, setCarriers] = useState([])
  const [carrSlugs, setCarrSlugs] = useState("")
  const [isResidentail, setResi] = useState(false)
  const dispatch = useDispatch()
  const { token, compareRates, installedCarriers } = useSelector(state => state)
  console.log(54, compareRates)
  console.log(64, locationDetail)
  const handleStateChange = useCallback(e => {
    const { name, checked } = e.target
    setCarrSlugs(name)
    setCarriers(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }))
  }, [])

  const handleState = useCallback(e => {
    const { name, checked } = e.target

    setResi(checked)
  }, [])

  const getErrMessage = input => {
    return (
      input +
      " format should be 100.22 or only 2 decimal places are allowed & a max of 6 digits are allowed."
    )
  }

  const enableCarriers = carriers => {
    let count = 0
    carriers?.map(carr => {
      console.log(13, carr)
    })
    if (count > 1) {
      return true
    } else {
      return false
    }
  }

  const onFinish = data => {
    data = {
      ...data,
      carriers,
      isResidentail,
    }

    let error = false
    let errormsg = ""

    if (data?.carriers === []) {
      error = true
      errormsg = "Please select at least 2 providers."
    }

    if (
      data?.weight !== undefined &&
      checkDigitsAfterDecimal(data?.weight, 2)
    ) {
      error = true
      errormsg = getErrMessage("Weight")
    }

    if (checkDigitsAfterDecimal(data?.length, 2)) {
      error = true
      errormsg = getErrMessage("Length")
    }

    if (checkDigitsAfterDecimal(data?.width, 2)) {
      error = true
      errormsg = getErrMessage("Width")
    }

    if (checkDigitsAfterDecimal(data?.height, 2)) {
      error = true
      errormsg = getErrMessage("Height")
    }

    if (error === true) {
      dispatch({
        type: "ALERT_MESSAGE",
        payload: {
          showAlertMessage: false,
          alertMessageType: "loading",
        },
      })
      dispatch({
        type: "ALERT_MESSAGE",
        payload: {
          alertMessage: errormsg,
          showAlertMessage: true,
          alertMessageType: "error",
        },
      })
    } else {
      dispatch(submitCompareRates(data, token))
    }
  }

  const changeValue = e => {
    setLocationDetail({
      ...locationDetail,
      [e.target.name]: e.target.value,
    })
  }

  const populateOriginRatesLocation = useCallback(
    async (zip_code = "") => {
      try {
        const zipCode = zip_code ?? locationDetail?.origin_zip
        const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipCode}`
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }

        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            showAlertMessage: false,
            alertMessageType: "loading",
          },
        })

        const { data } = await axios.get(url, config)
        if (!data.error) {
          const updatedLocationDetail = {
            origin_city: data?.data?.city[0] ?? "",
            origin_state: data?.data?.state ?? "",
            origin_country: data?.data?.country ?? "",
          }

          setOriginRatesCity(data?.data?.city)
          setLocationDetail({
            ...locationDetail,
            ...updatedLocationDetail,
          })
        }

        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            alertMessage: data.message,
            showAlertMessage: data.error,
            alertMessageType: data.error ? "error" : "success",
          },
        })
      } catch (err) {
        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            alertMessage: "",
            showAlertMessage: false,
            alertMessageType: null,
          },
        })
      }
    },
    [dispatch, locationDetail, token]
  )

  //if (!compareRates) return <Skeleton active />

  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
        <Row>
          <Card style={{ width: "59%", marginRight: "1%" }}>
            <Form
              layout="vertical"
              name="connection_settings"
              className="connection-settings"
              size="large"
              onFinish={onFinish}
            >
              <Row>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <Title level={4}>Compare Rates</Title>
                </Col>
              </Row>

              <Card>
                <Row gutter={30}>
                  <Col
                    className="gutter-row"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Title level={5}>Providers</Title>
                    <label className="text-gray">
                      Select the providers for whom you'd like to compare rates.
                    </label>
                  </Col>

                  {installedCarriers?.map(carrier =>
                    carrier.is_enabled && carrier.carrier_type === 2 ? (
                      <Col
                        className="gutter-row"
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                      >
                        <Form.Item className="mb-0">
                          <Checkbox
                            name={carrier?.slug}
                            onChange={e => handleStateChange(e)}
                          >
                            {carrier?.name}
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    ) : null
                  )}
                </Row>
              </Card>
              <Card className="mt-2">
                <Row gutter={30}>
                  <Col
                    className="gutter-row"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label="Origin Zip/Postal Code"
                      required
                      name="origin_zip"
                      rules={[
                        {
                          required: true,
                          message: "Origin Zip/Postal Code",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Origin Zip/Postal Code"
                        value={locationDetail.origin_zip}
                        onChange={e => {
                          e.target.value.length > 4 &&
                            populateOriginRatesLocation(e.target.value)
                        }}
                        required
                        maxLength="6"
                      />
                    </Form.Item>
                    {/* <Form.Item
                      label="Origin City"
                      name="origin_city"
                      rules={[{ required: true, message: "Origin City" }]}
                    >
                      <Input placeholder="Origin City" />
                    </Form.Item> */}{console.log(34,locationDetail)}
                    {originRatesCity?.length > 1 ? (
                      <Form.Item name="origin_city" label="Origin City">
                        <Select
                          name="origin_city"
                          placeholder="Origin City"
                          style={{
                            width: "100%",
                          }}
                          defaultValue={originRatesCity[0]}
                          value={locationDetail?.origin_city}
                          onChange={city =>
                            setLocationDetail(prevState => ({
                              ...prevState,
                              origin_city: city,
                            }))
                          }
                        >{console.log(454,originRatesCity)}
                          {originRatesCity?.map(city => (
                            <Select.Option value={city} key={city}>
                              {city}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label="Origin City"
                        name="origin_city"
                        rules={[
                          {
                            required: true,
                            message: "Origin City",
                          },
                        ]}
                      >
                        <Input
                          name="origin_city"
                          placeholder="Origin City"
                          value={locationDetail?.origin_city}
                          onChange={e => changeValue(e)}
                          required
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      label="Origin State"
                      name="origin_state"
                      rules={[{ required: true, message: "Origin State" }]}
                    >
                      <Input placeholder="Origin State" value={locationDetail?.origin_state}/>
                    </Form.Item>
                    <Form.Item
                      label="Origin State"
                      name="origin_state"
                      rules={[
                        {
                          required: true,
                          message: "Origin State",
                        },
                      ]}
                    >
                      <Input
                        name="origin_state"
                        placeholder="Origin State"
                        value={locationDetail?.state}
                        onChange={e => changeValue(e)}
                        required
                      />
                    </Form.Item>
                    {/* <Form.Item
                      label="Origin Country"
                      name="origin_country"
                      rules={[{ required: true, message: "Origin Country" }]}
                    >
                      <Input placeholder="Origin Country" />
                    </Form.Item> */}
                    <Form.Item
                      label="Origin Country"
                      name="origin_country"
                      rules={[
                        {
                          required: true,
                          message: "Origin Country",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Origin Country"
                        name="origin_country"
                        value={locationDetail?.country}
                        onChange={e => changeValue(e)}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label="Destination Zip/Postal Code"
                      name="destination_zip"
                      rules={[
                        {
                          required: true,
                          message: "Destination Zip/Postal Code",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Destination Zip/Postal Code"
                        maxLength="6"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Destination City"
                      name="destination_city"
                      rules={[{ required: true, message: "Destination City" }]}
                    >
                      <Input placeholder="Destination City" />
                    </Form.Item>
                    <Form.Item
                      label="Destination State"
                      name="destination_state"
                      rules={[{ required: true, message: "Destination State" }]}
                    >
                      <Input placeholder="Destination State" />
                    </Form.Item>
                    <Form.Item
                      label="Destination Country"
                      name="destination_country"
                      rules={[
                        { required: true, message: "Destination Country" },
                      ]}
                    >
                      <Input placeholder="Destination Country" />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    <Form.Item
                      label="Weight (lbs)"
                      name="weight"
                      rules={[{ required: true, message: "Weight" }]}
                    >
                      <Input
                        placeholder="Weight"
                        maxLength="6"
                        min="0"
                        step="0.01"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    <Form.Item
                      label="Length (inches)"
                      name="length"
                      rules={[{ required: false, message: "Length" }]}
                    >
                      <Input
                        placeholder="Length"
                        maxLength="6"
                        min="0"
                        step="0.01"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    <Form.Item
                      label="Width (inches)"
                      name="width"
                      rules={[{ required: false, message: "Width" }]}
                    >
                      <Input
                        placeholder="Width"
                        maxLength="6"
                        min="0"
                        step="0.01"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    <Form.Item
                      label="Height (inches)"
                      name="height"
                      rules={[{ required: false, message: "Height" }]}
                    >
                      <Input
                        placeholder="Height"
                        maxLength="6"
                        min="0"
                        step="0.01"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item className="mb-0 mt-0">
                      <Checkbox
                        name="is_residentail"
                        onChange={e => handleState(e)}
                      >
                        <b>Residential Delivery</b>
                      </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col
                    className="gutter-row"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item
                      style={{ textAlign: "right", marginBottom: "0" }}
                    >
                      <Space>
                        <Button type="primary" size="medium" htmlType="submit">
                          Get Quotes
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>

          {compareRates ? (
            <Card style={{ width: "40%" }}>
              <Row>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <Title level={4}>Shipping Services</Title>
                </Col>
              </Row>
              {carrName.map(carr => (
                <Card
                  type="inner"
                  title={carr.value}
                  headStyle={{ backgroundColor: "hsl(0deg 12.87% 88.25%)" }}
                  className="mb-2"
                >
                  <Col
                    className="gutter-row mb-1"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    {compareRates[carr?.index]?.map((rate, key) => (
                      <>
                        <span>
                          {rate.title} {" $" + rate.rate}
                        </span>
                        <br />
                        <span>{rate.date}</span>
                        <hr></hr>
                      </>
                    ))}
                  </Col>
                </Card>
              ))}
            </Card>
          ) : null}
        </Row>
      </Space>
    </Fragment>
  )
}

export default ShippingGroupsComponent
