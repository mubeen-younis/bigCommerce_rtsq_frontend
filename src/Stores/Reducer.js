const initialState = {
    connectionSettings: null,
    locations: null,
    quoteSettings: null,
    carrriers: null
}

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CONNECTION_SETTINGS':
            return {
                ...state,
                connectionSettings: action.payload 
            }

        case 'GET_QUOTE_SETTINGS':
            return {
                ...state,
                quoteSettings: action.payload 
            }
        case 'GET_LOCATIONS':
            return {
                ...state,
                locations: action.payload 
            }
        case 'GET_CARRIERS':
            return {
                ...state,
                carrriers: action.payload 
            }

        default:
            break;
    }
    return state;
}

export default Reducer;