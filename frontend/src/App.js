import React, { useState, useEffect } from 'react'

const App = () => {
	const [ users, setUsers ] = useState(false)
	
	useEffect(() => {
		getUsers()
	}, [])

	const getUsers = () => {
		fetch('http://localhost:3001')
			.then(res => {
				return res.text()
			})
			.then(data => {
				setUsers(data)
			})
	}

	const createUser = () => {
		let name = prompt('name')
		let username = prompt('username')
		let email = prompt('email')
		let password = prompt('password')
		let gender = prompt('gender')
		let orientation = prompt('orientation')

		fetch('http://localhost:3001/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, username, email, password, gender, orientation  }),
		})
			.then(res => {
				return res.text()
			})
			.then(data => {
				alert(data)
				getUsers()
			})
	}

	const deleteUser = () => {
		let id = prompt('Enter user id')
		fetch(`http://localhost:3001/users/${id}`, {
			method: 'DELETE',
		})
			.then(res => {
				return res.text()
			})
			.then(data => {
				alert(data)
				getUsers()
			})
	}

	return (
		<div>
			{ users ? users : 'There is no user data available' }
			<br />
			<button onClick={createUser}>Add user</button>
			<br />
			<button onClick={deleteUser}>Delete user</button>
		</div>
	)
}

export default App;