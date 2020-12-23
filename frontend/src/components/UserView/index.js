import React, { useState, useEffect } from 'react'
import { useRouteMatch, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'
import { Container, Nav } from 'react-bootstrap'
import UserProfile from '../UserProfile'
import Signup from '../Signup'
import Login from '../Login'
import Verify from '../Verify'
import Forgot from '../ForgotPassword'
import Reset from '../ForgotPassword/resetNewPasswd'
import UserSearch from '../UserSearch'
import UserCard from '../UserCard'
import Matches from '../Matches'
import Notifications from '../Notifications'
import NotificationsList from '../Notifications/NotificationsList'
import logoutService from '../../services/logoutService'
import userService from '../../services/userService'
import notificationService from '../../services/notificationService'

import '../../style/userView.css'

const UserView = ({ user, setUser, wsClient }) => {

	const [showUser, setShowUser] = useState(null)
	const [notifications, setNotifications] = useState(null)
	const history = useHistory()
	const matchUserRoute = useRouteMatch('/users/:id')
	const matchChatRoute = useRouteMatch('/chat/:id')
	const id = matchUserRoute
		? matchUserRoute.params.id
		: matchChatRoute
			? matchChatRoute.params.id
			: null

	const userInfoComplete = () => {
		return user.firstName && user.lastName && user.username && user.email && user.gender && user.orientation
	}

	useEffect(() => {
		userService
			.getUser(id)
			.then(data => {
				//console.log('data', data, 'id', id)
				setShowUser(data)
			})
			.catch(e => {
				console.log(`Error: could not get user id ${id}`, e)
			})
	}, [id])


	useEffect(() => {
		if (user.user_id) {
			notificationService
				.getNotifications(user.user_id)
				.then(res => {
					setNotifications(res)
				})
				.catch(e => {
					console.log('Error: could not get notifications', e)
				})
		}

	}, [user.user_id])

	const handleNotificationClick = data => {
		notificationService
			.markAsRead(data.id)
			.then(() => {
				if (data.notification.startsWith('New message from'))
					history.push('/matches')
				setNotifications(notifications.map(n => n.id === data.id ? ({ ...n, read: 1 }) : n))

			})
	}

	return <>
		<Nav className="nav">
			<div className="navLeft">
				<Link to="/">matcha</Link>
			</div>
			<div className="navRight">
				{user.username
					? <><Link to="/matches">matches</Link>
						<Link to="/profile">{user.username}</Link>
						<Notifications user_id={user.user_id} notifications={notifications} handleClick={handleNotificationClick} />
						<Link to="/login" onClick={() => logoutService.handleLogout(wsClient, user.user_id)}>logout</Link></>

					: <><Link to="/signup">signup</Link>
						<Link to="/login">login</Link></>
				}
			</div>
		</Nav>

		<Container id="main-container" fluid="lg" className="m-auto text-center">

			<Switch>
				<Route path="/" exact={true} render={() => user.user_id
					? userInfoComplete()
						? <UserSearch user={user} />
						: <Redirect to="/profile" />
					: <Redirect to="/login" />
				} />
				<Route path="/signup" component={Signup} />
				<Route path="/forgot" component={Forgot} />
				<Route path="/reset-password/:token" component={Reset} />
				<Route path="/login" render={() => user.user_id
					? <Redirect to="/" />
					: <Login setUser={setUser} wsClient={wsClient} />
				} />
				<Route path="/verify" render={() => user.user_id
					? <Redirect to="/" />
					: <Verify setUser={setUser} />
				} />
				<Route path="/users/:id" render={() => user.user_id
					? showUser
						? <UserCard userToShow={showUser} loggedUser={user} wsClient={wsClient} />
						: null
					: <Redirect to="/" />
				} />
				<Route path="/profile" render={() => user.user_id
					? userInfoComplete()
						? <UserProfile user={user} setUser={setUser} />
						: <><p className="text-center text-info">fill your info to start matching</p>
							<UserProfile user={user} setUser={setUser} /></>
					: <Redirect to="/" />
				} />
				<Route path="/matches" render={() => user.user_id
					? <Matches user={user} wsClient={wsClient} setNotifications={setNotifications} notifications={notifications} />
					: <Redirect to="/" />
				} />
				<Route path="/notifications" render={() => user.user_id
					? <NotificationsList notifications={notifications} handleClick={handleNotificationClick} />
					: <Redirect to="/" />
				} />
			</Switch>

		</Container>

		<footer>
			this is footer
		</footer>
	</>
}


export default UserView