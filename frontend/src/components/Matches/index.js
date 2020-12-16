import React, { useState, useEffect, useRef } from 'react'
import userService from '../../services/userService'
import Chat from './Chat'
import socket from '../../socket'
import chatService from '../../services/chatService'
import { ListGroup } from 'react-bootstrap'

const Matches = ({ user }) => {
	const [matches, setMatches] = useState([])
	const [chatToShow, setChatToShow] = useState(null)

	const handleClose = () => setChatToShow(null)

	var client = useRef({})

	const sendMessage = (from, fromUn, to, msg) => {

		//show some kind of error if connection is not working
		if (client.current.readyState > 1) {
			console.log('could not send, websocket state', client.current.readyState)
			return
		}

		client.current.send(JSON.stringify({
			type: 'message',
			from,
			user: fromUn,
			to,
			msg
		}))

		console.log('message sent', msg)
	}

	useEffect(() => {
		userService
			.getAll()
			.then(res => {
				const matches = res
					.filter(u => u.user_id !== user.user_id)
					.map(u => ({ ...u, messages: [] }))

				if (matches.length < 1) {
					setMatches(matches)
					return
				}

				chatService
					.getChatHistory(user.user_id)
					.then(res => {

						res.forEach(m => {
							const match = matches.find(u => u.user_id === m.sender || u.user_id === m.receiver)
							if (match)
								match.messages.push(m)
						})

						setMatches(matches)
					})
			})
	}, [user.user_id])

	useEffect(() => {
		client.current = socket.createWs(user.user_id)

		return () => {
			client.current.send(JSON.stringify(({
				type: 'close',
				from: user.user_id
			})))
			alert('will unmount');
		}
	}, [user.user_id])

	useEffect(() => {

		client.current.onmessage = message => {
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

	}, [matches, user.user_id, chatToShow])

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