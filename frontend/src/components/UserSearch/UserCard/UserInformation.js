import React from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'

const UserInformation = ({ user }) => <>

	<Card.Body>
		<Card.Title>{user.username}, {user.age} </Card.Title>
		<Card.Text>{user.firstName} {user.lastName}</Card.Text>
		<Card.Text>
			{user.bio}
		</Card.Text>
	</Card.Body>

	<ListGroup className="list-group-flush">
		<ListGroupItem>{user.gender} looking for {user.orientation
			.map((o, i) => i === user.orientation.length - 1
				? o
				: i === user.orientation.length - 2
					? `${o} and `
					: `${o}, `
			)}
		</ListGroupItem>

		{ user.tags && <ListGroupItem>
			{user.tags.split('#')
				.map((t, i) => i > 1
					? ` #${t}`
					: i === 1 ? `#${t}` : null
				)}
		</ListGroupItem> }

		<ListGroupItem>
			online / offline
		</ListGroupItem>
	</ListGroup>
</>

export default UserInformation