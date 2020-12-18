import React, { useState, useEffect } from 'react'
import userService from '../../services/userService'
import Chat from './Chat'
import chatService from '../../services/chatService'
import { ListGroup } from 'react-bootstrap'
import likeService from '../../services/likeService'

const Matches = ({ user, wsClient }) => {
	const [matches, setMatches] = useState([])
	const [chatToShow, setChatToShow] = useState(null)

	const handleClose = () => setChatToShow(null)

	const sendMessage = (from, fromUn, to, msg) => {

		//show some kind of error if connection is not working
		if (wsClient.current.readyState > 1) {
			console.log('could not send, websocket state', wsClient.current.readyState)
			return
		}

		wsClient.current.send(JSON.stringify({
			type: 'message',
			from,
			user: fromUn,
			to,
			msg
		}))

		console.log('message sent', msg)
	}

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

			wsClient.current.onmessage = message => {
				const { type, ...dataFromServer } = JSON.parse(message.data)


				//todo: think if you need the rejected type for anything
				if (type === 'message' || type === "rejected") {

					const updatedMatches = [...matches]

					const match = updatedMatches.find(u => u.user_id === dataFromServer.sender || u.user_id === dataFromServer.receiver)

					if (match) {
						match.messages.push(dataFromServer)
						if (dataFromServer.sender !== user.user_id && (!chatToShow || match.user_id !== chatToShow.user_id))
							console.log('you have new message')
					}


					setMatches(updatedMatches)

				}
			}

		}, [matches, user.user_id, chatToShow, wsClient])

		//console.log('users', matches)

		//console.log('messages', messages)

		//todo: get matches instead of everyone
		//		add profile picture thumbnails to list
		return <>
			{
				matches && matches.length !== 0
					? <>
						<ListGroup className="text-left text-primary" variant="flush">
							{matches.map(m => <ListGroup.Item key={m.username} onClick={() => setChatToShow(m)}>
								{m.username}
							</ListGroup.Item>)}
						</ListGroup>
						<Chat user={user} match={chatToShow} sendMessage={sendMessage}
							handleClose={handleClose} />
					</>
					: <div>Get some matches to chat</div>
			}
		</>

	}

export default Matches