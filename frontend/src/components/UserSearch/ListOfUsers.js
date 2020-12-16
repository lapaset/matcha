import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap'

const ListOfUsers = ({ users }) => {

	return  (
		users && users.length > 0
			? <ListGroup className="text-left" variant="flush">
				{users.map(u => <Link to={`/users/${u.user_id}`} key={u.user_id}>
						<ListGroup.Item>
							<div style={{display: "inline-block", width: "60%"}}>{u.username}, {u.age.years}</div>
							<div style={{display: "inline-block", width: "40%", textAlign: "right"}}>{parseInt(u.distance)} km<br />
							<FontAwesomeIcon icon={faAward} /> {u.fame}</div>
						</ListGroup.Item>
				</Link>)}
			</ListGroup>
			: <div className="text-info">Could not find any matching users<br />please try different filters</div>
	)
}
export default ListOfUsers