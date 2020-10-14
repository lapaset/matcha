const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../utils/db')
const tokenSecret = require('../utils/config').TOKEN_SECRET

loginRouter.post('/', (request, response) => {
    const body = request.body;
    db.query("SELECT username, password, user_id FROM users WHERE username= $1", [body.username], async (err, res) => {

		if (err)
			return response.status(500).send(err)
		if (res.rowCount === 0)
        	return response.status(401).send({ message: "Invalid username or password" })

		const hashedPass = res.rows[0].password;
		const matches = await bcrypt.compare(body.password, hashedPass)

		if (!matches)
			return response.status(401).send({ message: "Invalid username or password" })
		
		const userForToken = {
			username: res.rows[0].username,
			id: res.rows[0].user_id
		}

		const token = jwt.sign(userForToken, tokenSecret)
		response.header('auth-token', token).send({ token, username: res.rows[0].username, user_id: res.rows[0].user_id })
	})
})

module.exports = loginRouter