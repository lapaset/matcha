import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

const Notification = ({ data, handleClick }) => (
	<Dropdown.Item onClick={() => handleClick(data)} className='p-2'>
		{data.read ? null : <FontAwesomeIcon icon={faCircle} color="gold" size="xs" className="mr-1" />}
		{data.notification}
	</Dropdown.Item>
)

export default Notification