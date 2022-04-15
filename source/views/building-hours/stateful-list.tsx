import * as React from 'react'
import {NoticeView} from '@frogpond/notice'
import {BuildingHoursList} from './list'
import type {ReduxState} from '../../redux'
import {useSelector} from 'react-redux'
import type {TopLevelViewPropsType} from '../types'
import type {BuildingType} from './types'
import toPairs from 'lodash/toPairs'
import groupBy from 'lodash/groupBy'
import {timezone} from '@frogpond/constants'
import {Timer} from '@frogpond/timer'
import {fetch} from '@frogpond/fetch'
import {API} from '@frogpond/api'
import {NativeStackNavigationOptions} from '@react-navigation/native-stack'

const fetchHours = (forReload?: boolean): Promise<Array<BuildingType>> =>
	fetch(API('/spaces/hours'), {
		delay: forReload ? 500 : 0,
	})
		.json<{data: Array<BuildingType>}>()
		.then((body) => body.data)

const groupBuildings = (
	buildings: Array<BuildingType>,
	favorites: Array<string>,
): Array<{title: string; data: Array<BuildingType>}> => {
	let favoritesGroup = {
		title: 'Favorites',
		data: buildings.filter((b) => favorites.includes(b.name)),
	}

	let grouped = groupBy(buildings, (b) => b.category || 'Other')
	let groupedBuildings = toPairs(grouped).map(([key, value]) => ({
		title: key,
		data: value,
	}))

	if (favoritesGroup.data.length > 0) {
		groupedBuildings = [favoritesGroup, ...groupedBuildings]
	}

	return groupedBuildings
}

type ReduxStateProps = {
	favoriteBuildings: Array<string>
}

type Props = TopLevelViewPropsType & ReduxStateProps

type State = {
	error?: Error
	loading: boolean
	buildings: Array<BuildingType>
}

export class BuildingHoursView extends React.PureComponent<Props, State> {
	state = {
		error: null,
		loading: false,
		buildings: [],
	}

	componentDidMount(): void {
		this.fetchData()
	}

	refresh = async (): Promise<void> => {
		this.setState(() => ({loading: true}))
		let buildings = await fetchHours(true)
		this.setState(() => ({loading: false, buildings}))
	}

	fetchData = async (): Promise<void> => {
		let buildings = await fetchHours()
		this.setState(() => ({buildings}))
	}

	render(): JSX.Element {
		if (this.state.error) {
			return <NoticeView text={`Error: ${this.state.error.message}`} />
		}

		let {buildings} = this.state
		let {favoriteBuildings} = this.props
		let grouped = groupBuildings(buildings, favoriteBuildings)

		return (
			<Timer
				interval={60000}
				moment={true}
				render={({now}) => (
					<BuildingHoursList
						buildings={grouped}
						loading={this.state.loading}
						navigation={this.props.navigation}
						now={now}
						onRefresh={this.refresh}
					/>
				)}
				timezone={timezone()}
			/>
		)
	}
}

export function ConnectedBuildingHoursView(
	props: TopLevelViewPropsType,
): JSX.Element {
	let favoriteBuildings = useSelector(
		(state: ReduxState) => state.buildings?.favorites || [],
	)

	return <BuildingHoursView {...props} favoriteBuildings={favoriteBuildings} />
}

export const NavigationOptions: NativeStackNavigationOptions = {
	title: 'Building Hours',
	headerBackTitle: 'Back',
}
