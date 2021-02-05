import axios  from "axios";
export const submitProductSettings = (data, token) => {
    const config = {
        headers: {
            authorization: `Bearer eyJpdiI6Inl2aERGVi9td2dvTzlaRTl0aGFxelE9PSIsInZhbHVlIjoiMjJIZXF0ekdQUzB5d1M4ZXAyZTBYZz09IiwibWFjIjoi`
         }
    };
    return dispatch => {
        //${process.env.ENITURE_API_URL}
        axios.post(`${process.env.REACT_APP_ENITURE_API_URL}/update_product`, {
            data
        }, config)
        .then(({data}) => {
            console.log(data)
        })
        .catch((error) => {

        })
    }
}