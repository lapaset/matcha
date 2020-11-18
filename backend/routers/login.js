const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../utils/db')
const tokenSecret = require('../utils/config').TOKEN_SECRET
const { getLoginCoordinates } = require('../utils/getLoginCoordinates')

loginRouter.post('/', (request, response) => {
	const body = request.body;
	db.query("SELECT user_id, first_name, last_name, username, email, verified, \
	token, password, gender, orientation, bio, tags, AGE(birthdate) as age, \
	id, profile_pic, photo_str, longitude, latitude \
	FROM users \
	LEFT OUTER JOIN photos USING (user_id) \
	WHERE username= $1", [body.username], async (err, res) => {

		if (err)
			return response.status(500).send(err)
		if (res.rowCount === 0)
			return response.status(401).send({ error: "Invalid username or password" })

		const hashedPass = res.rows[0].password;
		const matches = await bcrypt.compare(body.password, hashedPass)

		if (!matches)
			return response.status(401).send({ error: "Invalid username or password" })

		if (!res.rows[0].verified)
			return response.status(401).send({ error: "Account needs to be verified, check your email" })

		//todo: a separate location service!

		// need to check if the coordinates correct
		const ip = request.ip;
		//console.log(ip);
		//console.log("Is this?")
		const coords = await getLoginCoordinates(request, res.rows[0]);
		//console.log(res.rows[0].longitude)
		if (!res.rows[0].longitude && !res.rows[0].latitude)
		{
			db.query("UPDATE users SET latitude = $1, longitude = $2 WHERE username = $3 RETURNING *",
				[coords.latitude, coords.longitude, body.username], (err, result) => {
					if (result && result.rows[0]) {
						console.log("coordinates your location successfull")

						const userForToken = {
							username: res.rows[0].username,
							id: res.rows[0].user_id,
							longitude: coords.longitude,
							latitude: coords.latitude
						}
						console.log('user for token', userForToken)
						const session_token = jwt.sign(userForToken, tokenSecret)
						console.log('here')

						response.header('auth-token', session_token).send({ rows: res.rows, session_token })

					} else
						console.log("coordinates your location failed")
				});
		}
		else{
			const userForToken = {
				username: res.rows[0].username,
				id: res.rows[0].user_id,
				longitude: coords.longitude,
				latitude: coords.latitude
			}
			console.log('user for token', userForToken)
			const session_token = jwt.sign(userForToken, tokenSecret)
			console.log('here')

			response.header('auth-token', session_token).send({ rows: res.rows, session_token })
		}

	})
})

module.exports = loginRouter