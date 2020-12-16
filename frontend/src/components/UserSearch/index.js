import React, { useState, useEffect } from 'react'
import { useFilter } from '../../hooks/index'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'
import blockService from '../../services/blockService'

const UserSearch = ({ user }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 100, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	const filterFormProps = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge })

	const [blockedUsers, setBlockedUsers] = useState(null);

	const requiredTagFound = tags => tags && requiredTag.value
		? tags.split('#').includes(requiredTag.value)
		: true

	const matchesFilters = r =>
		r.distance <= maxDistance.value &&
		r.age.years >= minAge.value &&
		r.age.years <= maxAge.value &&
		r.fame >= minFame.value &&
		requiredTagFound(r.tags)

	const filterResults = () => resultsToShow
		? blockedUsers && blockedUsers.length > 0
			? resultsToShow
				.filter(r =>
					!blockedUsers.find(u => u.user_id === r.user_id) &&
					matchesFilters(r))
			: resultsToShow
				.filter(r => matchesFilters(r))
		: []

	useEffect(() => {
		blockService
			.blockedList({
				from_user_id: user.user_id
			})
			.then(res => {
				setBlockedUsers(res)
			})
	}, [user.user_id])

	console.log('blocked users', blockedUsers)

	return blockedUsers
		? <>
			<SortForm {...sortFormProps} />

			<FilterForm {...filterFormProps} />

			<ListOfUsers users={filterResults()} />
		</>
		: null
}

export default UserSearch