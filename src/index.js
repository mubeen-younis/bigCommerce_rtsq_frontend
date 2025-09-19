import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import Reducer from './Stores/Reducer'
import axios from 'axios'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(Reducer, composeEnhancers(applyMiddleware(thunk)))
// Expose store globally so action helper can read transient flags
window.store = store

axios.defaults.baseURL = process.env.REACT_APP_ENITURE_API_URL

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
