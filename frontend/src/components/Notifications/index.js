import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import Notification from './Notification'
import notificationService from '../../services/notificationService'


const Notifications = ({ user_id, wsClient, notifications, setNotifications }) => {

	const history = useHistory()

	useEffect(() => {
		if (user_id) {
			notificationService
				.getNotifications(user_id)
				.then(res => {
					setNotifications(res)
				})
				.catch(e => {
					console.log('Error: could not get notifications', e)
				})
		}

	}, [user_id, setNotifications])

	useEffect(() => {

		wsClient.current.onmessage = message => {
			const { type, ...dataFromServer } = JSON.parse(message.data)

			console.log('wsClient message at notifications', type)

			//todo: think if you need the rejected type for anything
			/*if (type === 'message' || type === "rejected") {

				const updatedMatches = [...matches]

				const match = updatedMatches
					.find(u => u.user_id === dataFromServer.sender || u.user_id === dataFromServer.receiver)

				if (match) {
					match.messages.push(dataFromServer)
					if (dataFromServer.sender !== user.user_id && (!chatToShow || match.user_id !== chatToShow.user_id)) {
						notificationService
							.notify({
								user_id: user.user_id,
								notification: `New message from ${match.username}`
							})
					}
				}

				setMatches(updatedMatches)

			}*/
		}

	}, [wsClient])

	const handleClick = data => {
		notificationService
			.markAsRead(data.id)
			.then(() => {
				if (data.notification.startsWith('New message from'))
					history.push('/matches')
				setNotifications(notifications.map(n => n.id === data.id ? ({ ...n, read: 1 }) : n))

			})
	}

	const notificationsToRender = () => notifications
		? notifications.slice(0, 10)
		: []

	const unreadNotifications = () => notifications
		? notifications.find(n => !n.read) !== undefined
		: false

	const dropDownButton = () => <>
		<FontAwesomeIcon icon={faBell} />
		{ unreadNotifications()
			? <FontAwesomeIcon icon={faCircle} color='gold' size='xs' className='unreadNotifications' />
			: null
		}
	</>

	console.log('notifications at Notifications', notifications)
	return notifications
		? <DropdownButton className='notifications' variant='link' title={dropDownButton()}>
			<Dropdown.Header>Notifications</Dropdown.Header>
			{
				notificationsToRender()
					.map(n => <Notification key={n.id} data={n} handleClick={handleClick} />)
			}
			<Dropdown.Divider className='p-0' />
			<Dropdown.Item href="/notifications" className='p-2'>
				View all
		</Dropdown.Item>
		</DropdownButton>
		: null

}

export default Notifications