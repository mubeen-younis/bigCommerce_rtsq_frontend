import axios  from "axios";

export const getGoogleResponse = (data) => {
    return dispatch => {
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/google_location`, data)
        .then(({data}) => {
            if (!data.error) {
                dispatch({
                    type: 'GET_GOOGLE_LOCATION_RESPONSE',
                    payload: JSON.parse(data.response)
                })
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