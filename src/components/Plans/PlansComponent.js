import React, { useCallback, useEffect, useState, Fragment } from 'react'
import {
  Row,
  Col,
  Button,
  Skeleton,
  Modal,
  Radio,
  Form,
  Input,
  Select,
  Space,
} from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  getPlans,
  submitPaymentInfo,
  updateSubscription,
  changePaymentMethod,
} from '../../Actions/Plans'
import PlanStatusHeading from '../../partials/PlanStatusHeading'

const { Option } = Select

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

function PlansComponent() {
  const { plans, token, store, currentPlan } = useSelector((state) => state)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymenyMethod, setPaymenyMethod] = useState(2)
  const [number, setNumber] = useState('')
  const [date, setDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [country, setCountry] = useState(store?.country || '')
  const [zipCode, setZipCode] = useState('')
  const [name, setName] = useState(
    store ? store.first_name + ' ' + store.last_name : ''
  )
  const [email, setEmail] = useState(store?.admin_email || '')
  const [address, setAddress] = useState(store?.address || '')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [planid, setPlanid] = useState('')
  const [cancelSubsriptionVisible, SetCancelSubsriptionVisible] =
    useState(false)
  const [updatePaymentMethodCheck, SetUpdatePaymentMethodCheck] =
    useState(false)
  const [trialVisible, SetTrialVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!plans) {
      dispatch(getPlans())
    }
  }, [dispatch, plans])

  const clearForm = useCallback(() => {
    if (store) {
      setNumber('')
      setDate('')
      setCvc('')
      setName(store.first_name + ' ' + store.last_name)
      setAddress(store.address)
      setEmail(store.admin_email)
      setCity('')
      setState('')
      setCountry(store.country)
      setZipCode('')
    }
  }, [store])

  const toggleModal = (id) => {
    clearForm()
    setPlanid(id)

    if (id === 1) {
      SetTrialVisible(true)
      //dispatch(submitPaymentInfo({plan:1}, token, setIsModalVisible))
    } else {
      setIsModalVisible(!isModalVisible)
    }
  }

  const activateTrialPlan = () => {
    if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)) {
      dispatch(
        submitPaymentInfo(
          { plan: planid, email: email },
          token,
          SetTrialVisible
        )
      )
    } else {
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: false,
        },
      })
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: true,
          alertMessage: 'Enter valid email address',
          alertMessageType: 'error',
        },
      })
    }
  }

  const onFinish = (values) => {
    if (updatePaymentMethodCheck) {
      const data = {
        ...values,
        card_number: number,
        date,
        exp_year: date.split('/')[1],
        exp_month: date.split('/')[0],
        cvc,
        card_name: name,
        address,
        city: city,
        state: state,
        country,
        zip: zipCode,
        plan: '',
        defaultpayment: false,
      }
      dispatch(changePaymentMethod(data, token, SetUpdatePaymentMethodCheck))
      //SetUpdatePaymentMethodCheck(false);
    } else {
      if (+paymenyMethod === 1) {
        const data = {
          defaultpayment: true,
        }
        dispatch(submitPaymentInfo(data, token, setIsModalVisible))
      } else if (+paymenyMethod === 2) {
        const data = {
          ...values,
          card_number: number,
          date,
          exp_year: date.split('/')[1],
          exp_month: date.split('/')[0],
          cvc,
          card_name: name,
          email,
          address,
          city,
          state,
          country,
          zip: zipCode,
          plan: planid,
          defaultpayment: false,
        }
        dispatch(submitPaymentInfo(data, token, setIsModalVisible))
      }
      //setIsModalVisible(false)
    }
  }

  const updatePlan = useCallback(() => {
    const data = {
      defaultpayment: true,
      plan: planid,
    }
    dispatch(submitPaymentInfo(data, token, setIsModalVisible))
  }, [dispatch, planid, token])

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', { ...errorInfo, country })
  }

  const formatAccountNumber = useCallback((inp) => {
    const text = inp.split(' ').join('')

    if (!isNaN(text)) {
      let formatted_number = ''

      for (let i = 0; i < text.length; i++) {
        if (i > 1 && i % 4 === 0) {
          formatted_number += ' ' + text[i]
          continue
        }

        formatted_number += text[i]
      }

      setNumber(formatted_number)
    }
  }, [])

  const formatExpiryDate = useCallback((date) => {
    const text = date.split('/').join('')
    const month = date.slice(0, 2)
    const year = date.split('/')[1]

    if (!isNaN(text)) {
      let formatted_date = ''

      if (+month > 12) {
        setDate('12')
        return
      }

      if (
        year &&
        year.length === 4 &&
        (+year < new Date().getFullYear() || +year > 2030)
      ) {
        setDate(month + '/20')
        return
      }

      if (+text[0] > 1) {
        formatted_date = '0' + text[0] + '/'
      } else {
        for (let i = 0; i < text.length; i++) {
          if (i > 1 && i < 3) {
            formatted_date += '/' + text[i]
            continue
          }

          formatted_date += text[i]
        }
      }
      setDate(formatted_date)
    }
  }, [])

  const toggleSubscription = useCallback(() => {
    const data = {
      cancel: currentPlan && currentPlan?.status === 2 ? 0 : 1,
    }
    dispatch(updateSubscription(token, data))
    SetCancelSubsriptionVisible(false)
  }, [currentPlan, dispatch, token])

  const updatePaymentMethod = useCallback(() => {
    clearForm()
    SetUpdatePaymentMethodCheck(true)
  }, [clearForm])

  return plans ? (
    <Fragment>
      <PlanStatusHeading />
      {currentPlan?.plan_id > 1 && (
        <Space className={'mb-3'}>
          {currentPlan.status !== 2 ? (
            <Button
              type='primary'
              onClick={() => SetCancelSubsriptionVisible(true)}
            >
              Cancel Subscription
            </Button>
          ) : (
            <Button type='primary' onClick={() => toggleSubscription(true)}>
              Undo Cancel Subscription
            </Button>
          )}

          <Button type='primary' onClick={updatePaymentMethod}>
            Change Payment Method
          </Button>
          <Modal
            title='Cancel Subscription'
            visible={cancelSubsriptionVisible}
            onCancel={() => SetCancelSubsriptionVisible(false)}
            centered
            onOk={() => toggleSubscription()}
            okText='Confirm'
            cancelButtonProps={{ style: { display: 'none' } }}
          >
            Are you sure you want to cancel subscription?
          </Modal>
        </Space>
      )}
      <Space>
        <Modal
          title='Trial Plan'
          visible={trialVisible}
          onCancel={() => SetTrialVisible(false)}
          centered
          onOk={() => activateTrialPlan()}
          okText='Activate'
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <Row gutter={24}>
            <Col span={6}>Email</Col>
            <Col span={18}>
              <Input
                name='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
          </Row>
        </Modal>
      </Space>
      <Space direction='vertical' size={'large'} className={'w-100'}>
        <Row gutter={30}>
          <Modal
            title='Payment Information'
            visible={isModalVisible}
            onCancel={toggleModal}
            centered
            footer={null}
            // width={700}
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
          >
            {currentPlan?.plan_id > 1 && (
              <>
                <p>Default payment method</p>
                <Radio
                  checked={paymenyMethod === 1}
                  onChange={() => setPaymenyMethod(1)}
                >
                  **** **** **** {currentPlan?.last4}
                </Radio>
                <p className='mt-2'>Add new payment method</p>
                <Radio
                  checked={paymenyMethod === 2}
                  onChange={() => setPaymenyMethod(2)}
                >
                  Add Card
                </Radio>
              </>
            )}

            {paymenyMethod === 2 ? (
              <Form
                {...layout}
                name='payment-form'
                initialValues={{
                  city: '',
                  state: '',
                  requiredMark: true,
                }}
                // defaultValue=''
                onFinish={onFinish}
                requiredMark
                //onFinishFailed={onFinishFailed}
                className='mt-2'
              >
                <h3>Card Information</h3>
                <Form.Item
                  label={`Number`}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your card number!',
                    },
                  ]}
                >
                  <Input
                    type='tel'
                    name='number'
                    maxlength='23'
                    required
                    value={number}
                    onChange={(e) => formatAccountNumber(e.target.value)}
                  />
                  <div className={'text-gray'}>e.g. xxxx xxxx xxxx xxxx</div>
                </Form.Item>

                <Form.Item
                  label='MM/YYYY'
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please input your MM/YYYY!',
                    },
                  ]}
                >
                  <Input
                    type='text'
                    name='date'
                    maxlength='7'
                    pattern='(?:0[1-9]|1[0-2])/[0-9]{4}'
                    placeholder='xx/xxxx'
                    required
                    value={date}
                    onChange={(e) => {
                      formatExpiryDate(e.currentTarget.value)
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label='CVC'
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please input your CVC',
                    },
                  ]}
                >
                  <Input
                    type='number'
                    name='cvc'
                    maxlength='4'
                    pattern='\d{4}$'
                    required
                    max='only 4 digits'
                    value={cvc}
                    onChange={(e) => {
                      if (e.target.value.length < 5) {
                        setCvc(e.target.value)
                      }
                    }}
                  />
                </Form.Item>

                <h3>Billing Details</h3>
                <Form.Item
                  label='Card Holder Name'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input card holder name',
                    },
                  ]}
                >
                  <Input
                    name='name'
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label='Address'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your address',
                    },
                  ]}
                >
                  <Input
                    name='address'
                    value={address}
                    type='text'
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Item>

                <Form.Item
                  label='Email'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your email',
                    },
                  ]}
                >
                  <Input
                    name='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Item>

                <Form.Item
                  label='City'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your city',
                    },
                  ]}
                >
                  <Input
                    defaultValue=''
                    name='city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Form.Item>

                <Form.Item
                  label='State'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your state',
                    },
                  ]}
                >
                  <Input
                    name='state'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    defaultValue=''
                    required
                  />
                </Form.Item>

                <Form.Item label='Country'>
                  <Select
                    defaultValue='united states'
                    name='country'
                    onChange={(opt) => setCountry(opt)}
                    value={country}
                    required
                  >
                    <Option value='usa'>United States</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Zip'
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please input your zip code!',
                    },
                  ]}
                >
                  <Input
                    type='number'
                    name='zip'
                    maxLength='5'
                    pattern='\d{5}$'
                    value={zipCode}
                    onChange={(e) => {
                      if (e.target.value.length < 6) {
                        setZipCode(e.target.value)
                      }
                    }}
                    required
                  />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type='primary' htmlType='submit'>
                    Change Plan
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Row gutter={24}>
                <Col span={24} className={'m-4'}>
                  <Button
                    className={'mt-3'}
                    type='primary'
                    onClick={updatePlan}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            )}
          </Modal>
        </Row>

        {updatePaymentMethodCheck && (
          <Row gutter={30}>
            <Modal
              title='Payment Information'
              visible={updatePaymentMethodCheck}
              onCancel={() => SetUpdatePaymentMethodCheck(false)}
              centered
              footer={null}
              // width={700}
              okButtonProps={{ style: { display: 'none' } }}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <Form
                {...layout}
                name='basic'
                initialValues={{ city: '', state: '' }}
                defaultValue=''
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className='mt-2'
              >
                <h3>Card Information</h3>
                <Form.Item
                  label='Number'
                  required
                  requiredMark
                  rules={[
                    {
                      required: true,
                      message: 'Please input your card number!',
                    },
                  ]}
                >
                  <Input
                    type='tel'
                    name='number'
                    maxlength='23'
                    required
                    value={number}
                    onChange={(e) => formatAccountNumber(e.target.value)}
                  />
                  <div className={'text-gray'}>e.g. xxxx xxxx xxxx xxxx</div>
                </Form.Item>

                <Form.Item
                  label='MM/YY'
                  required
                  requiredMark
                  rules={[
                    {
                      required: true,
                      message: 'Please input your MM/YY!',
                    },
                  ]}
                >
                  <Input
                    type='text'
                    name='date'
                    maxlength='7'
                    pattern='(?:0[1-9]|1[0-2])/[0-9]{4}'
                    placeholder='xx/xxxx'
                    required
                    value={date}
                    onChange={(e) => {
                      formatExpiryDate(e.currentTarget.value)
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label='CVC'
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please input your CVC',
                    },
                  ]}
                >
                  <Input
                    type='number'
                    name='cvc'
                    maxlength='4'
                    pattern='\d{4}$'
                    required
                    max='only 4 digits'
                    value={cvc}
                    onChange={(e) => {
                      if (e.target.value.length < 5) {
                        setCvc(e.target.value)
                      }
                    }}
                  />
                </Form.Item>

                <h3>Billing Details</h3>
                <Form.Item
                  label='Card Holder Name'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input card holder name',
                    },
                  ]}
                >
                  <Input
                    name='name'
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label='Address'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your address',
                    },
                  ]}
                >
                  <Input
                    name='address'
                    value={address}
                    type='text'
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Item>

                <Form.Item
                  label='City'
                  name='city'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your city',
                    },
                  ]}
                >
                  <Input defaultValue='' required />
                </Form.Item>

                <Form.Item
                  label='State'
                  name='state'
                  required
                  rules={[
                    {
                      required: true,
                      message: ' Please input your state',
                    },
                  ]}
                >
                  <Input defaultValue='' required />
                </Form.Item>

                <Form.Item label='Country'>
                  <Select
                    defaultValue='united states'
                    name='country'
                    onChange={(opt) => setCountry(opt)}
                    value={country}
                    required
                  >
                    <Option value='usa'>United States</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Zip'
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please input your zip code!',
                    },
                  ]}
                >
                  <Input
                    type='number'
                    name='zip'
                    maxLength='5'
                    pattern='\d{5}$'
                    value={zipCode}
                    onChange={(e) => {
                      if (e.target.value.length < 6) {
                        setZipCode(e.target.value)
                      }
                    }}
                    required
                  />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type='primary' htmlType='submit'>
                    Change
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Row>
        )}
      </Space>

      <Row gutter={24}>
        {plans.map((plan, i) =>
          (plan.id === 1 && currentPlan?.plan_id > 1) ||
          ((plan.id === 1 || (plan.name + '').toLowerCase() === 'trial') &&
            currentPlan?.plan_id === 1 &&
            currentPlan?.status === 2) ? null : (
            <Col
              className='gutter-row mb-3'
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={8}
              key={i}
            >
              <div className={'pricing-box'}>
                <div className='pricing-header'>
                  <h2>{plan.name}</h2>
                  {currentPlan?.plan_id === plan.id &&
                  !currentPlan?.is_expired ? (
                    <Button size={'large'} className='mt-2'>
                      ${plan.price} / month
                    </Button>
                  ) : (
                    <Button
                      size={'large'}
                      type='primary'
                      className='mt-2'
                      onClick={() => toggleModal(plan.id)}
                    >
                      ${plan.price} / month
                    </Button>
                  )}
                </div>
                <ul>
                  {plan.terms.split('.').map(
                    (term) =>
                      term && (
                        <li
                          style={{
                            listStyleType: 'disc',
                            display: 'list-item',
                            margin: '5px 10px',
                          }}
                          key={term}
                        >
                          {term}
                        </li>
                      )
                  )}
                </ul>
              </div>
            </Col>
          )
        )}
      </Row>
    </Fragment>
  ) : (
    <Skeleton />
  )
}

export default PlansComponent
