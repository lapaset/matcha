import React, { useState } from 'react'

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
		<div className="input-group">
			<div>
				{imagePreview()}
			</div>
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

const UserPhotos = () => {
	const [photo1, setPhoto1] = useState({})
	const [photo2, setPhoto2] = useState({})

	const handleSubmit = e => {
		e.preventDefault();

		if (!photo1.imgUrl)
			return
		/*
				userService
					.updateUser({ profilePic: profilePicture.imgUrl }, id)
					.then(data => {
						//console.log('data when updated', data)
						//setErrorMessage('')
						//setNotification('user updated')
						setUser(data)
						setProfilePicture({})
					})
					.catch(e => {
						//console.log('error', e.response.data)
						//if (e.response && e.response.data)
							//setErrorMessage(e.response.data.error)
						//setNotification('')
					})*/
	}



	return <>
		<h2 className="text-center mt-3">User photos</h2>

		<form className="text-center mt-3" onSubmit={handleSubmit}>
			<div className="row justify-content-center align-items-center">
				<div className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8">
					<UploadPhoto photo={photo1} setPhoto={setPhoto1} name="photo1" />
				</div>
				<div className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8">
					<UploadPhoto photo={photo2} setPhoto={setPhoto2} name="photo2" />
				</div>
			</div>
			<button className="btn btn-success mt-3" type="submit">Upload</button>
		</form>

	</>

}

export default UserPhotos