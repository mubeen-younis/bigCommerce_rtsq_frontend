import axios from 'axios';
export const postData = (data, type, url, token) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}, //Authorization: `Bearer ${token}`
	};
	return (dispatch) => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});
		axios
			.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, data, config)
			.then(({ data }) => {
				if (!data.error) {
					if (data.data.value !== undefined) {
						dispatch({
							type: type,
							payload: JSON.parse(data.data.value),
						});
					}
				}
				console.log('data', data);
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
			})
			.catch((error) => {});
	};
};

export const getCarrierDetails = (data) => {
  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_info`, {
        data,
      })
      .then(({ data }) => {
        if (data.settings.length > 0) {
          dispatch({
            type: "GET_CONNECTION_SETTINGS",
            payload: data.settings,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getConnectionSettings = () => {
  const data = {
    shop: "dev-azm-1.mybigcommerce.com",
    carrierId: 1,
  };

  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_conn_settings`, {
        data,
      })
      .then(({ data }) => {
        console.log(data);
        console.log(JSON.parse(data.data.value));
        dispatch({
          type: "GET_CONNECTION_SETTINGS",
          payload: JSON.parse(data.data.value),
        });
        dispatch({
          type: "SKELETON_LOADING",
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: "SKELETON_LOADING",
          payload: false,
        });
      });
  };
};

export const getLocations = (token) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	};

	return (dispatch) => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_locations`,
				config
			)
			.then(async ({ data }) => {
				if (data.data.length > 0) {
					let dropships = [];
					let warehouse = [];
					await data.data.map((value) => {
						if (value.type === 1) {
							warehouse = [...warehouse, value];
						} else {
							dropships = [...dropships, value];
						}
					});
					dispatch({
						type: 'GET_LOCATIONS',
						payload: {
							dropships: dropships,
							warehouse: warehouse,
						},
					});
				}
			})
			.catch((error) => {});
	};
};

export const getQuoteSettings = (token, carrierId) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	};

	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_qoute_settings/${carrierId}`,config)
			.then(({ data }) => {
				//if (data.data.length > 0) {
				dispatch({
					type: 'GET_QUOTE_SETTINGS',
					payload: JSON.parse(data.data.value),
				});
				//}
			})
			.catch((error) => {});
	};
};

export const getAllProducts = (token) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	};
	return (dispatch) => {
		axios
			.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_products`, config)
			.then(({ data }) => {
				//if (data.data.length > 0) {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: data.data,
				});
				//}
			})
			.catch((error) => {
				dispatch({
					type: 'GET_ALL_PRODUCTS',
					payload: [],
				});
			});
	};
};

export const dismissAlert = () => {
  return (dispatch) => {
    dispatch({
      type: "ALERT_MESSAGE",
      payload: {
        alertMessage: null,
        showAlertMessage: false,
        alertMessageType: null,
      },
    });
  };
};

export const setStore = (store) => {
  console.log("store action", store);
  localStorage.setItem("store", store);
  return (dispatch) => {
    dispatch({
      type: "STORE",
      payload: store,
    });
  };
};

export const getAllCarriers = (data) => {
  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/getAllCarriers`, {
        params: { store: data.store },
      })
      .then(({ data }) => {
        if (!data.error) {
          dispatch({
            type: "GET_EN_CARRIERS",
            payload: JSON.parse(data.enitureCarriers),
          });
          dispatch({
            type: "GET_INSTALLED_CARRIERS",
            payload: JSON.parse(data.installedCarriers),
          });
        }
        console.log("data", data);
        dispatch({
          type: "ALERT_MESSAGE",
          payload: {
            alertMessage: data.message,
            showAlertMessage: true,
            alertMessageType: data.error ? "error" : "success",
          },
        });
      })
      .catch((error) => {});
  };
};

export const getPlansInfo = (data) => {
  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_plans_info`, {
        ...config,
        params: { store: data.store },
      })
      .then(({ data }) => {
        console.log(data.data[0].value);
        if (!data.error) {
          dispatch({
            type: "GET_PLANS_INFO",
            payload: JSON.parse(data.data[0].value),
          });
        }
      })
      .catch((error) => {});
  };
};
