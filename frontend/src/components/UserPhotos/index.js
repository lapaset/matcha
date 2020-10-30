import React, { useState, useEffect } from 'react'
import {
	Container, Row, Col, Image, ResponsiveEmbed, Button,
	ButtonGroup
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import UploadModal from './UploadModal'
import photoService from '../../services/photoService'

const Photo = ({ photo, name, user, setUser, profilePic }) => {

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
											: p )
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



	return <>
		<Image src={photo.photoStr} alt={name}
			title={name} fluid={true} className="d-block m-auto mh-100 mw-100" />
		<ButtonGroup style={{
			position: "absolute",
			bottom: "5px",
			right: "5px",
		}}>

			{
				photo.profilePic
					? <Button size="sm" variant="light" disabled>
						<FontAwesomeIcon icon={faUser} color="gold" />
					</Button>
					: <Button size="sm" variant="light" onClick={toggleProfilePic}>
						<FontAwesomeIcon icon={faUser} />
					</Button>
			}

			<Button size="sm" variant="danger" onClick={handleDelete}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	</>
}

const PhotoContainer = ({ photo, user, setUser, profilePic }) => {

	const content = () => photo && photo.photoStr
		? <Photo photo={photo} name={user.username} user={user}
			setUser={setUser} profilePic={profilePic} />
		: <UploadModal user={user} setUser={setUser} />

	return <Col xs={6} md={4}>
		<ResponsiveEmbed aspectRatio="1by1">
			<div className="border d-flex align-items-center">
				{content()}
			</div>
		</ResponsiveEmbed>
	</Col>

}

const UserPhotos = ({ user, setUser }) => {

	const [profilePic, setProfilePic] = useState(null)
	const emptyPhotos = () => user.photos ? 5 - user.photos.length : 5

	useEffect(() => {
		if (user.photos && user.photos.length > 0) 
			setProfilePic(user.photos.find(p => p.profilePic))
		else
			setProfilePic(null)
	}, [user.photos])

	//console.log('profile pic', profilePic)

	return <>
		<h2 className="text-center mt-3">User photos</h2>

		<Container>
			<Row noGutters={true} >
				<Col>
				{
					profilePic
						? <div className="border d-flex align-items-center">
							<Photo photo={profilePic} name={user.username} user={user}
								setUser={setUser} profilePic={profilePic} />
						</div>
						: null
				}
				</Col>
			</Row>
			<Row noGutters={true} >
				{
					user.photos
						? user.photos.map(p => p.profilePic
							? null
							: <PhotoContainer photo={p} key={p.id} user={user} setUser={setUser} profilePic={profilePic} /> )

						: null
				}
				{[...Array(emptyPhotos())].map((e, i) => <PhotoContainer photo={null} key={i} user={user} setUser={setUser} />)}
			</Row>
		</Container>
	</>

}

export default UserPhotos

//todo:

// should the amount of photos be checked from the db before adding one?
