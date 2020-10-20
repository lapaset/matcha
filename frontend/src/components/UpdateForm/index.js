import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'
import SelectTags from './SelectTags'
import userService from '../../services/userService'

const UpdateForm = ({ user, setUser }) => {
	const { register, handleSubmit, errors, control, watch } = useForm()
	const [ errorMessage, setErrorMessage ] = useState('')
	const [ notification, setNotification ] = useState('')
	const password = useRef({})
	password.current = watch("password", "")

	const onSubmit = data => {
		//console.log('react-hook-form data', data)

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
			...data,
			gender: data.gender.value,
			orientation: orientationToDb(data.orientation),
			tags: data.tags ? data.tags.map(t => t.value).join('') : '',
		}

		//console.log('updateduser', updatedUser)

		userService
			.updateUser(updatedUser, user.user_id)
			.then(data => {
				//console.log('data when updated', data)
				setUser(data)
				setErrorMessage('')
				setNotification('user updated')
			})
			.catch(e => {
				//console.log('error', e.response.data)
				setErrorMessage(e.response.data.error)
				setNotification('')
			})
	}

	return <div>
		<h2 className="text-center mt-3">Update user</h2>

		<div className="row justify-content-center align-items-center">

			<form className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleSubmit(onSubmit)}>

				{ errorMessage && <div className="text-danger" >{errorMessage}</div> }
				{ notification && <div className="text-success" >{notification}</div> }

				<div className="form-group">
					<label>first name</label>
					{errors.firstName && errors.firstName.type === 'required' && (<span className="text-danger"> *</span>)}<br />
					<input className="form-control" name="firstName" defaultValue={user.firstName} maxLength="50"
						ref={register({ required: true, maxLength: 50 })} />
					{errors.firstName && errors.firstName.type === 'maxLength' && (<p className="text-danger">Max length is 50</p>)}
				</div>

				<div className="form-group">
					<label>last name</label><br />
					<input className="form-control" name="lastName" defaultValue={user.lastName} maxLength="50"
						ref={register({ required: true, maxLength: 50 })} />
					{errors.lastName && errors.lastName.type === 'required' && (<p className="text-danger">Required</p>)}
					{errors.lastName && errors.lastName.type === 'maxLength' && (<p className="text-danger">Max length is 50</p>)}
				</div>

				<div className="form-group">
					<label>username</label><br />
					<input className="form-control" name="username" defaultValue={user.username} maxLength="50"
						ref={register({ required: true, maxLength: 50 })} />
					{errors.username && errors.username.type === 'required' && (<p className="text-danger">Required</p>)}
					{errors.username && errors.username.type === 'maxLength' && (<p className="text-danger">Max length is 50</p>)}
				</div>

				<div className="form-group">
					<label>email</label><br />
					<input className="form-control" name="email" type="email" defaultValue={user.email} maxLength="255"
						ref={register({
							required: true, maxLength: 255,
							pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{ | }~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
						})} />
					{errors.email && errors.email.type === 'required' && (<p className="text-danger">Required</p>)}
					{errors.email && errors.email.type === 'pattern' && (<p className="text-danger">Not a valid email</p>)}
					{errors.username && errors.username.type === 'maxLength' && (<p className="text-danger">Max length is 255</p>)}
				</div>

				<div className="form-group">
					<label>password</label><br />
					<input className="form-control" name="password" type="password" defaultValue="" maxLength="50"
						ref={register({ maxLength: {
											value: 50,
											message: "max length 50" },
										minLength: {
											value: 8,
											message: "min length 8" },
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
											message: "must contain a number, an upper and a lower case letter"
										}})} />
					{errors.password && (<p className="text-danger">{errors.password.message}</p>)}

					<label>confirm password</label><br />
					<input className="form-control" name="password2" type="password" defaultValue="" maxLength="50"
						ref={register({ validate: value => value === password.current || "passwords don't match" })} />
					{errors.password2 && (<p className="text-danger">{errors.password2.message}</p>)}
				</div>

				<SelectGender gender={user.gender} control={control} errors={errors} />

				<SelectOrientation orientation={user.orientation} control={control} errors={errors} />

				<SelectTags name='tags' userTags={user.tags} control={control} errors={errors} />

				<div className="form-group">
					<label>bio</label><br />
					<textarea className="form-control" name="bio" defaultValue={user.bio}
						maxLength="1000" ref={register({ maxLength: 1000 })} />
					{errors.bio && errors.bio.type === 'maxLength' && (<p className="text-danger">Max length is 255</p>)}
				</div>

				<button className="btn btn-success mt-3" type="submit">Update</button>
			</form>
		</div>
	</div>
}

export default UpdateForm;