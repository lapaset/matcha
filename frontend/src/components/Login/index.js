import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loginService from '../../services/loginService';
import {userGeoLocation} from '../../modules/geolocate'
//import FlashMessage from 'react-flash-message';
//import Alert from 'react-bootstrap/Alert';

const Login = ({ setUser, loadingUser }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		userGeoLocation();
		//var data = JSON.parse(localStorage.getItem("coordinates"));
		//console.log(window.localStorage.getItem("coordinates"));
		//console.log(data["latitude"]);
		//console.log(data["longitude"]);
	}, []);

	const handleLogin = event => {
		event.preventDefault();
		loginService
			.login({ username, password })
			.then(data => {
				console.log('Login data:', data)
				console.log(window.localStorage.getItem("coordinates"));
				window.localStorage.setItem(
					'loggedMatchaUser', JSON.stringify(data)
				)
				setUsername('')
				setPassword('')
				setErrorMessage(null)
				setUser(data)
			})
			.catch(e => {
				setErrorMessage(e.response.data.error)
			})
	}

	return (
		<>
			<h2 className="text-center mt-3">Login</h2>
			<div className="row justify-content-center align-items-center">
				<form className="text-center mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleLogin}>
					{errorMessage && <div className="text-danger" >{errorMessage}</div>}
					<div className="form-group mt-3">
						<input className="form-control"
							type="text"
							name="username"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
							placeholder="Username"
						/>
					</div>
					<div className="form-group mt-3">
						<input className="form-control"
							type="password"
							name="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
							placeholder="Password"
						/>
					</div>
					<button className="btn btn-success mt-3" type="submit">Login</button>
					<p className="forgot-password text-right">
						<Link to={'/forgot'}>Forgot password?</Link>
					</p>
				</form>
			</div>
		</>
	)
}

export default Login;