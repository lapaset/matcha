import React, { useState, useEffect } from 'react'
import UpdateForm from './components/UpdateForm/'

const UserList = ({ users }) => (
	<ul>
		{users.map(u => {
			return <li key={u.user_id}>{u.user_id}: {u.username}, {u.gender} looking for {u.orientation} </li>
		})}
	</ul>
)

const App = () => {

	const [users, setUsers] = useState(false)

	useEffect(() => {
		getUsers()
	}, [])

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

	return (
		<>
			<UpdateForm getUsers={getUsers} />
			{ users ? <UserList users={users} /> : 'There is no user data available'}
		</>
	)
}

export default App;