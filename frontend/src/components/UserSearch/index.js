import React, { useState } from 'react'
import { useFilter } from '../../hooks/index'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'

// fix adding tags
// fix upload photo preview layout

const UserSearch = ({ user }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 100, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	const filterFormProps = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge })

	const requiredTagFound = tags => tags && requiredTag.value
		? tags.split('#').includes(requiredTag.value)
		: true

	const filterResults = () => resultsToShow
		? resultsToShow
			.filter(r => r.distance <= maxDistance.value &&
				r.age.years >= minAge.value && r.age.years <= maxAge.value
				&& r.fame >= minFame.value && requiredTagFound(r.tags))
		: []

	return <>

		<SortForm {...sortFormProps} />

		<FilterForm {...filterFormProps} />

		<ListOfUsers users={filterResults()} />

	</>
}

export default UserSearch