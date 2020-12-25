import React from 'react'
import { ListGroupItem, OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faFlag, faBan } from '@fortawesome/free-solid-svg-icons'

const DisabledLikeButton = () => <OverlayTrigger overlay={
	<Tooltip id="tooltip-disabled">You must have a profile picture to like users</Tooltip>}>
	<span>
		<Button variant="link" className="disabled">
			<FontAwesomeIcon icon={faHeart} /> Like
		</Button>
	</span>
</OverlayTrigger>

const ActionButton = ({ action, icon, text }) =>
	<Button variant="link" onClick={e => action(e)}>
		<FontAwesomeIcon icon={icon} /> {text}
	</Button>


const ActionButtons = ({ liked, hasPhoto, likeHandler, reportHandler, blockHandler }) => {
	return <ListGroupItem>
		{
			hasPhoto || liked
				? <ActionButton action={likeHandler} icon={faHeart} text={ liked ? " Unlike" : " Like" } />
				: <DisabledLikeButton likeHandler={likeHandler} />
		}
		<ActionButton action={reportHandler} icon={faFlag} text=" Report" />
		<ActionButton action={blockHandler} icon={faBan} text=" Block" />
	</ListGroupItem>
}

export default ActionButtons