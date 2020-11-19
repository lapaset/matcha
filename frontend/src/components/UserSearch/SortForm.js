import React, { useCallback, useEffect } from 'react'
import { Form } from 'react-bootstrap'

const SortForm = ({ user, resultsToShow, setResultsToShow, results }) => {
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

	useEffect(() => {

		const defaultSortValue = window.localStorage.getItem('matchaSortBy')
			? window.localStorage.getItem('matchaSortBy')
			: 'fame'

		//first filter results here
		const sortedResults = sortResults([...results], defaultSortValue)
		setResultsToShow(sortedResults)
	}, [results, sortResults, setResultsToShow])

	return <Form>
		<Form.Group>
			<Form.Label>Sort by</Form.Label>
			<Form.Control as="select" defaultValue={window.localStorage.getItem('matchaSortBy')
				? window.localStorage.getItem('matchaSortBy')
				: 'fame'} onChange={handleSort}>
				<option value="fame">fame</option>
				<option value="tags">mutual tags</option>
				<option value="age ascending">age (from youngest to oldest)</option>
				<option value="age descending">age (from oldest to youngest)</option>
				<option value="distance">distance</option>

			</Form.Control>
		</Form.Group>
	</Form>
}

export default SortForm