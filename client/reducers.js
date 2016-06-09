import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import app from 'containers/App/reducer'

export default combineReducers({
	// main reducers
	app,

	// others
	routing,
})
