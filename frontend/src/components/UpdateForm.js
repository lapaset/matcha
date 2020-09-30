import React from 'react'
import { useField } from '../hooks'

const InputField = ({ label, field }) => (
	<div>
		{label}
		<input {...field} />
	</div>
)

const UpdateForm = ({ getUsers }) => {

	const handleSubmit = e => {
		e.preventDefault()
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
				orientation: orientation.value
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
	const { reset: genderReset, ...gender } = useField('text')
	const { reset: orientationReset, ...orientation } = useField('text')
	
	return (
		<div>	
			<form onSubmit={handleSubmit}>
				<InputField label='name' field={name} />
				<InputField label='username' field={username} />
				<InputField label='email' field={email} />
				<InputField label='password' field={password} />
				<InputField label='gender' field={gender} />
				<InputField label='orientation' field={orientation} />
				<button type="submit">Create</button>
			</form>
		</div>
	)
}

export default UpdateForm;