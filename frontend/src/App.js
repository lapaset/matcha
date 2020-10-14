import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import userService from './services/users'
import UpdateForm from './components/UpdateForm/'
import Signup from './components/Signup'
import Login from './components/Login'
import './style/app.css'


const UserList = ({ users }) => {
	return users
		? <div>
			<h2>users</h2>
			<ul>
				{users.map(u => {
					return <li key={u.user_id}>{u.user_id}: {u.username}, {u.email}, {u.gender} looking for {u.orientation} </li>
				})}
			</ul>
		</div>
		: null
}

const App = () => {
	const [users, setUsers] = useState(false)

	useEffect(() => {
		userService
			.getAll()
			.then(u => {
				//console.log(users)
				setUsers(u)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	return (
		<Router>
			<div className="nav">
				<Link to="/">home</Link>
				<Link to="/update">update</Link>
				<Link to="/signup">signup</Link>
				<Link to="/login">login</Link>
			</div>
			<Switch>
				<Route path="/update">
					<UpdateForm />
				</Route>
				<Route path="/signup">
					<Signup />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/">
					<UserList users={users} />
				</Route>
			</Switch>
			<footer>
				this footer stays here
			</footer>
		</Router>
	)

	/*const [users, setUsers] = useState(false)

	const getUsers = () => {
		userService
			.getAll()
			.then(u => {
				setUsers(u)
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
	)*/
}

export default App;