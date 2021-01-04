import axios  from "axios";

export const installCarrier = (data) => {
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

export const changeCarrierStatus = (data) => {
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