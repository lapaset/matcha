import React from 'react'
import { ListGroup } from 'react-bootstrap'
import Notification from './Notification'

const NotificationsList = ({ notifications, handleClick }) => notifications

	? <ListGroup className="text-left text-primary" variant="flush">
		{notifications.map(n =>
			<ListGroup.Item key={n.id} onClick={() => handleClick(n)}>
				<Notification data={n} />
			</ListGroup.Item>)
		}
	</ListGroup>
	: null

export default NotificationsList