// TODO Check on https://github.com/kmagiera/react-native-gesture-handler/issues/320,
// and remove this if/when it is no longer necessary
import 'react-native-gesture-handler'

// initialization
import './init/constants'
import './init/moment'
import * as sentryInit from './init/sentry'
import './init/api'
import './init/theme'
import {queryClient, persister} from './init/tanstack-query'

import * as React from 'react'
import {PersistGate} from 'redux-persist/integration/react'
import {Provider as ReduxProvider} from 'react-redux'
// import {Provider as PaperProvider} from 'react-native-paper'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {store, persistor} from './redux'
import {CombinedLightTheme, CombinedDarkTheme} from '@frogpond/app-theme'
import {ActionSheetProvider} from '@expo/react-native-action-sheet'
import {NavigationContainer} from '@react-navigation/native'

import {RootStack} from './navigation'
import {LoadingView} from '@frogpond/notice'
import {StatusBar, useColorScheme} from 'react-native'

export default function App(): JSX.Element {
	// Create a ref for the navigation container
	const navigationRef = React.useRef()
	const scheme = useColorScheme()

	return (
		<ReduxProvider store={store}>
			<PersistGate
				loading={<LoadingView text="Loading App..." />}
				persistor={persistor}
			>
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{persister}}
				>
					<ActionSheetProvider>
						<NavigationContainer
							onReady={() => {
								// Register the navigation container with the instrumentation
								sentryInit.routingInstrumentation.registerNavigationContainer(
									navigationRef,
								)
							}}
							theme={scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme}
						>
							<StatusBar
								barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
							/>
							<RootStack />
						</NavigationContainer>
					</ActionSheetProvider>
				</PersistQueryClientProvider>
			</PersistGate>
		</ReduxProvider>
	)
}
