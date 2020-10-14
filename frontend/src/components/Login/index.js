import React, { useState } from "react";
import login from '../../services/loginService';
//import FlashMessage from 'react-flash-message';
//import Alert from 'react-bootstrap/Alert';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null)
    const [user, setUser] = useState("");

    const handleLogin = async event => {
        event.preventDefault();
        try {
            const user = await login.loginService({
                username, password
            })
            setUser(user)
            setUsername('')
            setPassword('')
        } catch(exception){
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <>
		   { errorMessage && 
		   		<div><strong>{errorMessage}</strong></div>
				/*<FlashMessage duration={5000}>
					<Alert variant="info">
						<span className="close"><strong >X</strong></span>
						<strong>{errorMessage}</strong>
					</Alert>
				</FlashMessage>*/
            }
            <h2 className="text-center mt-3">Login</h2>
            <div className="row justify-content-center align-items-center">
                <form className="text-center mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8" onSubmit={handleLogin}>
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
                    <div className="form-group mt-3">
                        {user !== null &&
                            <div>
                                <p><b>{user.username}</b> logged-in and id is: {user.id}</p>
                            </div>
                        }
                    </div>
                </form>
            </div>
       </>
   )
}

export default Login;