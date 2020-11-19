import React, { useState } from 'react'
import { Form, Col } from 'react-bootstrap'
import { useFilter } from '../../hooks/index'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'

// fix adding tags
// fix upload photo preview layout

const UserSearch = ({ user }) => {

	//const [results, setResults] = useState([])
	const [resultsToShow, setResultsToShow] = useState([])
	const [hideFilterForm, setHideFilterForm] = useState(true)

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 100, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	/*
	const [maxDistance, setMaxDistance] = useState(filterFromStorage('matchaMaxDistance', 100))
	const [minAge, setMinAge] = useState(filterFromStorage('matchaMinAge', 20))
	const [maxAge, setMaxAge] = useState(filterFromStorage('matchaMaxAge', 120))
	const [minFame, setMinFame] = useState(filterFromStorage('matchaMinFame', 100))
	const [requiredTag, setRequiredTag] = useState(filterFromStorage('matchaRequiredTag', null))
	const [hideFilterForm, setHideFilterForm] = useState(true)

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })*/



	/*const handleIntValue = (val, localStorageName, setter) => {
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
	}*/

	const requiredTagFound = tags => tags && requiredTag.value
		? tags.split('#').includes(requiredTag.value)
		: true

	const filterResults = () => resultsToShow
		? resultsToShow
			.filter(r => r.distance <= maxDistance.value &&
				r.age.years >= minAge.value && r.age.years <= maxAge.value
				&& r.fame >= minFame.value && requiredTagFound(r.tags))
		: []

	//console.log('sortBy', sortBy.current)
	//console.log('results', results);


	console.log('requiredTag', requiredTag)
	console.log('maxDistance', maxDistance)

	return <>

		<SortForm {...sortFormProps} />

		<Form hidden={hideFilterForm}>

			{user.tags
				? <Form.Group>
					<Form.Label>Tag</Form.Label>
					<Form.Control as="select" {...requiredTag} >
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
						<Form.Control {...maxDistance} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Min fame</Form.Label>
						<Form.Control {...minFame} />
					</Form.Group>
				</Col>
			</Form.Row>

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Min age</Form.Label>
						<Form.Control {...minAge} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Max age</Form.Label>
						<Form.Control {...maxAge} />
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