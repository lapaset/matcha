import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ListGroup, Form } from 'react-bootstrap'
import userService from '../../services/userService'

//todo
// The list must be sortable by age, location, “fame rating” and common tags.
// The list must be filterable by age, location, “fame rating” and common tags.

// add sort by selector
// add filter selectors including max distance selector


const ListOfUsers = ({ users }) => {
	console.log('users list rendered');
	
	return (
	users
		? <ListGroup className="text-left">
			{users.map(u => <ListGroup.Item key={u.user_id}>
				<Link to={`/users/${u.user_id}`}>
					{u.username}, {u.age.years}, {u.gender}, {u.tags}, {u.fame}
				</Link>
			</ListGroup.Item>)}
		</ListGroup>
		: null
)}

const UserSearch = ({ user }) => {
	const [results, setResults] = useState([])
	const [maxDistance, setMaxDistance] = useState(10000)

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

		return R * c; //in metres
	}

	useEffect(() => {
		userService
			.getByGenderOrientation(user.orientation, user.gender)
			.then(res => {
				setResults(res.filter(u => u.user_id !== user.user_id &&
					calculateDistance(user.latitude, user.longitude, u.latitude, u.longitude) < maxDistance))
			})
			.catch(e => {
				console.log('error', e);
			})
	}, [user.latitude, user.longitude, user.gender, user.orientation, user.user_id, maxDistance])

	//console.log('results', results);

	const handleSort = e => {

		console.log('on change', e.target.value)

		let newOrder

		if (e.target.value === "age descending")
			newOrder = [...results].sort((a, b) => b.age.years - a.age.years)
		else if (e.target.value === "age ascending")
			newOrder = [...results].sort((a, b) => a.age.years - b.age.years)


		console.log('in handleSort new order', newOrder)

		setResults(newOrder)

	}

	console.log('render results', results)

	return <>
			<Form>
			<Form.Group>
				<Form.Label>Sort by</Form.Label>
				<Form.Control as="select" onChange={handleSort}>
					<option value="tags">tags</option>
					<option value="age ascending">age ascending</option>
					<option value="age descending">age descending</option>
					<option value="distance">distance</option>
					<option value="fame">fame</option>
				</Form.Control>
			</Form.Group>
		</Form>
		<ListOfUsers users={results} />


	</>
}

export default UserSearch

//Advance search based on age, tags, fame rating, GPS location
//List of suggetions that match their profile based on geo location, tags, fame rating. Same geo location will get priority

//todo
// show user card when clicked
// search form
// update results