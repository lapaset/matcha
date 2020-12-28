import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'
import SelectGender from '../../UserProfile/UpdateUserForm/SelectGender'
import SelectOrientation from '../../UserProfile/UpdateUserForm/SelectOrientation'
import SelectTags from '../../UserProfile/UpdateUserForm/SelectTags'
import UploadFirstPhoto from './UploadFirstPhoto'
import userService from '../../../services/userService'
import photoService from '../../../services/photoService'
import dbFunctions from '../../../utils/dbFunctions'

const UserInfoForm = ({ user, setUser }) => {

	const [photo, setPhoto] = useState({})
	const { register, handleSubmit, errors, control } = useForm()

	const [userTagsState, setUserTagsState] = useState({
		value: dbFunctions.userTagsFromDb(user.tags),
		inputValue: ''
	})

	useEffect(() => {
		if (user.photos && user.photos.length > 0)
			setPhoto(user.photos.find(p => p.profilePic))
	}, [user.photos])


	const onSubmit = data => {

		const updatedUser = { ...data }
		updatedUser.gender = data.gender.value
		updatedUser.orientation = dbFunctions.orientationToDb(data.orientation)
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

	return <>
		<div className='text-info text-center mb-3'>Fill your info to start matching!</div>

		<UploadFirstPhoto photo={photo} setPhoto={setPhoto} />

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