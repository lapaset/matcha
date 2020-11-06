import React, { useState } from "react";
import { useForm } from 'react-hook-form'
import { Form, Col } from 'react-bootstrap'
//import FlashMessage from 'react-flash-message';
//import Alert from 'react-bootstrap/Alert';
import '../../style/signup.css';
import userService from '../../services/userService'
import PasswordFields from '../Forms/PasswordFields'
import RequiredInputField from '../Forms/RequiredInputField'
import BirthdateField from './BirthdateField'

const Signup = () => {
	const { register, handleSubmit, errors, watch } = useForm()
	const [errorMessage, setErrorMessage] = useState('')
	const [notification, setNotification] = useState('')

	// generating token
	const rand = () => Math.random(0).toString(36).substr(2);
	const token_check = (length) => (rand() + rand() + rand() + rand()).substr(0, length);
	const token = token_check(100);

	const onSubmit = (data, e) => {
		//console.log('data', data);

		const userObject = {
			...data,
			token,
			birthdate: `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`
		}

		userService
			.createUser(userObject)
			.then(() => {
				console.log('user added')
				setNotification('signup succesfull, check your email')
				e.target.reset()
			})
			.catch(e => {
				setErrorMessage(e.response.data.error)
			})
	}
	return (
		<>
			<h2 className="text-center mt-3">Signup Form</h2>

			<div className="row justify-content-center align-items-center">
				<form className="text-center mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleSubmit(onSubmit)}>
					
					{errorMessage && <div className="text-center text-danger" >{errorMessage}</div>}
					{notification && <div className="text-center text-success" >{notification}</div>}

					<Form.Row>
						<Col>
							<RequiredInputField label='first name' errors={errors.firstName}
								name='firstName' defVal='' maxLen='50'
								register={register} />
						</Col>
						<Col>
							<RequiredInputField label='last name' errors={errors.lastName}
								name='lastName' defVal='' maxLen='50'
								register={register} />
						</Col>
					</Form.Row>

					<RequiredInputField label='username' errors={errors.username}
						name='username' defVal='' maxLen='255'
						register={register} />

					<BirthdateField register={register} errors={errors.birthdate} watch={watch} />

					<RequiredInputField label='email' errors={errors.email}
						name='email' defVal='' maxLen='255'
						register={register} requirements={{
							pattern: {
								value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{ | }~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
								message: 'not a valid email'
							}
						}} />

					<PasswordFields watch={watch} register={register} errors={errors}
						required={true} />

					<button className="btn btn-success mt-3" type="submit">Register</button>
				</form>
			</div>
		</>
	)
}

export default Signup;