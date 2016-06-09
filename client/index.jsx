import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Router from 'react-router/lib/Router'
import { syncHistoryWithStore } from 'react-router-redux'
import browserHistory from 'react-router/lib/browserHistory'

import configureStore from 'store/configureStore'
import createRoutes from 'routes'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
	<Provider store={store}>
		<Router routes={createRoutes(store)} history={history} />
	</Provider>,
	document.getElementById('app')
)
