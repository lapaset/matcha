import React, { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import Chat from './Chat'
import userService from '../../services/userService'
import chatService from '../../services/chatService'
import likeService from '../../services/likeService'
import notificationService from '../../services/notificationService'

const Matches = ({ user, wsClient, setNotifications, notifications }) => {
	const [matches, setMatches] = useState([])
	const [chatToShow, setChatToShow] = useState(null)

	useEffect(() => {

		likeService
			.getLikes(user.user_id)
			.then(likes => {

				userService
					.getAll()
					.then(users => {

						const matchesFromDb = []

						likes.filter(l => l.match).forEach(m => {
							const match = users.find(u => u.user_id === m.to_user_id)
							if (match)
								matchesFromDb.push({ ...match, messages: [] })
						})

						if (matchesFromDb.length < 1) {
							setMatches(matchesFromDb)
							return
						}

						chatService
							.getChatHistory(user.user_id)
							.then(res => {

								res.forEach(m => {
									const match = matchesFromDb.find(u => u.user_id === m.sender || u.user_id === m.receiver)
									if (match)
										match.messages.push(m)
								})

								setMatches(matchesFromDb)
							})
					})
			})
	}, [user.user_id])

	useEffect(() => {

		const sendNotification = (notification) => {

			//show some kind of error if connection is not working
			if (wsClient.current.readyState > 1) {
				console.log('Error: could not send notification, websocket state', wsClient.current.readyState)
				return
			}

			wsClient.current.send(JSON.stringify({
				...notification,
				type: 'notification'
			}))

		}

		wsClient.current.onmessage = message => {
			const { type, ...dataFromServer } = JSON.parse(message.data)

			//console.log('message on client', type, dataFromServer)

			if (type === 'message' || type === "rejected") {

				const updatedMatches = [...matches]

				const match = updatedMatches
					.find(u => u.user_id === dataFromServer.sender || u.user_id === dataFromServer.receiver)

				if (!match)
					return

				match.messages.push(dataFromServer)

				if (type === 'message') {
					if (dataFromServer.receiver === user.user_id && (!chatToShow || chatToShow.user_id !== match.user_id )) {
						console.log('we should get here')
						sendNotification({ user_id: user.user_id, notification: `New message from ${match.username}` })
					}
					setMatches(updatedMatches)
				}

				if (type === 'rejected' && dataFromServer.sender === user.user_id) {
					notificationService
						.notify({
							user_id: dataFromServer.receiver,
							notification: `New message from ${user.username}`
						})
						.then(() => {
							setMatches(updatedMatches)
						})
						.catch(e => {
							console.log('Error sending notification', e)
						})
				}



			}
			if (type === 'notification') {
				const updatedNotifications = [...notifications]
				updatedNotifications.unshift({ ...dataFromServer })
				setNotifications(updatedNotifications)
			}
		}

	}, [matches, user.user_id, chatToShow, wsClient, notifications, setNotifications, user.username])

	return matches && matches.length !== 0
		? <>
			<ListGroup className="text-left text-primary" variant="flush">
				{matches.map(m =>
					<ListGroup.Item key={m.username} onClick={() => setChatToShow(m)}>
						{m.username}
					</ListGroup.Item>)
				}
			</ListGroup>

			<Chat user={user} match={chatToShow} wsClient={wsClient}
				handleClose={() => setChatToShow(null)} />
		</>
		: <div>Get some matches to chat</div>

}

export default Matches