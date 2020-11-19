import React, { useState, useEffect } from 'react'
import { Form, Col } from 'react-bootstrap'
import userService from '../../services/userService'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'

// fix adding tags
// fix upload photo preview layout

const UserSearch = ({ user }) => {

	const filterFromStorage = (name, def) => window.localStorage.getItem(name)
		? window.localStorage.getItem(name)
		: def

	const [results, setResults] = useState([])
	const [resultsToShow, setResultsToShow] = useState([])
	const [maxDistance, setMaxDistance] = useState(filterFromStorage('matchaMaxDistance', 100))
	const [minAge, setMinAge] = useState(filterFromStorage('matchaMinAge', 20))
	const [maxAge, setMaxAge] = useState(filterFromStorage('matchaMaxAge', 120))
	const [minFame, setMinFame] = useState(filterFromStorage('matchaMinFame', 100))
	const [requiredTag, setRequiredTag] = useState(filterFromStorage('matchaRequiredTag', null))
	const [hideFilterForm, setHideFilterForm] = useState(true)

	const sortFormProps = ({ user, resultsToShow, setResultsToShow, results })

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
	const handleFilterTag = e => {
		window.localStorage.setItem('matchaRequiredTag', e.target.value)
		setRequiredTag(e.target.value)
	}

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

	


	//console.log('sortBy', sortBy.current)
	//console.log('results', results);

	return <>

		<SortForm {...sortFormProps} />

		<Form hidden={hideFilterForm}>

			{user.tags
				? <Form.Group>
					<Form.Label>Tag</Form.Label>
					<Form.Control as="select" defaultValue={requiredTag} onChange={handleFilterTag}>
						{user.tags
							.split('#')
							.map(t => <option key={t} value={t}>{t}</option>)}
					</Form.Control>
				</Form.Group>
				: null
			}

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Max distance</Form.Label>
						<Form.Control type="number" defaultValue={maxDistance} onChange={handleMaxDistance} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Min fame</Form.Label>
						<Form.Control type="number" defaultValue={minFame} onChange={handleMinFame} />
					</Form.Group>
				</Col>
			</Form.Row>

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Min age</Form.Label>
						<Form.Control type="number" defaultValue={minAge} onChange={handleMinAge} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Max age</Form.Label>
						<Form.Control type="number" defaultValue={maxAge} onChange={handleMaxAge} />
					</Form.Group>
				</Col>
			</Form.Row>
		</Form>

		<div className="text-info text-right mb-3" onClick={() => setHideFilterForm(!hideFilterForm)}>
			{
				hideFilterForm
					? <>show filters</>
					: <>hide filters</>
			}
		</div>

		<ListOfUsers users={filterResults()} />

	</>
}

export default UserSearch