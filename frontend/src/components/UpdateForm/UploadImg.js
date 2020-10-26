import React, { useState } from 'react'
import userService from '../../services/userService'


const UploadImg = ({ id, profilePic, setErrorMessage, setNotification, setUser }) => {
	const [profilePicture, setProfilePicture] = useState({})

	const handleSubmit = e => {
		e.preventDefault();

		if (!profilePicture.imgUrl)
			return

		userService
			.updateUser({ profilePic: profilePicture.imgUrl }, id)
			.then(data => {
				//console.log('data when updated', data)
				setErrorMessage('')
				setNotification('user updated')
				setUser(data)
			})
			.catch(e => {
				//console.log('error', e.response.data)
				if (e.response && e.response.data)
					setErrorMessage(e.response.data.error)
				setNotification('')
			})
	}

	const handleImageChange = e => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		if (!file)
			return

		if (file.size > 350000) {
			setErrorMessage('Max photo size is 350kb')
			setNotification('')
			return
		}

		reader.onloadend = () => {
			setProfilePicture({
				file: file,
				imgUrl: reader.result
			})
		}
		reader.readAsDataURL(file)
	}

	const imagePreview = () => profilePicture.imgUrl
		? <img src={profilePicture.imgUrl} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
		: profilePic
			? <img src={profilePic} alt="profile pic preview" title="profile pic preview" className="img-thumbnail" />
			: null

	return <>
		<form onSubmit={handleSubmit}>
			<div>
				{imagePreview()}
			</div>
			<div className="input-group">
				<input className="form-control" type="file" name="photo" accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
				<div className="input-group-append">
					<button className="btn btn-success" type="submit">Upload</button>
				</div>
			</div>
		</form>
	</>
}

export default UploadImg