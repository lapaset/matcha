import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './style/app.css'
import userService from './services/userService'
import notificationService from './services/notificationService'
import socket from './socket'
import UserView from './components/UserView'

const App = () => {

	const [user, setUser] = useState({})
	const [matches, setMatches] = useState([])
	const [notifications, setNotifications] = useState(null)
	const [chatToShow, setChatToShow] = useState(null)
	
	var wsClient = useRef({})
	const loadingUser = useRef(true);

	const props = {
		user,
		setUser,
		matches,
		setMatches,
		notifications,
		setNotifications,
		chatToShow,
		setChatToShow,
		wsClient
	};

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedMatchaUser')

		if (loggedUserJSON) {
			const userFromLocalStorage = JSON.parse(loggedUserJSON)

			userService
				.getUser(userFromLocalStorage.user_id)
				.then(data => {
					wsClient.current = socket.createWs(userFromLocalStorage.user_id)
					loadingUser.current = false
					setUser(data)
				})
				.catch(e => {
					console.log(e)
				})

			return () => {
				wsClient.current.send(JSON.stringify(({
					type: 'close',
					from: userFromLocalStorage.user_id
				})))
			}

		} else {

			loadingUser.current = false
			setUser({})
		}
	}, [])

	useEffect(() => {

		wsClient.current.onmessage = message => {

			const { type, ...dataFromServer } = JSON.parse(message.data)

			if (type === 'message' || type === "rejected") {

				const updatedMatches = [...matches]

				const match = updatedMatches
					.find(u => u.user_id === dataFromServer.sender || u.user_id === dataFromServer.receiver)

				if (!match)
					return

				match.messages.push(dataFromServer)

				if (type === 'message') {
					if (dataFromServer.receiver === user.user_id && (!chatToShow || chatToShow.user_id !== match.user_id ))
						socket.sendNotification(wsClient, {
							user_id: user.user_id,
							notification: `New message from ${match.username}`
						})
		
					else
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


	return loadingUser.current
		? null
		: <Router>
			<UserView {...props} />
		</Router>
}

export default App;