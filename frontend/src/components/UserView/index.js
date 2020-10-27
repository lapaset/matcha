import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import UpdateForm from '../UpdateForm/'
import Signup from '../Signup'
import Login from '../Login'
import Verify from '../Verify'
import Forgot from '../ForgotPassword'
import Reset from '../ForgotPassword/resetNewPasswd'
import userService from '../../services/userService'
import logoutService from '../../services/logoutService'


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

const UserView = ({ user, setUser }) => {
	const [users, setUsers] = useState(false)
	
	console.log('do we get here?');

	useEffect(() => {
		userService
			.getAll()
			.then(u => {
				setUsers(u)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	const userInfoComplete = () => {
		return user.firstName && user.lastName && user.username && user.email && user.gender && user.orientation
	}
	
	console.log('here')
	
	return <Router>
			<div className="nav">
				<Link to="/">home</Link>
				{user.username
					? <><Link to="/update">update</Link>
						<div>user: {user.username}</div>
						<Link to="/login" onClick={logoutService.handleLogout}>Logout</Link></>
					: <><Link to="/signup">signup</Link>
						<Link to="/login">login</Link></>}
			</div>
			<Switch>
				<Route path="/update" render={() =>
					user.user_id
						? userInfoComplete()
							? <UpdateForm user={user} setUser={setUser} />
							: <><p className="text-center text-info">fill your info to start matching</p>
							<UpdateForm user={user} setUser={setUser} /></>
							
						: <Redirect to="/login" />
				} />
				<Route path="/signup">
					<Signup />
				</Route>
				<Route path="/forgot">
					<Forgot />
				</Route>
				<Route path="/reset-password/:token">
					<Reset />
				</Route>
				<Route path="/login" render={() =>
					user.user_id ? <Redirect to="/" /> : <Login setUser={setUser} />
				} />
				<Route path="/verify">
					<Verify setUser={setUser} />
				</Route>
				<Route path="/" render={() =>
					user.user_id
						? userInfoComplete() ? <UserList users={users} /> : <Redirect to="/update" />
						: <><h1>Welcome</h1></>
				} />
			</Switch>
			<footer>
				this is footer
			</footer>
		</Router>
}

export default UserView