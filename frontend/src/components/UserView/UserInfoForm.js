import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button, ResponsiveEmbed, Image } from 'react-bootstrap'
import userService from '../../services/userService'
import SelectGender from '../UserProfile/UpdateUserForm/SelectGender'
import SelectOrientation from '../UserProfile/UpdateUserForm/SelectOrientation'
import SelectTags from '../UserProfile/UpdateUserForm/SelectTags'
import photoService from '../../services/photoService'

const UploadFirstPhoto = ({ photo, setPhoto }) => {
	const [errorMessage, setErrorMessage] = useState(null)

	const handleImageChange = e => {
		e.preventDefault()

		let reader = new FileReader()
		let file = e.target.files[0]

		if (!file)
			return

		if (file.size > 350000) {
			setErrorMessage('Max photo size is 350kb')
			return
		}

		reader.onloadend = () => {
			setPhoto({
				photoStr: reader.result
			})
		}
		reader.readAsDataURL(file)
		setErrorMessage('')
	}

	const imagePreview = () => photo.photoStr
		? <ResponsiveEmbed aspectRatio="1by1" className="w-50 m-auto">
			<div className="d-flex" >
				<Image src={photo.photoStr} alt="upload preview" title="upload preview"
					className="img-fluid d-block m-auto" style={{ maxWidth: '100%', maxHeight: '100%' }} />
			</div>
		</ResponsiveEmbed>
		: null

	return <>
		<Form className="text-center">
			{imagePreview()}
			{
				photo.profilePic
					? null
					: <Form.Group>
						<Form.Label htmlFor="photo-upload" className="custom-photo-upload btn btn-primary mt-3">Choose photo</Form.Label>
						<Form.Control id="photo-upload" type="file"
							accept=".png, .jpg, .jpeg" onChange={handleImageChange} className='w-50 m-auto' />
					</Form.Group>
			}
			{errorMessage && <div className="text-center text-danger" >{errorMessage}</div>}
		</Form>
	</>
}

const UserInfoForm = ({ user, setUser }) => {

	const [photo, setPhoto] = useState({})
	const { register, handleSubmit, errors, control } = useForm()

	const userTagsFromDb = () => {
		const tagsFromUser = user.tags.split('#').map(t => ({ label: `#${t}`, value: `#${t}` }))
		return tagsFromUser.slice(1)
	}

	const [userTagsState, setUserTagsState] = useState({
		value: user.tags ? userTagsFromDb() : [],
		inputValue: ''
	})

	useEffect(() => {
		if (user.photos && user.photos.length > 0)
			setPhoto(user.photos.find(p => p.profilePic))
	}, [user.photos])


	const onSubmit = data => {

		//console.log('react-hook-form data', data)

		const orientationToDb = selected => {

			//console.log('orientation to db', selected)

			if (!selected)
				return ''
			if (selected.length === 3)
				return 'fmo'
			if (selected.length === 1)
				return selected[0].value.substring(0, 1)
			if (!selected.map(o => o.value).find(v => v === 'female'))
				return 'mo'
			if (!selected.map(o => o.value).find(v => v === 'male'))
				return 'fo'
			return 'fm'
		}

		// eslint-disable-next-line no-unused-vars
		const updatedUser = { ...data }

		updatedUser.gender = data.gender.value
		updatedUser.orientation = orientationToDb(data.orientation)
		updatedUser.tags = userTagsState.value && userTagsState.value.length !== 0
			? userTagsState.value.map(t => t.value).join('')
			: ''

		userService
			.updateUser(updatedUser, user.user_id)
			.then(data => {

				if (photo && !photo.profilePic) {

					photoService
						.addPhoto({
							user_id: user.user_id,
							profilePic: 1,
							...photo
						})
						.then(data => {
							const newUser = { ...user, ...data }
							const newPhoto = { ...data }
							newUser.photos = user.photos
								? user.photos.concat(newPhoto)
								: [newPhoto]

							setUser(newUser)
						})
						.catch(e => {
							console.log('Database error', e)
						})
				}
				else
					setUser({ ...user, ...data })
			})
			.catch(e => {
				console.log('Database error', e)
			})
	}

	const uploadPhotoProps = {
		photo, setPhoto
	}

	return <>
		<div className='text-info text-center mb-3'>Fill your info to start matching!</div>

		<UploadFirstPhoto {...uploadPhotoProps} />

		<Form onSubmit={handleSubmit(onSubmit)} className="mt-3">


			<SelectGender gender={user.gender} control={control} errors={errors} />

			<SelectOrientation orientation={user.orientation} control={control} errors={errors} />

			<SelectTags name='tags' state={userTagsState} setState={setUserTagsState} control={control} errors={errors} />

			<Form.Group className="text-left">
				<Form.Label>bio</Form.Label><br />
				<Form.Control as="textarea" name="bio" defaultValue={user.bio} maxLength="1000"
					ref={register({
						maxLength: {
							value: 1000,
							message: 'max length 1000'
						}
					})} />
				{errors.bio && (<p className="text-danger">{errors.bio.message}</p>)}
			</Form.Group>

			<Button className="mt-3" type="submit">Update</Button>
		</Form>
	</>
}

export default UserInfoForm