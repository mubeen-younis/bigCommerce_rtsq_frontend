import React, { Fragment, useState, useEffect } from "react";
import { Form, Input, Button, Space, Skeleton, Checkbox } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { postData } from "../../../Actions/Action";
import { getFDOCouponCarrierInfo } from "../../../Actions/FDOActions";

function ConnectionSettingsComponent(props) {
  const [connectionState, setConnectionState] = useState({
    testType: false,
    skeleton_loading: true,
  });
  const [form] = Form.useForm();
  const { fdoCouponInfo, fdoCouponCarrierInfo, token, isInstalling } =
    useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getFDOCouponCarrierInfo(
        token,
        "unishipper-ltl",
        fdoCouponInfo ? fdoCouponInfo?.code ?? "" : ""
      )
    );
  }, [dispatch, token, fdoCouponInfo]);

  useEffect(() => {
    if (props.connectionSettings) {
      // Reset form fields when connectionSettings changes
      form.setFieldsValue(props.connectionSettings);
    }
  }, [props.connectionSettings, form]);

  const handleTypeChange = (type) => {
    setConnectionState({ ...connectionState, testType: type });
  };

  const onFinish = (values) => {
    values = { ...props.connectionSettings, ...values };
    values.testType = connectionState.testType;
    values.installed_carrier_id = props.carrierId;
    values.carrierId = props.carrierId;

    if (fdoCouponCarrierInfo)
      values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false;

    props.postData(values, props.token);
  };

  if (
    props.connectionSettings === null ||
    props.connectionSettings === undefined
  ) {
    return <Skeleton active />;
  }

  return (
    <Fragment>
      <div className={"note-bx"}>
        <strong>Note!</strong> You must have a Unishippers Freight account to
        use this application. If you do not have one, click{" "}
        <a
          href="https://www.unishippers.com/request-account"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{" "}
        to access the new account request form.
      </div>

      <Form
        form={form}
        layout="vertical"
        name="connection_settings"
        className="connection-settings"
        size={"large"}
        initialValues={props.connectionSettings}
        onFinish={onFinish}
      >
        <Form.Item
          className="mb-1"
          label="Nickname"
          name="nickname"
          required={true}
          rules={[{ required: !connectionState.testType, message: "Nickname is required" }]}
        >
          <Input placeholder="e.g., Unishippers LTL" />
        </Form.Item>
        <Form.Item
          label="Client ID"
          name="clientId"
          required={true}
          rules={[{ required: connectionState.testType, message: "Client ID is required." }]}
        >
          <Input placeholder="Client ID" maxLength={100} />
        </Form.Item>
        <Form.Item
          className="mb-1"
          label="Client Secret"
          name="clientSecret"
          required={true}
          rules={[{ required: connectionState.testType, message: "Client Secret is required." }]}
        >
          <Input placeholder="Client Secret" maxLength={256} />
        </Form.Item>

        <div>
          <a
            href="https://eniture.com/bigcommerce-unishippers-api-connection-instructions-2/"
            target="_blank"
            rel="noreferrer"
          >
            How to obtain your Unishippers Client ID and Client Secret?
          </a>
        </div>

        <Form.Item
          className="mt-1"
          label="Username"
          name="username"
          // rules={[{ required: connectionState.testType, message: "Username is required" }]}
        >
          <Input placeholder="Username" maxLength={100} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          // rules={[{ required: connectionState.testType, message: "Password is required" }]}
        >
          <Input type="text" placeholder="Password" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="requiresNmfc"
          valuePropName="checked"
        >
          <Checkbox>My account requires NMFC numbers</Checkbox>
        </Form.Item>

        <Form.Item style={{ textAlign: "right", marginBottom: "0" }}>
          <Space>
            <Button
              type="primary"
              size={"large"}
              htmlType="submit"
              name={`test`}
              onClick={() => handleTypeChange(true)}
            >
              Test Connection
            </Button>
            <Button
              type="primary"
              size={"large"}
              htmlType="submit"
              name={`save`}
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

const mapStateToProps = (state) => {
  return {
    connectionSettings: state.connectionSettings,
    skeleton_loading: state.skeleton_loading,
    token: state.token,
    carrierId: state.carrierId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postData: (data, token) =>
      dispatch(
        postData(
          data,
          "GET_CONNECTION_SETTINGS",
          "submit_connection_settings",
          token
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionSettingsComponent);