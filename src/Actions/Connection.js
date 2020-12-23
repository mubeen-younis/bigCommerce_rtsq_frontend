import axios  from "axios";

export const submitConnectionSettings = (data) => {
    const token = '';
    const config = {
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
         } //Authorization: `Bearer ${token}`
    };
    return dispatch => {
        //${process.env.ENITURE_API_URL}
        axios.post(`http://127.0.0.1:8000/api/submit_connection_settings`,config, {
            data
        })
        .then(({data}) => {
            console.log(data)
        })
        .catch((error) => {

        })
    }
}