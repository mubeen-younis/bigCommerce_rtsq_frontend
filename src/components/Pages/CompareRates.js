import React, { Fragment, useState, useCallback, useEffect } from "react"
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
  Radio,
  Input,
} from "antd"
import { useDispatch, useSelector } from "react-redux"
import { submitRADSettings, getRADSettings } from "../../Actions/RAD"

const { Title } = Typography
const initialState = {
  always_quote_residential_delivery: false,
  return_rates: false,
  residential_delivery_auto_detect: false,
  unconfirmed_address_type: 1,
  always_residential_pickup_delivery: false,
}

function ShippingGroupsComponent() {
  const [settings, setSettings] = useState(initialState)
  const dispatch = useDispatch()
  const { token, radSettings, installedCarriers } = useSelector(state => state)
  const [pickup, setPickup] = useState(true)

  useEffect(() => {
    if (!radSettings) {
      dispatch(getRADSettings(token))
    }

    if(installedCarriers){
      for (const ic of installedCarriers) {
        if (ic.slug === 'ltl-quotes' && ic.is_enabled) {
          setPickup(false)
        }
      }
    }

    if (radSettings) {
      if(radSettings?.settings){
        const newSettings = JSON.parse(radSettings?.settings) ?? {}
        setSettings(prevSettings => ({
        ...prevSettings,
        ...newSettings,
      }))
      }
    }
  }, [dispatch, radSettings, token])

  const handleStateChange = useCallback(e => {
    const { name, checked } = e.target

    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }))
  }, [])

  const onFinish = useCallback(() => {
    dispatch(
      submitRADSettings(
        {
          ...radSettings,
          settings,
        },
        token
      )
    )
  }, [dispatch, radSettings, settings, token])

  if (!radSettings) return <Skeleton active />

  return (
    <Fragment>
      <Space direction="vertical" size={"large"} className={"w-100"}>
      <Card style={{ width: '50%' }}>
        <Row>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>Compare Rates</Title>
          </Col>
        </Row>

        <Card>
          <Row gutter={30}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Title level={5}>Providers</Title>
              <label
                className="text-gray"
                    
              >
                Select the providers for whom you'd like to compare rates.
              </label>
            </Col>

            {installedCarriers?.map(carrier =>
							carrier.is_enabled && carrier.carrier_type === 2 ? (
								<Col className="gutter-row" xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form.Item className="mb-0">
                    <Checkbox
                      name={carrier?.slug}
                      // checked={settings.return_rates}
                      // onChange={e => handleStateChange(e)}
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
          <Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12} >
            <Form.Item
              className={'mb-2'}
              label='Origin Zip/Postal Code'
              rules={[
                {
                  required: false,
                  message: 'Origin Zip/Postal Code',
                },
              ]}
            >
              <Input
                name='origin_zip'
                placeholder='Origin Zip/Postal Code'
                // value={locationDetail.nickname}
                // onChange={changeValue}
              />
            </Form.Item>
          </Col>
          <Col className='gutter-row' xs={12} sm={12} md={12} lg={12} xl={12} >
            <Form.Item
              className={'mb-2'}
              label='Destination Zip/Postal Code'
              rules={[
                {
                  required: false,
                  message: 'Destination Zip/Postal Code',
                },
              ]}
            >
              <Input
                name='destination_zip'
                placeholder='Destination Zip/Postal Code'
                // value={locationDetail.nickname}
                // onChange={changeValue}
              />
            </Form.Item>
          </Col>
          
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item style={{ textAlign: "right", marginBottom: "0" }}>
                <Space>
                  <Button
                    onClick={onFinish}
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
      </Card>
      </Space>
    </Fragment>
  )
}

export default ShippingGroupsComponent
