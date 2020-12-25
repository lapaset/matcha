import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import Photos from './Photos'
import ActionButtons from './ActionButtons'
import likeService from '../../services/likeService'
import reportService from '../../services/reportService'
import blockService from '../../services/blockService'
import socket from '../../socket'




const UserCard = ({ userToShow, loggedUser, wsClient }) => {

	const [access, setAccess] = useState(null)
	const [liked, setLiked] = useState(false)
	const [showMatchAlert, setShowMatchAlert] = useState(false)

	const users = {
		from_user_id: loggedUser.user_id,
		to_user_id: userToShow.user_id
	};

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
		likeService
			.getLike(loggedUser.user_id, userToShow.user_id)
			.then(res => {
				if (res.length > 0)
					setLiked(true)
			})
			.catch(e => {
				console.log(("Error: couldn't get like info"))
			})
	}, [loggedUser.user_id, userToShow.user_id])

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

				if (res.value === 1 && res.status === 'match') {
					sendNotification(`New match with ${loggedUser.username}`)
					setShowMatchAlert(true)
				}

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

	const actionButtonProps = {
		liked, likeHandler, reportHandler, blockHandler,
		hasPhoto: loggedUser.photos && loggedUser.photos.length > 0
	};


	//console.log('profile pic', profilePic, 'photos', user.photos);

	return access
		? null
		: <>
			<Card className="w-100 m-auto">

				<Photos photos={userToShow.photos} />
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

					<ActionButtons {...actionButtonProps} />

					<ListGroupItem>
						<Card.Link as={Link} to="/">Back to the list</Card.Link>
					</ListGroupItem>
				</ListGroup>

			</Card>
			<Modal show={showMatchAlert} variant="success" onHide={() => setShowMatchAlert(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>It's a match!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Link to='/matches'>You can now chat with {userToShow.username}</Link>
				</Modal.Body>
			</Modal>
		</>
}

export default UserCard
