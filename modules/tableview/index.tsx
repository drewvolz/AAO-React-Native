import * as React from 'react'
import {sectionBgColor} from '@frogpond/colors'

import {
	TableView,
	Section as ActualSection,
	Cell,
} from 'react-native-tableview-simple'
import type {SectionInterface} from 'react-native-tableview-simple/src/components/Section'

export * from './cells'

let Section = (props: SectionInterface): JSX.Element => (
	<ActualSection sectionTintColor={sectionBgColor} withSafeAreaView={false} {...props} />
)

export {TableView, Section, Cell}
