import React, { useState } from 'react'
import photoService from '../../services/photoService'
import { Container, Row, Col, Image, ResponsiveEmbed, Button,
	ButtonGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'

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

const PhotoContainer = ({ photo }) => {

	const imagePreview = () => photo && photo.photoStr
		? <Photo photo={photo} />
		: <span className="d-block m-auto">add picture</span>

	return <Col xs={6} md={4}>
		<ResponsiveEmbed aspectRatio="1by1">
			<div className="border rounded d-flex align-items-center">
				{imagePreview()}
			</div>
		</ResponsiveEmbed>
	</Col>

}

const UploadPhoto = ({ photo, setPhoto, name }) => {
	const [errorMessage, setErrorMessage] = useState(null)

	const handleImageChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		if (!file)
			return

		if (file.size > 350000) {
			setErrorMessage('Max photo size is 350kb')
			return
		}

		reader.onloadend = () => {
			setPhoto({
				file: file,
				imgUrl: reader.result
			})
		}
		reader.readAsDataURL(file)
		setErrorMessage('')

	}

	const imagePreview = () => photo.imgUrl
		? <img src={photo.imgUrl} alt="profile pic preview" title="profile pic preview"
			className="img-fluid mh-100 mw-100 d-block" />
		: null
	/*? <img src={photo1.imgUrl} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
	: profilePic
		? <img src={profilePic} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
		: null*/


	return <>
		<div style={{
			width: "20em",
			height: "20em",
		}} className="border d-flex align-items-center" >
			{imagePreview()}
		</div>
		<div className="input-group">

			<input className="form-control" type="file" name={name}
				accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
		</div>
		{errorMessage && <div className="text-center text-danger" >{errorMessage}</div>}
	</>
}

const UserPhotos = ({ user, setUser }) => {

	const [showUpload, setShowUpload] = useState(false)

	const handleCloseUpload = () => setShowUpload(false)
	const handleOpenUpload = () => setShowUpload(true)

	const handleUpload = e => {
		e.preventDefault()
		console.log('handle upload')
	}

	const handleSubmit = e => {
		e.preventDefault();

		/*photoService
			.addPhoto({
				user_id: user.user_id,
				profilePic: 0,
				photoStr: photo2.imgUrl
			})
			.then(data => {
				//console.log('data when updated', data)
				//setErrorMessage('')
				//setNotification('user updated')
				//setUser(data)
				//setProfilePicture({})
				console.log('photo added', data)
			})
			.catch(e => {
				console.log('error', e)
				//if (e.response && e.response.data)
				//setErrorMessage(e.response.data.error)
				//setNotification('')
			})*/
	}

	return <>
		<h2 className="text-center mt-3">User photos</h2>

		<Container>
			<Row noGutters={true} >
				{//map photos
					user.photos
						? user.photos.map(p => <PhotoContainer photo={p} key={p.id} />)
						: null
				}
				{[...Array(5 - user.photos.length)].map((e, i) => <PhotoContainer photo={null} key={i} />)}
			</Row>
			<Row>
				{/*
				<form className="text-center" onSubmit={handleSubmit}>
					<UploadPhoto photo={photo2} setPhoto={setPhoto2} name="photo2" />
					<button className="btn btn-success mt-3" type="submit">Upload</button>
				</form>
				*/}
			</Row>
			<>
				<Button variant="primary" onClick={handleOpenUpload}>
					Launch demo modal
      			</Button>

				<Modal show={showUpload} onHide={handleCloseUpload}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseUpload}>
							Close
          				</Button>
						<Button variant="primary" onClick={handleUpload}>
							Save Changes
          				</Button>
					</Modal.Footer>
				</Modal>
			</>
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