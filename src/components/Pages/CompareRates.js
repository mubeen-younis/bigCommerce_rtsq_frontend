import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react"
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
import types from "../../Stores/types"

const { Title } = Typography
const initialState = {
  origin_zip: [],
  destination_zip: [],
}

const carrName = [
  {
    index: "small_package",
    value: "Worldwide Express (Parcel)",
  },
  { index: "ups_ship_engine", value: "UPS (ShipEngine_UPS)" },
]

function CompareRates() {
  const [locationDetail, setLocationDetail] = useState(initialState)
  const [originRatesCity, setOriginRatesCity] = useState([])
  const [destinationCities, setDestinationCities] = useState([])
  const [carriers, setCarriers] = useState([])
  const [isResidentail, setResi] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { token, compareRates, installedCarriers } = useSelector(state => state)
  const [form] = Form.useForm()
  const ref = useRef(null)

  const handleStateChange = useCallback(e => {
    const { name, checked } = e.target
    setCarriers(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }))
  }, [])

  useEffect(() => {
    dispatch({
      type: types.SET_COMPARE_RATES,
      payload: [],
    })
    setLoading(false)
  }, (compareRates, locationDetail))

  const handleState = useCallback(e => {
    const { name, checked } = e.target

    setResi(checked)
  }, [])

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getErrMessage = input => {
    return (
      input +
      " format should be 100.22 or only 2 decimal places are allowed & a max of 6 digits are allowed."
    )
  }

  const onFinish = data => {
    dispatch({
      type: types.SET_COMPARE_RATES,
      payload: [],
    })
    setLoading(false)

    data["carriers"] = {
      "ups-ship-engine": true,
      "small-package": true,
    }

    data = {
      ...data,
      isResidentail,
    }

    let error = false
    let count = 0
    let errormsg = ""

    Object.keys(carriers).map(key => {
      if (carriers[key]) {
        count = count + 1
      }
    })

    // if (count === 0) {
    //   error = true
    //   errormsg = "Please Select Providers."
    // }

    if (
      (data?.weight !== undefined &&
        checkDigitsAfterDecimal(data?.weight, 2)) ||
      data?.weight?.toString()?.length > 6
    ) {
      if (errormsg === "") {
        error = true
        errormsg = getErrMessage("Weight")
      }
    }

    if (
      checkDigitsAfterDecimal(data?.length, 2) ||
      data?.length?.toString()?.length > 6
    ) {
      if (errormsg === "") {
        error = true
        errormsg = getErrMessage("Length")
      }
    }

    if (
      checkDigitsAfterDecimal(data?.width, 2) ||
      data?.width?.toString()?.length > 6
    ) {
      if (errormsg === "") {
        error = true
        errormsg = getErrMessage("Width")
      }
    }

    if (
      checkDigitsAfterDecimal(data?.height, 2) ||
      data?.height?.toString()?.length > 6
    ) {
      if (errormsg === "") {
        error = true
        errormsg = getErrMessage("Height")
      }
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
      dispatch(submitCompareRates(data, token, setLoading, handleClick))
    }
  }

  const populateOriginRatesLocation = useCallback(
    async (zip_code = "", is_origin = false) => {
      try {
        const zipCode =
          zip_code ??
          locationDetail?.origin_zip ??
          locationDetail?.destination_zip
        const url = `${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipCode}`
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }

        dispatch({
          type: types.SET_COMPARE_RATES,
          payload: [],
        })

        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            showAlertMessage: false,
            alertMessageType: "loading",
          },
        })
        setLoading(false)
        const { data } = await axios.get(url, config)
        if (!data.error) {
          const updatedOrigin = {
            origin_city: data?.data?.city[0] ?? "",
            origin_state: data?.data?.state ?? "",
            origin_country: data?.data?.country ?? "",
          }
          const updatedDestination = {
            destination_city: data?.data?.city[0] ?? "",
            destination_state: data?.data?.state ?? "",
            destination_country: data?.data?.country ?? "",
          }

          if (is_origin) {
            form.setFieldsValue(updatedOrigin)
            setOriginRatesCity(data?.data?.city)
            setLocationDetail({
              ...locationDetail,
              ...updatedOrigin,
            })
          } else {
            form.setFieldsValue(updatedDestination)
            setDestinationCities(data?.data?.city)
            setLocationDetail({
              ...locationDetail,
              ...updatedDestination,
            })
          }
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

  //if (!alertMessageType === "loading") return <Skeleton active />

  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
        <Row>
          <Col
            className="gutter-row"
            style={{ marginLeft: "1rem" }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <Card className="mb-2">
              <Form
                layout="vertical"
                name="connection_settings"
                className="connection-settings"
                size="large"
                onFinish={onFinish}
                form={form}
                initialValues={locationDetail}
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
                    <div className="mb-0">
                      Compare the UPS rates you receive from Worldwide Express
                      to the UPS rates that you can receive from ShipEngine.
                      Afterward, click this{" "}
                      <a href="#" target="_blank" rel="noreferrer">
                        link
                      </a>{" "}
                      to learn how to move forward with ShipEngine.
                    </div>
                  </Col>
                </Row>
                {/* Providers feature will use in future */}
                {/* <Card>
                  <Row>
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
                        Select the providers for whom you'd like to compare
                        rates.
                      </label>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <Form.Item className="mb-0">
                        <Checkbox
                          name="ups-ship-engine"
                          onChange={e => handleStateChange(e)}
                        >
                          UPS via ShipEngine
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    {installedCarriers?.map(carrier =>
                      carrier.is_enabled &&
                      carrier.carrier_type === 2 &&
                      carrier.slug !== "ups-ship-engine" &&
                      carrier.slug === "small-package" ? (
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
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
                </Card> */}
                <Card className="mt-2">
                  <Row gutter={30}>
                    <Col
                      className="gutter-row "
                      xs={24}
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
                            message: "Enter Origin Zip/Postal Code",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter Origin Zip/Postal Code"
                          value={locationDetail.origin_zip}
                          onChange={e => {
                            e.target.value.length > 4 &&
                              populateOriginRatesLocation(e.target.value, true)
                          }}
                          required
                          maxLength="6"
                        />
                      </Form.Item>

                      {originRatesCity?.length > 1 ? (
                        <Form.Item name="origin_city" label="Origin City">
                          <Select
                            name="origin_city"
                            placeholder="Enter Origin City"
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
                          >
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
                              message: "Enter Origin City",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Origin City" required />
                        </Form.Item>
                      )}

                      <Form.Item
                        label="Origin State"
                        name="origin_state"
                        rules={[
                          {
                            required: true,
                            message: "Enter Origin State",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Origin State" required />
                      </Form.Item>

                      <Form.Item
                        label="Origin Country"
                        name="origin_country"
                        rules={[
                          {
                            required: true,
                            message: "Enter Origin Country",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Origin Country" required />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <Form.Item
                        label="Destination Zip/Postal Code"
                        required
                        name="destination_zip"
                        rules={[
                          {
                            required: true,
                            message: "Enter Destination Zip/Postal Code",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter Destination Zip/Postal Code"
                          value={locationDetail.destination_zip}
                          onChange={e => {
                            e.target.value.length > 4 &&
                              populateOriginRatesLocation(e.target.value)
                          }}
                          required
                          maxLength="6"
                        />
                      </Form.Item>
                      {destinationCities?.length > 1 ? (
                        <Form.Item
                          name="destination_city"
                          label="Destination City"
                        >
                          <Select
                            name="destination_city"
                            placeholder="Enter Destination City"
                            style={{
                              width: "100%",
                            }}
                            defaultValue={destinationCities[0]}
                            value={locationDetail?.destination_city}
                            onChange={city =>
                              setLocationDetail(prevState => ({
                                ...prevState,
                                destination_city: city,
                              }))
                            }
                          >
                            {destinationCities?.map(city => (
                              <Select.Option value={city} key={city}>
                                {city}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="Destination City"
                          name="destination_city"
                          rules={[
                            {
                              required: true,
                              message: "Enter Destination City",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter Destination City"
                            required
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        label="Destination State"
                        name="destination_state"
                        rules={[
                          {
                            required: true,
                            message: "Enter Destination State",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Destination State" required />
                      </Form.Item>
                      <Form.Item
                        label="Destination Country"
                        name="destination_country"
                        rules={[
                          {
                            required: true,
                            message: "Enter Destination Country",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter Destination Country"
                          required
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <Form.Item
                        label="Weight (lbs)"
                        name="weight"
                        rules={[{ required: true, message: "Enter Weight" }]}
                      >
                        <Input
                          placeholder="Enter Weight"
                          maxLength="6"
                          min="0"
                          step="0.01"
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <Form.Item
                        label="Length (inches)"
                        name="length"
                        rules={[{ required: false, message: "Enter Length" }]}
                      >
                        <Input
                          placeholder="Enter Length"
                          maxLength="6"
                          min="0"
                          step="0.01"
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <Form.Item
                        label="Width (inches)"
                        name="width"
                        rules={[{ required: false, message: "Enter Width" }]}
                      >
                        <Input
                          placeholder="Enter Width"
                          maxLength="6"
                          min="0"
                          step="0.01"
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <Form.Item
                        label="Height (inches)"
                        name="height"
                        rules={[{ required: false, message: "Enter Height" }]}
                      >
                        <Input
                          placeholder="Enter Height"
                          maxLength="6"
                          min="0"
                          step="0.01"
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col
                      className="gutter-row"
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item className="mb-0 mt-0">
                        <Checkbox
                          name="is_residentail"
                          onChange={e => handleState(e)}
                        >
                          <b>Residential Delivery</b>
                        </Checkbox>
                      </Form.Item>
                    </Col> */}
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      ref={ref}
                    >
                      <Form.Item
                        style={{ textAlign: "right", marginBottom: "0" }}
                      >
                        <Space>
                          <Button
                            type="primary"
                            size="medium"
                            htmlType="submit"
                          >
                            Get Quotes
                          </Button>
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Form>
            </Card>
          </Col>
          {/* Display Compare Rates */}

          <Col
            className="gutter-row"
            style={{ marginLeft: "1rem" }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            {loading ? (
              <Card>
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

                  {carrName.map(carr => (
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      {compareRates[carr?.index]?.length > 0 ? (
                        <Card
                          type="inner"
                          title={carr.value}
                          headStyle={{
                            backgroundColor: "hsl(0deg 12.87% 88.25%)",
                          }}
                        >
                          <Col
                            className="gutter-row"
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
                                <br />
                                <br />
                              </>
                            ))}
                          </Col>
                        </Card>
                      ) : null}
                    </Col>
                  ))}
                </Row>
              </Card>
            ) : null}
          </Col>
        </Row>
      </Space>
    </Fragment>
  )
}

export default CompareRates
