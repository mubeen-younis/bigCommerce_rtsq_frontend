import React, { Fragment, useState } from 'react';
import { Form, Input, Button, Space, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { postData } from '../../../Actions/Action';

function ConnectionSettingsComponent() {
  const [testType, setTestType] = useState(false);
  const dispatch = useDispatch();
  const { connectionSettings, token, carrierId } = useSelector(
    (state) => state
  );

  const handleTypeChange = (type) => setTestType(type);

  const onFinish = (values) => {
    values = {
      ...values,
      testType,
      carrierId,
      installed_carrier_id: carrierId,
    };

    dispatch(
      postData(
        values,
        'GET_CONNECTION_SETTINGS',
        'submit_connection_settings',
        token
      )
    );
  };

  if (!connectionSettings) return <Skeleton active />;

  return (
    <Fragment>
      <div className={'note-bx'}>
        <strong>Note!</strong> You must have a USPS Small account to use this
        application.
      </div>
    </Fragment>
  );
}

export default ConnectionSettingsComponent;
