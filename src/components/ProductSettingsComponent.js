import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  submitProductSettings,
  importProducts,
  getAllProducts,
  getProduct,
} from '../Actions/ProductSettings';
import {
  Table,
  Button,
  Space,
  Form,
  // Input,
  Modal,
  Drawer,
  Col,
  Row,
  Skeleton,
  Input,
} from 'antd';
import addKeysToList from '../Utilities/addKey';
import Settings from './Products/Settings';
import { isFireFox } from '../Utilities/browserName';
import { getLocations } from './../Actions/Warehouse';
import { validateHandlingFeeMarkup } from '../Utilities/numberValidation';

const makeColumns = (sortProducts, showProductDetails, showMoreItems, recordId) => {
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: sortProducts,
      sortOrder: false,
      //filters:sortProducts,
      /*sorter: (a, b) => a.name.length - b.name.length,
			sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,*/
      ellipsis: true,
      render: (text) =>
        text && text?.length > 50 ? (
          <>
            <p>{`${text?.substring(0, 50)}`}</p>
            <p>{`${text?.substring(50)}`}</p>
          </>
        ) : (
          text
        ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      ellipsis: true,
      render: (categories, record) => (
        
        <>
          {record.key == recordId ?  (
            <>
              {categories?.map((key) => {
              return (
                <>
                  <span> {key} </span>
                  <br/>
                </>
              )})}
            </>
          ): (
            <>
              {categories?.map((key, item) => {
              if(item < 3){
                return (
                <>
                  <span> {key} </span>
                  <br/>
                </>
              )}})}
              {categories?.length > 3 ? <a className="btn mt-2" onClick={() => showMoreItems(record.key)}>show more</a> : null}
            </>
          )}
        </>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      key: 'brand_name',
      /*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
    },
    {
      title: 'Product Id',
      dataIndex: 'source_product_id',
      key: 'source_product_id',
      /*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
    },
    {
      title: 'Variant Id',
      dataIndex: 'variant_id',
      key: 'variant_id',
      /*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
    },
    {
      title: 'Product SKU',
      dataIndex: 'sku',
      key: 'sku',
      /*sorter: (a, b) => a.sku - b.sku,
			sortOrder: sortedInfo.columnKey === 'sku' && sortedInfo.order,
			ellipsis: true,*/
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      /*sorter: (a, b) => +a.price.substring(1) - +b.price.substring(1),
			sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
			ellipsis: true,*/
    },
    {
      title: 'Default',
      dataIndex: 'settings',
      key: 'settings',
      render: (settings) => (
        <>
          <span>{JSON.parse(settings)?.freightParcelEnabled ? 'Both' : JSON.parse(settings)?.freight_enabled ? 'LTL' : JSON.parse(settings)?.parcel_enabled ? 'Parcel' : ''}</span>
        </>
      )
    },
    {
      title: 'Action',
      dataIndex: 'source_product_id',
      key: 'source_product_id',
      render: (source_product_id, record) => (
        <Space size='middle'>
          <Button onClick={() => showProductDetails(source_product_id, record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return columns;
};

function ProductSettingsComponent(props) {
  const [loading, setLoading] = useState(true);
  const [loadProduct, setLoadProduct] = useState(false);
  const [syncModel, setSyncModel] = useState(false);
  const [lastPageNo, setLastPageNo] = useState(1);
  const [countSorting, setCountSorting] = useState(0);
  const [emailAddress, setEmailAddress] = useState(
    props?.store?.admin_email || ''
  );
  const [state, setState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    selectedRowKeys: [],
    showDropship: false,
    visible: false,
  });
  const [selectedProductDetail, setselectedProductDetail] = useState({
    freight_enabled: false,
    parcel_enabled: false,
    freight_class: '',
    hazardous_enabled: false,
    insurance: false,
    dropship_enabled: false,
    allow_vertical: false,
    ship_own_package: false,
    ship_multiple_package: false,
  });
  const [productVariants, setProductVariants] = useState([]);
  const [sortProd, setSortProd] = useState(false);
  const [formError /* setFormError */] = useState('');
  const dispatch = useDispatch();
  const { productsPagination } = useSelector((state) => state);
  const [recordId, setRecordId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: productsPagination?.total,
    search: null,
  });
  const addonCheck = props.installedAddons.find(
    (add) => add.short_code === 'SBS'
  );

  const showMoreItems = key => {
    setRecordId(key)
  }

  useEffect(() => {
    if (props.allProducts === null) {
      dispatch(
        getAllProducts(
          props.token,
          pagination.current,
          pagination.pageSize,
          false,
          setLoading,
          pagination.search
        )
      );
    }
    if (props.allProducts !== null && props.allProducts !== undefined) {
      setLoading(false);
      setPagination({
        ...pagination,
        total: productsPagination?.total,
      });
    }
    if (props.productDetail) {
      const variants = props.productDetail.map((variant) => {
        let settings =
          variant.settings !== '' ? JSON.parse(variant.settings) : {};
        return {
          ...variant,
          ...settings,
        };
      });
      setProductVariants(variants);
    }
    if (countSorting > 0) {
      setLoading(true);
      setCountSorting(0);
      dispatch(
        getAllProducts(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLoading,
          pagination.search
        )
      );
    }
    // eslint-disable-next-line
  }, [
    productsPagination,
    props.productDetail,
    sortProd,
    dispatch,
    props.token,
  ]);

  useEffect(() => {
    dispatch(getLocations(props.token));
  }, [dispatch, props.token]);

  const showProductDetails = async (id, product) => {
    dispatch(getLocations(props.token));

    setState({
      ...state,
      visible: true,
    });
    dispatch(
      getProduct(id, setselectedProductDetail, setLoadProduct, props.token)
    );
    setLoadProduct(true);

    setTimeout(() => {
      setLoadProduct(false);
    }, 1000);
  };

  const onClose = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const syncProducts = () => {
    if (
      new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(emailAddress)
    ) {
      dispatch(importProducts(emailAddress, props.token));
      setSyncModel(false);
    } else {
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: false,
        },
      });
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: true,
          alertMessage: 'Enter valid email address',
          alertMessageType: 'error',
        },
      });
    }
  };

  const openConfirmModel = () => {
    setSyncModel(true);
  };

  const handleChange = (pagination, filters, sorter) => {
    setLoading(true);
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    let PaginationPerpage = (productsPagination?.perpage * 10) / 10;
    if (pagination?.pageSize !== PaginationPerpage) {
      setLoading(true);
      dispatch(
        getAllProducts(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLoading,
          pagination.search
        )
      );
      const meta = {
        ...productsPagination,
        perpage: pagination?.pageSize,
      };
      dispatch({
        type: 'PRODUCT_PAGINATION',
        payload: meta,
      });
    } else {
      if (pagination?.current !== lastPageNo) {
        setLastPageNo(pagination?.current);
        dispatch(
          getAllProducts(
            props.token,
            pagination.current,
            pagination.pageSize,
            sortProd,
            setLoading,
            pagination.search
          )
        );
      } else {
        setSortProd(!sortProd);
      }
    }

    /*dispatch(
			getAllProducts(
				props.token,
				pagination.current,
				pagination.pageSize,
				sortProd,
				setLoading,
				pagination.search,
			)
		)*/
    setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  const productSearch = () => {
    let search = pagination.search;

    if (search && search.length >= 2) {
      setPagination({
        ...pagination,
        current: 1,
      });
      dispatch(
        getAllProducts(
          props.token,
          1,
          pagination.pageSize,
          sortProd,
          setLoading,
          search
        )
      );
      setLoading(true);
    } else if (search && search.length === 0) {
      dispatch(
        getAllProducts(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLoading,
          null
        )
      );
      setLoading(true);
    }
  };
  const resetSearch = (search) => {
    setPagination({
      ...pagination,
      search: search,
    });
    if (search.length === 0) {
      setLoading(true);
      dispatch(
        getAllProducts(
          props.token,
          pagination.current,
          pagination.pageSize,
          sortProd,
          setLoading
        )
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      productSearch();
    }
  };

  const copyShippingMethod = useCallback(() => {
    const first_variant = productVariants[0];

    const variants_to_change_array = productVariants.slice(1).map((v) => ({
      ...v,
      freight_enabled: first_variant?.freight_enabled,
      parcel_enabled: first_variant?.parcel_enabled,
    }));
    setProductVariants([first_variant, ...variants_to_change_array]);
  }, [productVariants]);

  const copyShippingParams = useCallback(() => {
    const first_variant = productVariants[0];

    //let oneProduct = { ...settings, ...product }
    const {
      freight_class,
      weight,
      length,
      width,
      height,
      dropship_enabled,
      dropship_location,
      hazardous_enabled,
      //parcel_enabled,
      //freight_enabled,
      insurance,
      allow_vertical,
      ship_own_package,
      ship_multiple_package,
    } = first_variant;

    const variants_to_change_array = productVariants.slice(1).map((v) => ({
      ...v,
      freight_class,
      weight,
      length,
      width,
      height,
      dropship_enabled,
      dropship_location,
      hazardous_enabled,
      //parcel_enabled,
      //freight_enabled,
      insurance,
      allow_vertical,
      ship_own_package,
      ship_multiple_package,
    }));
    setProductVariants([first_variant, ...variants_to_change_array]);
  }, [productVariants]);

  const onChangeVariant = useCallback((index, field, val) => {
    setProductVariants((productVariants) => {
      const variants = [
        ...productVariants.slice(0, index),
        {
          ...productVariants[index],
          [field]: val,
        },
        ...productVariants.slice(index + 1),
      ];

      return variants;
    });
  }, []);

  const onSubmit = useCallback(async () => {
    props.submitProductSettings(
      { products: productVariants },
      props.token,
      setState
    );
  }, [productVariants, props]);

  const validate = useCallback(() => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
      },
    });

    let error = false;
    let msg = '';

    for (const prd of productVariants) {
      if (
        prd.weight === null ||
        (prd.weight <= 0 &&
          (prd.length === null ||
            prd.length <= 0 ||
            prd.width === null ||
            prd.width <= 0 ||
            prd.height === null ||
            prd.height <= 0))
      ) {
        error = true;
        msg =
          'Error! Product Weight or Dimensions are required and must be greater than 0.';
      } else if (prd.dropship_enabled === 1 || prd.dropship_enabled) {
        if (!prd.dropship_location) {
          error = true;
          msg = 'Dropship location is required';
        }
      } else if (
        prd.shipping_group_enabled === 1 ||
        prd.shipping_group_enabled
      ) {
        if (!prd.shipping_group) {
          error = true;
          msg = 'Shipping group is required';
        }
      } else if (
        prd.shipping_class_enabled === 1 ||
        prd.shipping_class_enabled
      ) {
        if (!prd.shipping_class) {
          error = true;
          msg = 'Shipping class is required';
        }
      } else if (
        validateHandlingFeeMarkup(prd.product_markup, 'Product level markup') !=
        ''
      ) {
        error = true;
        msg =
          'Invalid input! Product level markup should be like, e.g. 3.75, or a percentage, e.g. 5%, and only 2 digits are allowed after the decimal point.';
      }
    }

    if (!error) {
      onSubmit();
    } else {
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: true,
          alertMessage: msg,
          alertMessageType: 'error',
        },
      });
    }
  }, [dispatch, onSubmit, productVariants]);

  const sortProducts = useCallback(
    (a, b) => {
      let lastProduct = props.allProducts[props.allProducts.length - 1];
      let checkId = isFireFox() ? b?.id : a?.id;
      if (lastProduct?.id === checkId) {
        setCountSorting(countSorting + 1);
        setSortProd(!sortProd);
        //productSearch()
      }
    },
    [countSorting, props.allProducts, sortProd]
  );

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <Fragment>
      <Modal
        title='Confirm Synchronization'
        visible={syncModel}
        onOk={syncProducts}
        onCancel={() => setSyncModel(false)}
        okText='Confirm'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>
          Are you sure you want to synchronize all products? This will download
          all products from your BigCommerce store, might take long time.
        </p>
        <p>
          Enter the email address to which you want the product synchronize
          status sent.
        </p>
        <Row gutter={24}>
          <Col span={8} required>
            Email Address
          </Col>
          <Col span={16}>
            <Input
              required
              value={emailAddress}
              name='emailAddress'
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      <Row gutter={24} className='mb-3'>
        <Col span={8}>
          <Input
            placeholder='Search by product Name/ID/SKU'
            className='col-8'
            onKeyDown={handleKeyDown}
            defaultValue={props.searched_product}
            value={pagination.search ?? props.searched_product}
            onChange={(e) => resetSearch(e.target.value)}
            size='medium'
          />
        </Col>
        <Col span={10} style={{ paddingLeft: '0px' }}>
          <Button onClick={productSearch} type='primary' size='medium'>
            Search
          </Button>
        </Col>
        <Col span={6}>
          <Button
            onClick={openConfirmModel}
            type='primary'
            size='medium'
            style={{ width: '100%' }}
          >
            Sync Products
          </Button>
        </Col>
      </Row>
      <Table
        className='custom-table'
        columns={makeColumns(sortProducts, showProductDetails, showMoreItems, recordId)}
        dataSource={addKeysToList(props.filteredProducts ?? props.allProducts)}
        onChange={handleChange}
        pagination={pagination}
        showSorterTooltip={{ title: '' }}
      />
      <Drawer
        title={`Product Settings ${
          !loadProduct && productVariants.length > 0
            ? ' (' + productVariants?.[0]?.name + ')'
            : ''
        }`}
        width={720}
        onClose={onClose}
        visible={state.visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={validate} type='primary'>
              Save
            </Button>
          </div>
        }
      >
        {loadProduct ? (
          <Skeleton active />
        ) : (
          <Form layout='vertical' initialValues={selectedProductDetail}>
            <Row gutter={16}>
              {formError.length ? (
                <Col span={24}>
                  <Form.Item className='text-danger'>* {formError}</Form.Item>
                </Col>
              ) : null}
            </Row>
            {productVariants?.length > 0
              ? productVariants?.map((product, index) => (
                  <Settings
                    count={productVariants?.length}
                    key={index}
                    index={index}
                    copyShippingMethod={copyShippingMethod}
                    copyShippingParams={copyShippingParams}
                    onChangeVariant={onChangeVariant}
                    product={product}
                    addonCheck={addonCheck}
                  />
                ))
              : null}
          </Form>
        )}
      </Drawer>
      {/* ================ */}
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    allProducts: state.allProducts,
    token: state.token,
    dropships: state.dropships,
    filteredProducts: state.filteredProducts,
    productDetail: state.productDetail,
    store: state.store,
    searched_product: state.searched_product,
    installedAddons: state.installedAddons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitProductSettings: (data, token, visibility) =>
      dispatch(submitProductSettings(data, token, visibility)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductSettingsComponent);
