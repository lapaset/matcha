import React, { useState, useEffect } from 'react'
import { useField } from '../../hooks'
import InputField from './InputField'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'
import SelectTags from './SelectTags'
import Textarea from './Textarea'
import userService from '../../services/userService'
import tagService from '../../services/tagService'

const UpdateForm = ({ user, setUser }) => {

	//TODO: 
	// gender, tags and orientation translations in the components?

	const id = user.user_id

	const { reset: firstNameReset, ...firstName } = useField('text', user.firstName)
	const { reset: lastNameReset, ...lastName } = useField('text', user.lastName)
	const { reset: usernameReset, ...username } = useField('text', user.username)
	const { reset: emailReset, ...email } = useField('email', user.email)
	const { reset: passwordReset, ...password } = useField('password')
	const [ gender, setGender ] = useState({})
	const [ orientation, setOrientation ] = useState([])
	const [ tags, setTags ] = useState(false)
	const [ userTags, setUserTags ] = useState([])
	const [ bio, setBio ] = useState(user.bio || '')
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

		const orientationFromDb = () => {
			const o = []
			if (user.orientation.includes('f'))
				o.push({ value: 'female', label: 'female' })
			if (user.orientation.includes('m'))
				o.push({ value: 'male', label: 'male' })
			if (user.orientation.includes('o'))
				o.push({ value: 'other', label: 'other' })
			return o
		}

		const tagsFromDB = () => {
			const tagsFromUser = user.tags.split('#').map(t => {
				return { value: '#' + t, label: '#' + t }
			})
			return tagsFromUser.slice(1)
		}

		if (user.gender)
			setGender({ value: user.gender, label: user.gender })
		if (user.orientation)
			setOrientation(orientationFromDb())
		if (user.tags)
			setUserTags(tagsFromDB())
	}, [])

	const handleSubmit = e => {
		e.preventDefault()

		const orientationToDb = () => {
			if (orientation.length === 3)
				return 'fmo'
			if (orientation.length === 1)
				return orientation[0].value.substring(0, 1)
			if (!orientation.map(o => o.value).find(v => v === 'female'))
				return 'mo'
			if (!orientation.map(o => o.value).find(v => v === 'male'))
				return 'fo'
			return 'fm'
		}

		const updatedUser = {
			firstName: firstName.value ? firstName.value : user.firstName,
			lastName: lastName.value ? lastName.value : user.lastName,
			username: username.value.length > 0 ? username.value : user.username,
			email: email.value ? email.value : user.email,
			password: password.value ? password.value : user.password,
			gender: gender.value,
			orientation: orientationToDb(),
			tags: userTags.map(t => t.value).join(''),
			bio: bio
		}

		//console.log('updateduser', updatedUser)

		userService
			.updateUser(updatedUser, id)
			.then(data => {
				//console.log(data)
				setUser(data)
				setErrorMessage('')
				//todo: clear fields
			})
			.catch(e => {
				console.log('error', e.response.data)
				setErrorMessage(e.response.data.error)
			})
	}

	//console.log('user', user)
	//console.log('orientation', orientation)
	//console.log('user', user)
	//console.log('gender', gender)

	return <div>
			{ errorMessage && 
		   		<div><strong>{errorMessage}</strong></div>
			}
			<h2 className="text-center mt-3">Update user</h2>
			<div className="row justify-content-center align-items-center">
				
				<form className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleSubmit}>
					<InputField label='first name' field={firstName} current={user.firstName} />
					<InputField label='last name' field={lastName} current={user.lastName} />
					<InputField label='username' field={username} current={user.username} />
					<InputField label='email' field={email} current={user.email} />
					<InputField label='password' field={password} current='' />
					<SelectGender name='gender' setGender={setGender} gender={gender} />
					<SelectOrientation name='orientation' setOrientation={setOrientation} orientation={orientation} />
					<SelectTags name='tags' setUserTags={setUserTags} userTags={userTags}
						tags={tags} setTags={setTags} />
					<Textarea value={bio} setValue={setBio} label='bio' name='bio' />
					<button className="btn btn-success mt-3" type="submit">Update</button>
				</form>
			</div>
		</div>
}

export default UpdateForm;