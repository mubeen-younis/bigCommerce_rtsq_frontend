import types from './types';

const initialState = {
	connectionSettings: null,
	warehouse: null,
	dropships: null,
	quoteSettings: null,
	carriers: null,
	carriersSettings: null,
	plansInfo: null,
	boxSizes: null,
	services: null,
	filteredServices: null,
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
		case types.STORE:
			return {
				...state,
				store: action.payload,
			};

		case types.TOKEN:
			return {
				...state,
				token: action.payload,
			};

		case types.GET_CONNECTION_SETTINGS:
			return {
				...state,
				connectionSettings: action.payload,
			};

		case types.GET_QUOTE_SETTINGS:
			return {
				...state,
				quoteSettings: action.payload,
			};

		// Carrier Cases
		case types.CARRIER_ID:
			return {
				...state,
				carrierId: action.payload,
			};

		case types.GET_CARRIERS:
			return {
				...state,
				carriers: action.payload,
			};

		case types.GET_ADD_TAB_SETTING:
		case types.SAVE_CARRIER_TAB_SETTINGS:
			return {
				...state,
				carriersSettings: action.payload,
			};

		case types.GET_CARRIER_DETAILS:
			return {
				...state,
				carrierDetails: action.payload,
			};

		case types.GET_EN_CARRIERS:
			return {
				...state,
				enitureCarriers: action.payload,
			};

		case types.INSTALL_CARRIER:
			let newInstalledCarrier = {};

			state.carriers.forEach(carr => {
				if (carr.id === action.payload.carrier_id) {
					newInstalledCarrier = {
						...action.payload,
						name: carr.name,
						logo: carr.logo,
					};
				}
			});

			return {
				...state,
				installedCarriers: [...state.installedCarriers, newInstalledCarrier],
				carriers: state.carriers.filter(
					carrier => carrier.id !== action.payload.carrier_id
				),
			};

		case types.GET_INSTALLED_CARRIERS:
			return {
				...state,
				installedCarriers: action.payload,
			};

		case types.CHANGE_CARRIER_STATUS:
			return {
				...state,
				installedCarriers: state.installedCarriers.map(ic =>
					ic.id === action.payload.id
						? { ...ic, is_enabled: action.payload.is_enabled }
						: ic
				),
			};

		case types.FILTER_CARRIERS: {
			if (action.payload.length > 0) {
				const searchString = new RegExp(action.payload, 'gi');

				return {
					...state,
					filteredServices: state.services.filter(srvc =>
						srvc.carrier_name.match(searchString)
					),
				};
			} else {
				return {
					...state,
					filteredServices: null,
				};
			}
		}

		case types.GET_INSTALLED_CARRIER_PLAN_INFO:
			return {
				...state,
				plansInfo: action.payload,
			};

		// Carriers End

		// Location Cases
		case types.GET_LOCATIONS:
			return {
				...state,
				warehouse: action.payload.warehouse,
				dropships: action.payload.dropships,
			};

		case types.SAVE_LOCATION:
			const location = [...state.warehouse, ...state.dropships].filter(
				loc => loc.id === action.payload.id
			);

			if (location && location.length) {
				if (action.payload.type === 1) {
					return {
						...state,
						warehouse: state.warehouse.map(wh =>
							wh.id === action.payload.id ? action.payload : wh
						),
					};
				} else if (action.payload.type === 2) {
					return {
						...state,
						dropships: state.dropships.map(ds =>
							ds.id === action.payload.id ? action.payload : ds
						),
					};
				}
			} else {
				if (action.payload.type === 1) {
					return {
						...state,
						warehouse: [...state.warehouse, action.payload],
					};
				} else if (action.payload.type === 2) {
					return {
						...state,
						dropships: [...state.dropships, action.payload],
					};
				}
			}
			break;

		case types.DELETE_LOCATION:
			return {
				...state,
				warehouse: state.warehouse.filter(wh => wh.id !== action.payload),
				dropships: state.dropships.filter(wh => wh.id !== action.payload),
			};
		// Location End

		// Addon Cases
		case types.INSTALL_ADDON:
			let newInstalledAddon = {};

			state.addons.forEach(add => {
				if (add.id === action.payload.addon_id) {
					newInstalledAddon = {
						...action.payload,
						name: add.name,
						logo: add.logo,
					};
				}
			});

			return {
				...state,
				installedAddons: [...state.installedAddons, newInstalledAddon],
				addons: state.addons.filter(add => add.id !== action.payload.addon_id),
			};

		case types.GET_INSTALLED_ADDONS:
			return {
				...state,
				installedAddons: action.payload,
			};

		case types.CHANGE_ADDON_STATUS:
			return {
				...state,
				installedAddons: state.installedAddons.map(addon =>
					addon.id === action.payload.id
						? { ...addon, is_enabled: action.payload.is_enabled }
						: addon
				),
			};

		case types.CHANGE_ADDON_SUSPEND_STATUS:
			return {
				...state,
				installedAddons: state.installedAddons.map(addon =>
					addon.id === action.payload.id
						? { ...addon, is_suspend: action.payload.is_suspend }
						: addon
				),
			};

		case types.GET_ADDON_ADDRESS_SETTING:
		case types.CHANGE_DEFAULT_ADDRESS:
			return {
				...state,
				addonSettings: action.payload,
			};

		case types.GET_ADDONS:
			return {
				...state,
				addons: action.payload,
			};
		// Addons End

		case types.GET_SERVICES: // We had to change the term cause in BigCommerce we call CARRIERS as Eniture Apps
			return {
				...state,
				services: action.payload,
			};

		case types.SKELETON_LOADING:
			return {
				...state,
				skeleton_loading: action.payload,
			};

		case types.ALERT_MESSAGE:
			return {
				...state,
				showAlertMessage: action.payload.showAlertMessage,
				alertMessage: action.payload.alertMessage,
				alertMessageType: action.payload.alertMessageType,
			};

		case types.GET_GOOGLE_LOCATION_RESPONSE:
			return {
				...state,
				googleLocationResponse: action.payload,
			};

		case types.GET_ALL_PRODUCTS:
			return {
				...state,
				allProducts: action.payload,
			};

		case types.GET_PLANS_INFO:
			return {
				...state,
				plansInfo: action.payload,
			};

		case types.CONFIRM_MODAL:
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

		case types.RAD_PLANS:
			if (
				action.payload?.severity === 'SUCCESS' &&
				action.payload?.Message.includes(
					'disabled the Residential Address Detection plugin'
				)
			) {
				return {
					...state,
					radPlans: {
						...state.radPlans,
						...action.payload,
					},
				};
			}

			return {
				...state,
				radPlans: action.payload,
			};

		case types.GET_BOX_SIZES:
			return {
				...state,
				boxSizes: action.payload,
			};

		case types.ADD_BOX_SIZE:
			return {
				...state,
				boxSizes: [
					...state.boxSizes,
					{ ...action.payload, is_available: action.payload.is_available ? 1 : 0 },
				],
			};

		case types.DELETE_BOX_SIZE:
			return {
				...state,
				boxSizes: state.boxSizes.filter(bs => bs.id !== +action.payload),
			};

		case types.UPDATE_BOX_SIZE:
			return {
				...state,
				boxSizes: state.boxSizes.map(bs =>
					bs.id === action.payload.id ? action.payload : bs
				),
			};

		default:
			break;
	}
	return state;
};

export default Reducer;
