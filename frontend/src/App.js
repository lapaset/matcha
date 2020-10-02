import React, { useState, useEffect } from 'react'
import UpdateForm from './components/UpdateForm'

const App = () => {

	const [users, setUsers] = useState(false)

	useEffect(() => {
		getUsers()
	}, [])

	const getUsers = () => {
		fetch('http://localhost:3001/users')
			.then(res => {
				return res.text()
			})
			.then(data => {
				setUsers(data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<>
			{ users ? users : 'There is no user data available'}
			<UpdateForm getUsers={getUsers} />
		</>
	)
}

export default App;