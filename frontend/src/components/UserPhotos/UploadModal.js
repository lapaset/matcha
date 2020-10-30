import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import photoService from '../../services/photoService'
import UploadPhoto from './UploadPhoto'

const UploadModal = ({ user, setUser }) => {

    const [photo, setPhoto] = useState({})
    const [showUpload, setShowUpload] = useState(false)
    const handleCloseUpload = () => setShowUpload(false)
    const handleOpenUpload = () => setShowUpload(true)

    const handleUpload = e => {
        e.preventDefault()
        console.log('handle upload', photo)
        console.log('user', user)

        photoService
            .addPhoto({
                user_id: user.user_id,
                ...photo
            })
            .then(data => {
                //console.log('photo added', data)

                const newPhoto = {
                    id: data.id,
                    ...photo
                }
                const updatedUser = {
                    ...user,
                    photos: user.photos
                        ? user.photos.concat(newPhoto)
                        : [newPhoto]
                    }

                //console.log('updatedUser', updatedUser)
                setShowUpload(false)
                setPhoto({})
                setUser(updatedUser)
            })
            .catch(e => {
                console.log('error', e)
                //if (e.response && e.response.data)
                //setErrorMessage(e.response.data.error)
                //setNotification('')
            })
    }

    const isProfilePic = () => user.photos && user.photos.length > 0
        ? 0
        : 1

    return <div className="d-block m-auto">
        <Button variant="primary" onClick={handleOpenUpload}>
            Upload Photo
		</Button>

        <Modal show={showUpload} onHide={handleCloseUpload}>
            <Modal.Header closeButton>
                <Modal.Title>Upload photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UploadPhoto photo={photo} setPhoto={setPhoto} profilePic={isProfilePic()}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUpload}>
                    Close
		  		</Button>
                <Button variant="primary" onClick={handleUpload}>
                    Upload
		  		</Button>
            </Modal.Footer>
        </Modal>
    </div>
}

export default UploadModal