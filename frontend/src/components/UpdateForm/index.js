import React, { useState, useEffect } from 'react'
import { useField } from '../../hooks'
import InputField from './InputField'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'
import SelectTags from './SelectTags'
import Textarea from './Textarea'
import userService from '../../services/users'
import tagService from '../../services/tags'

const UpdateForm = () => {
	//TODO: get user_id from somewhere
	const id = 1

	const [ user, setUser ] = useState({})
	const { reset: firstNameReset, ...firstName } = useField('text')
	const { reset: lastNameReset, ...lastName } = useField('text')
	const { reset: usernameReset, ...username } = useField('text')
	const { reset: emailReset, ...email } = useField('email')
	const { reset: passwordReset, ...password } = useField('password')
	const [ gender, setGender ] = useState({})
	const [ orientation, setOrientation ] = useState([])
	const [ tags, setTags ] = useState(false)
	const [ userTags, setUserTags ] = useState([])
	const [ bio, setBio ] = useState('')


	useEffect(() => {
		tagService
			.getTags()
			.then(data => {
				setTags(data)
			})
			.catch((error) => {
				console.log(error)
			})

		userService
			.getUser(id)
			.then(res => {
				const orientationFromDb = () => {
					const o = []
					if (res.orientation.includes('f'))
						o.push({ value: 'female', label: 'female' })
					if (res.orientation.includes('m'))
						o.push({ value: 'male', label: 'male' })
					if (res.orientation.includes('o'))
						o.push({ value: 'other', label: 'other' })
					return o
				}

				const tagsFromDB = () => {
					const tagsFromUser = res.tags.split('#').map(t => {
						return { value: '#' + t, label: '#' + t }
					})
					return tagsFromUser.slice(1)
				}

				const { first_name, last_name, ...user } = res

				setUser({
					...user,
					firstName: res.first_name,
					lastName: res.last_name
				})

				setGender({ value: res.gender, label: res.gender })
				setOrientation(orientationFromDb())
				setUserTags(tagsFromDB())
				setBio(res.bio || '')
			})
			.catch(e => {
				console.log('Error:', e.response)
			})
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
				setUser(updatedUser)
				//todo: clear fields
			})
			.catch(e => {
				console.log('error', e.response.data)
				//todo: notify error
			})
	}

	//console.log('user', user)
	//console.log('orientation', orientation)
	//console.log('user', user)
	//console.log('gender', gender)

	return (
		<div>
			<h2 className="text-center mt-3">Update user</h2>
			<div className="row justify-content-center align-items-center">
				
				<form onSubmit={handleSubmit}>
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
	)
}

export default UpdateForm;