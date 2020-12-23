import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faHeart, faFlag, faBan } from '@fortawesome/free-solid-svg-icons'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import likeService from '../../services/likeService'
import reportService from '../../services/reportService'
import likeDisplayService from '../../services/likeDisplayService'
import blockService from '../../services/blockService'
import socket from '../../socket'

const UserCard = ({ userToShow, loggedUser, wsClient }) => {

	const [selectedPhoto, setSelectedPhoto] = useState(null)
	const [access, setAccess] = useState(null)
	const [liked, setLiked] = useState(0)

	const users = {
		from_user_id: loggedUser.user_id,
		to_user_id: userToShow.user_id
	};

	const profilePic = userToShow.photos
		? userToShow.photos.find(p => p.profilePic)
		: null

	useEffect(() => {

		socket.sendNotification(wsClient, {
			user_id: userToShow.user_id,
			from_id: loggedUser.user_id,
			notification: `${loggedUser.username} viewed your profile`
		})

	}, [loggedUser.user_id, loggedUser.username, userToShow.user_id, wsClient])

	useEffect(() => {
		blockService.blockedUser(users)
			.then(res => {
				setAccess(res.value);
				if (res.value === 1)
					window.location.href = "http://localhost:3000";
			})
			.catch(e => {
				console.log(("Error: couldn't get block info"))
			})
	}, [users])

	useEffect(() => {
		setSelectedPhoto(profilePic)
	}, [profilePic])

	useEffect(() => {
		likeDisplayService.unlikeDisplay(users)
			.then(res => {
				setLiked(res.value)
			})
			.catch(e => {
				console.log(("Error: couldn't get like info"))
			})
	}, [users])

	const likeHandler = event => {
		const sendNotification = notification => {
			socket.sendNotification(wsClient, {
				user_id: userToShow.user_id,
				from_id: loggedUser.user_id,
				notification
			})
		}

		event.preventDefault();

		likeService.likeUnlike(users)
			.then(res => {

				if (res.value === 1 && res.status === 'match')
					sendNotification(`New match with ${loggedUser.username}`)

				else if (res.value === 1 && res.status === 'like')
					sendNotification(`${loggedUser.username} likes you`)

				else if (res.value === 0 && res.status === 'unmatch')
					sendNotification(`No longer match with ${loggedUser.username}`)

				setLiked(res.value)
			})

	}

	const reportHandler = event => {
		event.preventDefault();

		reportService.report(users)
			.then(res => {
				alert(res.message);
			})
	}

	const blockHandler = event => {
		event.preventDefault();
		blockService.block(users)
			.then(res => {
				alert(res.message + userToShow.username)
				window.location.href = "http://localhost:3000";
			})
	}

	const changePhoto = id => setSelectedPhoto(userToShow.photos.find(p => p.id === id))

	const photoSelector = id => selectedPhoto
		? selectedPhoto.id === id
			? <FontAwesomeIcon icon={faCircle} color="gold" />
			: <FontAwesomeIcon icon={faCircle} />
		: null

	//console.log('profile pic', profilePic, 'photos', user.photos);

	return access
		? null
		: <Card className="w-100 m-auto">
			<>
				<Card.Img variant="top" src={selectedPhoto ? selectedPhoto.photoStr : null} />
				<Card.Body className="text-center">
					{profilePic && !access
						? <>
							<Card.Link onClick={() => changePhoto(profilePic.id)}>
								{photoSelector(profilePic.id)}
							</Card.Link>
							{userToShow.photos
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
					<Card.Title>{userToShow.username}, {userToShow.age}</Card.Title>
					<Card.Text>{userToShow.firstName} {userToShow.lastName}</Card.Text>
					<Card.Text>
						{userToShow.bio}
					</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroupItem>{userToShow.gender}</ListGroupItem>
					<ListGroupItem>
						looking for {userToShow.orientation
							.map((o, i) => i < userToShow.orientation.length - 1
								? `${o}, `
								: o
							)}
					</ListGroupItem>

					{userToShow.tags
						? <ListGroupItem>
							{userToShow.tags.split('#')
								.map((t, i) => i > 1
									? ` #${t}`
									: i === 1 ? `#${t}` : null
								)}
						</ListGroupItem>
						: null}
					{loggedUser.photos &&
						<ListGroupItem>
							{liked
								? <Card.Link href="#" onClick={event => likeHandler(event)}><FontAwesomeIcon icon={faHeart} /> Unlike</Card.Link>
								: <Card.Link href="#" onClick={event => likeHandler(event)}><FontAwesomeIcon icon={faHeart} /> Like</Card.Link>
							}
							<Card.Link href="#" onClick={event => reportHandler(event)}><FontAwesomeIcon icon={faFlag} /> Report</Card.Link>
							<Card.Link href="#" onClick={event => blockHandler(event)}><FontAwesomeIcon icon={faBan} /> Block</Card.Link>
						</ListGroupItem>
					}
					<ListGroupItem>
						<Card.Link as={Link} to="/">Back to the list</Card.Link>
					</ListGroupItem>
				</ListGroup>
			</>
		</Card>
}

export default UserCard
