import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import createLogger from 'redux-logger'

import rootReducer from 'reducers'

export default function configureStore(preloadedState) {
	const store = createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(thunk, apiMiddleware, createLogger()),
		window.devToolsExtension && window.devToolsExtension()
	)

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers').default
			store.replaceReducer(nextRootReducer)
		})
	}

	return store
}
