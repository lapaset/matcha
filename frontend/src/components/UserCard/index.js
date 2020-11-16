import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faHeart, faFlag } from '@fortawesome/free-solid-svg-icons'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'

const UserCard = ({ user }) => {

	const [selectedPhoto, setSelectedPhoto] = useState(null)
	const profilePic = user.photos
		? user.photos.find(p => p.profilePic)
		: null

	useEffect(() => {
		setSelectedPhoto(profilePic)
	}, [profilePic])

	const changePhoto = id => setSelectedPhoto(user.photos.find(p => p.id === id))

	const photoSelector = id => selectedPhoto
		? selectedPhoto.id === id
			? <FontAwesomeIcon icon={faCircle} color="gold" />
			: <FontAwesomeIcon icon={faCircle} />
		: null

	//console.log('profile pic', profilePic, 'photos', user.photos);

	return <Card className="w-100 m-auto">
		<Card.Img variant="top" src={selectedPhoto ? selectedPhoto.photoStr : null} />
		<Card.Body className="text-center">
			{profilePic
				? <>
					<Card.Link onClick={() => changePhoto(profilePic.id)}>
						{photoSelector(profilePic.id)}
					</Card.Link>
					{user.photos
						.filter(p => !p.profilePic)
						.map(p => <Card.Link key={p.id} onClick={() => changePhoto(p.id)}>
							{photoSelector(p.id)}
						</Card.Link>)
					}
				</>
				: null
			}

		</Card.Body>
		<Card.Body>
			<Card.Title>{user.username}, {user.age}</Card.Title>
			<Card.Text>{user.firstName} {user.lastName}</Card.Text>
			<Card.Text>
				{user.bio}
			</Card.Text>
		</Card.Body>
		<ListGroup className="list-group-flush">
			<ListGroupItem>{user.gender}</ListGroupItem>
			<ListGroupItem>
				looking for {user.orientation
					.map((o, i) => i < user.orientation.length - 1
						? `${o}, `
						: o
					)}
			</ListGroupItem>

			{user.tags
				? <ListGroupItem>
					{user.tags.split('#')
						.map((t, i) => i > 1
							? ` #${t}`
							: i === 1 ? `#${t}` : null
						)}
				</ListGroupItem>
				: null}
			<ListGroupItem>
				<Card.Link href="#"><FontAwesomeIcon icon={faHeart} /> Like</Card.Link>
				<Card.Link href="#"><FontAwesomeIcon icon={faFlag} /> Report</Card.Link>
			</ListGroupItem>
			<ListGroupItem>
				<Card.Link as={Link} to="/">Back to the list</Card.Link>
				<Card.Link href="#">Next</Card.Link>
			</ListGroupItem>
		</ListGroup>
	</Card>

}

export default UserCard

//todo:
// make username unmodifyable
// make orientation default fmo
// get tags as a list from db

// list interesting users, name, age, profile pic?
// must be sortable by age, location, fame rating, common tags
// ( matching tags: SELECT tags FROM users WHERE tags LIKE '%#wow%' )
