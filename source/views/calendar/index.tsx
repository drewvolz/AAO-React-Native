import * as React from 'react'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import {CccCalendarView, useNamedCalendar} from '@frogpond/ccc-calendar'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NativeStackNavigationOptions} from '@react-navigation/native-stack'

type Params = {
	StOlafCalendarView: undefined
	OlevilleCalendarView: undefined
	NorthfieldCalendarView: undefined
}

const Tabs = createBottomTabNavigator<Params>()

function StOlafCalendarView() {
	return (
		<CccCalendarView
			poweredBy={{
				title: 'Powered by the St. Olaf calendar',
				href: 'https://wp.stolaf.edu/calendar/',
			}}
			query={useNamedCalendar('stolaf')}
		/>
	)
}

function OlevilleCalendarView() {
	return (
		<CccCalendarView
			poweredBy={{
				title: 'Powered by the Oleville calendar',
				href: 'https://oleville.com/events/',
			}}
			query={useNamedCalendar('oleville')}
		/>
	)
}

function NorthfieldCalendarView() {
	return (
		<CccCalendarView
			poweredBy={{
				title: 'Powered by VisitingNorthfield.com',
				href: 'https://visitingnorthfield.com/events/calendar/',
			}}
			query={useNamedCalendar('northfield')}
		/>
	)
}

function CalendarView(): JSX.Element {
	return (
		<Tabs.Navigator screenOptions={{headerShown: false}}>
			<Tabs.Screen
				component={StOlafCalendarView}
				name="StOlafCalendarView"
				options={{
					tabBarLabel: 'St. Olaf',
					tabBarIcon: TabBarIcon('school'),
				}}
			/>
			<Tabs.Screen
				component={OlevilleCalendarView}
				name="OlevilleCalendarView"
				options={{
					tabBarLabel: 'Oleville',
					tabBarIcon: TabBarIcon('happy'),
				}}
			/>
			<Tabs.Screen
				component={NorthfieldCalendarView}
				name="NorthfieldCalendarView"
				options={{
					tabBarLabel: 'Northfield',
					tabBarIcon: TabBarIcon('happy'),
				}}
			/>
		</Tabs.Navigator>
	)
}

export {CalendarView as View}

export const NavigationKey = 'Calendar'

export const NavigationOptions: NativeStackNavigationOptions = {
	title: 'Calendar',
}

export type NavigationParams = undefined
