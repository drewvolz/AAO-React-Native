import * as React from 'react'
import {Cell} from '@frogpond/tableview'
import {StyleSheet, Text, View} from 'react-native'
import * as c from '@frogpond/colors'

type LeftDetailProps = {
	detail: string
	title: string
}

export function MultiLineLeftDetailCell(props: LeftDetailProps): JSX.Element {
	let {detail, title} = props
	let cellContent = (
		<View style={styles.cellContentView}>
			<Text allowFontScaling={true} style={styles.cellLeftDetail}>
				{detail}
			</Text>
			<Text allowFontScaling={true} style={styles.cellLeftDetailTitle}>
				{title}
			</Text>
		</View>
	)
	return <Cell cellContentView={cellContent} />
}

const styles = StyleSheet.create({
	cellContentView: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		// independent from other cellViews
		paddingVertical: 10,
	},
	cellLeftDetailTitle: {
		fontSize: 12,
		flex: 1,
		color: c.black,
	},
	cellLeftDetail: {
		fontSize: 12,
		alignSelf: 'center',
		textAlign: 'right',
		marginRight: 5,
		width: 75,
		color: c.infoBlue,
	},
})
