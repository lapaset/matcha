import React, { useState, useEffect, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import userService from '../../services/userService'
import ListOfUsers from './ListOfUsers'

//todo
// toggle options
// make the user list inviting

// fix adding tags




const UserSearch = ({ user }) => {
	const [results, setResults] = useState([])
	const [resultsToShow, setResultsToShow] = useState([])
	const [maxDistance, setMaxDistance] = useState(window.localStorage.getItem('matchaMaxDistance')
		? window.localStorage.getItem('matchaMaxDistance')
		: 100)
	const [minAge, setMinAge] = useState(20)
	const [maxAge, setMaxAge] = useState(120)
	const [minFame, setMinFame] = useState(100)
	const [requiredTag, setRequiredTag] = useState(null)

	const calculateDistance = (lat1, lon1, lat2, lon2) => {

		const R = 6371e3; // metres
		const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
		const φ2 = lat2 * Math.PI / 180;
		const Δφ = (lat2 - lat1) * Math.PI / 180;
		const Δλ = (lon2 - lon1) * Math.PI / 180;

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c / 1000; //in kilometres
	}

	const sortResults = useCallback((res, by) => {
		const countMutualTags = tags => {
			const userTags = user.tags.split('#')

			return tags.split('#').reduce((m, t) => userTags.includes(t)
				? m + 1
				: m, -1)
		}

		const sortByTags = () => res
			.map(r => r.mutualTags
				? r
				: ({
					...r,
					mutualTags: countMutualTags(r.tags)
				}))
			.sort((a, b) => b.mutualTags - a.mutualTags)

		if (!res || res.length === 0)
			return

		//console.log('results', results, '\nsort by', by)

		let sortedResults = [...res]

		switch (by) {
			case "age descending":
				sortedResults.sort((a, b) => b.age.years - a.age.years)
				break;
			case "age ascending":
				sortedResults.sort((a, b) => a.age.years - b.age.years)
				break;
			case "fame":
				sortedResults.sort((a, b) => b.fame - a.fame)
				break;
			case "tags":
				sortedResults = sortByTags()
				break;
			case "distance":
				sortedResults.sort((a, b) => a.distance - b.distance)
				break;
			default:
				break;
		}

		return sortedResults
	}, [user.tags])

	const handleSort = e => {
		window.localStorage.setItem('matchaSortBy', e.target.value)
		setResultsToShow(sortResults(resultsToShow, e.target.value))
	}

	const handleIntValue = (val, localStorageName, setter) => {
		const value = parseInt(val)

		if (!value || value < 0)
			return

		window.localStorage.setItem(localStorageName, value)
		setter(value)
	}

	const handleMaxDistance = e => handleIntValue(e.target.value, 'matchaMaxDistance', setMaxDistance)
	const handleMinAge = e => handleIntValue(e.target.value, 'matchaMinAge', setMinAge)
	const handleMaxAge = e => handleIntValue(e.target.value, 'matchaMaxAge', setMaxAge)
	const handleMinFame = e => handleIntValue(e.target.value, 'matchaMinFame', setMinFame)
	const handleFilterTag = e => setRequiredTag(e.target.value)

	const requiredTagFound = tags => tags && requiredTag
		? tags.split('#').includes(requiredTag)
		: true

	const filterResults = () => resultsToShow
		? resultsToShow
			.filter(r => r.distance <= maxDistance &&
				r.age.years >= minAge && r.age.years <= maxAge
				&& r.fame >= minFame && requiredTagFound(r.tags))
		: []

	useEffect(() => {
		userService
			.getByGenderOrientation(user.orientation, user.gender)
			.then(res => {

				const filteredResults = res
					.map(u => ({
						...u,
						distance: calculateDistance(user.latitude, user.longitude, u.latitude, u.longitude)
					}))
					.filter(u => u.user_id !== user.user_id)

				setResults(filteredResults)
			})
			.catch(e => {
				console.log('error', e);
			})
	}, [user.latitude, user.longitude, user.gender, user.orientation, user.user_id])


	useEffect(() => {

		const defaultSortValue = window.localStorage.getItem('matchaSortBy')
			? window.localStorage.getItem('matchaSortBy')
			: 'fame'

		//first filter results here
		const sortedResults = sortResults([...results], defaultSortValue)
		setResultsToShow(sortedResults)
	}, [results, sortResults])

	//console.log('sortBy', sortBy.current)
	//console.log('results', results);

	return <>
		<Form>
			<Form.Group>
				<Form.Label>Sort by</Form.Label>
				<Form.Control as="select" defaultValue={window.localStorage.getItem('matchaSortBy')
					? window.localStorage.getItem('matchaSortBy')
					: 'fame'} onChange={handleSort}>
					<option value="fame">fame</option>
					<option value="tags">tags</option>
					<option value="age ascending">age ascending</option>
					<option value="age descending">age descending</option>
					<option value="distance">distance</option>

				</Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Max distance</Form.Label>
				<Form.Control type="number" defaultValue={maxDistance} onChange={handleMaxDistance} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Min age</Form.Label>
				<Form.Control type="number" defaultValue={minAge} onChange={handleMinAge} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Max age</Form.Label>
				<Form.Control type="number" defaultValue={maxAge} onChange={handleMaxAge} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Min fame</Form.Label>
				<Form.Control type="number" defaultValue={minFame} onChange={handleMinFame} />
			</Form.Group>
			{user.tags
				? <Form.Group>
					<Form.Label>Tag</Form.Label>
					<Form.Control as="select" onChange={handleFilterTag}>
						{ user.tags
							.split('#')
							.map(t => <option key={t} value={t}>{t}</option>)}
					</Form.Control>
				</Form.Group>
				: null}
		</Form>
		<ListOfUsers users={filterResults()} />

	</>
}

export default UserSearch