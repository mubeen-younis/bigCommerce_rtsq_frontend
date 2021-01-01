import axios  from "axios";

export const postData = (data, type, url) => {
    return dispatch => {
        axios.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`, data)
        .then(({data}) => {
            if (!data.error) {
                if (data.value != undefined) {
                    dispatch({
                        type: type,
                        payload: JSON.parse(data.data.value)
                    })
                }
            }
            console.log('data' , data)
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    alertMessage: data.message,
                    showAlertMessage: true,
                    alertMessageType: data.error ? 'error' : 'success'
                }
            })
        })
        .catch((error) => {

        })

    }
}

export const getCarrierDetails = (data) => {
    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carrier_info`, {
            data
        })
        .then(({data}) => {
            if (data.settings.length > 0) {
                dispatch({
                    type: 'GET_CONNECTION_SETTINGS',
                    payload: data.settings
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }   
}

export const getConnectionSettings = () => {
    const data = {
        shop: 'dev-azm-1.mybigcommerce.com',
        carrierId: 1
    }

    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_conn_settings`, {
            data
        })
        .then(({data}) => {
            console.log(data)
            console.log(JSON.parse(data.data.value))
            dispatch({
                type: 'GET_CONNECTION_SETTINGS',
                payload: JSON.parse(data.data.value)
            })
            dispatch({
                type: 'SKELETON_LOADING',
                payload: false
            })
        })
        .catch((error) => {
            dispatch({
                type: 'SKELETON_LOADING',
                payload: false
            })
        })
    }
}

export const getLocations = () => {
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
    const data = {
        shop: 'dev-azm-1.mybigcommerce.com'
    }

    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_locations`, {
            data
        })
        .then(({data}) => {
            if (data.locations.length > 0) {
                dispatch({
                    type: 'GET_LOCATIONS',
                    payload: data.locations
                })
            }
        })
        .catch((error) => {

        })
    }
}

export const getQuoteSettings = () => {
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
    const data = {
        shop: 'dev-azm-1.mybigcommerce.com'
    }

    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_qoute_settings`, {
            data
        })
        .then(({data}) => {
            
            //if (data.data.length > 0) {
                dispatch({
                    type: 'GET_QUOTE_SETTINGS',
                    payload: JSON.parse(data.data.value)
                })
            //}
        })
        .catch((error) => {

        })
    }
}

export const dismissAlert = () => {
    return dispatch => {
        dispatch({
            type: 'ALERT_MESSAGE',
            payload: {
                alertMessage: null,
                showAlertMessage: false,
                alertMessageType: null
            }
        })
    }
}

export const setStore = (store) => {
    console.log('store action', store)
    localStorage.setItem('store', store)
    return dispatch => {
        dispatch({
            type: 'STORE',
            payload: store
        })
    }
}