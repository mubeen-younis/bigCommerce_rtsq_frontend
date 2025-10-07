import axios from 'axios';

export const submitConnectionSettings = (data) => {
  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
    },
  };
  return (dispatch) => {
    axios
      .post(
        `${process.env.ENITURE_API_URL}/submit_connection_settings`,
        config,
        {
          data,
        }
      )
      .then(({ data }) => {})
      .catch((error) => {});
  };
};

export const getConnectionSettings = (token, carrierId) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'ALERT_MESSAGE',
      payload: {
        showAlertMessage: false,
        alertMessageType: 'loading',
      },
    });

    dispatch({
      type: 'GET_CONNECTION_SETTINGS',
      payload: null,
    });

    axios
      .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_conn_settings`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          carrierId,
        },
      })
      .then(({ data }) => {
        let connectionSettings = null;

        if (data.data && data.data.value) {
          connectionSettings = JSON.parse(data.data.value);
        } else {
          connectionSettings = { test: true, connectionSetting: true };
        }

        // Merge nickname from installedCarriers if missing in connection settings
        try {
          const state = getState();
          const installedCarrier = state.installedCarriers?.find(c => c.id === carrierId);
          if (installedCarrier?.nickname && !connectionSettings.nickname) {
            connectionSettings = {
              ...connectionSettings,
              nickname: installedCarrier.nickname
            };
          }
        } catch (e) {
          console.error('Error merging nickname:', e);
        }

        dispatch({
          type: 'GET_CONNECTION_SETTINGS',
          payload: connectionSettings,
        });

        dispatch({
          type: 'SKELETON_LOADING',
          payload: false,
        });

        dispatch({
          type: 'ALERT_MESSAGE',
          payload: {
            showAlertMessage: false,
            alertMessageType: 'success',
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SKELETON_LOADING',
          payload: false,
        });
      });
  };
};
