import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  Select,
  Typography,
  Row,
  Col,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Table,
  Skeleton,
  Radio,
  Checkbox,
  Tooltip,
  message,
  Spin,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getShippingRules,
  saveShippingRule,
  deleteShippingRule,
  getStatesProvinces,
  getCarrServices,
  getCategories,
  getBrands,
} from '../../Actions/ShippingRulesActions';
import addKeysToList from './../../Utilities/addKey';
import types from '../../Stores/types';
import axios from '../../Utilities/authToken';
import { dispatchAlert } from '../../Utilities/dispatchAlert';
import { accessorialServices, shippingRuleTypes } from '../../Utilities/constants';
import {
  blockInvalidChar,
  handleNumbersOnly,
} from '../../Utilities/numberValidation';
import ServiceRate from '../ServiceRate';

const { Title } = Typography;
const { Option } = Select;
const initialState = {
  rule_name: '',
  filter_country: 'US',
  rule_type: '1',
  apply_rule_to: 1,
  filter_settings: [],
  filter_products: [],
  filter_categories: [],
  filter_brands: [],
  warehouses: [],
  filter_state_province: [],
  filter_postal_code: [],
  filter_provider: [],
  filter_services: [],
  service_rates: null,
  service_residential_fee: null,
  service_liftgate_fee: null,
  service_notify_fee: null,
  weight_from: '',
  weight_to: '',
  price_from: '',
  price_to: '',
  quantity_from: '',
  quantity_to: '',
};

function ShippingRulesComponent() {
  const [modal, setModal] = useState({
    open: false,
    type: '',
  });
  const [shippingRuleId, setShippingRuleId] = useState(null);
  const [available, setAvailable] = useState(true);
  const [countryCode, setCountryCode] = useState('US');
  const [isFilterWeight, setIsFilterWeight] = useState(false);
  const [isFilterPrice, setIsFilterPrice] = useState(false);
  const [isFilterQuantity, setIsFilterQuantity] = useState(false);
  const [ruleType, setRuleType] = useState(1);
  const [applyRuleTo, setApplyRuleTo] = useState(1);
  const [applyTo, setApplyTo] = useState(1);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    alertMessageType,
    shippingRules,
    token,
    installedCarriers,
    statesProvinces,
    carrierServices,
    warehouse,
    storeCategories,
    storeBrands,
  } = useSelector((state) => state);
  const [selectedServices, setSelectedServices] = useState([]);
  const [carrierId, setCarrierId] = useState();
  const [carrierSlug, setCarrierSlug] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectedPostalCodes, setSelectedPostalCodes] = useState([]);
  const [recordId, setRecordId] = useState(null);
  const [accessorials, setAccessorials] = useState([]);
  const [isLTL, setIsLTL] = useState();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (!shippingRules) {
      dispatch(getShippingRules(token));
    }

    if (ruleType == 3 || ruleType == 4) {
      dispatch(getStatesProvinces(countryCode, token));
    }

    if (!storeCategories) {
      dispatch(getCategories(token));
    }

    if (!storeBrands) {
      dispatch(getBrands(token));
    }
  }, [dispatch, shippingRules, token, countryCode, ruleType]);

  useEffect(() => {
    if (alertMessageType === 'success') {
      setModal({
        open: false,
        type: '',
      });
    }
  }, [alertMessageType]);

  // Fetch products data call when charcters length > 2
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchData();
    }
  }, [searchQuery]);

  useEffect(() => {
    // Attach event listener for body click
    document.body.addEventListener('click', handleBodyClick);

    // Cleanup event listener on component unmount
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  // Fetch products on search by name from DB
  const fetchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          search: searchQuery,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_ENITURE_API_URL}/get_shipping_rule_products`,
        config
      );

      setData((prevData) => [...response.data.data]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hanldeModalToggling = useCallback(
    (open = false, type = '') =>
      setModal({
        open,
        type,
      }),
    []
  );

  const filterOptionsBrands = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
      !selectedBrands.includes(option.key)
    );
  };

  const filterServices = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
      !selectedServices.includes(option.key)
    );
  };

  const handleChangeServices = (selectedValues) => {
    setSelectedServices(selectedValues);
  };

  const filterOptionsCategories = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
      !selectedCategories.includes(option.key)
    );
  };

  const handleChangeBrands = (selectedValues) => {
    setSelectedBrands(selectedValues);
  };

  const handleChangeProducts = (selectedValues) => {
    setData([]);
    setSearchQuery('');
    setSelectedProducts(selectedValues);
  };

  const handleSearch = (value) => {
    setData([]);
    setSearchQuery(value);
  };

  // Click outside the dropdown, clear data
  const handleBodyClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setData([]);
      setSearchQuery('');
    }
  };

  const handleChangeCategories = (selectedValues) => {
    setSelectedCategories(selectedValues);
  };

  const handleChangeProvinces = (selectedValues) => {
    setSelectedProvinces(selectedValues);
  };

  const handleProviderServices = (slug) => {
    if (slug.includes('ltl')) {
      setIsLTL(true)
    } else {
      setIsLTL(false)
    }
    setCarrierSlug(slug);
    setSelectedServices([]);
    form.resetFields(['filter_services']);
    getCarrierServices(slug)
  };

  const getCarrierServices = (slug) => {
    installedCarriers?.map((carrier) =>
      carrier?.slug == slug
        ? dispatch(getCarrServices(carrier?.id, token, carrier?.carrier_type, slug, setAccessorials))
        : null
    )
  }

  const handleChangeWarehouses = (selectedValues) => {
    setSelectedWarehouses(selectedValues);
  };

  const handleSelectChange = (selectedValues) => {
    setSelectedPostalCodes(selectedValues);
  };

  const showMoreItems = (key) => {
    setRecordId(key);
  };

  const statesProvince = statesProvinces?.map((item) => ({
    key: item.code,
    value: item.name,
  }));

  const filterOptionsProvinces = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
      !selectedProvinces.includes(option.key)
    );
  };

  const filterOptionsWarehouses = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
      !selectedWarehouses.includes(option.key)
    );
  };

  const editLocation = useCallback(
    (record) => {
      hanldeModalToggling(true, 'edit');
      setShippingRuleId(record.uuid);
      form.setFieldsValue(record);
    },
    [form, hanldeModalToggling]
  );

  const openDeleteLocationModal = useCallback(
    (record) => {
      hanldeModalToggling(true, 'delete');
      setShippingRuleId(record.uuid);
    },
    [hanldeModalToggling]
  );

  const isAvailable = async (uuid, available) => {
    try {
      dispatch(dispatchAlert(true, 'loading'));
      const url = `${process.env.REACT_APP_ENITURE_API_URL}/updateAvaiableStatus`,
        config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      const reqData = { uuid: uuid, available: available };
      const {
        data: { error, data, message },
      } = await axios.post(url, reqData, config);

      if (!data.error) {
        dispatch({
          type: types.UPDATE_SHIPPING_RULE,
          payload: data.shippingRule,
        });
      }
      dispatch(dispatchAlert(true, error ? 'error' : 'success', message));
    } catch (err) {
      dispatch(dispatchAlert(false, null));
    }
  };

  const updateFormFields = async (text) => {
    setCountryCode(text?.filter_country);
    if(text?.rule_type == 6){
      handleProviderServices(text?.filter_provider)
    }
    if (text?.filter_country == undefined || text?.filter_country == '') {
      setCountryCode('US');
      text.filter_country = 'US';
      text.filter_state_province = [];
      text.filter_postal_code = [];
    }
    setAvailable(text?.available);
    setRuleType(text?.rule_type);
    if (text?.apply_rule_to == 1) {
      text.filter_categories = text?.categories;
    } else if (text?.apply_rule_to == 2) {
      text.filter_brands = text?.brands;
    } else if (text?.apply_rule_to == 3) {
      text.filter_products = text?.products;
    }
    setIsFilterWeight(text?.isFilterWeight);
    setIsFilterPrice(text?.isFilterPrice);
    setIsFilterQuantity(text?.isFilterQuantity);
    setApplyRuleTo(text?.apply_rule_to ?? 1);

    editLocation(text);
  };

  const helptext = ruleType == 6 ? 'Shipment' : 'Cart';

  const onFinish = useCallback(
    (values) => {
      values = { ...values, apply_to: applyTo, available: available };
      if (values['rule_type'] == 2 || values['rule_type'] == 6) {
        values = {
          ...values,
          isFilterWeight: isFilterWeight,
          isFilterPrice: isFilterPrice,
          isFilterQuantity: isFilterQuantity,
        };
      }

      let error = false,
        errormsg = '',
        data = {};

      if (modal.open && modal.type === 'edit') {
        data = shippingRules?.find((sg) => sg.uuid === shippingRuleId) ?? {};
      }

      if (
        values['isFilterWeight'] &&
        parseFloat(values['weight_to']) <= parseFloat(values['weight_from'])
      ) {
        error = true;
        errormsg = 'From weight cannot be greater than or equal to To weight.';
      } else if (
        values['isFilterPrice'] &&
        parseFloat(values['price_to']) <= parseFloat(values['price_from'])
      ) {
        error = true;
        errormsg = 'From Price cannot be greater than or equal to To Price.';
      } else if (
        values['isFilterQuantity'] &&
        parseFloat(values['quantity_to']) <= parseFloat(values['quantity_from'])
      ) {
        error = true;
        errormsg =
          'From Quantity cannot be greater than or equal to To Quantity.';
      }

      if (error) {
        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            showAlertMessage: false,
            alertMessageType: 'loading',
          },
        });
        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            alertMessage: errormsg,
            showAlertMessage: true,
            alertMessageType: 'error',
          },
        });
      } else {
        dispatch(saveShippingRule({ ...data, ...values }, token));
        setSelectedCategories([]);
        setSelectedProducts([]);
        setSelectedBrands([]);
      }
    },
    [
      dispatch,
      form,
      modal.open,
      modal.type,
      shippingRuleId,
      shippingRules,
      token,
      available,
      isFilterWeight,
      isFilterPrice,
      isFilterQuantity,
      applyTo,
    ]
  );

  const columns = [
    {
      key: 'rule_name',
      title: 'Rule Name',
      dataIndex: 'rule_name',
    },
    {
      key: 'rule_type',
      title: 'Type',
      dataIndex: 'rule_type',
      render: (rule_type) => (
        <Space size='small'>{shippingRuleTypes[rule_type]}</Space>
      ),
    },
    {
      key: 'filter_name',
      title: 'Filters',
      dataIndex: 'filter_name',
      render: (filter_name, record) => (
        <>
          {record?.rule_type == 2 ? (
            installedCarriers?.map(
              (carrier) =>
                carrier.slug == filter_name &&
                (carrier.carrier_type == 1
                  ? carrier.name + ' (LTL Freight Providers)'
                  : carrier.carrier_type == 2
                  ? carrier.name + ' (Parcel & Postal Providers)'
                  : null
                )
              )
          ) : record?.rule_type == 3 ? (
            <>
              {record.id == recordId ? (
                <>
                  {record?.filter_state_province?.map((key) => {
                    return (
                      <>
                        <span> {key} </span>
                        <br />
                      </>
                    );
                  })}
                </>
              ) : (
                <>
                  {record?.filter_state_province?.map((key, item) => {
                    if (item < 5) {
                      return (
                        <>
                          <span> {key} </span>
                          <br />
                        </>
                      );
                    }
                  })}
                  {record?.filter_state_province?.length > 5 ? (
                    <a
                      className='btn mt-2'
                      onClick={() => showMoreItems(record.id)}
                    >
                      show more
                    </a>
                  ) : null}
                </>
              )}
            </>
          ) : record?.rule_type == 4 ? (
            <>
              {record.id == recordId ? (
                <>
                  {record?.filter_postal_code?.map((key) => {
                    return (
                      <>
                        <span> {key} </span>
                        <br />
                      </>
                    );
                  })}
                </>
              ) : (
                <>
                  {record?.filter_postal_code?.map((key, item) => {
                    if (item < 5) {
                      return (
                        <>
                          <span> {key} </span>
                          <br />
                        </>
                      );
                    }
                  })}
                  {record?.filter_postal_code?.length > 5 ? (
                    <a
                      className='btn mt-2'
                      onClick={() => showMoreItems(record.id)}
                    >
                      show more
                    </a>
                  ) : null}
                </>
              )}
            </>
          ) : record?.rule_type == 5 ? (
            <>
              {record.id == recordId ? (
                <>
                  {record?.warehouses?.map((key) => {
                    return (
                      <>
                        <span>
                          {warehouse
                            ? warehouse?.map(
                              (value) =>
                                value?.zip_code == key &&
                                `${value?.city + ','} ${value?.state} ${value?.zip_code
                                }`
                            )
                            : null}
                        </span>
                        <br />
                      </>
                    );
                  })}
                </>
              ) : (
                <>
                  {record?.warehouses?.map((key, item) => {
                    if (item < 5) {
                      return (
                        <>
                          <span>
                            {warehouse
                              ? warehouse?.map(
                                (value) =>
                                  value?.zip_code == key &&
                                  `${value?.city + ','} ${value?.state} ${value?.zip_code
                                  }`
                              )
                              : null}
                          </span>
                          <br />
                        </>
                      );
                    }
                  })}
                  {record?.warehouses?.length > 5 ? (
                    <a
                      className='btn mt-2'
                      onClick={() => showMoreItems(record.id)}
                    >
                      show more
                    </a>
                  ) : null}
                </>
              )}
            </>
          ) : record?.rule_type == 6 ? (
            installedCarriers?.map(
              (carrier) =>
                carrier.slug == filter_name &&
                (carrier.carrier_type == 1
                  ? <span> {carrier.name} (LTL Freight Providers) <br/> {accessorialServices[record?.filter_services]} </span>
                  : carrier.carrier_type == 2
                  ? record?.filter_services
                  : null
                )
            )
           ) : (
            filter_name
          )}
        </>
      ),
    },
    {
      key: 'available',
      title: 'Available',
      dataIndex: 'available',
      render: (available, record) => (
        <Space size='small'>
          <a
            href='#!'
            onClick={() => isAvailable(record.uuid, record.available)}
          >
            {available ? 'Yes' : 'No'}
          </a>
        </Space>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      render: (text) => (
        <>
          <Space size='middle'>
            <Button onClick={() => updateFormFields(text)}>Edit</Button>
            <Button
              onClick={() => openDeleteLocationModal(text)}
              className={'btn-danger'}
            >
              Delete
            </Button>
          </Space>
        </>
      ),
    },
  ];

  if (!shippingRules) return <Skeleton active />;

  return (
    <Fragment>
      <Space direction='vertical' size={'large'} className={'w-100'}>
        <Row gutter={30}>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
            <Title level={4}>
              Shipping Rules{' '}
              <Button
                type='primary'
                onClick={() => {
                  form.setFieldsValue(initialState);
                  setAvailable(true);
                  setRuleType(1);
                  setCountryCode('US');
                  setIsFilterWeight(false);
                  setIsFilterPrice(false);
                  setIsFilterQuantity(false);
                  setCarrierSlug();
                  setCarrierId();
                  setSelectedBrands([]);
                  setSelectedProducts([]);
                  setSelectedCategories([]);
                  hanldeModalToggling(true, 'add');
                  setApplyRuleTo(1);
                  setData([]);
                  setSearchQuery('');
                  setAccessorials([])
                  setIsLTL(false)
                }}
              >
                Add
              </Button>
            </Title>
            <p>
              The Shipping Rules gives you an opportunity to customize the
              behavior of the app.
            </p>
            <Table
              className={'custom-table'}
              dataSource={shippingRules ? addKeysToList(shippingRules) : []}
              columns={columns}
            />
          </Col>
        </Row>
      </Space>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <Title className={'mb-0'} level={4}>
            {alertMessageType === 'loading'
              ? 'Loading. Please wait...'
              : 'Shipping Rules'}
          </Title>
        }
        centered
        visible={modal.open && (modal.type === 'add' || modal.type === 'edit')}
        onCancel={() => {
          hanldeModalToggling(false, '');
          form.resetFields();
          dispatch({
            type: 'GET_CARRIER_SERVICES',
            payload: [],
          });
        }}
        destroyOnClose={true}
        footer={null}
        width={800}
      >
        {alertMessageType === 'loading' ? (
          <Skeleton active />
        ) : (
          <Form
            layout='vertical'
            name='add_shipping_rule_info'
            className='form-wrp'
            size={'large'}
            form={form}
            initialValues={initialState}
            onFinish={onFinish}
          >
            <Row gutter={30}>
              <Col
                className='gutter-row'
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <Form.Item
                  className={'mb-2'}
                  label='Rule name'
                  name='rule_name'
                  rules={[
                    {
                      required: true,
                      message: 'Rule name is required',
                    },
                  ]}
                >
                  <Input placeholder='Rule name' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col
                className='gutter-row'
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <div id='type_dropdown'>
                  <Form.Item
                    className={'mb-2'}
                    label='Type'
                    name='rule_type'
                    rules={[
                      {
                        required: false,
                        message: 'Type',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Type'
                      onChange={(value) => setRuleType(value)}
                      getPopupContainer={() =>
                        document.getElementById('type_dropdown')
                      }
                    >
                      <Option value={'1'}>Restrict By Country</Option>
                      <Option value={'3'}>Restrict By State</Option>
                      <Option value={'4'}>Restrict By Postal Codes</Option>
                      <Option value={'5'}>Restrict To Origin Locations</Option>
                      <Option value={'2'}>Hide Methods</Option>
                      <Option value={'6'}>Override Rates</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col
                className='gutter-row'
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <Form.Item
                  className={'mb-2'}
                  label='Apply to:'
                  rules={[
                    {
                      required: false,
                      message: 'Apply to',
                    },
                  ]}
                >
                  {ruleType == 6 ? (
                    <Radio checked={applyTo == 1}>Shipment</Radio>
                  ) : (
                    <Radio checked={applyTo == 1}>Cart</Radio>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {(ruleType == 1 ||
              ruleType == 3 ||
              ruleType == 4 ||
              ruleType == 5) && (
                <>
                  {ruleType != 5 && ruleType != 6 && (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label='Countries'
                            name='filter_country'
                            rules={[
                              {
                                required: false,
                                message: 'Select countries',
                              },
                            ]}
                          >
                            <Select
                              placeholder='Select countries'
                              value={this?.filter_country || undefined}
                              onChange={(value) => setCountryCode(value)}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                            >
                              <Option value={'US'}>US</Option>
                              <Option value={'CA'}>CA</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  )}
                  {(ruleType == 3 || ruleType == 4) && (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='state_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label='States/Provinces'
                            name='filter_state_province'
                            rules={[
                              {
                                required: true,
                                message: 'States/Provinces are required',
                              },
                            ]}
                          >
                            <Select
                              mode='multiple'
                              style={{ width: '100%' }}
                              placeholder='Select states/provinces'
                              value={selectedProvinces}
                              allowClear
                              onChange={handleChangeProvinces}
                              filterOption={filterOptionsProvinces}
                              getPopupContainer={() =>
                                document.getElementById('state_dropdown')
                              }
                            >
                              {statesProvince?.map((option) => (
                                <Option key={option.key} value={option.value}>
                                  {option.value}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  )}
                  {ruleType == 4 && (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          className={'mb-0'}
                          label='Postal codes'
                          name='filter_postal_code'
                          rules={[
                            {
                              required: true,
                              message: 'Postal codes are required',
                            },
                          ]}
                        >
                          <Select
                            mode='tags'
                            style={{ width: '100%' }}
                            placeholder='Postal codes'
                            value={selectedPostalCodes}
                            onChange={handleSelectChange}
                            dropdownStyle={{ display: 'none' }}
                            onInput={(e) =>
                            (e.target.value = (
                              '' + e.target.value
                            ).toUpperCase())
                            }
                          >
                            {selectedPostalCodes.map((item) => (
                              <Option key={item} value={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <div className={'text-gray mb-1'}>
                          Postal codes can be entered with exact values (e.g.,
                          90210), containing wildcards (e.g., 902*), or as fully
                          numeric ranges (e.g., 90210...99000). Use enter to add
                          the next value.
                        </div>
                      </Col>
                    </Row>
                  )}
                  {ruleType == 5 && (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label='Warehouses'
                            name='warehouses'
                            rules={[
                              {
                                required: true,
                                message: 'Warehouses are required',
                              },
                            ]}
                          >
                            <Select
                              mode='multiple'
                              style={{ width: '100%' }}
                              placeholder='Select warehouses'
                              value={selectedWarehouses}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                              allowClear
                              onChange={handleChangeWarehouses}
                              filterOption={filterOptionsWarehouses}
                            >
                              {warehouse
                                ? warehouse?.map((value) => (
                                  <Option
                                    value={value?.zip_code}
                                    key={value?.zip_code}
                                  >{`${value?.city + ','} ${value?.state} ${value?.zip_code
                                    }`}</Option>
                                ))
                                : null}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={30}>
                    <Col
                      className='gutter-row'
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <div id='apply_rule_to'>
                        <Form.Item
                          className={'mb-2'}
                          label='Apply rule to'
                          name='apply_rule_to'
                          rules={[
                            {
                              required: false,
                              message: 'Apply rule to',
                            },
                          ]}
                        >
                          <Select
                            placeholder='Apply rule to'
                            onChange={(value) => setApplyRuleTo(value)}
                            getPopupContainer={() =>
                              document.getElementById('apply_rule_to')
                            }
                          >
                            <Option value={1}>Categories</Option>
                            <Option value={2}>Brands</Option>
                            <Option value={3}>Individual Products</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  {applyRuleTo == 1 ? (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label={'Apply the rule to these categories'}
                            name='filter_categories'
                            rules={[
                              {
                                required: true,
                                message: 'Categories are required',
                              },
                            ]}
                          >
                            <Select
                              mode='multiple'
                              style={{ width: '100%' }}
                              placeholder={'Select categories'}
                              value={selectedCategories}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                              allowClear
                              onChange={handleChangeCategories}
                              filterOption={filterOptionsCategories}
                            >
                              {storeCategories?.map((option) => (
                                <Option key={option.key} value={option.key}>
                                  {option.value}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  ) : applyRuleTo == 2 ? (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label={'Apply the rule to these brands'}
                            name='filter_brands'
                            rules={[
                              {
                                required: true,
                                message: 'Brands are required',
                              },
                            ]}
                          >
                            <Select
                              mode='multiple'
                              style={{ width: '100%' }}
                              placeholder={'Select brands'}
                              value={selectedBrands}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                              allowClear
                              onChange={handleChangeBrands}
                              filterOption={filterOptionsBrands}
                            >
                              {storeBrands?.map((option) => (
                                <Option key={option.key} value={option.key}>
                                  {option.value}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  ) : applyRuleTo == 3 ? (
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <div ref={dropdownRef}>
                            <Form.Item
                              className={'mb-2'}
                              label={'Apply the rule to these products'}
                              name='filter_products'
                              rules={[
                                {
                                  required: true,
                                  message: 'Products are required',
                                },
                              ]}
                            >
                              <Select
                                mode='multiple'
                                style={{ width: '100%' }}
                                placeholder={'Search products by name, SKU'}
                                labelInValue
                                getPopupContainer={() =>
                                  document.getElementById('country_dropdown')
                                }
                                notFoundContent={
                                  loading ? (
                                    <span>
                                      <Spin size='small' />
                                    </span>
                                  ) : searchQuery?.length > 2 &&
                                    data?.length == 0 ? (
                                    <span>Product not found!</span>
                                  ) : (
                                    <span>
                                      Please enter a minimum of three characters.
                                    </span>
                                  )
                                }
                                value={selectedProducts}
                                allowClear
                                onSearch={handleSearch}
                                onChange={handleChangeProducts}
                                filterOption={false}
                              >
                                {data?.map((option) => (
                                  <Option
                                    key={option?.source_product_id}
                                    value={option?.source_product_id}
                                  >
                                    {option?.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </>
              )}

            {(ruleType == 2 || ruleType == 6) && (
              <>
                {ruleType == 2 && (
                  <>
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label='Provider'
                            name='filter_provider'
                            rules={[
                              {
                                required: true,
                                message: 'Provider is required',
                              },
                            ]}
                          >
                            <Select
                              placeholder='Select provider'
                              value={this?.filter_provider || undefined}
                              onChange={handleProviderServices}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                            >
                              {installedCarriers?.map((carrier) => (
                                <Option value={carrier?.slug}>
                                  {carrier.carrier_type == 1
                                    ? carrier.name + ' (LTL Freight Providers)'
                                    : carrier.carrier_type == 2
                                      ? carrier.name +
                                      ' (Parcel & Postal Providers)'
                                      : null}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
                {ruleType == 6 && (
                  <>
                    <Row gutter={30}>
                      <Col
                        className='gutter-row'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div id='country_dropdown'>
                          <Form.Item
                            className={'mb-2'}
                            label='Provider'
                            name='filter_provider'
                            rules={[
                              {
                                required: true,
                                message: 'Provider is required',
                              },
                            ]}
                          >
                            <Select
                              placeholder='Select provider'
                              value={this?.filter_provider || undefined}
                              onChange={handleProviderServices}
                              getPopupContainer={() =>
                                document.getElementById('country_dropdown')
                              }
                            >
                              {installedCarriers?.map((carrier) =>
                                carrier?.slug == 'estes-ltl' ||
                                  carrier?.slug == 'abf-ltl' ||
                                  carrier?.slug == 'xpo-ltl' ||
                                  carrier?.slug == 'fedex-ltl' ||
                                  carrier?.slug == 'ups-ltl' ||
                                  carrier?.slug == 'ups-small' ||
                                  carrier?.slug == 'echo-ltl' ||
                                  carrier?.slug == 'odfl-ltl' ||
                                  carrier?.slug == 'daylight-ltl' ||
                                  carrier?.slug == 'ltl-quotes' ||
                                  carrier?.slug == 'rl-ltl' ||
                                  carrier?.slug == 'southeastern-ltl' ||
                                  carrier?.slug == 'saia-ltl' ||
                                  carrier?.slug == 'freightquote-chr-ltl' ||
                                  carrier?.slug == 'freightquote-ltl' ||
                                  carrier?.slug == 'priority-one-ltl'? (
                                  <Option value={carrier?.slug}>
                                    {carrier.carrier_type == 1
                                      ? carrier.name + ' (LTL Freight Providers)'
                                      : carrier.carrier_type == 2
                                        ? carrier.name +
                                        ' (Parcel & Postal Providers)'
                                        : null}
                                  </Option>
                                ) : null
                              )}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    {isLTL ? (
                      <>
                        <Row gutter={30}>
                          <Col
                            className='gutter-row'
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div id='country_dropdown'>
                              <Form.Item
                                className={'mb-2'}
                                label='Service'
                                name='filter_services'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Service is required',
                                  },
                                ]}
                              >
                                <Select
                                  placeholder='Select service'
                                  value={selectedServices}
                                  onChange={handleChangeServices}
                                  getPopupContainer={() =>
                                    document.getElementById('country_dropdown')
                                  }
                                >
                                  <Option value={'transportation'}>Transportation service</Option>
                                  <Option value={'residential'}>Residential delivery service</Option>
                                  {accessorials && accessorials?.map((accessorial) => (
                                    accessorial?.accessorial_service_sac == 'lgd' && accessorial?.status ? (
                                      <Option value={'liftgate'}>Lift gate delivery service</Option>
                                    ) :
                                    accessorial?.accessorial_service_sac == 'nbd' && accessorial?.status ? (
                                      <Option value={'notify'}>Notify before delivery service</Option>
                                    ) :
                                    accessorial?.accessorial_service_sac == 'lad' && accessorial?.status ? (
                                      <Option value={'limitedAccess'}>Limited access delivery service</Option>
                                    ) :
                                    accessorial?.accessorial_service_sac == 'ind' && accessorial?.status ? (
                                      <Option value={'insideDelivery'}>Inside delivery service</Option>
                                    ) : null
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <ServiceRate
                          label='Service rate (e.g. 5.25)'
                          name='service_rates'
                          placeholder='Enter service rate'
                          required={true}
                          message='Service rate is required'
                        />
                      </>
                    ) : (
                      <>
                        <Row gutter={30}>
                          <Col
                            className='gutter-row'
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div id='country_dropdown'>
                              <Form.Item
                                className={'mb-2'}
                                label='Service'
                                name='filter_services'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Service is required',
                                  },
                                ]}
                              >
                                <Select
                                  style={{ width: '100%' }}
                                  placeholder='Select service'
                                  value={selectedServices}
                                  onChange={handleChangeServices}
                                  notFoundContent={
                                    <span>
                                      <Spin size='small' />
                                    </span>
                                  }
                                  filterOption={filterServices}
                                  getPopupContainer={() =>
                                    document.getElementById('country_dropdown')
                                  }
                                  allowClear
                                  disabled={!carrierSlug} // Disable carrier services dropdown if no carrier is selected
                                >
                                  {carrierSlug &&
                                    carrierServices?.map((service) => (
                                      <Option
                                        key={service?.value}
                                        value={service?.value}
                                      >
                                        {service?.value}
                                      </Option>
                                    ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <ServiceRate
                          label='Service rate (e.g. 5.25)'
                          name='service_rates'
                          placeholder='Enter service rate'
                          required={true}
                          message='Service rate is required'
                        />
                      </>
                    )}
                  </>
                )}
                <Row gutter={30}>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item className={'mb-0'} name='is_filter_weight'>
                      <Checkbox
                        name='is_filter_weight'
                        checked={isFilterWeight}
                        onChange={(e) => setIsFilterWeight(e.target.checked)}
                      >
                        Filter by weight (lbs)
                      </Checkbox>
                      <Tooltip
                        title={
                          'The total weight of the ' + helptext + ' in pounds.'
                        }
                      >
                        <a href='#!'>[ i ]</a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='From'
                      name='weight_from'
                      rules={[
                        {
                          required: isFilterWeight,
                          message: 'Weight from is required',
                        },
                        {
                          pattern: /^(\d{0,10}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 10 numbers with 2 decimal places.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={blockInvalidChar}
                        step='0.01'
                        placeholder='Enter weight from'
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='To'
                      name='weight_to'
                      rules={[
                        {
                          required: false,
                          message: 'Weight to is required',
                        },
                        {
                          pattern: /^(\d{0,10}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 10 numbers with 2 decimal places.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={blockInvalidChar}
                        step='0.01'
                        placeholder='Enter weight to'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item className={'mb-0'} name='is_filter_price'>
                      <Checkbox
                        name='is_filter_price'
                        checked={isFilterPrice}
                        onChange={(e) => setIsFilterPrice(e.target.checked)}
                      >
                        Filter by price
                      </Checkbox>
                      <Tooltip
                        title={
                          'The total value of the items in the ' +
                          helptext +
                          '.'
                        }
                      >
                        <a href='#!'>[ i ]</a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='From'
                      name='price_from'
                      rules={[
                        {
                          required: isFilterPrice,
                          message: 'Price from is required',
                        },
                        {
                          pattern: /^(\d{0,15}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 15 numbers with 2 decimal places.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={blockInvalidChar}
                        step='0.01'
                        placeholder='Enter price from'
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='To'
                      name='price_to'
                      rules={[
                        {
                          required: false,
                          message: 'Price to is required',
                        },
                        {
                          pattern: /^(\d{0,15}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 15 numbers with 2 decimal places.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={blockInvalidChar}
                        step='0.01'
                        placeholder='Enter price to'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item className={'mb-0'} name='is_filter_quantity'>
                      <Checkbox
                        name='is_filter_quantity'
                        checked={isFilterQuantity}
                        onChange={(e) => setIsFilterQuantity(e.target.checked)}
                      >
                        Filter by quantity
                      </Checkbox>
                      <Tooltip
                        title={
                          'The total number of items in the ' + helptext + '.'
                        }
                      >
                        <a href='#!'>[ i ]</a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='From'
                      name='quantity_from'
                      rules={[
                        {
                          required: isFilterQuantity,
                          message: 'Quantity from is required',
                        },
                        {
                          pattern: /^(\d{0,7}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 7 numbers.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={handleNumbersOnly}
                        step='1'
                        placeholder='Enter quantity from'
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className='gutter-row'
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Form.Item
                      label='To'
                      name='quantity_to'
                      rules={[
                        {
                          required: false,
                          message: 'Quantity to is required',
                        },
                        {
                          pattern: /^(\d{0,7}(\.\d{0,2})?)?$/,
                          message: 'Please enter up to 7 numbers.',
                        },
                      ]}
                    >
                      <Input
                        type='number'
                        onKeyDown={handleNumbersOnly}
                        step='1'
                        placeholder='Enter quantity to'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Row gutter={30}>
              <Col
                className='gutter-row'
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <Form.Item
                  className={'mb-2'}
                  rules={[
                    {
                      required: false,
                      message: 'Available',
                    },
                  ]}
                >
                  <Checkbox
                    name='available'
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  >
                    Available
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30} align='middle' className={'mt-3'}>
              <Col
                className='gutter-row'
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <Form.Item
                  style={{
                    textAlign: 'right',
                    marginBottom: '0',
                  }}
                >
                  <Space>
                    <Button type='primary' size={'large'} htmlType='submit'>
                      Save
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        title='Confirm Delete'
        centered
        visible={modal.open && modal.type === 'delete'}
        onOk={() => dispatch(deleteShippingRule(shippingRuleId, token))}
        onCancel={() => hanldeModalToggling(false, '')}
        okText='Confirm'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Are you sure you want to delete this shipping rule?</p>
      </Modal>
    </Fragment>
  );
}

export default ShippingRulesComponent;
