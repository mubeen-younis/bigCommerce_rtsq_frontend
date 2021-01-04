const initialState = {
    connectionSettings: null,
    locations: null,
    quoteSettings: null,
    carrriers: null,
    skeleton_loading: true,
    showAlertMessage: false,
    alertMessageType: null,
    alertMessage: null
}

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'STORE':
            return {
                ...state,
                store: action.payload
        }
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
                services: action.payload 
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

        case 'ALERT_MESSAGE':
            return {
                ...state,
                showAlertMessage: action.payload.showAlertMessage,
                alertMessage: action.payload.alertMessage,
                alertMessageType: action.payload.alertMessageType
            }
            
        case 'GET_EN_CARRIERS':
            return {
                ...state,
                enitureCarriers: action.payload
            }

        case 'GET_INSTALLED_CARRIERS':
            return {
                ...state,
                installedCarriers: action.payload
            }

        default:
            break;
    }
    return state;
}

export default Reducer;