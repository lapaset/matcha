import React, { useState } from 'react'
import Select from 'react-select'
import { useField } from '../hooks'

const InputField = ({ label, field }) => (
	<div>
		{label}
		<input {...field} />
	</div>
)

const SelectGender = ({ setGender }) => {

	const onChange = option => {
		console.log('option', option)
		setGender(option)
	}

	const options = [
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' },
		{ value: 'other', label: 'other' }
	]

	return 	<div>
				gender
				<Select options={options} onChange={onChange} />
			</div>
}

const SelectOrientation = ({ setOrientation, orientation }) => {

	const onChange = options => setOrientation(options)

	const options = [
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' },
		{ value: 'other', label: 'other' }
	]

	return 	<div>
				looking for
				<Select options={options} onChange={onChange} isMulti />
			</div>
}

const UpdateForm = ({ getUsers }) => {

	const [ gender, setGender ] = useState('')
	const [ orientation, setOrientation ] = useState([])

	const handleSubmit = e => {
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

		e.preventDefault()

		//TODO validate input

		fetch('http://localhost:3001/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name.value,
				username: username.value,
				email: email.value,
				password: password.value,
				gender: gender.value,
				orientation: orientationToDb()
			}),
		})
			.then(res => {
				return res.text()
			})
			.then(data => {
				alert(data)
				getUsers()
			})
	}

	const { reset: nameReset, ...name } = useField('text')
	const { reset: usernameReset, ...username } = useField('text')
	const { reset: emailReset, ...email } = useField('email')
	const { reset: passwordReset, ...password } = useField('password')
	
	return (
		<div>	
			<form onSubmit={handleSubmit}>
				<InputField label='name' field={name} />
				<InputField label='username' field={username} />
				<InputField label='email' field={email} />
				<InputField label='password' field={password} />
				<SelectGender name='gender' setGender={setGender} />
				<SelectOrientation name='orientation' setOrientation={setOrientation} orientation={orientation} />				
				<button type="submit">Create</button>
			</form>
		</div>
	)
}

export default UpdateForm;