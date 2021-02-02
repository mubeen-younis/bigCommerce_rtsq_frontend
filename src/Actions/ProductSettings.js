import axios  from "axios";

export const submitProductSettings = (data, token) => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
         }
    };
    return dispatch => {
        //${process.env.ENITURE_API_URL}
        axios.post(`${process.env.REACT_APP_ENITURE_API_URL}/update_product`,config, {
            data
        })
        .then(({data}) => {
            console.log(data)
        })
        .catch((error) => {

        })
    }
}