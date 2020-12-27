import React, { useState, useEffect } from 'react'
import { useFilter } from '../../hooks/index'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'
import UserCard from '../UserCard'
import blockService from '../../services/blockService'

const UserSearch = ({ user, wsClient, showUserAtLoad }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 100, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	const filterFormProps = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge })

	const [blockedUsers, setBlockedUsers] = useState(null)
	const [showUser, setShowUser] = useState(null)

	useEffect(() => {
		blockService
			.blockedList(user.user_id)
			.then(res => {
				setBlockedUsers(res.map(r => r.to_user_id === user.user_id ? r.from_user_id : r.to_user_id))
			})

	}, [user.user_id])

	useEffect(() => {
		setShowUser(showUserAtLoad)
	}, [showUserAtLoad])

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
					!blockedUsers.find(id => id === r.user_id) &&
					matchesFilters(r))
			: resultsToShow
				.filter(r => matchesFilters(r))
		: []

	const handleClick = user => setShowUser(user.user_id)

	return blockedUsers
		? showUser
		
			? <UserCard user_id={showUser} loggedUser={user} wsClient={wsClient} setShowUserAtUserSearch={setShowUser} />
			
			: <>
			<SortForm {...sortFormProps} />

			<FilterForm {...filterFormProps} />

			<ListOfUsers users={filterResults()} handleClick={handleClick} />
		</>
		: null
}

export default UserSearch