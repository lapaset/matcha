import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import UserCard from './UserCard'
import UserSearch from './UserSearch'

const UserBrowser = ({ user, wsClient, showUserAtLoad, matches, setMatches }) => {
	const [showUser, setShowUser] = useState(showUserAtLoad)
	const { path, url } = useRouteMatch()
	const history = useHistory()

	useEffect(() => {
		setShowUser(showUserAtLoad)
	}, [showUserAtLoad])

	const activeLinkStyle = {
		fontWeight: 'bold'
	}

	const hideUser = () => {
		history.push('/browse')
		setShowUser(null)
	}

	return showUser

		? <UserCard user_id={showUser} loggedUser={user} wsClient={wsClient} hideUser={hideUser} matches={matches} setMatches={setMatches} />

		: <>
			<ButtonGroup className="mb-5">
				<Button variant="outline-light"><NavLink exact to={`${url}`} activeStyle={activeLinkStyle}>All</NavLink></Button>

				<Button variant="outline-light"><NavLink to={`${url}/likes`} activeStyle={activeLinkStyle}>Likes</NavLink></Button>

				<Button variant="outline-light"><NavLink to={`${url}/views`} activeStyle={activeLinkStyle}>Views</NavLink></Button>
			</ButtonGroup>
			<Switch>
				<Route exact path={path} render={() => showUser
					? null
					: <UserSearch user={user} wsClient={wsClient} setShowUser={setShowUser} /> } />
				<Route path={`${path}/likes`}>
					<div>Show users that like you</div>
				</Route>
				<Route path={`${path}/views`}>
					<div>Show users that viewed you</div>
				</Route>
			</Switch>
		</>

}

export default UserBrowser