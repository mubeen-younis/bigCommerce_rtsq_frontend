import axios from 'axios'

export const getGoogleResponse = (zipcode, token, setLocationOn) => {
  return (dispatch) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
        alertMessageType: 'loading',
      },
    })

    axios
      .get(
        `${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipcode}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        if (!data.error) {
          dispatch({
            type: 'GET_GOOGLE_LOCATION_RESPONSE',
            payload: data.data,
          })
        } else {
          dispatch({
            type: 'GET_GOOGLE_LOCATION_RESPONSE',
            payload: null,
          })
        }

        setLocationOn(true)

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            alertMessage: data.message,
            showAlertMessage: data.error,
            alertMessageType: data.error ? 'error' : 'success',
          },
        })
      })
      .catch((error) => {})
  }
}

export const getWarehouse = (
  id,
  setLocationDetail,
  setVisibleWarehouse,
  token
) => {
  return (dispatch) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
        alertMessageType: 'loading',
      },
    })

    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_location`, {
        params: {
          location_id: id,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setVisibleWarehouse(true)

        const { data } = res.data

        let additional = JSON.parse(data.additionals)

        setLocationDetail({
          id: data.id ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          country: data.country ?? '',
          xpo_account_number: data.xpo_account_number ?? '',
          nickname: data.nickname ?? '',
          zip_code: data.zip_code ?? '',
          location_type: data.type ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',

          enable_instore: additional.instore_pickup ?? false,
          instore_miles: additional.instore_pickup_data.miles ?? null,
          instore_zipcodes:
            additional.instore_pickup_data.postalCodes.length > 0
              ? additional.instore_pickup_data.postalCodes.split(',')
              : [],
          instock_description:
            additional.instore_pickup_data.checkout_description ?? null,
          default_location_id: data?.default_location_id
            ? isNaN(data?.default_location_id)
              ? data?.default_location_id
              : parseInt(data?.default_location_id)
            : 'default',
          instore_postalCode:
            additional?.instore_pickup_data?.instore_postalCode ?? '',
          instore_city: additional?.instore_pickup_data?.instore_city ?? null,
          instore_state: additional?.instore_pickup_data?.instore_state ?? null,
          instore_country:
            additional?.instore_pickup_data?.instore_country ?? null,

          enable_ld: additional.local_delivery ?? false,
          ld_miles: additional.local_delivery_data.miles ?? null,
          ld_zipcodes:
            additional.local_delivery_data.postalCodes.length > 0
              ? additional.local_delivery_data.postalCodes.split(',')
              : [],
          ld_description:
            additional.local_delivery_data.checkout_description ?? null,
          ld_fee: additional.local_delivery_data.local_delivery_fee ?? null,

          ld_enable_supress: additional.ld_enable_supress ?? false,
        })

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            alertMessage: data.message,
            showAlertMessage: data.error,
            alertMessageType: data.error ? 'error' : 'success',
          },
        })
      })
  }
}

export const deleteLocation = (id, type, setDeleteWarehouseModal, token) => {
  return (dispatch) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: true,
        alertMessageType: 'loading',
      },
    })

    axios
      .post(
        `${process.env.REACT_APP_ENITURE_API_URL}/delete_location`,
        {
          location_id: id,
          location_type: type === 1 ? 'Warehouse' : 'Drop ship',
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        if (!data.error) {
          dispatch({
            type: 'DELETE_LOCATION',
            payload: id,
          })

          setDeleteWarehouseModal(false)
        }

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            alertMessage: data.message,
            showAlertMessage: true,
            alertMessageType: data.error ? 'error' : 'success',
          },
        })
      })
  }
}

export const getLocations = (token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_locations`, config)
      .then(async ({ data }) => {
        if (data.data.length > 0) {
          let dropships = []
          let warehouse = []

          await data.data.forEach((value) =>
            value.type === 1
              ? (warehouse = [...warehouse, value])
              : (dropships = [...dropships, value])
          )

          dispatch({
            type: 'GET_LOCATIONS',
            payload: {
              dropships: dropships,
              warehouse: warehouse,
            },
          })
        }
      })
      .catch(({ response }) => {
        if (
          response &&
          response.data.error &&
          response.data.message === 'Token Mismatch'
        ) {
          dispatch({
            type: 'GET_CARRIERS',
            payload: undefined,
          })

          dispatch({
            type: 'ALERT_MESSAGE',
            payload: {
              showAlertMessage: false,
              alertMessageType: 'Token Mismatch',
            },
          })
        }
      })
  }
}
