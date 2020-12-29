const initialState = {
    connectionSettings: null,
    locations: null,
    quoteSettings: null,
    carrriers: null,
    skeleton_loading: true
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
        case 'GET_SERVICES': // We had to change the term cause in BigCommerce we call CARRIERS as Eniture Apps
            return {
                ...state,
                services: action.payload 
            }
        case 'GET_CARRIERS':
            return {
                ...state,
                carrriers: action.payload 
            }  
        case 'GET_CARRIER_DETAILS':
            return {
                ...state,
                carrierDetails: action.payload
            }
        case 'SKELETON_LOADING':
            return {
                ...state,
                skeleton_loading: action.payload
            }

        default:
            break;
    }
    return state;
}

export default Reducer;