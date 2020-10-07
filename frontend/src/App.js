import React, { useState, useEffect } from 'react'
import UpdateForm from './components/UpdateForm/'

const UserList = ({ users }) => (
	<div>
		<h2>users</h2>
		<ul>
			{users.map(u => {
				return <li key={u.user_id}>{u.user_id}: {u.username}, {u.gender} looking for {u.orientation} </li>
			})}
		</ul>
	</div>
)

const App = () => {

	const [users, setUsers] = useState(false)

	const getUsers = () => {
		fetch('http://localhost:3001/users')
			.then(res => {
				return res.json()
			})
			.then(data => {
				setUsers(data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		getUsers()
	}, [])

	return (
		<>
			<UpdateForm getUsers={getUsers} />
			{ users ? <UserList users={users} /> : 'No user data available'}
		</>
	)
}

export default App;