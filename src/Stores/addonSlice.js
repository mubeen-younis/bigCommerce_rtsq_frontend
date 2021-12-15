import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
	name: 'addon',
	initialState: {
		addons: null,
		installedAddons: null,
		addonSettings: null,
	},
	reducers: {
		getAddons: (state, action) => {
			state.addons = action.payload;
		},
		installAddon: (state, action) => {
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

			state.installedAddons = [...state.installedAddons, newInstalledAddon];
			state.addons = state.addons.filter(add => add.id !== action.payload.addon_id);
		},
		getInstalledAddons: (state, action) => {
			state.installedAddons = action.payload;
		},
		chanegAddonStatus: (state, action) => {
			state.installedAddons = state.installedAddons.map(addon =>
				addon.id === action.payload.id
					? { ...addon, is_enabled: action.payload.is_enabled }
					: addon
			);
		},
		changeAddonSuspendStatus: (state, action) => {
			state.installedAddons = state.installedAddons.map(addon =>
				addon.id === action.payload.id
					? { ...addon, is_suspend: action.payload.is_suspend }
					: addon
			);
		},
		getAddonAddressSettings: (state, action) => {
			state.addonSettings = action.payload;
		},
		changeDefaultAddress: (state, action) => {
			state.addonSettings = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	getAddons,
	installAddon,
	getInstalledAddons,
	chanegAddonStatus,
	changeAddonSuspendStatus,
	getAddonAddressSettings,
	changeDefaultAddress,
} = counterSlice.actions;

export default counterSlice.reducer;
