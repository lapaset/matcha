import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loginService from '../../services/loginService';
import { userGeoLocation } from '../../modules/geolocate'
//import FlashMessage from 'react-flash-message';
//import Alert from 'react-bootstrap/Alert';
import socket from '../../socket'


const Login = ({ setUser, wsClient }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		userGeoLocation();
		//console.log(window.localStorage.getItem("coordinates"));
	}, []);

	const handleLogin = event => {
		event.preventDefault();
		var coords = JSON.parse(window.localStorage.getItem('coordinates'));
		if (coords) {
			var latitude = coords.latitude
			var longitude = coords.longitude
		}
		loginService
			.login({ username, password, longitude, latitude })
			.then(data => {
				//console.log('Login data:', data)
				//console.log('coordinates from local storage:', window.localStorage.getItem("coordinates"));

				window.localStorage.setItem('loggedMatchaUser', JSON.stringify(data))
				wsClient.current = socket.createWs(data.user_id)
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

			<form onSubmit={handleLogin}>
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
		</>
	)
}

export default Login;