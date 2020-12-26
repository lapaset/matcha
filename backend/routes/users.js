const usersRouter = require('express').Router()
const db = require('../utils/db')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').TOKEN_SECRET

usersRouter.get('/', (req, resp) => {

	if (!jwt.verify(req.token, tokenSecret))
		return resp.status(401).json({ error: 'token missing or invalid' })

	let query = `SELECT username, user_id, longitude, latitude, 
	AGE(birthdate) as age, tags, gender, orientation, fame 
	FROM users`

	const parameters = []

	if (req.query.orientation) {
		query = query.concat(` WHERE CAST(orientation AS text) LIKE $1`)
		parameters.push(`%${req.query.orientation}%`)
	}

	if (req.query.gender) {

		query = query.concat(` ${parameters.length === 0 ? 'WHERE' : 'AND'}`)

		req.query.gender
			.split('')
			.forEach((g, i) => {
				parameters.push(g === 'f'
					? 'female'
					: g === 'm'
						? 'male'
						: 'other')

				query = query.concat(`${i === 0
					? ''
					: ' OR'} gender=$${parameters.length}`)

			})
	}

	db.query(`${query} ORDER BY fame DESC`, parameters, (err, res) => {
		if (err)
			resp.status(500).send(err)
		else
			resp.status(200).send(res.rows)
	})
})

usersRouter.get('/:id', (req, resp) => {

	if (!jwt.verify(req.token, tokenSecret))
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('SELECT user_id, first_name, last_name, username, email, verified, \
	token, password, gender, orientation, bio, tags, AGE(birthdate) as age, \
	id, profile_pic, photo_str, longitude, latitude, fame \
	FROM users \
	LEFT OUTER JOIN photos USING (user_id) \
	WHERE users.user_id = $1', [req.params.id], (err, res) => {
		if (res && res.rows[0])
			resp.status(200).send(res.rows)
		else if (res)
			resp.status(500).send({ error: 'User not found' })
		else
			resp.status(500).send({ error: err.detail })
	})
})

usersRouter.post('/', async (req, resp) => {

	const sendEmail = (email, token) => {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'testing.matcha',
				pass: 'matcha1234'
			}
		})

		//could add user_id to the verify address
		const mailOptions = {
			from: 'testing.matcha@gmail.com',
			to: email,
			subject: 'Verify your matcha account',
			text: `Hello! Please click the following link to verify your email http://localhost:3001/verify?token=${token}`
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		})
	}

	const { firstName, lastName, username, email, token, birthdate } = req.body;

	const hashedPassword = await bcrypt.hash(req.body.password, 10)

	db.query('INSERT INTO users (first_name, last_name, username, email, password, token, birthdate) \
		VALUES ($1, $2, $3, $4, $5, $6, $7)',
		[firstName, lastName, username, email, hashedPassword, token, birthdate],
		(err, res) => {
			if (res)
				resp.status(201).send(res.rows[0])

			else if (err.detail && err.detail.startsWith('Key (email)'))
				resp.status(409).send({ error: 'email already exists' })

			else if (err.detail && err.detail.startsWith('Key (username)'))
				resp.status(409).send({ error: 'username already exists' })

			else
				resp.status(500).send(err)
		})

	sendEmail(email, token)
})

usersRouter.patch('/:id', async (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user || user.user_id !== Number(req.params.id))
		return resp.status(401).json({ error: 'token missing or invalid' })

	const { password, firstName, lastName, ...body } = req.body

	if (firstName)
		body.first_name = firstName
	
	if (lastName)
		body.last_name = lastName

	let query = 'UPDATE users SET '
	const parameters = []

	if (req.body.password) {
		body.password = await bcrypt.hash(req.body.password, 10)
	}

	console.log('body after pw', body)
	
	Object.keys(body).forEach((k, i) => {
		query = query.concat(`${k} = $${i + 1}, `)
		parameters.push(body[k])
	})
	
	query = query.slice(0, -2).concat(` WHERE user_id = $${parameters.length + 1}
		RETURNING first_name, last_name, username, email, gender, orientation,
		bio, tags, AGE(birthdate) as age, longitude, latitude`)

	console.log('query', query, 'parameters', parameters)

	db.query(query, [...parameters, user.user_id], (err, res) => {

		if (res && res.rows[0])
			resp.status(200).send(res.rows[0])

		else if (res)
			resp.status(500).send({ error: 'User not found' })

		else if (err.detail && err.detail.startsWith('Key (email)'))
			resp.status(409).send({ error: 'email already exists' })

		else
			resp.status(500).send(err)
	})
})

usersRouter.delete('/:id', (req, resp) => {
	const user = jwt.verify(req.token, tokenSecret)

	if (!user || user.user_id !== Number(req.params.id))
		return resp.status(401).json({ error: 'token missing or invalid' })

	db.query('DELETE FROM users WHERE user_id = $1', [req.params.id], (err, res) => {
		if (res)
			resp.status(204).end()
		else
			resp.status(500).send(err)
	})
})

module.exports = usersRouter