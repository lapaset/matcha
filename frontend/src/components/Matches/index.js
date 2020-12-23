import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import Chat from './Chat'
import userService from '../../services/userService'
import chatService from '../../services/chatService'
import likeService from '../../services/likeService'

const Matches = ({ user, matches, setMatches, chatToShow, setChatToShow, wsClient }) => {

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
	}, [user.user_id, setMatches])

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