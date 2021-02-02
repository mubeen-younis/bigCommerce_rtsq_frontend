import axios  from "axios";
const config = {
    headers: {
        authorization : `Bearer eyJpdiI6Inl2aERGVi9td2dvTzlaRTl0aGFxelE9PSIsInZhbHVlIjoiMjJIZXF0ekdQUzB5d1M4ZXAyZTBYZz09IiwibWFjIjoi`
     } //Authorization: `Bearer ${token}`
};
export const getGoogleResponse = (zipcode) => {
    return dispatch => {
        dispatch({
            type: 'ALERT_MESSAGE',
            payload: {
                showAlertMessage: true,
                alertMessageType: 'loading'
            }
        })
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_loc_from_zip/${zipcode}`,config)
        .then(({data}) => {
            if (!data.error) {
                dispatch({
                    type: 'GET_GOOGLE_LOCATION_RESPONSE',
                    payload: data.data
                })
            }
            dispatch({
                type: 'ALERT_MESSAGE',
                payload: {
                    alertMessage: data.message,
                    showAlertMessage: data.error,
                    alertMessageType: data.error ? 'error' : 'success'
                }
            })
        })
        .catch((error) => {

        })

    }
}