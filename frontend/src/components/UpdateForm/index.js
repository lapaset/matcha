import React, { useState, useEffect } from 'react'
import { useField } from '../../hooks'
import InputField from './InputField'
import SelectGender from './SelectGender'
import SelectOrientation from './SelectOrientation'

const UpdateForm = ({ getUsers }) => {
	//TODO: get user_id from somewhere
	const id = 1
	
	const [ user, setUser ] = useState({})
	const { reset: nameReset, ...name } = useField('text')
	const { reset: usernameReset, ...username } = useField('text')
	const { reset: emailReset, ...email } = useField('email')
	const { reset: passwordReset, ...password } = useField('password')
	const [ gender, setGender ] = useState({})
	const [ orientation, setOrientation ] = useState([])

	useEffect(() => {

		fetch(`http://localhost:3001/users/${id}`)
			.then(res => {
				if (!res.ok)
					throw Error(res.statusText)
				return res.json()
			})
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

				setUser({
					...res
				})

				setGender({ value: res.gender, label: res.gender })
				setOrientation(orientationFromDb())

			})
			.catch(e => {
				console.log(e)
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

		//TODO validate input

		const updatedUser = {
			name: name.value ? name.value : user.name,
			username: username.value.length > 0 ? username.value : user.username,
			email: email.value ? email.value : user.email,
			password: password.value ? password.value : user.password,
			gender: gender.value,
			orientation: orientationToDb()
		}

		console.log('updateduser', updatedUser)

		fetch(`http://localhost:3001/users/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedUser),
		})
			.then(res => {
				if (!res.ok)
					throw Error(res.statusText)
				return res.text()
			})
			.then(data => {
				alert(data)
				setUser(updatedUser)
				getUsers()
			})
			.catch(e => {
				console.log(e)
			})
	}

	//console.log('user', user)
	//console.log('orientation', orientation)
	//console.log('user', user)
	//console.log('gender', gender)
	
	return (
		<div>	
			<form onSubmit={handleSubmit}>
				<InputField label='name' field={name} current={user.name} />
				<InputField label='username' field={username} current={user.username} />
				<InputField label='email' field={email} current={user.email} />
				<InputField label='password' field={password} current='' />
				<SelectGender name='gender' setGender={setGender} gender={gender} />
				<SelectOrientation name='orientation' setOrientation={setOrientation} orientation={orientation} />				
				<button type="submit">Update</button>
			</form>
		</div>
	)
}

export default UpdateForm;