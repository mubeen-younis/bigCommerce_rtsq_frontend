import axios  from "axios";

export const postData = (data, type, url) => {
    console.log(data)
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
    return dispatch => {
        axios.post(`${process.env.REACT_APP_ENITURE_API_URL}/${url}`,config, {
            data
        })
        .then(({data}) => {
            console.log(data)
        })
        .catch((error) => {

        })
    }
}

export const getCarrierDetails = (data) => {
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
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

        })
    }   
}

export const getConnectionSettings = () => {
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
    const data = {
        shop: 'dev-azm-1.mybigcommerce.com',
        carrierId: 1
    }

    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_conn_settings`, {
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
            if (data.settings.length > 0) {
                dispatch({
                    type: 'GET_QUOTE_SETTINGS',
                    payload: data.settings
                })
            }
        })
        .catch((error) => {

        })
    }
}