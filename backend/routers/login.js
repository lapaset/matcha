const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../utils/db')
const tokenSecret = require('../utils/config').TOKEN_SECRET
const {getLoginCoordinates} = require('../utils/getLoginCoordinates')

loginRouter.post('/', async (request, response) => {
    const body = request.body;
    db.query("SELECT * FROM users WHERE username= $1", [body.username], async (err, res) => {
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
		// need to check if the coordinates correct
		const ip = request.ip;
		console.log(ip);
		console.log("Is this?")
		const coords = await getLoginCoordinates(request, res.rows[0]);
		db.query("UPDATE users SET latitude = $1, longitude = $2 WHERE username = $3 RETURNING *", [coords.latitude, coords.longitude, body.username], (err, res) => {
			if (res && res.rows[0])
				console.log("coordinates your location successfull")
			else
				console.log("coordinates your location failed")
		});
		const userForToken = {
			username: res.rows[0].username,
			id: res.rows[0].user_id,
			longitude: coords.longitude,
			latitude: coords.latitude
		}

		const session_token = jwt.sign(userForToken, tokenSecret)
		response.header('auth-token', session_token).send({ ...res.rows[0], session_token })
	})
})

module.exports = loginRouter