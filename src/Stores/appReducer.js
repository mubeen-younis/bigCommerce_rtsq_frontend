import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
	name: 'app',
	initialState: {
		connectionSettings: null,
		warehouse: null,
		dropships: null,
		quoteSettings: null,
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
		store: null,
		radPlans: null,
	},
	reducers: {
		store: (state, action) => {
			state.store = action.payload;
		},
		token: (state, action) => {
			state.token = action.payload;
		},
		getConnectionSettings: (state, action) => {
			state.connectionSettings = action.payload;
		},
		getQuoteSettings: (state, action) => {
			state.quoteSettings = action.payload;
		},
		getLocations: (state, action) => {
			state.warehouse = action.payload.warehouse;
			state.dropships = action.payload.dropships;
		},
		saveLocation: (state, action) => {
			const location = [...state.warehouse, ...state.dropships].filter(
				loc => loc.id === action.payload.id
			);

			if (location && location.length) {
				if (action.payload.type === 1) {
					state.warehouse = state.warehouse.map(wh =>
						wh.id === action.payload.id ? action.payload : wh
					);
				} else if (action.payload.type === 2) {
					state.dropships = state.dropships.map(ds =>
						ds.id === action.payload.id ? action.payload : ds
					);
				}
			} else {
				if (action.payload.type === 1) {
					state.warehouse = [...state.warehouse, action.payload];
				} else if (action.payload.type === 2) {
					state.dropships = [...state.dropships, action.payload];
				}
			}
		},
		deleteLocation: (state, action) => {
			state.warehouse = state.warehouse.filter(wh => wh.id !== action.payload);
			state.dropships = state.dropships.filter(wh => wh.id !== action.payload);
		},
		skeletonLoading: (state, action) => {
			state.skeleton_loading = action.payload;
		},
		alertMessage: (state, action) => {
			state.showAlertMessage = action.payload.showAlertMessage;
			state.alertMessage = action.payload.alertMessage;
			state.alertMessageType = action.payload.alertMessageType;
		},
		getGoogleLocationResponse: (state, action) => {
			state.googleLocationResponse = action.payload;
		},
		getAllProducts: (state, action) => {
			state.allProducts = action.payload;
		},
		updateProductSettings: (state, action) => {
			state.allProducts = state.allProducts.map(pdct =>
				pdct.id === action.payload.id ? action.payload : pdct
			);
		},
		getPlansInfo: (state, action) => {
			state.plansInfo = action.payload;
		},
		confirmModal: (state, action) => {
			state.confirmModal = {
				on: action.payload.on,
				ok: action.payload.ok,
				cancel: action.payload.cancel,
				title: action.payload.title,
				body: action.payload.body,
			};
		},
		radPlans: (state, action) => {
			if (
				action.payload?.severity === 'SUCCESS' &&
				action.payload?.Message.includes(
					'disabled the Residential Address Detection plugin'
				)
			) {
				state.radPlans = {
					...state.radPlans,
					...action.payload,
				};

				return;
			}
			state.radPlans = action.payload;
		},
		getBoxSizes: (state, action) => {
			state.boxSizes = action.payload;
		},
		addBoxSize: (state, action) => {
			state.boxSizes = [
				...state.boxSizes,
				{ ...action.payload, is_available: action.payload.is_available ? 1 : 0 },
			];
		},
		deleteBoxSize: (state, action) => {
			state.boxSizes = state.boxSizes.filter(bs => bs.id !== +action.payload);
		},
		updateBoxSize: (state, action) => {
			state.boxSizes = state.boxSizes.map(bs =>
				bs.id === action.payload.id ? action.payload : bs
			);
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	addBoxSize,
	deleteBoxSize,
	updateBoxSize,
	getBoxSizes,
	getLocations,
	deleteLocation,
	updateProductSettings,
	getAllProducts,
	alertMessage,
	confirmModal,
	getConnectionSettings,
	getGoogleLocationResponse,
	getPlansInfo,
	getQuoteSettings,
	radPlans,
	saveLocation,
	skeletonLoading,
	store,
	token,
} = counterSlice.actions;

export default counterSlice.reducer;
