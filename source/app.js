// @flow

import './globalize-fetch'
import './setup-moment'

import * as React from 'react'
import {StatusBar, Platform} from 'react-native'
import {Provider} from 'react-redux'
import {makeStore, initRedux} from './flux'
import bugsnag from './bugsnag'
import {tracker} from './analytics'
import {AppNavigator} from './navigation'
import type {NavigationState} from 'react-navigation'
import * as c from './views/components/colors'

const store = makeStore()
initRedux(store)

// gets the current screen from navigation state
function getCurrentRouteName(navigationState: NavigationState): ?string {
	if (!navigationState) {
		return null
	}
	const route = navigationState.routes[navigationState.index]
	// dive into nested navigators
	if (route.routes) {
		return getCurrentRouteName(route)
	}
	return route.routeName
}

type Props = {}

export default class App extends React.Component<Props> {
	trackScreenChanges(
		prevState: NavigationState,
		currentState: NavigationState,
	) {
		const currentScreen = getCurrentRouteName(currentState)
		const prevScreen = getCurrentRouteName(prevState)

		if (!currentScreen) {
			return
		}

		if (currentScreen !== prevScreen) {
			tracker.trackScreenView(currentScreen)
			bugsnag.leaveBreadcrumb(currentScreen, {
				type: 'navigation',
				previousScreen: prevScreen,
			})
		}
	}

	render() {
		return (
			<Provider store={store}>
				<AppNavigator onNavigationStateChange={this.trackScreenChanges} />
			</Provider>
		)
	}
}
