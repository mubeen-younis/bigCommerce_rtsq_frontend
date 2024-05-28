import types from './../Stores/types';
import axios from './../Utilities/authToken';
import { dispatchAlert } from './../Utilities/dispatchAlert';

export const getPaymentsDetial = (token) => async (dispatch) => {
  try {
    dispatch(dispatchAlert(false, 'loading'));

    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const {
      data: { error, data, message },
    } = await axios.get('get_payments', config);

    if (!error) {
      dispatch({
        type: types.GET_PAYMENTS,
        payload: data ?? [],
      });
    }
    dispatch(dispatchAlert(error, error ? 'error' : 'success', message));
  } catch ({ response }) {
    if (
      response &&
      response?.data?.error &&
      response?.data?.message === 'Token Mismatch'
    ) {
      dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
          showAlertMessage: false,
          alertMessageType: 'Token Mismatch',
        },
      });

      return;
    }

    dispatch(dispatchAlert(false, null));
    dispatch({
      type: types.GET_PAYMENTS,
      payload: [],
    });
  }
};
