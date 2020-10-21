import React, { useState, useEffect, useRef } from 'react'
import userService from './services/userService'
import './style/app.css'
import UserView from './components/UserView'

const App = () => {

	const [user, setUser] = useState({})
	const loadingUser = useRef(true);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedMatchaUser')
		console.log('first here')
		if (loggedUserJSON) {
			const userFromLocalStorage = JSON.parse(loggedUserJSON)
			console.log('then here')
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
			console.log('then here');
			loadingUser.current = false
			setUser({})
		}
	}, [])

	console.log('loadingUser', loadingUser.current)

	return loadingUser.current
		? null
		: <UserView user={user} setUser={setUser} />
}

export default App;