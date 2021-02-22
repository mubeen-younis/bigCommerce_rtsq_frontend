const initialState = {
  connectionSettings: null,
  warehouse: null,
  dropships: null,
  quoteSettings: null,
  carrriers: null,
  carriersSettings: null,
  skeleton_loading: true,
  showAlertMessage: false,
  alertMessageType: null,
  alertMessage: null,
  googleLocationResponse: null,
  allProducts: null,
  token: null,
  confirmModal: null,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "STORE":
      return {
        ...state,
        store: action.payload,
      };
    case "TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    
    case "CARRIER_ID":
      return {
        ...state,
        carrierId: action.payload,
      };  
    case "GET_CONNECTION_SETTINGS":
      return {
        ...state,
        connectionSettings: action.payload,
      };

    case "GET_QUOTE_SETTINGS":
      return {
        ...state,
        quoteSettings: action.payload,
      };
    case "GET_LOCATIONS":
      return {
        ...state,
        warehouse: action.payload.warehouse,
        dropships: action.payload.dropships,
      };

    case "DELETE_LOCATION":
      return {
        ...state,
        warehouse: state.warehouse.filter((wh) => wh.id !== action.payload),
        dropships: state.dropships.filter((wh) => wh.id !== action.payload),
      };

    case "GET_SERVICES": // We had to change the term cause in BigCommerce we call CARRIERS as Eniture Apps
      return {
        ...state,
        services: action.payload,
      };
    case "GET_CARRIERS":
      return {
        ...state,
        carriers: action.payload,
      };
    case "GET_ADD_TAB_SETTING":
      return {
        ...state,
        carriersSettings: action.payload,
      };
    case "GET_CARRIER_DETAILS":
      return {
        ...state,
        carrierDetails: action.payload,
      };
    case "SKELETON_LOADING":
      return {
        ...state,
        skeleton_loading: action.payload,
      };

    case "ALERT_MESSAGE":
      return {
        ...state,
        showAlertMessage: action.payload.showAlertMessage,
        alertMessage: action.payload.alertMessage,
        alertMessageType: action.payload.alertMessageType,
      };

    case "GET_EN_CARRIERS":
      return {
        ...state,
        enitureCarriers: action.payload,
      };

    case "GET_INSTALLED_CARRIERS":
      return {
        ...state,
        installedCarriers: action.payload,
      };

    case "CHANGE_CARRIER_STATUS":
      return {
        ...state,
        installedCarriers: state.installedCarriers.map((ic) =>
          ic.carrier_id === action.payload.carrier_id ? action.payload : ic
        ),
      };

    case "GET_INSTALLED_ADDONS":
      return {
        ...state,
        installedAddons: action.payload,
      };

    case "CHANGE_ADDON_STATUS":
      return {
        ...state,
        installedAddons: state.installedAddons.map((ic) =>
          ic.addon_id === action.payload.addon_id ? action.payload : ic
        ),
      };

    case "GET_GOOGLE_LOCATION_RESPONSE":
      return {
        ...state,
        googleLocationResponse: action.payload,
      };
    case "GET_ALL_PRODUCTS":
      return {
        ...state,
        allProducts: action.payload,
      };
    case "GET_PLANS_INFO":
      return {
        ...state,
        plansInfo: action.payload,
      };
    case "CONFIRM_MODAL":
      return {
        ...state,
        confirmModal: {
          on: action.payload.on,
          ok: action.payload.ok,
          cancel: action.payload.cancel,
          title: action.payload.title,
          body: action.payload.body,
        },
      };
    
    case "RAD_PLANS":
      return {
        ...state,
        radPlans: action.payload
      };  

    default:
      break;
  }
  return state;
};

export default Reducer;
