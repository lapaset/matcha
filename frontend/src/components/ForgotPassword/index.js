import React, { useState } from 'react'
import forgotPasswdService from '../../services/forgotpassService'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
	const [message, setMessage] = useState(null)
	const [errMessage, setErressage] = useState(null)

    const forgotHandler = e => {
		e.preventDefault();
		forgotPasswdService
		.forgotPass({email})
		.then(function (response){
			setMessage(response.message)
			setErressage('')
			setEmail('')
		})
		.catch(function (error){
			setErressage(error.response.data.error)
			setMessage('')
		})
    }
    return <>
            <h2 className="text-center mt-3">Forgot password</h2>
			<div className="row justify-content-center align-items-center">
				<form className="text-center mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={forgotHandler}>
					{errMessage && <div className="text-danger" >{errMessage}</div>}
					{message && <div className="text-success" >{message}</div>}
					<div className="form-group mt-3">
						<input className="form-control"
							type="text"
							name="email"
							value={email}
							onChange={({ target }) => setEmail(target.value)}
							placeholder="Type your email"
						/>
					</div>
					<button className="btn btn-success mt-3" type="submit">Submit</button>
				</form>
			</div>
        </>
}

export default ForgotPassword;