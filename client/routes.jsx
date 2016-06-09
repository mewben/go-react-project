import React from 'react'
import Route from 'react-router/lib/Route'

import App from 'containers/App'
import Home from 'containers/Home'

export default function routes(store) {
	return (
		<Route component={App}>
			<Route path="/" component={Home} />
		</Route>
	)
}
