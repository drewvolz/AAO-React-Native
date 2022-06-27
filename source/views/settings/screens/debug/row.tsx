/**
 * TODO(volz):
 * - Fix the typings of this view
 * - Undo disabling of eslint
 * See https://github.com/StoDevX/AAO-React-Native/issues/6007
 */

/* Disabling eslint as the view is not usable in the build */
/* eslint-disable */

import * as React from 'react'
import {Cell} from '@frogpond/tableview'
import type {TopLevelViewPropsType} from '../../../types'

type Props = TopLevelViewPropsType & {
	data: {key: string; value: any}
	onPress: (key: string) => any
}

export class DebugRow extends React.PureComponent<Props> {
	render() {
		let {data} = this.props

		let rowDetail = '<unknown>'
		let arrowPosition = 'none'

		if (Array.isArray(data.value)) {
			// Array(0), Array(100), etc
			rowDetail = `Array(${data.value.length})`
			arrowPosition = 'center'
		} else if (typeof data.value === 'object' && data.value !== null) {
			// [object Object], [object Symbol], etc
			rowDetail = data.value.toString()
			arrowPosition = 'center'
		} else if (typeof data.value === 'string') {
			if (data.value.length > 20) {
				rowDetail = `"${data.value.substr(0, 20)}…"`
			} else {
				rowDetail = JSON.stringify(data.value)
			}
		} else {
			rowDetail = JSON.stringify(data.value)
		}

		let arrowStyle = arrowPosition === 'none' ? false : 'DisclosureIndicator'
		let onPress = arrowPosition === 'none' ? null : this.props.onPress

		return (
			<Cell
				accessory={arrowStyle}
				cellStyle="RightDetail"
				detail={rowDetail}
				onPress={onPress}
				title={data.key}
			/>
		)
	}
}
