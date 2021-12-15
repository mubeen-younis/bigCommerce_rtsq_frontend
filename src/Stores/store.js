import { configureStore } from '@reduxjs/toolkit';
import carrierReducer from './appReducer';
import addonReducer from './addonSlice';

export default configureStore({
	reducer: {
		carrier: carrierReducer,
		addon: addonReducer,
	},
});
