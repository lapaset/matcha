import React from 'react'
import {
	Container, Row, Col, Image, ResponsiveEmbed, Button,
	ButtonGroup
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import UploadModal from './UploadModal'

const Photo = ({ photo }) => (
	<>
		<Image src={photo.photoStr} alt="profile pic preview"
			title="profile pic preview" fluid={true} className="d-block m-auto mh-100 mw-100" />
		<ButtonGroup style={{
			position: "absolute",
			bottom: "5px",
			right: "5px",
		}}>
			<Button size="sm" variant="dark"><FontAwesomeIcon icon={faUser} /></Button>
			<Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
		</ButtonGroup>
	</>
)

const PhotoContainer = ({ photo, user, setUser }) => {

	const imagePreview = () => photo && photo.photoStr
		? <Photo photo={photo} />
		: <UploadModal user={user} setUser={setUser} />

	return <Col xs={6} md={4}>
		<ResponsiveEmbed aspectRatio="1by1">
			<div className="border rounded d-flex align-items-center">
				{imagePreview()}
			</div>
		</ResponsiveEmbed>
	</Col>

}

const UserPhotos = ({ user, setUser }) => {

	const emptyPhotos = () => user.photos ? 5 - user.photos.length : 5

	return <>
		<h2 className="text-center mt-3">User photos</h2>

		<Container>
			<Row noGutters={true} >
				{
					user.photos
						? user.photos.map(p => <PhotoContainer photo={p} key={p.id} user={user} setUser={setUser} />)
						: null
				}
				{[...Array(emptyPhotos())].map((e, i) => <PhotoContainer photo={null} key={i} user={user} setUser={setUser} />)}
			</Row>
		</Container>
	</>

}

export default UserPhotos

//todo:

// upload photo modal only available when there are less than 5 pictures
// what information is needed in the photo object?
// possibility to delete photo
// choose profile picture
// should the amount of photos be checked from the db before adding one?