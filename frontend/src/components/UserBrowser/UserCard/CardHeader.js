import React from 'react'
import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward } from '@fortawesome/free-solid-svg-icons'

const CardHeader = ({ hideUser, fame }) => <Card.Body>
	<span className="text-info" style={{ float: "left", cursor: "pointer" }} onClick={hideUser}>
		Back to the list
	</span>
	<span style={{ float: "right" }}>
		<FontAwesomeIcon icon={faAward} /> {fame}
	</span>
</Card.Body>

export default CardHeader