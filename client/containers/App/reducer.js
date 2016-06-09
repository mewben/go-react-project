import { fromJS } from 'immutable'

let initialState = fromJS({
	error: '',
	loading: false,
})

export default function app(state = initialState, action) {
	switch (action.type) {
		default:
			return state
	}
}
