const initialState = {
    connectionSettings: null,
    warehouse: null,
    dropships: null,
    quoteSettings: null,
    carrriers: null,
    skeleton_loading: true,
    showAlertMessage: false,
    alertMessageType: null,
    alertMessage: null,
    googleLocationResponse: null,
    allProducts: null,
    token: null,
    confirmModal: null
}

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'STORE':
            return {
                ...state,
                store: action.payload
        }
        case 'TOKEN':
            return {
                ...state,
                token: action.payload
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
                warehouse: action.payload.warehouse,
                dropships: action.payload.dropships
            }
        case 'GET_SERVICES': // We had to change the term cause in BigCommerce we call CARRIERS as Eniture Apps
            return {
                ...state,
                services: action.payload 
            }
        case 'GET_CARRIERS':
            return {
                ...state,
                carriers: action.payload 
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

        case 'GET_GOOGLE_LOCATION_RESPONSE':
            return {
                ...state,
                googleLocationResponse: action.payload
            }
        case 'GET_ALL_PRODUCTS':
            return {
                ...state,
                allProducts: action.payload
            }
        case 'CONFIRM_MODAL':
            return {
                ...state,
                confirmModal: {
                    on: action.payload.on,
                    ok: action.payload.ok,
                    cancel: action.payload.cancel,
                    title: action.payload.title,
                    body: action.payload.body
                }
            }    

        default:
            break;
    }
    return state;
}

export default Reducer;