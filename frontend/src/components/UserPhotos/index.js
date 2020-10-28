import React, { useState } from 'react'
import photoService from '../../services/photoService'
import { Container, Row, Col, Image, ResponsiveEmbed, Button, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'

const Photo = ({ photo }) => (
	<>
		<Image src={photo.imgUrl} alt="profile pic preview"
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

	const imagePreview = () => photo.imgUrl
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

	const handleDelete = e => {
		console.log('delete', e)
		setPhoto({})
	}

	const imagePreview = () => photo.imgUrl
		? <img src={photo.imgUrl} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
		: null
	/*? <img src={photo1.imgUrl} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
	: profilePic
		? <img src={profilePic} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
		: null*/


	return <>
		<div>
			{imagePreview()}
		</div>
		<div className="input-group">

			<input className="form-control" type="file" name={name}
				accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
			<div className="input-group-append">
				<button className="btn btn-danger" type="button" name={`${name}Delete`}
					disabled={Object.entries(photo).length === 0} onClick={handleDelete}>
					<b> x </b>
				</button>
			</div>
		</div>
		{errorMessage && <div className="text-center text-danger" >{errorMessage}</div>}
	</>
}

const UserPhotos = ({ userId }) => {
	const [photo1, setPhoto1] = useState({})
	const [photo2, setPhoto2] = useState({})

	const handleSubmit = e => {
		e.preventDefault();

		photoService
			.addPhoto({
				user_id: userId,
				profilePic: 0,
				photoStr: photo1.imgUrl
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
			})
	}

	if (photo2.file)
		console.log(photo2.file)

	return <>
		<h2 className="text-center mt-3">User photos</h2>

		<Container>
			<Row noGutters={true} >
				<PhotoContainer photo={photo2} />
				<PhotoContainer photo={photo2} />
				<PhotoContainer photo={photo2} />
				<PhotoContainer photo={photo2} />
				<PhotoContainer photo={photo2} />
			</Row>
			<Row>
				<form className="text-center" onSubmit={handleSubmit}>
					<UploadPhoto photo={photo2} setPhoto={setPhoto2} name="photo2" />
					<button className="btn btn-success mt-3" type="submit">Upload</button>
				</form>
			</Row>
		</Container>

	</>

}

export default UserPhotos

//todo:
// make a ruudukko for the five pictures
// check if this can be done with react-hook-form
// get photos from the db ( join user_id & photos )
// add all the photos to db
// should there be just one upload and possibility to delete existing photos or change them to profile_pic