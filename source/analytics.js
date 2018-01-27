// @flow
import {
	GoogleAnalyticsTracker,
	GoogleAnalyticsSettings,
} from 'react-native-google-analytics-bridge'
import {stringifyFilters} from './views/components/filter'

import {getAnalyticsOptOut} from './lib/storage'

const trackerId =
	process.env.NODE_ENV === 'development' ? 'UA-90234209-1' : 'UA-90234209-2'

export const tracker = new GoogleAnalyticsTracker(trackerId)

function disableIfOptedOut() {
	return getAnalyticsOptOut().then(didOptOut => {
		if (didOptOut) {
			GoogleAnalyticsSettings.setOptOut(true)
		}
	})
}
disableIfOptedOut()

// Google requires that custom dimensions be tracked by index, and we only get
// 20 custom dimensions, so I decided to centralize them here.
export function trackMenuFilters(menuName: string, filters: any) {
	tracker.trackEventWithCustomDimensionValues(
		'menus',
		'filter',
		{label: menuName},
		{'1': stringifyFilters(filters)},
	)
}

export function trackHomescreenOrder(order: string[]) {
	tracker.trackEventWithCustomDimensionValues(
		'homescreen',
		'reorder',
		{},
		{'2': order.join(', ')},
	)
}

export function trackStreamPlay(streamName: string) {
	tracker.trackEvent('stream', 'play', streamName)
}

export function trackStreamPause(streamName: string) {
	tracker.trackEvent('stream', 'pause', streamName)
}

export function trackStreamError(streamName: string) {
	tracker.trackEvent('stream', 'error', streamName)
}

export const trackBuildingView = (buildingName: string) =>
	tracker.trackEvent('building-hours', 'open', {label: buildingName})

export const trackDefinitionView = (word: string) =>
	tracker.trackEvent('dictionary', 'open', {label: word})
