import React, { useState, useEffect } from 'react'
import { useRouteMatch, Switch, Route, Link, Redirect } from 'react-router-dom'
import { Container, Nav } from 'react-bootstrap'
import '../../style/userView.css'
import UserProfile from '../UserProfile'
import Signup from '../Signup'
import Login from '../Login'
import Verify from '../Verify'
import Forgot from '../ForgotPassword'
import Reset from '../ForgotPassword/resetNewPasswd'
import UserSearch from '../UserSearch'
import UserCard from '../UserCard'
import logoutService from '../../services/logoutService'
import userService from '../../services/userService'
import likeDisplayService from '../../services/likeDisplayService'

const UserView = ({ user, setUser }) => {

	const [like, setLike] = useState(0)
	const [showUser, setShowUser] = useState(null)
	const matchRoute = useRouteMatch('/users/:id')
	const id = matchRoute ? matchRoute.params.id : null

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
				console.log(`Error: could not get user id ${id}`)
			})
	}, [id])

/// Here for like unlike
	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
	var from_user_id = coords.user_id;
	var to_user_id = id;

	useEffect(() => {
		const userObject = {
			from_user_id,
			to_user_id
		}
		likeDisplayService.likeDisplay(userObject)
		.then(res => {
			console.log("This is now added "+ res.value);
			setLike(res.value)
		})
	}, [])
////////End like unlike
	//console.log('showUser', showUser)

	//console.log('id', matchRoute.params.id)
	//console.log('user', user)
	//console.log('userToShow', matchRoute ? userToShow(matchRoute.params.id) : null)

	//kannattaako tata lahestya nain jos kayttajan saa user searchista???
//console.log("is thiss??")
//console.log(like);
	return <>
		<Nav className="nav">
			<div className="navLeft">
				<Link to="/">matcha</Link>
			</div>
			<div className="navRight">
				{user.username
					? <><Link to="/profile">{user.username}</Link>
						<Link to="/login" onClick={logoutService.handleLogout}>logout</Link></>

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
							? <UserCard user={showUser} like_show={like}/>
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
				<Route path="/login" render={() =>
					user.user_id ? <Redirect to="/" /> : <Login setUser={setUser} />
				} />
				<Route path="/verify" render={() =>
					user.user_id ? <Redirect to="/" /> : <Verify setUser={setUser} />
				} />å
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