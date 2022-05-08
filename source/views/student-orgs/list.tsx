import * as React from 'react'
import {StyleSheet, SectionList} from 'react-native'
import {NoticeView, LoadingView} from '@frogpond/notice'
import {Column} from '@frogpond/layout'
import {
	ListRow,
	ListSectionHeader,
	ListSeparator,
	Detail,
	Title,
	largeListProps,
} from '@frogpond/lists'
import {white} from '@frogpond/colors'
import groupBy from 'lodash/groupBy'
import toPairs from 'lodash/toPairs'
import words from 'lodash/words'
import deburr from 'lodash/deburr'
import type {StudentOrgType} from './types'
import {API} from '@frogpond/api'
import {useFetch} from 'react-async'
import {useDebounce} from '@frogpond/use-debounce'
import {NativeStackNavigationOptions} from '@react-navigation/native-stack'
import {useNavigation} from '@react-navigation/native'
import memoize from 'lodash/memoize'
import {ChangeTextEvent} from '../../navigation/types'

const useStudentOrgs = () => {
	return useFetch<StudentOrgType[]>(API('/orgs'), {
		headers: {accept: 'application/json'},
	})
}

const splitToArray = memoize((str: string) => words(deburr(str.toLowerCase())))

const orgToArray = memoize((term: StudentOrgType) =>
	Array.from(
		new Set([
			...splitToArray(term.name),
			...splitToArray(term.category),
			...splitToArray(term.description),
		]),
	),
)

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: white,
	},
	contentContainer: {
		flexGrow: 1,
	},
})

function StudentOrgsView(): JSX.Element {
	let navigation = useNavigation()

	let [query, setQuery] = React.useState('')
	let searchQuery = useDebounce(query.toLowerCase(), 200)

	let {data: orgs = [], error, reload, isPending, isInitial} = useStudentOrgs()

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerSearchBarOptions: {
				barTintColor: white,
				onChangeText: (event: ChangeTextEvent) =>
					setQuery(event.nativeEvent.text),
			},
		})
	}, [navigation])

	let results = React.useMemo(() => {
		if (!orgs) {
			return []
		}

		if (!searchQuery) {
			return orgs
		}

		return orgs.filter((org) =>
			orgToArray(org).some((word) => word.startsWith(searchQuery)),
		)
	}, [orgs, searchQuery])

	let grouped = React.useMemo(() => {
		return toPairs(groupBy(results, '$groupableName')).map(([k, v]) => {
			return {title: k, data: v}
		})
	}, [results])

	let onPressOrg = React.useCallback(
		(org: StudentOrgType) => navigation.navigate('StudentOrgsDetail', {org}),
		[navigation],
	)

	// conditionals must come after all hooks
	if (error) {
		return (
			<NoticeView
				buttonText="Try Again"
				onPress={reload}
				text="A problem occured while loading the orgs"
			/>
		)
	}

	if (isInitial) {
		return <LoadingView />
	}

	return (
		<SectionList
			ItemSeparatorComponent={ListSeparator}
			ListEmptyComponent={
				searchQuery ? (
					<NoticeView text={`No results found for "${searchQuery}"`} />
				) : (
					<NoticeView text="No organizations found." />
				)
			}
			contentContainerStyle={styles.contentContainer}
			keyExtractor={(item) => item.name + item.category}
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="never"
			onRefresh={reload}
			refreshing={isPending && !isInitial}
			renderItem={({item}) => (
				<ListRow arrowPosition="top" onPress={() => onPressOrg(item)}>
					<Column flex={1}>
						<Title lines={1}>{item.name}</Title>
						<Detail lines={1}>{item.category}</Detail>
					</Column>
				</ListRow>
			)}
			renderSectionHeader={({section: {title}}) => (
				<ListSectionHeader title={title} />
			)}
			sections={grouped}
			style={styles.wrapper}
			{...largeListProps}
		/>
	)
}

export {StudentOrgsView as View}

export const NavigationOptions: NativeStackNavigationOptions = {
	title: 'Student Orgs',
	headerBackTitle: 'Back',
}
