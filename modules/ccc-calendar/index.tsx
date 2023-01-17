import {EventList, type PoweredBy} from '@frogpond/event-list'
import type {EventType} from '@frogpond/event-type'
import {NoticeView} from '@frogpond/notice'
import {useMomentTimer} from '@frogpond/timer/hook'
import {UseQueryResult} from '@tanstack/react-query'
import * as React from 'react'
import {Calendar} from './types'

export {
	useNamedCalendar,
	useGoogleCalendar,
	useReasonCalendar,
	useIcsCalendar,
} from './query'

type Props = {
	detailView?: string
	poweredBy: PoweredBy
	query: UseQueryResult<EventType[]>
}

export function CccCalendarView(props: Props) {
	let {now} = useMomentTimer({intervalMs: 60000})
	let {isError, refetch, data = [], isLoading, isInitialLoading} = props.query

	if (isError) {
		return (
			<NoticeView
				buttonText="Try Again"
				onPress={refetch}
				text={`A problem occured while loading: ${props.query.error}`}
			/>
		)
	}

	return (
		<EventList.EventList
			detailView={props.detailView}
			events={data}
			now={now}
			onRefresh={refetch}
			poweredBy={props.poweredBy}
			refreshing={isLoading && !isInitialLoading}
		/>
	)
}
