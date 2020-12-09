import React, { useState, useRef, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Card, Modal } from 'react-bootstrap'

const Chat = ({ user, match, sendMessage, handleClose }) => {

	//console.log('chat open, user: ', user, 'match', match)

	const [input, setInput] = useState('')
	const messagesEndRef = useRef(null)

	const handleSubmit = e => {
		e.preventDefault()
		console.log('handle submit')

		if (!input)
			return
		sendMessage(user.user_id, user.username, match.user_id, input)
		setInput('')
	}

	useEffect(() => {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
	}, [match])
	//todo: max length for msg
	//		add profile pic to chat header

	return match
		? <>
			<Modal show={true} onHide={handleClose} >
				<Modal.Header closeButton>
					<Modal.Title>{match.username}</Modal.Title>
				</Modal.Header>

				<Modal.Body className="messageContainer" style={{ height: '60vh', overflowY: 'auto', paddingBottom: '5vh' }}>
					{match.messages.map(m =>
						<Card key={m.id} className="w-75 mt-2 text-left"
							style={{ marginLeft: user.user_id === m.sender ? '25%' : '0' }}>
							<Card.Body>{m.msg}</Card.Body>
						</Card>
					)}
					<div ref={messagesEndRef}></div>
				</Modal.Body>

				<Modal.Footer>
					<Form onSubmit={handleSubmit} className="w-100">
						<InputGroup >
							<Form.Control
								placeholder="write message and send"
								value={input}
								onChange={e => setInput(e.target.value)}
							/>
							<InputGroup.Append>
								<button className="btn btn-primary" type="submit">send</button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				</Modal.Footer>
			</Modal>
		</>
		: null
}

export default Chat