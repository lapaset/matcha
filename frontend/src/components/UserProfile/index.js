import React, {useEffect, useState } from 'react'
import UserPhotos from './UserPhotos'
import UpdateUserForm from './UpdateUserForm'
import Map from '../Map/index'
import BlockList from '../Block/index'
import BlockListService from '../../services/blockService'

const UserProfile = ({ user, setUser }) => {
	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
    var from_user_id = coords.user_id;
    var userObject = {
        from_user_id
    }
	const [block, setBlock] = useState([])
	
	useEffect(() => {
		BlockListService.blockedList(userObject)
		.then(res => {
			setBlock(res)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <>
		<h1>{user.username}</h1>
		<UserPhotos user={user} setUser={setUser} />
		<UpdateUserForm user={user} setUser={setUser} />
		<Map />	
		<BlockList blockuser={block}/>
	</>
}

export default UserProfile;