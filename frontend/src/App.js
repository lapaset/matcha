import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './style/app.css'

import userService from './services/userService'
import socket from './socket'
import UserView from './components/UserView'

const App = () => {

	const [user, setUser] = useState({})
	var wsClient = useRef({})
	const loadingUser = useRef(true);

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
				alert('will unmount');
			}

		} else {

			loadingUser.current = false
			setUser({})
		}
	}, [])

	//console.log(user)

	return loadingUser.current
		? null
		: <Router>
			<UserView user={user} setUser={setUser} wsClient={wsClient} />
		</Router>
}

export default App;