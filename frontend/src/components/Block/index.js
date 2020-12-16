import React, { useState, useEffect } from 'react'
import { ListGroup, Button, Modal } from 'react-bootstrap'
import blockService from '../../services/blockService'

const BlockList = ({ user }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [blockedUsers, setBlockedUsers] = useState([])

	useEffect(() => {
		blockService
			.blockedList(user.user_id)
			.then(res => {
				setBlockedUsers(res.filter(r => r.from_user_id === user.user_id))
			})
	}, [user.user_id])

	const unblockUser = userObject => {

		blockService
			.unblockUser(userObject)
			.then(res => {
				setBlockedUsers(blockedUsers.filter(u => u.to_user_id !== userObject.to_user_id))
			})
	}

	return <>
		<Button onClick={() => setModalIsOpen(true)} variant="primary">Blocked users</Button>
		<Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Blocked users</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{blockedUsers && blockedUsers.length > 0
					? <ListGroup className="text-left" variant="flush">
						{blockedUsers.map(u =>
							<ListGroup.Item key={u.username}>
								<div style={{ display: "inline-block", width: "60%" }}>{u.username}</div>
								<div style={{ display: "inline-block", width: "40%", textAlign: "right" }}>
									<Button onClick={() => unblockUser(u)} variant="warning">Unblock</Button>
								</div>
							</ListGroup.Item>
						)}
					</ListGroup>
					: <div className="text-info">Your block list is empty</div>
				}
			</Modal.Body>
		</Modal>
	</>
}

export default BlockList;