import axios from 'axios'

export const getPlans = () => dispatch => {
    axios
        .get(`${process.env.REACT_APP_ENITURE_API_URL}/get_plans`)
        .then(({data}) => {
            if (!data.error) {
                dispatch({
                    type: 'GET_PLANS',
                    payload: data.data,
                })
            } else {
                dispatch({
                    type: 'ALERT_MESSAGE',
                    showAlertMessage: true,
                    alertMessage: data.message,
                    alertMessageType: 'error',
                })
            }
        })
        .catch(error => {
        })
}

export const submitPaymentInfo = (data, token, setIsModalVisible) => dispatch => {

    const config = {
        headers: {
            authorization: `Bearer ${token}`,
        },
    }
    // post http://bc.eniture.com/api/create_subscription
    dispatch({
        type: 'ALERT_MESSAGE',
        payload: {showAlertMessage: true, alertMessageType: 'loading'},
    });

    axios
        .post('subscribe-plan', data, config)
        .then(({data}) => {
            dispatch({type: 'ALERT_MESSAGE', payload: {showAlertMessage: false}})
            // if success, and there is no error, then get the current subscription and hide the subscription modal.
            if (!data.error) {
                const planDetails = data.data;

                // Trigger the Google Tag Manager event for subscription success.
                triggerGoogleTagManagerEvent('plan_subscribed_bc', {
                    'plan_name': planDetails.name,
                    'amount_charged': planDetails.amount_charged,
                    'created_at': planDetails.created_at
                })

                dispatch({type: 'GET_CURRENT_PLAN', payload: data.data})
                setIsModalVisible(false)
            } else {
                // Trigger the Google Tag Manager event for subscription error.
                triggerGoogleTagManagerEvent('plan_subscription_bc_error', {
                    'plan_subscription_bc_error_message': data.message,
                })
            }

            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: true,
                    alertMessage: data.message,
                    alertMessageType: data.error ? 'error' : 'success'
                },
            })

        })
        .catch(err => console.log(err))
}

export const updateSubscription = (token, data) => dispatch => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`,
        },
    }
    // post http://bc.eniture.com/api/create_subscription
    dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
            showAlertMessage: true,
            alertMessageType: 'loading',
        },
    })
    axios
        .post('cancel-subscription', data, config)
        .then(({data}) => {
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: false,
                },
            })
            if (!data.error) {
                dispatch({
                    type: 'GET_CURRENT_PLAN',
                    payload: data.data,
                })
            }
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: true,
                    alertMessage: data.message,
                    alertMessageType: data.error ? 'error' : 'success',
                },
            })

        })
        .catch(err => console.log(err))
}

export const changePaymentMethod = (data, token, setIsModalVisible) => dispatch => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`,
        },
    }
    dispatch({
        type: 'ALERT_MESSAGE',
        payload: {
            showAlertMessage: true,
            alertMessageType: 'loading',
        },
    })
    axios
        .post('change-payment-method', data, config)
        .then(({data}) => {
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: false,
                },
            })
            if (!data.error) {
                setIsModalVisible(false)
                dispatch({
                    type: 'GET_CURRENT_PLAN',
                    payload: data.data,
                })
            }
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    showAlertMessage: true,
                    alertMessage: data.message,
                    alertMessageType: data.error ? 'error' : 'success',
                },
            })

        })
        .catch(err => console.log(err))
}

const triggerGoogleTagManagerEvent = (event, data) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, ...data});
}
