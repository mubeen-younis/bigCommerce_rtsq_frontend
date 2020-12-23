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