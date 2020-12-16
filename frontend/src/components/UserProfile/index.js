import React, { useEffect, useState } from 'react'
import UserPhotos from './UserPhotos'
import UpdateUserForm from './UpdateUserForm'
import Map from '../Map/index'
import BlockList from '../Block/index'
import blockService from '../../services/blockService'

const UserProfile = ({ user, setUser }) => {
	const [blockedUsers, setBlockedUsers] = useState([])

	useEffect(() => {
		blockService
			.blockedList(user.user_id)
			.then(res => {
				setBlockedUsers(res.filter(r => r.from_user_id === user.user_id))
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <>
		<h1>{user.username}</h1>
		<UserPhotos user={user} setUser={setUser} />
		<UpdateUserForm user={user} setUser={setUser} />
		<Map />
		<BlockList blockuser={blockedUsers} />
	</>
}

export default UserProfile;