import React, { useEffect } from 'react'
import { useLocation, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'
import { Container, Nav } from 'react-bootstrap'
import UserProfile from '../UserProfile'
import Signup from '../Signup'
import Login from '../Login'
import Verify from '../Verify'
import Forgot from '../ForgotPassword'
import Reset from '../ForgotPassword/resetNewPasswd'
import UserBrowser from '../UserBrowser'
import Matches from '../Matches'
import Notifications from '../Notifications'
import NotificationsList from '../Notifications/NotificationsList'
import logoutService from '../../services/logoutService'
import Views from '../Views/index'
import notificationService from '../../services/notificationService'

import '../../style/userView.css'

const UserView = ({ user, setUser, matches, setMatches, notifications, setNotifications,
	chatToShow, setChatToShow, wsClient }) => {

	const history = useHistory()
	let location = useLocation()

	const userInfoComplete = () => {
		return user.firstName && user.lastName && user.username && user.email && user.gender && user.orientation
	}

	const matchProps = {
		user,
		matches,
		setMatches,
		chatToShow,
		setChatToShow,
		wsClient
	};

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

	}, [user.user_id, setNotifications])

	const handleNotificationClick = data => {
		notificationService
			.markAsRead(data.id)
			.then((res) => {
				if (data.notification.endsWith('viewed your profile') ||
					data.notification.endsWith('likes you'))
					history.push(`browse/?user_id=${data.from_id}`)
				else if (data.notification.startsWith('New message from') ||
					data.notification.startsWith('New match with') ||
					data.notification.startsWith('No longer match with'))
					history.push('/matches')
				setNotifications(notifications.map(n => n.id === data.id ? ({ ...n, read: 1 }) : n))

			})
	}

	const markAllNotificationsRead = () => {
		notificationService
			.markAllAsRead(user.user_id)
			.then(() => {
				setNotifications(notifications.map(n => ({ ...n, read: 1 })))
			})
	}

	return <>
		<Nav className="nav">
			<div className="navLeft">
				<Link to="/browse">matcha</Link>
			</div>
			<div className="navRight">
				{user.username
					? <><Link to="/matches">matches</Link>
						<Link to="/profile">{user.username}</Link>
						<Views />
						<Notifications user_id={user.user_id} notifications={notifications} handleClick={handleNotificationClick} markAllAsRead={markAllNotificationsRead} />
						<Link to="/login" onClick={() => logoutService.handleLogout(wsClient, user.user_id)}>logout</Link></>

					: <><Link to="/signup">signup</Link>
						<Link to="/login">login</Link></>
				}
			</div>
		</Nav>

		<Container id="main-container" fluid="lg" className="m-auto text-center">

			<Switch>
				<Route path="/" exact={true} render={() => {

					return user.user_id
						? userInfoComplete()
							? <Redirect to="/browse" />
							: <Redirect to="/profile" />
						: <Redirect to="/login" />
				}} />

				<Route path="/browse" render={() => {

					const showUser = location && location.search.indexOf('user_id=') &&
						Number(location.search.substring(location.search.indexOf('user_id=') + 8))

						? Number(location.search.substring(location.search.indexOf('user_id=') + 8))
						: null

					return user.user_id
						? userInfoComplete()
							? <UserBrowser user={user} wsClient={wsClient} showUserAtLoad={showUser} matches={matches} setMatches={setMatches} />
							: <Redirect to="/profile" />
						: <Redirect to="/login" />
				}} />
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
				<Route path="/profile" render={() => user.user_id
					? userInfoComplete()
						? <UserProfile user={user} setUser={setUser} />
						: <><p className="text-center text-info">fill your info to start matching</p>
							<UserProfile user={user} setUser={setUser} /></>
					: <Redirect to="/" />
				} />
				<Route path="/matches" render={() => user.user_id
					? <Matches {...matchProps} />
					: <Redirect to="/" />
				} />
				<Route path="/notifications" render={() => user.user_id
					? <NotificationsList notifications={notifications} handleClick={handleNotificationClick} markAllAsRead={markAllNotificationsRead} />
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