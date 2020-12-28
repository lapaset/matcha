import React, { useState, useEffect } from 'react'
import { ListGroup, Modal } from 'react-bootstrap'
import viewService from '../../../services/viewsService'

const VisitHistory = () => {
	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'))
	const userObject = {
		username: coords.username
	}
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [viewhistory, setViewhistory] = useState([])

	useEffect(() => {
		viewService.viewsHistory(userObject)
			.then(res => {
				setViewhistory(res)
			})
	}, [])
	//console.log(viewhistory);
	var i = 0
	return <>
		<a  href="#/" onClick={() => setModalIsOpen(true)} variant="light">views</a>
		<Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Your visit history</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{viewhistory && viewhistory.length > 0
					? <ListGroup className="text-left" variant="flush">
						{viewhistory.map(u =>
							(u.from_visit_username === coords.username ?
								<ListGroup.Item key={i++}>
									<div style={{ display: 'inline-block', width: '60%' }}>You visited <a href={`http://localhost:3000/users/${u.to_user_id}`}>{u.to_visit_username} </a>profile</div>
								</ListGroup.Item>
								:
								<ListGroup.Item key={i++}>
									<div key={i++} style={{ display: 'inline-block', width: '60%' }}><a href={`http://localhost:3000/users/${u.from_user_id}`}>{u.from_visit_username}</a> visited your profile</div>
								</ListGroup.Item>
							)

						)}
					</ListGroup>
					: <div className="text-info">Your visit history is empty</div>
				}
			</Modal.Body>
		</Modal>
	</>
}

export default VisitHistory