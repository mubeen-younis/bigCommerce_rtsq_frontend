import React, { Fragment, useState, useEffect } from "react";
import { Form, Input, Button, Space, Skeleton } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { postData } from "../../../Actions/Action";
import { getFDOCouponCarrierInfo } from "../../../Actions/FDOActions";

function ConnectionSettingsComponent(props) {
  const [connectionState, setConnectionState] = useState({
    testType: false,
    skeleton_loading: true,
  });
  const { fdoCouponInfo, fdoCouponCarrierInfo, token, connectionSettings } =
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  const handleTypeChange = (type) => {
    setConnectionState({ ...connectionState, testType: type });
  };

  const onFinish = (values) => {
    values = { ...connectionSettings, ...values };
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
        <strong>Note!</strong> You must have an account with Kuehne+Nagel to
        use this application. If you do not have one, click{" "}
        <a
          href="https://mykn.kuehne-nagel.com/ac/login"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{" "}
        to access the new account request form.
      </div>

      <Form
        layout="vertical"
        name="connection_settings"
        className="connection-settings"
        size={"large"}
        initialValues={props.connectionSettings}
        onFinish={onFinish}
      >

        <Form.Item
          className="mb-1"
          label="Username"
          // name="clientSecret"
          name="username"
          rules={[{ required: true, message: "Username is required." },
            // {
            //   pattern: /^[a-zA-Z0-9]+$/,
            //   message: "Username must be alphanumeric (letters and numbers only).",
            // },
          ]}
        >
          <Input placeholder="Username" maxLength={128} />
        </Form.Item>


        <Form.Item
          className="mb-1"
          label="Authentication ID"
          name="autId"
          rules={[{ required: true, message: "Authentication ID is required" },
            // {
            //   pattern: /^[a-zA-Z0-9]+$/,
            //   message: "Authentication ID must be alphanumeric (letters and numbers only).",
            // },
          ]}
        >
          <Input placeholder="Authentication ID" maxLength={163} />
        </Form.Item>
        <Form.Item
        className="mb-1"
          label="Client Code"
          name="clientCode"
          rules={[{ required: true, message: "Client Code is required" },
            // {
            //   pattern: /^[a-zA-Z0-9]+$/,
            //   message: "Client Code must be alphanumeric (letters and numbers only).",
            // },
          ]}
        >
          <Input type="text" placeholder="Client Code" maxLength={134} />
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
