/**
 * @flow
 *
 * Building Hours "report a problem" screen.
 */

import * as React from 'react'
import {ScrollView, View} from 'react-native'
import moment from 'moment-timezone'
import type {Moment} from 'moment-timezone'
import {InfoHeader} from '@frogpond/info-header'
import {
	TableView,
	Section,
	Cell,
	CellTextField,
	CellToggle,
	DeleteButtonCell,
	ButtonCell,
} from '@frogpond/tableview'
import type {
	BuildingType,
	NamedBuildingScheduleType,
	SingleBuildingScheduleType,
} from '../types'
import type {TopLevelViewPropsType} from '../../types'
import {summarizeDays, formatBuildingTimes, blankSchedule} from '../lib'
import {submitReport} from './submit'
import {NativeStackNavigationOptions} from '@react-navigation/native-stack'
import {RouteProp} from '@react-navigation/native'
import {RootStackParamList} from '../../../navigation/types'

type Props = TopLevelViewPropsType & {
	navigation: {state: {params: {initialBuilding: BuildingType}}}
}

type State = {
	building: BuildingType
}

// TODO: convert this class to a functional component (useState, useNavigation)
export class BuildingHoursProblemReportView extends React.PureComponent<
	Props,
	State
> {
	state = {
		building: this.props.route.params.initialBuilding,
	}

	openEditor = (
		scheduleIdx: number,
		setIdx: number,
		set?: SingleBuildingScheduleType,
	) => {
		// TODO: refactor this to useNavigation
		this.props.navigation.navigate('BuildingHoursScheduleEditor', {
			initialSet: set,
			onEditSet: (editedData: SingleBuildingScheduleType) =>
				this.editHoursRow(scheduleIdx, setIdx, editedData),
			onDeleteSet: () => this.deleteHoursRow(scheduleIdx, setIdx),
		})
	}

	editName = (newName: BuildingType['name']) => {
		this.setState((state) => {
			return {
				...state,
				building: {
					...state.building,
					name: newName,
				},
			}
		})
	}

	editSchedule = (idx: number, newSchedule: NamedBuildingScheduleType) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]
			schedules.splice(idx, 1, newSchedule)

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	deleteSchedule = (idx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]
			schedules.splice(idx, 1)

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	addSchedule = () => {
		this.setState((state) => {
			return {
				...state,
				building: {
					...state.building,
					schedule: [
						...state.building.schedule,
						{
							title: 'Hours',
							hours: [blankSchedule()],
						},
					],
				},
			}
		})
	}

	addHoursRow = (idx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			schedules[idx] = {
				...schedules[idx],
				hours: [...schedules[idx].hours, blankSchedule()],
			}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	editHoursRow = (
		scheduleIdx: number,
		setIdx: number,
		newData: SingleBuildingScheduleType,
	) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			let hours = [...schedules[scheduleIdx].hours]
			hours.splice(setIdx, 1, newData)

			schedules[scheduleIdx] = {...schedules[scheduleIdx], hours}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	deleteHoursRow = (scheduleIdx: number, setIdx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			let hours = [...schedules[scheduleIdx].hours]
			hours.splice(setIdx, 1)

			schedules[scheduleIdx] = {...schedules[scheduleIdx], hours}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	submit = () => {
		console.log(JSON.stringify(this.state.building))
		submitReport(this.props.route.params.initialBuilding, this.state.building)
	}

	render() {
		let {schedule: schedules = [], name} = this.state.building

		return (
			<ScrollView>
				<InfoHeader
					message="If you could tell us what the new times are, we&rsquo;d greatly appreciate it."
					title="Thanks for spotting a problem!"
				/>

				<TableView>
					<Section header="NAME">
						<TitleCell onChange={this.editName} text={name || ''} />
					</Section>

					{schedules.map((s, i) => (
						<EditableSchedule
							key={i}
							addRow={this.addHoursRow}
							editRow={this.openEditor}
							onDelete={this.deleteSchedule}
							onEditSchedule={this.editSchedule}
							schedule={s}
							scheduleIndex={i}
						/>
					))}

					<Section>
						<Cell
							accessory="DisclosureIndicator"
							onPress={this.addSchedule}
							title="Add New Schedule"
						/>
					</Section>

					<Section footer="Thanks for reporting!">
						<ButtonCell onPress={this.submit} title="Submit Report" />
					</Section>
				</TableView>
			</ScrollView>
		)
	}
}

type EditableScheduleProps = {
	schedule: NamedBuildingScheduleType
	scheduleIndex: number
	addRow: (idx: number) => any
	editRow: (
		schedIdx: number,
		setIdx: number,
		set: SingleBuildingScheduleType,
	) => any
	onEditSchedule: (idx: number, set: NamedBuildingScheduleType) => any
	onDelete: (idx: number) => any
}

class EditableSchedule extends React.PureComponent<EditableScheduleProps> {
	onEdit = (data) => {
		let idx = this.props.scheduleIndex
		this.props.onEditSchedule(idx, {
			...this.props.schedule,
			...data,
		})
	}

	editTitle = (newValue: string) => {
		this.onEdit({title: newValue})
	}

	editNotes = (newValue: string) => {
		this.onEdit({notes: newValue})
	}

	toggleChapel = (newValue: boolean) => {
		this.onEdit({closedForChapelTime: newValue})
	}

	addHoursRow = () => {
		this.props.addRow(this.props.scheduleIndex)
	}

	delete = () => {
		this.props.onDelete(this.props.scheduleIndex)
	}

	openEditor = (setIndex: number, hoursSet: SingleBuildingScheduleType) => {
		this.props.editRow(this.props.scheduleIndex, setIndex, hoursSet)
	}

	render() {
		let {schedule} = this.props
		let now = moment()

		return (
			<View>
				<Section header="INFORMATION">
					<TitleCell onChange={this.editTitle} text={schedule.title || ''} />
					<NotesCell onChange={this.editNotes} text={schedule.notes || ''} />

					<CellToggle
						label="Closes for Chapel"
						onChange={this.toggleChapel}
						value={Boolean(schedule.closedForChapelTime)}
					/>

					{schedule.hours.map((set, i) => (
						<TimesCell
							key={i}
							now={now}
							onPress={this.openEditor}
							set={set}
							setIndex={i}
						/>
					))}

					<Cell
						accessory="DisclosureIndicator"
						onPress={this.addHoursRow}
						title="Add More Hours"
					/>

					<DeleteButtonCell onPress={this.delete} title="Delete Schedule" />
				</Section>
			</View>
		)
	}
}

type TextFieldProps = {text: string; onChange: (text: string) => any}
// "Title" will become a textfield like the login form
const TitleCell = ({text, onChange = () => {}}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="words"
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Title"
		returnKeyType="done"
		value={text}
	/>
)

// "Notes" will become a big textarea
const NotesCell = ({text, onChange}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="sentences"
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Notes"
		returnKeyType="done"
		value={text}
	/>
)

type TimesCellProps = {
	set: SingleBuildingScheduleType
	setIndex: number
	onPress: (setIdx: number, set: SingleBuildingScheduleType) => any
	now: Moment
}

class TimesCell extends React.PureComponent<TimesCellProps> {
	onPress = () => {
		this.props.onPress(this.props.setIndex, this.props.set)
	}

	render() {
		let {set, now} = this.props

		return (
			<Cell
				accessory="DisclosureIndicator"
				cellStyle="RightDetail"
				detail={formatBuildingTimes(set, now)}
				onPress={this.onPress}
				title={set.days.length ? summarizeDays(set.days) : 'Days'}
			/>
		)
	}
}

export const NavigationKey = 'BuildingHoursProblemReport'

export const NavigationOptions = (props: {
	route: RouteProp<RootStackParamList, typeof NavigationKey>
}): NativeStackNavigationOptions => {
	let {initialBuilding} = props.route.params
	return {
		title: 'Report a Problem',
		headerBackTitle: initialBuilding.name,
	}
}
