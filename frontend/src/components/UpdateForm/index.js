import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'
import SelectTags from './SelectTags'
import userService from '../../services/userService'
import tagService from '../../services/tagService'

const UpdateForm = ({ user, setUser }) => {
	const { register, handleSubmit, errors, control } = useForm()
	
	const [ tags, setTags ] = useState(false)
	const [ userTags, setUserTags ] = useState(user.tags)
	const [ errorMessage, setErrorMessage ] = useState('')

	useEffect(() => {
		tagService
			.getTags()
			.then(data => {
				setTags(data)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	const onSubmit = data => {
		console.log(data)


		const orientationToDb = selected => {

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
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			password: user.password,
			gender: data.gender.value,
			orientation: orientationToDb(data.orientation),
			tags: userTags,
			bio: data.bio
		}

		console.log('updateduser', updatedUser)

		userService
			.updateUser(updatedUser, user.user_id)
			.then(data => {
				console.log('data when updated', data)
				setUser(data)
				setErrorMessage('')
				//todo: clear fields
			})
			.catch(e => {
				console.log('error', e.response.data)
				setErrorMessage(e.response.data.error)
			})
	}

	//todo add password field

	return <div>
			{ errorMessage && 
		   		<div><strong>{errorMessage}</strong></div>
			}
			<h2 className="text-center mt-3">Update user</h2>
			<div className="row justify-content-center align-items-center">
				
				<form className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleSubmit(onSubmit)}>
					
					<div className="form-group">
						<label>first name</label><br />
						<input className="form-control" name="firstName" ref={register({ required: true })} defaultValue={user.firstName} />
						{errors.firstName && errors.firstName.type === 'required' && (<p className="text-danger">Required</p>)}
					</div>

					<div className="form-group">
						<label>last name</label><br />
						<input className="form-control" name="lastName" ref={register({ required: true })} defaultValue={user.lastName} />
						{errors.lastName && errors.lastName.type === 'required' && (<p className="text-danger">Required</p>)}
					</div>

					<div className="form-group">
						<label>username</label><br />
						<input className="form-control" name="username" ref={register({ required: true })} defaultValue={user.username} />
						{errors.username && errors.username.type === 'required' && (<p className="text-danger">Required</p>)}
					</div>

					<div className="form-group">
						<label>email</label><br />
						<input className="form-control" name="email" ref={register({ required: true })} defaultValue={user.email} />
						{errors.email && errors.email.type === 'required' && (<p className="text-danger">Required</p>)}
					</div>

					<SelectGender gender={user.gender} control={control} errors={errors} />

					<SelectOrientation orientation={user.orientation} control={control} errors={errors} />
					<SelectTags name='tags' setUserTags={setUserTags} userTags={userTags}
						tags={tags} setTags={setTags} />
					
					<div className="form-group">
						<label>bio</label><br />
						<textarea className="form-control" name="bio" defaultValue={user.bio}
							maxLength="1000" ref={register} />
					</div>
				
					<button className="btn btn-success mt-3" type="submit">Update</button>
				</form>
			</div>
		</div>
}

export default UpdateForm;