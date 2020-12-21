import React, { useState, useEffect } from 'react'
import { useRouteMatch, Switch, Route, Link, Redirect } from 'react-router-dom'
import { Container, Nav, Card, Dropdown, DropdownButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import '../../style/userView.css'
import UserProfile from '../UserProfile'
import Signup from '../Signup'
import Login from '../Login'
import Verify from '../Verify'
import Forgot from '../ForgotPassword'
import Reset from '../ForgotPassword/resetNewPasswd'
import UserSearch from '../UserSearch'
import UserCard from '../UserCard'
import Matches from '../Matches'
import logoutService from '../../services/logoutService'
import userService from '../../services/userService'
import notificationService from '../../services/notificationService'


const Notification = ({ data }) => {


	return data.read
		? <Dropdown.Item href="#" className='p-2'>
			{data.notification}
		</Dropdown.Item>

		: <Dropdown.Item href="#" className='p-2 text-success'>
			<FontAwesomeIcon icon={faCircle} color="green"></FontAwesomeIcon> {data.notification}
		</Dropdown.Item>
}


const Notifications = ({ data, notificationCard }) => {

	return <DropdownButton className='notifications' variant="link" title={<FontAwesomeIcon icon={faBell} />}>
		<Dropdown.Header>Notifications</Dropdown.Header>
		{
			data.map(n => <Notification key={n.id} data={n} />)
		}
		<Dropdown.Divider className='p-0' />
		<Dropdown.Item href="#" className='p-2'>
			View all
		</Dropdown.Item>
	</DropdownButton>

}

const UserView = ({ user, setUser, wsClient }) => {

	const [showUser, setShowUser] = useState(null)
	const [notifications, setNotifications] = useState(null)

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
	//console.log('showUser', showUser)

	//console.log('id', matchRoute.params.id)
	//console.log('user', user)
	//console.log('userToShow', matchRoute ? userToShow(matchRoute.params.id) : null)

	const notificationsToRender = () => notifications
		? notifications.slice(0, 10)
		: []

	return <>
		<Nav className="nav">
			<div className="navLeft">
				<Link to="/">matcha</Link>
			</div>
			<div className="navRight">
				{user.username
					? <><Link to="/matches">matches</Link>
						<Link to="/profile">{user.username}</Link>
						{
							notifications
								? <Notifications data={notificationsToRender()} />
								: null
						}
						<Link to="/login" onClick={() => logoutService.handleLogout(wsClient, user.user_id)}>logout</Link></>

					: <><Link to="/signup">signup</Link>
						<Link to="/login">login</Link></>
				}
			</div>
		</Nav>
		<Container id="main-container" fluid="lg" className="m-auto text-center">

			<Switch>
				<Route path="/users/:id">
					{
						showUser
							? <UserCard userToShow={showUser} loggedUser={user} />
							: null
					}
				</Route>
				<Route path="/profile" render={() =>
					user.user_id
						? userInfoComplete()
							? <UserProfile user={user} setUser={setUser} />
							: <><p className="text-center text-info">fill your info to start matching</p>
								<UserProfile user={user} setUser={setUser} /></>

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
				<Route path="/matches" render={() =>
					user.user_id ? <Matches user={user} wsClient={wsClient} /> : <Redirect to="/" />
				} />
				<Route path="/login" render={() =>
					user.user_id ? <Redirect to="/" /> : <Login setUser={setUser} wsClient={wsClient} />
				} />
				<Route path="/verify" render={() =>
					user.user_id ? <Redirect to="/" /> : <Verify setUser={setUser} />
				} />
				<Route path="/" render={() =>
					user.user_id
						? userInfoComplete() ? <UserSearch user={user} /> : <Redirect to="/profile" />
						: <Redirect to="/login" />
				} />
			</Switch>
		</Container>

		<footer>
			this is footer
		</footer>
	</>
}


export default UserView