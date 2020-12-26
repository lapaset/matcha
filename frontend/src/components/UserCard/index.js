import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import Photos from './Photos'
import ActionButtons from './ActionButtons'
import UserInformation from './UserInformation'
import MatchModal from './MatchModal'
import likeService from '../../services/likeService'
import reportService from '../../services/reportService'
import blockService from '../../services/blockService'
import viewService from '../../services/viewsService'
import socket from '../../socket'
import ConfirmationModal from './ConfirmationModal'


const UserCard = ({ userToShow, loggedUser, wsClient }) => {

	const [access, setAccess] = useState(null)
	const [liked, setLiked] = useState(false)
	const [matchModal, setMatchModal] = useState(null)
	const [confirmationModal, setConfirmationModal] = useState(null)

	const users = {
		from_user_id: loggedUser.user_id,
		to_user_id: userToShow.user_id
	};

	//views working
	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		viewService.views(users)
		.then(res => {
			console.log(res.message)
		})
		.catch(e => {
			console.log(("Error: couldn't get block info"))
		})
	}, []) 
	//
	useEffect(() => {

		socket.sendNotification(wsClient, {
			user_id: userToShow.user_id,
			from_id: loggedUser.user_id,
			notification: `${loggedUser.username} viewed your profile`
		})

	}, [loggedUser.user_id, loggedUser.username, userToShow.user_id, wsClient])


	//access value is all twisted!
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

		likeService.toggleLike(userToShow.user_id)
			.then(res => {

				if (res.value === 1 && res.status === 'match') {
					sendNotification(`New match with ${loggedUser.username}`)
					setMatchModal(userToShow.username)
				}

				else if (res.value === 1 && res.status === 'like')
					sendNotification(`${loggedUser.username} likes you`)

				else if (res.value === 0 && res.status === 'unmatch')
					sendNotification(`No longer match with ${loggedUser.username}`)

				setLiked(res.value)
			})

	}

	const reportHandler = () => {
		reportService.report(userToShow.user_id)
			.then(() => setConfirmationModal(null))
			.catch(e => {
				console.log(e)
			})
	}

	const blockHandler = () => {
		blockService.block(userToShow.user_id)
			.then(() => {
				window.location.href = "http://localhost:3000";
			})
			.catch(e => {
				console.log(e)
			})
	}

	const actionButtonProps = {
		liked, likeHandler, reportHandler, blockHandler, setConfirmationModal,
		hasPhoto: loggedUser.photos && loggedUser.photos.length > 0,
		username: userToShow.username
	};

	return !access && <>
			<Card className="w-100 m-auto">
				<Card.Body>
					<span style={{ float: "left" }}><Link to="/">Back to the list</Link></span>
					<span style={{ float: "right" }}><FontAwesomeIcon icon={faAward} /> {userToShow.fame}</span>
				</Card.Body>
				<Photos photos={userToShow.photos} />
				<UserInformation user={userToShow} />
				<ActionButtons { ...actionButtonProps } />
			</Card>
			<MatchModal modal={matchModal} setModal={setMatchModal} />
			<ConfirmationModal modal={confirmationModal} setModal={setConfirmationModal} />
		</>
}

export default UserCard
