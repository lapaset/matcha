import React from 'react'
import UserPhotos from './UserPhotos'
import UpdateUserForm from './UpdateUserForm'
import Map from './Map/index'
import BlockList from './BlockList/index'

const UserProfile = ({ user, setUser }) => {

	return <>
		<h1>{user.username}</h1>
		<UserPhotos user={user} setUser={setUser} />
		<UpdateUserForm user={user} setUser={setUser} />
		<Map user={user} setUser={setUser} />
		<BlockList user={user}/>
	</>
}

export default UserProfile