import React, { useState, useEffect } from 'react'
import UserCard from './UserCard'
import UserSearch from './UserSearch'

const UserBrowser = ({ user, wsClient, showUserAtLoad }) => {
	const [showUser, setShowUser] = useState(null)

	useEffect(() => {
		setShowUser(showUserAtLoad)
	}, [showUserAtLoad])


	return showUser

	? <UserCard user_id={showUser} loggedUser={user} wsClient={wsClient} setShowUserAtUserSearch={setShowUser} />

	: <UserSearch user={user} wsClient={wsClient} setShowUser={setShowUser} />
}

export default UserBrowser