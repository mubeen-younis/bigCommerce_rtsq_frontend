import types from './types'

const initialState = {
	connectionSettings: null,
	warehouse: [],
	dropships: [],
	quoteSettings: null,
	carriersSettings: null,
	plansInfo: null,
	currentPlan: null,
	sbsPlans: null,
	boxSizes: null,
	services: null,
	filteredServices: null,
	skeleton_loading: true,
	showAlertMessage: false,
	alertMessageType: null,
	alertMessage: null,
	googleLocationResponse: null,
	allProducts: null,
	productDetail: null,
	productsPagination: null,
	orders: null,
	orderwidget: null,
	ordersPagination: null,
	filteredProducts: null,
	filteredOrders: null,
	token: null,
	confirmModal: null,
	activeMenu: '99',
	searched_order: null,
	searched_product: null,
	importIndexes: null,
	plans: null,
	store: null,
	carrier_type: 'NEWAPI',
	gtzCarriers: {
		GTZ: [],
		CRS: [],
		NEWAPI: [],
	},
	insuranceStatus: false,
	productBoxes: null,
	boxesType: null,
	boxSizeInfo: {
		id: null,
		type: '',
	},
	boxSizeStatus: false,
	isFedexSmallCarrier: false,
	shippingGroups: null,
	getPayments: null,
	fdoCouponInfo: null,
	fdoCouponCarrierInfo: null,
	/* Dbsc states */
	shippingProfiles: null,
	shippingClasses: null,
	dbscBigComZones: null,
	dbscOtherSettings: null,
	modalData: {
		visible: false,
		title: '',
		data: null,
		action: '',
		url: '',
		type: '',
	},
	isUspsSmallCarrier: false,
	isUpsSmallCarrier: false,
	actionButtons: {
		visible: false,
		id: null,
	},
	dayRossApiType: 'general_freight',
	UpsSmallApiType: 'legacy_api',
	UpsLtlApiType: 'legacy_api',
	WweSmallApiType: 'legacy_api',
	WweLtlApiType: 'legacy_api',
	FedexSmallApiType: 'legacy_api',
	FedexLTLApiType: 'legacy_api',
	/* Pallet packaging */
	palletPlans: null,
	radSettings: null,
	/* Weight Threshold */
	thresholdSetting: null,
}

const Reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.STORE:
			return {
				...state,
				store: action.payload,
			}

		case types.TOKEN:
			return {
				...state,
				token: action.payload,
			}

		case types.GET_PLANS:
			return {
				...state,
				plans: action.payload,
			}

		case types.GET_CONNECTION_SETTINGS:
			return {
				...state,
				connectionSettings: action.payload,
			}

		case types.GET_QUOTE_SETTINGS:
			return {
				...state,
				quoteSettings: action.payload,
			}

		// Carrier Cases
		case types.CARRIER_ID:
			return {
				...state,
				carrierId: action.payload,
			}

		case types.ADDON_ID:
			return {
				...state,
				addonId: action.payload,
			}

		case types.GET_CARRIERS:
			return {
				...state,
				carriers: action.payload,
			}

		case types.GET_ADD_TAB_SETTING:
		case types.SAVE_CARRIER_TAB_SETTINGS:
			return {
				...state,
				carriersSettings: action.payload,
			}

		case types.GET_CARRIER_DETAILS:
			return {
				...state,
				carrierDetails: action.payload,
			}

		case types.GET_EN_CARRIERS:
			return {
				...state,
				enitureCarriers: action.payload,
			}

		case types.INSTALL_CARRIER:
			let newInstalledCarrier = {}

			state.carriers.forEach(carr => {
				if (carr.id === action.payload.carrier_id) {
					newInstalledCarrier = {
						...action.payload,
						name: carr.name,
						logo: carr.logo,
						carrier_type: carr.carrier_type,
						slug: carr.slug,
					}
				}
			})

			return {
				...state,
				installedCarriers: [...state.installedCarriers, newInstalledCarrier],
				carriers: state.carriers.filter(
					carrier => carrier.id !== action.payload.carrier_id
				),
			}

		case types.GET_INSTALLED_CARRIERS:
			return {
				...state,
				installedCarriers: action.payload,
			}

		case types.CHANGE_CARRIER_STATUS:
			return {
				...state,
				installedCarriers: state.installedCarriers.map(ic =>
					ic.id === action.payload.id
						? { ...ic, is_enabled: action.payload.is_enabled }
						: ic
				),
			}

		case types.FILTER_CARRIERS: {
			if (action.payload.length > 0) {
				const searchString = new RegExp(action.payload, 'gi')

				return {
					...state,
					filteredServices: state.services.filter(srvc =>
						srvc.carrier_name.match(searchString)
					),
				}
			} else {
				return {
					...state,
					filteredServices: null,
				}
			}
		}

		case types.GET_INSTALLED_CARRIER_PLAN_INFO:
			return {
				...state,
				plansInfo: action.payload,
			}

		case types.GET_CURRENT_PLAN:
			return {
				...state,
				currentPlan: action.payload,
			}
		// Carriers End

		// Location Cases
		case types.GET_LOCATIONS:
			return {
				...state,
				warehouse: action.payload.warehouse,
				dropships: action.payload.dropships,
			}

		case types.SAVE_LOCATION:
			const location = [...state.warehouse, ...state.dropships].filter(
				loc => loc.id === action.payload.id
			)
			if (location && location.length) {
				if (action.payload.type === 1) {
					return {
						...state,
						warehouse: state.warehouse.map(wh =>
							wh.id === action.payload.id ? action.payload : wh
						),
					}
				} else if (action.payload.type === 2) {
					return {
						...state,
						dropships: state.dropships.map(ds =>
							ds.id === action.payload.id ? action.payload : ds
						),
					}
				}
			} else {
				if (action.payload.type === 1) {
					return {
						...state,
						warehouse: [...state.warehouse, action.payload],
					}
				} else if (action.payload.type === 2) {
					return {
						...state,
						dropships: [...state.dropships, action.payload],
					}
				}
			}
			break

		case types.DELETE_LOCATION:
			return {
				...state,
				warehouse: state.warehouse.filter(wh => wh.id !== action.payload),
				dropships: state.dropships.filter(wh => wh.id !== action.payload),
			}
		// Location End

		// Addon Cases
		case types.INSTALL_ADDON:
			let newInstalledAddon = {}

			state.addons.forEach(add => {
				if (add.id === action.payload.addon_id) {
					newInstalledAddon = {
						...action.payload,
						name: add.name,
						logo: add.logo,
					}
				}
			})

			return {
				...state,
				installedAddons: [...state.installedAddons, newInstalledAddon],
				addons: state.addons.filter(
					add => add.id !== action.payload.addon_id
				),
			}

		case types.GET_INSTALLED_ADDONS:
			return {
				...state,
				installedAddons: action.payload,
			}

		case types.CHANGE_ADDON_STATUS:
			return {
				...state,
				installedAddons: state.installedAddons.map(addon =>
					addon.id === action.payload.id
						? { ...addon, is_enabled: action.payload.is_enabled }
						: addon
				),
			}

		case types.CHANGE_ADDON_SUSPEND_STATUS:
			return {
				...state,
				installedAddons: state.installedAddons.map(addon =>
					addon.id === action.payload.id
						? { ...addon, is_suspend: action.payload.is_suspend }
						: addon
				),
			}

		case types.GET_ADDON_ADDRESS_SETTING:
		case types.CHANGE_DEFAULT_ADDRESS:
			return {
				...state,
				addonSettings: action.payload,
			}

		case types.GET_ADDONS:
			return {
				...state,
				addons: action.payload,
			}
		// Addons End

		case types.GET_SERVICES: // We had to change the term cause in BigCommerce we call CARRIERS as Eniture Apps
			return {
				...state,
				services: action.payload,
			}

		case types.SKELETON_LOADING:
			return {
				...state,
				skeleton_loading: action.payload,
			}

		case types.ALERT_MESSAGE:
			return {
				...state,
				showAlertMessage: action.payload.showAlertMessage,
				alertMessage: action.payload.alertMessage,
				alertMessageType: action.payload.alertMessageType,
			}

		case types.GET_GOOGLE_LOCATION_RESPONSE:
			return {
				...state,
				googleLocationResponse: action.payload,
			}

		case types.GET_ALL_PRODUCTS:
			return {
				...state,
				allProducts: action.payload,
			}
		case types.GET_ALL_LOGS:
			return {
				...state,
				allLogs: action.payload,
			}
		case types.GET_LOG_DETAIL:
			return {
				...state,
				logDetail: action.payload,
			}
		case types.LOGS_PAGINATION:
			return {
				...state,
				logsPagination: action.payload,
			}
		case types.GET_PRODUCT_DETAIL:
			return {
				...state,
				productDetail: action.payload,
			}
		case types.PRODUCTS_PAGINATION:
			return {
				...state,
				productsPagination: action.payload,
			}

		case types.FILTER_PRODUCTS:
			if (action.payload.length > 0) {
				const searchString = new RegExp(action.payload, 'gi')

				return {
					...state,
					filteredProducts: state.allProducts.filter(
						pdct =>
							pdct.name.match(searchString) ||
							pdct.sku.match(searchString)
					),
				}
			} else {
				return {
					...state,
					filteredProducts: null,
				}
			}

		case types.UPDATE_PRODUCT_SETTINGS:
			return {
				...state,
				allProducts: state.allProducts.map(pdct =>
					pdct.id === action.payload.id ? action.payload : pdct
				),
			}

		case types.GET_PLANS_INFO:
			return {
				...state,
				plansInfo: action.payload,
			}

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
			}

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
				}
			}

			return {
				...state,
				radPlans: action.payload,
			}

		case types.SBS_PLANS: {
			if (
				action.payload?.severity === 'SUCCESS' &&
				action.payload?.Message.includes(
					'disabled the Residential Address Detection plugin'
				)
			) {
				return {
					...state,
					sbsPlans: {
						...state.sbsPlans,
						...action.payload,
					},
				}
			}

			return {
				...state,
				sbsPlans: action.payload,
			}
		}

		case types.PLT_PLANS: {
			if (
				action.payload?.severity === 'SUCCESS' &&
				action.payload?.Message.includes(
					'disabled the Pallet Packaging Detection plugin'
				)
			) {
				return {
					...state,
					palletPlans: {
						...state.palletPlans,
						...action.payload,
					},
				}
			}

			return {
				...state,
				palletPlans: action.payload,
			}
		}

		case types.GET_BOX_SIZES:
			return {
				...state,
				boxSizes: action.payload,
			}

		case types.ADD_BOX_SIZE:
			return {
				...state,
				boxSizes: [
					...state.boxSizes,
					{
						...action.payload,
						is_available: action.payload.is_available ? 1 : 0,
					},
				],
			}

		case types.DELETE_BOX_SIZE:
			return {
				...state,
				boxSizes: state.boxSizes.filter(bs => bs.id !== +action.payload),
			}

		case types.UPDATE_BOX_SIZE:
			return {
				...state,
				boxSizes: state.boxSizes.map(bs =>
					bs.id === action.payload.id ? action.payload : bs
				),
			}

		case types.SET_ACTIVE_MENU:
			return {
				...state,
				activeMenu: action.payload,
			}

		case types.GET_ORDERS:
			return {
				...state,
				orders: action.payload,
			}
		case types.SEARCHED_ORDER:
			return {
				...state,
				searched_order: action.payload,
			}
		case types.SEARCHED_PRODUCT:
			return {
				...state,
				searched_product: action.payload,
			}
		case types.ORDERS_PAGINATION:
			return {
				...state,
				ordersPagination: action.payload,
			}
		case types.FILTER_ORDERS:
			if (action.payload.length > 0) {
				const searchString = new RegExp(action.payload, 'gi')

				return {
					...state,
					filteredOrders: state.orders.filter(
						ordr =>
							ordr.id.toString().match(searchString) ||
							ordr.total_inc_tax.match(searchString)
					),
				}
			} else {
				return {
					...state,
					filteredOrders: null,
				}
			}
		case types.GET_ORDER_WIDGET:
			return {
				...state,
				orderwidget: action.payload,
			}

		case types.GET_PACKAGE_DETAIL:
			return {
				...state,
				packaging: action.payload,
			}

		case types.UPDATE_ORDER_SETTINGS:
			return {
				...state,
				orders: state.orders.map(odr =>
					odr.id === action.payload.id ? action.payload : odr
				),
			}

		case types.IMPORT_INDEXES:
			return {
				...state,
				importIndexes: action.payload,
			}

		case types.DOWNLOAD_LINK:
			return {
				...state,
				exportCSVDownloadLink: action.payload,
			}

		case types.SET_CARRIER_TYPE: {
			return {
				...state,
				carrier_type: action.payload,
			}
		}

		case types.SET_GTZ_CARRIERS: {
			return {
				...state,
				gtzCarriers: action.payload,
			}
		}
		case types.SET_INSURANCE_STATUS:
			return {
				...state,
				insuranceStatus: action.payload,
			}

		case types.GET_PRODUCT_BOX_SIZES: {
			return {
				...state,
				productBoxes: action.payload,
			}
		}

		case types.ADD_PRODUCT_BOX_SIZE: {
			return {
				...state,
				productBoxes: state.productBoxes.map(pb =>
					pb.id === action.payload.product_id
						? {
								...pb,
								boxes: [...pb.boxes, action.payload],
						  }
						: pb
				),
			}
		}
		case types.SET_FEDEX_SMALL_CARRIER: {
			return {
				...state,
				isFedexSmallCarrier: action.payload,
			}
		}
		case types.SET_USPS_SMALL_CARRIER: {
			return {
				...state,
				isUspsSmallCarrier: action.payload,
			}
		}
		case types.SET_UPS_SMALL_CARRIER: {
			return {
				...state,
				isUpsSmallCarrier: action.payload,
			}
		}
		/* Shipping Groups */
		case types.GET_SHIPPING_GROUPS:
			return {
				...state,
				shippingGroups: action.payload,
			}
		case types.ADD_SHIPPING_GROUP:
			return {
				...state,
				shippingGroups: [...state.shippingGroups, action.payload],
			}
		case types.DELETE_SHIPPING_GROUP:
			return {
				...state,
				shippingGroups: state.shippingGroups.filter(
					sg => sg.uuid !== action.payload
				),
			}
		case types.UPDATE_SHIPPING_GROUP:
			return {
				...state,
				shippingGroups: state.shippingGroups.map(sg =>
					sg.uuid === action.payload.uuid ? action.payload : sg
				),
			}
		/* Get Payments Invoice */	
		case types.GET_PAYMENTS:
		return {
			...state,
			getPayments: action.payload
		}
		/* Get States and Provices */
		case types.GET_STATES_PROVINCES:
			return {
				...state,
				statesProvinces: action.payload,
			}

		/* Get Carrier Services */
		case types.GET_CARRIER_SERVICES:
			return {
				...state,
				carrierServices: action.payload,
			}
		/* Get Store Categories */
		case types.GET_STORE_CATEGORIES:
			return {
				...state,
				storeCategories: action.payload,
			}

		/* Get Store Brands */
		case types.GET_STORE_BRANDS:
			return {
				...state,
				storeBrands: action.payload,
			}

		/* Shipping Rules */
		case types.GET_SHIPPING_RULES:
			return {
				...state,
				shippingRules: action.payload,
			}
		case types.ADD_SHIPPING_RULE:
			return {
				...state,
				shippingRules: [...state.shippingRules, action.payload],
			}
		case types.DELETE_SHIPPING_RULE:
			return {
				...state,
				shippingRules: state.shippingRules.filter(
					sg => sg.uuid !== action.payload
				),
			}
		case types.UPDATE_SHIPPING_RULE:
			return {
				...state,
				shippingRules: state.shippingRules.map(sg =>
					sg.uuid === action.payload.uuid ? action.payload : sg
				),
			}

		case types.GET_FDO_COUPON_INFO:
			return {
				...state,
				fdoCouponInfo: action.payload,
			}
		case types.GET_FDO_COUPON_CARRIER_INFO: {
			return {
				...state,
				fdoCouponCarrierInfo: action.payload,
			}
		}

		/* Shipping Classes */
		case types.GET_DBSC_CLASSES:
			return {
				...state,
				shippingClasses: action.payload,
			}
		case types.ADD_DBSC_CLASS:
			return {
				...state,
				shippingClasses: [...state.shippingClasses, action.payload],
			}
		case types.UPDATE_DBSC_CLASS:
			return {
				...state,
				shippingClasses: state.shippingClasses.map(sc =>
					sc.id === action.payload.id ? action.payload : sc
				),
			}
		case types.DELETE_DBSC_CLASS:
			return {
				...state,
				shippingClasses: state.shippingClasses.filter(
					sc => sc.id !== action.payload
				),
			}

		/* Dbsc other settings */

		case types.SET_DBSC_OTHER_SETTINGS:
		case types.GET_DBSC_OTHER_SETTINGS:
			return {
				...state,
				dbscOtherSettings: action.payload,
			}

		/* Shipping Profiles */
		case types.GET_DBSC_PROFILES:
			return {
				...state,
				shippingProfiles: action.payload,
			}
		case types.ADD_DBSC_PROFILE:
			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					store_profiles: [
						...state?.shippingProfiles?.store_profiles,
						action.payload,
					],
				},
			}
		case types.UPDATE_DBSC_PROFILE:
			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					store_profiles: state?.shippingProfiles?.store_profiles?.map(
						sp => (sp.id === action.payload.id ? action.payload : sp)
					),
				},
			}
		case types.DELETE_DBSC_PROFILE:
			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					store_profiles: state?.shippingProfiles?.store_profiles?.filter(
						sp => sp.id !== action.payload
					),
				},
			}

		/* Shipping Origins */
		case types.ADD_DBSC_ORIGIN: {
			let origin_id = null,
				profile_id = null,
				isNew = false
			if (action.payload.newOrigin && action.payload.origin) {
				origin_id = action.payload.origin.origin_id
				profile_id = action.payload.newOrigin.profile_id
				isNew = true
			} else {
				origin_id = action.payload?.origin_id
			}
			const prevOrigins = state.shippingProfiles.origin
				? state.shippingProfiles.origin[origin_id]
				: []

			const updatedData = {
				...state.shippingProfiles,
				origin: {
					...(state.shippingProfiles?.origin ?? []),
					[origin_id]: [
						...(prevOrigins ?? []),
						isNew ? action.payload.origin : action.payload,
					],
				},
			}

			if (isNew) {
				updatedData['origins'][profile_id] = [
					...(state.shippingProfiles.origins[profile_id] ?? []),
					action.payload.newOrigin,
				]
			}

			return {
				...state,
				shippingProfiles: updatedData,
			}
		}
		case types.UPDATE_DBSC_ORIGIN: {
			const { id, origin_id } = action.payload
			const updatedOrigins = state.shippingProfiles.origin[origin_id].map(
				org => (org.id === id ? action.payload : org)
			)

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					origin: {
						...state.shippingProfiles.origin,
						[origin_id]: updatedOrigins,
					},
				},
			}
		}
		case types.DELETE_DBSC_ORIGIN: {
			const { origin_id, id } = action.payload
			const updatedOrigins = state.shippingProfiles.origin[origin_id].filter(
				org => org.id !== id
			)

			const updatedData = {
				...state.shippingProfiles,
				origin: {
					...state.shippingProfiles.origin,
					[origin_id]: updatedOrigins,
				},
			}

			return {
				...state,
				shippingProfiles: updatedData,
			}
		}

		/* Shipping Zones */
		case types.ADD_DBSC_ZONE: {
			const { dbsc_origin_id } = action.payload

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					zones: {
						...(state.shippingProfiles.zones ?? []),
						[dbsc_origin_id]: [
							...(state.shippingProfiles.zones[dbsc_origin_id] ?? []),
							action.payload,
						],
					},
				},
			}
		}
		case types.UPDATE_DBSC_ZONE: {
			const { id, dbsc_origin_id } = action.payload
			const updatedZones = state?.shippingProfiles?.zones[dbsc_origin_id]?.map(
				zone => (zone.id === id ? action.payload : zone)
			)

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					zones: {
						...state.shippingProfiles.zones,
						[dbsc_origin_id]: updatedZones,
					},
				},
			}
		}
		case types.DELETE_DBSC_ZONE: {
			const { id, origin_id } = action.payload
			const updatedZones = state?.shippingProfiles?.zones[origin_id]?.filter(
				zone => zone.id !== id
			)

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					zones: {
						...state.shippingProfiles.zones,
						[origin_id]: updatedZones,
					},
				},
			}
		}

		/* Shipping Rates */
		case types.ADD_DBSC_RATE: {
			const { dbsc_shipping_zone_id } = action.payload
			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					rates: {
						...(state.shippingProfiles.rates ?? []),
						[dbsc_shipping_zone_id]: [
							...(state.shippingProfiles.rates[
								dbsc_shipping_zone_id
							] ?? []),
							action.payload,
						],
					},
				},
			}
		}
		case types.UPDATE_DBSC_RATE: {
			const { id, dbsc_shipping_zone_id } = action.payload
			const updatedRates = state.shippingProfiles.rates[
				dbsc_shipping_zone_id
			].map(rate => (rate.id === id ? action.payload : rate))

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					rates: {
						...state.shippingProfiles.rates,
						[dbsc_shipping_zone_id]: updatedRates,
					},
				},
			}
		}
		case types.DELETE_DBSC_RATE: {
			const { id, zone_id } = action.payload
			const updatedRates = state.shippingProfiles.rates[zone_id].filter(
				rate => rate.id !== id
			)

			return {
				...state,
				shippingProfiles: {
					...state.shippingProfiles,
					rates: {
						...state.shippingProfiles.rates,
						[zone_id]: updatedRates,
					},
				},
			}
		}

		case types.SET_MODAL_DATA:
			return {
				...state,
				modalData: { ...state.modalData, ...action.payload },
			}
		case types.GET_DBSC_BC_ZONES:
			return {
				...state,
				dbscBigComZones: action.payload,
			}

		case types.SET_ACTION_BUTTONS_VISIBILITY:
			return {
				...state,
				actionButtons: {
					visible: action.payload.visible,
					id: action.payload.id,
				},
			}

		case types.SET_DAYROSS_API_TYPE:
			return {
				...state,
				dayRossApiType: action.payload,
			}

		case types.SET_UPS_SMALL_API_TYPE:
			return {
				...state,
				UpsSmallApiType: action.payload,
			}

		case types.SET_WWE_SMALL_API_TYPE:
			return {
				...state,
				WweSmallApiType: action.payload,
			}

		case types.SET_WWE_LTL_API_TYPE:
			return {
				...state,
				WweLtlApiType: action.payload,
			}
			
		case types.SET_UPS_LTL_API_TYPE:
			return {
				...state,
				UpsLtlApiType: action.payload,
			}

		case types.SET_UNISHIPPER_API_TYPE:
			return {
				...state,
				uniShipperSmallApiType: action.payload,
			}
		case types.SET_FEDEX_SMALL_API_TYPE:
			return {
				...state,
				FedexSmallApiType: action.payload,
			}

		case types.SET_FEDEX_LTL_API_TYPE:
			return {
				...state,
				FedexLTLApiType: action.payload,
			}

		case types.GET_RAD_SETTINGS:
		case types.SET_RAD_SETTINGS:
			return {
				...state,
				radSettings: action.payload,
			}
		case types.GET_THRESHOLD_SETTINGS:
		case types.SET_THRESHOLD_SETTINGS:
			return {
				...state,
				thresholdSetting: action.payload,
			}
		case types.TOGGLE_THRESHOLD_SETTINGS:
			return {
				...state,
				thresholdSetting: {...state.thresholdSetting, parcel_rates:action.payload},
			}
		case types.GET_STAFFNOTE_SETTINGS:
		case types.SET_STAFFNOTE_SETTINGS:
			return {
				...state,
				staffNoteSettings: action.payload,
			}
		case types.TOGGLE_STAFFNOTE_SETTINGS:
			return {
				...state,
				staffNoteSettings: {...state.staffNoteSettings, is_staff_note_active:action.payload},
			}
		case types.SET_COMPARE_RATES:
				return {
					...state,
				compareRates: action.payload,
				}		
		default:
			return state
	}
}

export default Reducer
