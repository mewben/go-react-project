import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'

// local modules
import rootReducer from 'reducers'

export default function configureStore(preloadedState) {
	return createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(thunk, apiMiddleware)
	)
}
