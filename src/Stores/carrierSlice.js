import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
	name: 'carriers',
	initialState: {
		carriers: null,
		carrierId: null,
		carriersSettings: null,
		carrierDetails: null,
		installedCarriers: null,
		services: null,
		plansInfo: null,
	},
	reducers: {
		carrierId: (state, action) => {
			state.carrierId = action.payload;
		},
		getCarriers: (state, action) => {
			state.carriers = action.payload;
		},
		getAddTabSettings: (state, action) => {
			state.carriersSettings = action.payload;
		},
		saveCarrierTabSettings: (state, action) => {
			state.carriersSettings = action.payload;
		},
		getCarrierDetails: (state, action) => {
			state.carrierDetails = action.payload;
		},
		installCarrier: (state, action) => {
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

			state.installedCarriers = [...state.installedCarriers, newInstalledCarrier];
			state.carriers = state.carriers.filter(
				carrier => carrier.id !== action.payload.carrier_id
			);
		},
		getInstalledCarriers: (state, action) => {
			state.installedCarriers = action.payload;
		},
		changeCarrierStatus: (state, action) => {
			state.installedCarriers = state.installedCarriers.map(ic =>
				ic.id === action.payload.id
					? { ...ic, is_enabled: action.payload.is_enabled }
					: ic
			);
		},
		filterCarriers: (state, action) => {
			if (action.payload.length > 0) {
				const searchString = new RegExp(action.payload, 'gi');

				state.filteredServices = state.services.filter(srvc =>
					srvc.carrier_name.match(searchString)
				);
			} else {
				state.filteredServices = null;
			}
		},
		getInstalledCarrierPlanInfo: (state, action) => {
			state.plansInfo = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	carrierId,
	getCarriers,
	installCarrier,
	getInstalledCarriers,
	changeCarrierStatus,
	saveCarrierTabSettings,
	getAddTabSettings,
	getCarrierDetails,
	filterCarriers,
} = counterSlice.actions;

export default counterSlice.reducer;
