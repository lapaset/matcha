import React, { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import viewService from '../../../services/viewsService'

const VisitHistory = ({ user }) => {

	const [viewhistory, setViewhistory] = useState([])

	useEffect(() => {
		viewService
			.viewsHistory({ username: user.username })
			.then(res => {
				setViewhistory(res)
			})
	}, [user.username])

	var i = 0
	return viewhistory && viewhistory.length > 0
		? <ListGroup className="text-left" variant="flush">
			{viewhistory.map(u => u.from_visit_username === user.username
				? <ListGroup.Item key={i++}>
					<div style={{ display: 'inline-block', width: '60%' }}>You visited <a href={`http://localhost:3000/users/${u.to_user_id}`}>{u.to_visit_username} </a>profile</div>
				</ListGroup.Item>
				: <ListGroup.Item key={i++}>
					<div key={i++} style={{ display: 'inline-block', width: '60%' }}><a href={`http://localhost:3000/users/${u.from_user_id}`}>{u.from_visit_username}</a> visited your profile</div>
				</ListGroup.Item>
			)}
		</ListGroup>
		: <div className="text-info">Your visit history is empty</div>
}

export default VisitHistory