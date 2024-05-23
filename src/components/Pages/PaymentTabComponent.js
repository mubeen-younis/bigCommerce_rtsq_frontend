import React, { Fragment, useEffect } from 'react';
import { Typography, Row, Col, Space, Button, Table } from 'antd';
import { getPaymentsDetial } from '../../Actions/PaymentsAction';
import addKeysToList from './../../Utilities/addKey';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchAlert } from '../../Utilities/dispatchAlert';
import axios from './../../Utilities/authToken';
const { Title } = Typography;

function PaymentsTabComponent(props) {
  const dispatch = useDispatch();
  const { getPayments, token } = useSelector((state) => state);

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  useEffect(() => {
    dispatch(getPaymentsDetial(token));
  }, [dispatch, token]);

  const getReceiptDetial = async (id) => {
    try {
      dispatch(dispatchAlert(true, 'loading'));

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const {
        data: { error, data, message },
      } = await axios.get('get_receipt?id=' + id, config);

      if (!error) {
        dispatch(dispatchAlert(false, null));
        openInNewTab(data?.file_url);
      } else {
        dispatch(dispatchAlert(error, error ? 'error' : 'success', message));
      }
    } catch ({ response }) {
      dispatch(dispatchAlert(false, null));
    }
  };
  const formatDate = (date = '') => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    if (!date || (date && date?.trim() === '')) return date;

    let newDate = new Date(date);
    const monthIndex = newDate.getMonth();
    const year = newDate.getFullYear();
    let day = newDate.getDate();

    if (+day < 10) {
      day = '0' + day;
    }

    const formattedDate = `${months[monthIndex]} ${day}, ${year}`;

    return formattedDate;
  };
  const columns = [
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount) => '$' + amount,
    },
    {
      key: 'invoice_id',
      title: 'Description',
      dataIndex: 'is_addon',
      render: (is_addon, data) =>
        is_addon ? 'Monthly renewal fee' : 'Subscription fee',
    },
    {
      key: 'is_addon',
      title: 'Plan / Add-on',
      dataIndex: 'is_addon',
      render: (is_addon, data) =>
        is_addon ? data.addon_name : 'Monthly ' + data.product_name + ' Plan',
    },
    {
      key: 'created_at',
      title: 'Date',
      dataIndex: 'created_at',
      render: (created_at) => formatDate(created_at),
    },
    {
      key: 'action',
      title: 'Receipt',
      render: (text) => (
        <Space size='middle'>
          <Button onClick={() => getReceiptDetial(text.id)}>
            View/Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Space direction='vertical' size={'large'} className={'w-100'}>
        <Row gutter={30} className='m-3'>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}> Payments </Title>
            <Table
              className={'custom-table'}
              dataSource={getPayments ? addKeysToList(getPayments) : []}
              columns={columns}
              pagination={false}
            />
          </Col>
        </Row>
      </Space>
    </Fragment>
  );
}

export default PaymentsTabComponent;
