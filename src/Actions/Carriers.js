import axios  from "axios";

export const getServices = () => {
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
        axios.get(`${process.env.REACT_APP_ENITURE_API_URL}/get_carriers`, {
            data
        })
        .then(({data}) => {
            if (data.carriers.length > 0) {
                dispatch({
                    type: 'GET_SERVICES',
                    payload: data.carriers
                })
            }
        })
        .catch((error) => {

        })
    }
}