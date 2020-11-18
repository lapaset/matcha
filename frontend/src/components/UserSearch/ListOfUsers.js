import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'

const ListOfUsers = ({ users }) => {
	console.log('users list rendered', users)

	return (
		users
			? <ListGroup className="text-left">
				{users.map(u => <ListGroup.Item key={u.user_id}>
					<Link to={`/users/${u.user_id}`}>
						{u.username}, {u.age.years}, {u.gender}, {u.tags}, {u.fame}, {parseInt(u.distance)}km
					</Link>
				</ListGroup.Item>)}
			</ListGroup>
			: null
	)
}

export default ListOfUsers