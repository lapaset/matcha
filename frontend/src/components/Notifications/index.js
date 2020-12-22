import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import Notification from './Notification'

const Notifications = ({ notifications, handleClick }) => {

	const notificationsToRender = () => notifications
		? notifications.slice(0, 8)
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

	return notifications
		? <DropdownButton className='notifications' variant='link' title={dropDownButton()}>
			<Dropdown.Header>Notifications</Dropdown.Header>
			{
				notificationsToRender()
					.map(n => <Dropdown.Item key={n.id} onClick={() => handleClick(n)} className='p-2'>
						<Notification data={n} handleClick={handleClick} />
					</Dropdown.Item>)
			}
			<Dropdown.Divider className='p-0' />

			<Dropdown.Item as={Link} to='/notifications'>View all</Dropdown.Item>

		</DropdownButton>
		: null

}

export default Notifications