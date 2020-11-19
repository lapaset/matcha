import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'react-bootstrap'
import userService from '../../../services/userService'
import RequiredInputField from './RequiredInputField'
import PasswordFields from './PasswordFields'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'
import SelectTags from './SelectTags'


const UpdateUserForm = ({ user, setUser }) => {


	const userTagsFromDb = () => {
		const tagsFromUser = user.tags.split('#').map(t => ({ label: `#${t}`, value: `#${t}` }))
		return tagsFromUser.slice(1)
	}

	const [errorMessage, setErrorMessage] = useState('')
	const [notification, setNotification] = useState('')
	const [userTagsState, setUserTagsState] = useState({
		value: user.tags ? userTagsFromDb() : [],
		inputValue: ''
	})
	const { register, handleSubmit, errors, control, watch } = useForm()

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

		const updatedUser = {
			...data,
			gender: data.gender.value,
			orientation: orientationToDb(data.orientation),
			tags: userTagsState.value && userTagsState.value.length !== 0
				? userTagsState.value.map(t => t.value).join('') : '',
		}

		//console.log('update', updatedUser)

		userService
			.updateUser(updatedUser, user.user_id)
			.then(data => {
				//console.log('data when updated', data)
				setErrorMessage('')
				setNotification('user updated')
				setUser({
					...data,
					photos: user.photos ? user.photos : [],
					latitude: user.latitude,
					longitude: user.longitude
				})
			})
			.catch(e => {
				//console.log('error', e.response.data)
				if (e.response && e.response.data)
					setErrorMessage(e.response.data.error)
				setNotification('')
			})
	}

	return <form onSubmit={handleSubmit(onSubmit)} className="mt-3">


		{errorMessage && <div className="text-center text-danger" >{errorMessage}</div>}
		{notification && <div className="text-center text-success" >{notification}</div>}

		<Form.Group className="text-left">
			<Form.Label>
				age
    		</Form.Label>
			<Form.Control plaintext readOnly defaultValue={user.age} />
		</Form.Group>

		<RequiredInputField label='first name' errors={errors.firstName}
			name="firstName" defVal={user.firstName} maxLen='50'
			requirements={register({
				required: {
					value: true,
					message: '*'
				},
				maxLength: {
					value: 50,
					message: 'max length 50'
				}
			})} />

		<RequiredInputField label='last name' errors={errors.lastName}
			name="lastName" defVal={user.lastName} maxLen='50'
			requirements={register({
				required: {
					value: true,
					message: '*'
				},
				maxLength: {
					value: 50,
					message: 'max length 50'
				}
			})} />

		<RequiredInputField label='email' errors={errors.email}
			name="email" defVal={user.email} maxLen='255'
			requirements={register({
				required: {
					value: true,
					message: '*'
				},
				maxLength: {
					value: 255,
					message: 'max length 255'
				},
				pattern: {
					value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{ | }~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
					message: 'not a valid email'
				}
			})} />

		<SelectGender gender={user.gender} control={control} errors={errors} />

		<SelectOrientation orientation={user.orientation} control={control} errors={errors} />

		<SelectTags name='tags' state={userTagsState} setState={setUserTagsState} control={control} errors={errors} />

		<Form.Group className="text-left">
			<Form.Label>bio</Form.Label><br />
			<Form.Control as="textarea" name="bio" defaultValue={user.bio} maxLength="1000"
				ref={register({
					maxLength: {
						value: 1000,
						message: "max length 1000"
					}
				})} />
			{errors.bio && (<p className="text-danger">{errors.bio.message}</p>)}
		</Form.Group>

		<PasswordFields watch={watch} register={register} errors={errors} />

		<button className="btn btn-success mt-3" type="submit">Update</button>
	</form>
}

export default UpdateUserForm