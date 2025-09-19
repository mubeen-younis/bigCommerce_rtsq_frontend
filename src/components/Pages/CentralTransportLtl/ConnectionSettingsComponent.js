import React, { Fragment, useState, useEffect } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
  const [testType, setTestType] = useState(false)
  const dispatch = useDispatch()
  const { connectionSettings, token, carrierId } = useSelector(state => state)

  const handleTypeChange = type => setTestType(type)

  useEffect(() => { }, [props.connectionSettings])

  const onFinish = values => {
    values = {
      ...values,
      testType,
      carrierId,
      installed_carrier_id: carrierId,
    }

    dispatch(
      postData(
        values,
        'GET_CONNECTION_SETTINGS',
        'submit_connection_settings',
        token
      )
    )
  }

  if (!connectionSettings) return <Skeleton active />

  return (
    <Fragment>
      <div className={"note-bx"}>
        <strong>Note!</strong> You must have a Central Transport account to use this
        application. If you don’t have one, contact Central Transport at
        (586) 467-1900 or {" "}
        <a
          href="https://www.centraltransport.com/company/my-central-account"
          target="_blank"
          rel="noreferrer"
        >
          register online
        </a>
      </div>
      <Form
        layout="vertical"
        name="connection_settings"
        className="connection-settings"
        size="large"
        initialValues={connectionSettings}
        onFinish={onFinish}
      >
        <Form.Item
          className='mb-1'
          label='Nickname'
          name='nickname'
          rules={[{ required: false, message: 'Nickname' }]}
        >
          <Input placeholder='e.g., Central Transport' />
        </Form.Item>
        <Form.Item
          label="Customer Number"
          name="customer_number"
          rules={[
            { required: true, message: "Customer Number is required" },
            { max: 100, message: "Customer Number must be at most 100 characters" },
            {
              pattern: /^[a-zA-Z0-9]*$/,
              message: "Customer Number must be alphanumeric",
            },
          ]}
        >
          <Input placeholder="Customer Number" maxLength={100} />
        </Form.Item>

        <Form.Item
          label="Access Code"
          name="access_code"
          rules={[
            { required: true, message: "Access Code is required" },
            { max: 100, message: "Access Code must be at most 100 characters" },
            {
              pattern: /^[\w!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]+$/,
              message: "Access Code can include letters, numbers, and special characters",
            },
          ]}
        >
          <Input placeholder="Access Code" maxLength={100} />
        </Form.Item>




        {/* <div>
          <a
            href="https://eniture.com/bigcommerce-estes-connection-instructions/"
            target="_blank"
            rel="noreferrer"
          >
            How to obtain your Estes account credentials?
          </a>
        </div> */}

        <Form.Item style={{ textAlign: "right", marginBottom: "0" }}>
          <Space>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              name="test"
              onClick={() => handleTypeChange(true)}
            >
              Test Connection
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              name="save"
              onClick={() => handleTypeChange(false)}
            >
              Save Settings
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Fragment>
  );
}

export default ConnectionSettingsComponent
