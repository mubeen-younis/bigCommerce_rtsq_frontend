import axios from 'axios';

export const submitQuoteSettings = (data) => {
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
    },
  };
  return (dispatch) => {
    axios
      .post(`${process.env.ENITURE_API_URL}/submit_quote_settings`, config, {
        data,
      })
      .then(({ data }) => {})
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getQuoteSettings = (token, carrierId) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
        alertMessageType: 'loading',
      },
    });

    dispatch({
      type: 'GET_QUOTE_SETTINGS',
      payload: null,
    });

    axios
      .get(
        `${process.env.REACT_APP_ENITURE_API_URL}/get_qoute_settings/${carrierId}`,
        config
      )
      .then(({ data }) => {
        if (data.data && data.data.value) {
          dispatch({
            type: 'GET_QUOTE_SETTINGS',
            payload: JSON.parse(data.data.value),
          });
        } else {
          dispatch({
            type: 'GET_QUOTE_SETTINGS',
            payload: {},
          });
        }

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            showAlertMessage: false,
            alertMessageType: 'success',
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getThresholdSettings = (token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
        alertMessageType: 'loading',
      },
    });

    axios
      .get(
        `${process.env.REACT_APP_ENITURE_API_URL}/get_threshold_settings`,
        config
      )
      .then(({ data }) => {
        if (data.data) {
          dispatch({
            type: 'GET_THRESHOLD_SETTINGS',
            payload: data.data,
          });
        } else {
          dispatch({
            type: 'GET_THRESHOLD_SETTINGS',
            payload: {},
          });
        }

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            showAlertMessage: false,
            alertMessageType: 'success',
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
