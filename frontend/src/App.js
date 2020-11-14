import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import userService from './services/userService'
import './style/app.css'
import UserView from './components/UserView'

const App = () => {

	const [user, setUser] = useState({})
	const loadingUser = useRef(true);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedMatchaUser')

		if (loggedUserJSON) {
			const userFromLocalStorage = JSON.parse(loggedUserJSON)

			userService
				.getUser(userFromLocalStorage.user_id)
				.then(data => {
					loadingUser.current = false
					setUser(data)
				})
				.catch(e => {
					console.log(e)
				})
		} else {

			loadingUser.current = false
			setUser({})
		}
	}, [])

	//console.log(user)

	return loadingUser.current
		? null
		: <Router>
			<UserView user={user} setUser={setUser} />
		</Router>
}

export default App;