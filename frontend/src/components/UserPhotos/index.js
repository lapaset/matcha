import React, { useState, useEffect } from 'react'
import {
	Container, Row, Col, Image, ResponsiveEmbed, Button,
	ButtonGroup
} from 'react-bootstrap'
import '../../style/profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser, faPlus } from '@fortawesome/free-solid-svg-icons'
import UploadModal from './UploadModal'
import photoService from '../../services/photoService'
import { NonceProvider } from 'react-select'

const PhotoButtons = ({ photo, user, setUser, profilePic, show }) => {

	const toggleProfilePic = () => {

		//console.log('toggle profile pic', photo);
		photoService
			.toggleProfilePhoto(photo.id, 1)
			.then(() => {
				photoService
					.toggleProfilePhoto(profilePic.id, 0)
					.then(() => {
						const updatedUser = {
							...user,
							photos: user.photos.map(p => p.id === photo.id
								? { ...p, profilePic: 1 }
								: p.id = profilePic.id
									? { ...p, profilePic: 0 }
									: p)
						}
						//console.log(updatedPhotos);
						setUser(updatedUser)
					})
					.catch(e => {
						console.log('error at toggle profile pic', e);
					})
			})
			.catch(e => {
				console.log('error at toggle profile pic', e);
			})
	}

	const handleDelete = () => {

		photoService
			.deletePhoto(photo.id)
			.then(() => {

				if (photo.profilePic) {
					const newProfilePic = user.photos.find(p => !p.profilePic)

					if (newProfilePic) {
						photoService
							.toggleProfilePhoto(newProfilePic.id, 1)
							.then(() => {
								const updatedUser = {
									...user,
									photos: user.photos
										.filter(p => p.id !== photo.id)
										.map(p => p.id === newProfilePic.id
											? { ...p, profilePic: 1 }
											: p)
								}
								setUser(updatedUser)
							})
					} else {
						const updatedUser = {
							...user,
							photos: user.photos.filter(p => p.id !== photo.id)
						}
						setUser(updatedUser)
					}
				} else {
					const updatedUser = {
						...user,
						photos: user.photos.filter(p => p.id !== photo.id)
					}
					setUser(updatedUser)
				}
			})
			.catch(e => {
				console.log('error at delete photo', e)
			})
	}

	const profilePicButton = () => photo.profilePic
		? <Button size="sm" variant="light" disabled>
			<FontAwesomeIcon icon={faUser} color="gold" />
		</Button>
		: <Button size="sm" variant="light" onClick={toggleProfilePic}>
			<FontAwesomeIcon icon={faUser} />
		</Button>

	const buttonStyle = show
		? {
			display: "block",
			position: "absolute",
			bottom: "5px",
			right: "5px"
		}
		: {
			display: "none",
			position: "absolute",
			bottom: "5px",
			right: "5px"
		}

	return <ButtonGroup style={buttonStyle}>

		{profilePicButton()}

		<Button size="sm" variant="danger" onClick={handleDelete}>
			<FontAwesomeIcon icon={faTrash} />
		</Button>

	</ButtonGroup>
}

const EmptyBox = ({ user, setUser }) => {

	const [showModal, setShowModal] = useState(false)
	const openModal = () => setShowModal(true)
	const closeModal = () => setShowModal(false)

	const buttonStyle = {
		position: "absolute",
		bottom: "5px",
		right: "5px"
	}

	return <ResponsiveEmbed aspectRatio="1by1">
		<div className="border d-flex align-items-center">
			<Button size="sm" variant="light" onClick={openModal} style={buttonStyle}>
				<FontAwesomeIcon icon={faPlus} />
			</Button>
			<UploadModal user={user} setUser={setUser} showModal={showModal}
				closeModal={closeModal} />
		</div>
	</ResponsiveEmbed>
}

const PhotoBox = ({ photo, user, setUser, profilePic }) => {

	const [hovered, setHovered] = useState(false)

	const buttons = () => <PhotoButtons photo={photo} user={user} setUser={setUser} profilePic={profilePic}
		show={hovered} />


	const imgStyle = () => hovered
		? {
			display: 'block',
			margin: 'auto',
			maxWidth: '105%',
			maxHeight: '105%'
		}
		: {
			display: 'block',
			margin: 'auto',
			maxWidth: '100%',
			maxHeight: '100%'
		}

	//console.log('hovered', hovered )
	return <ResponsiveEmbed aspectRatio="1by1">
		<div className="border d-flex align-items-center img-fluid"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}>
			<Image src={photo.photoStr} alt={user.username}
				title={user.username}
				style={imgStyle()} />
			{buttons()}
		</div>
	</ResponsiveEmbed>
}

const UserPhotos = ({ user, setUser }) => {

	const [profilePic, setProfilePic] = useState(null)
	const maxPhotos = 5
	const emptyPhotos = () => user.photos ? maxPhotos - user.photos.length : maxPhotos

	useEffect(() => {
		if (user.photos && user.photos.length > 0)
			setProfilePic(user.photos.find(p => p.profilePic))
		else
			setProfilePic(null)
	}, [user.photos])

	const profilePhoto = () => profilePic
		? <PhotoBox photo={profilePic} user={user}
			setUser={setUser} profilePic={profilePic} />
		: null

	//console.log('profile pic', profilePic)

	return <Container>
		<Row noGutters={true} >
			<Col>
				{profilePhoto()}
			</Col>
		</Row>
		<Row noGutters={true} >
			{
				user.photos
					? user.photos.map(p => p.profilePic
						? null
						: <Col xs={6} key={p.id}>
							<PhotoBox photo={p} user={user} setUser={setUser} profilePic={profilePic} />
						</Col>)
					: null
			}
			{
				[...Array(emptyPhotos())]
					.map((e, i) =>
						<Col xs={6} key={i}>
							<EmptyBox photo={null} user={user} setUser={setUser} />
						</Col>)}
		</Row>
	</Container>

}

export default UserPhotos

//todo:
// refactor
// profile pic container
// should the amount of photos be checked from the db before adding one?
