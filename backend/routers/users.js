const usersRouter = require('express').Router()
const db = require('../utils/db')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

//const { registerValidation } = require('../utils/validation')

const sendEmail = (email, token) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'testing.matcha',
			pass: 'matcha1234'
		}
	});

	const mailOptions = {
		from: 'testing.matcha@gmail.com',
		to: email,
		subject: 'Sending Email using Node.js',
		text: `Hello! Please click the following link to verify your email http://localhost:5000/verify?token=${token}`
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

usersRouter.get('/', (req, resp) => {
	db.query('SELECT * FROM users', [], (err, res) => {
		if (err)
			resp.status(500).send(err)
		else
			resp.status(200).send(res.rows)
	})
})

usersRouter.get('/:id', (req, resp) => {
	db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id], (err, res) => {
		if (res && res.rows[0])
			resp.status(200).send(res.rows[0])
		else if (res)
			resp.status(500).send({ error: 'User not found' })
		else
			resp.status(500).send({ error: err.detail })
	})
})

usersRouter.post('/', async (req, resp) => {
	// LETS VALIDATE THE DATA BEFORE MAKE A USER and it comes from validation.js file
	//const { error } = registerValidation(req.body);
	//if (error) return res.status(400).send({ message: error.details[0].message });

	const { firstName, lastName, username, email, token } = req.body;

	// Hash password	
	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

	// Add user
	db.query('INSERT INTO users (first_name, last_name, username, email, password, token) \
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[firstName, lastName, username, email, hashedPassword, token],
		(err, res) => {
			if (res)
				resp.status(200).send(res.rows[0])
			else if (err.detail.startsWith('Key (email)'))
				resp.status(409).send({ error: 'email already exists' })
			else if (err.detail.startsWith('Key (username)'))
				resp.status(409).send({ error: 'username already exists' })
			else
				resp.status(500).send(err)
		})

	//send the email!
})

usersRouter.put('/:id', (req, resp) => {
	const { firstName, lastName, username, email, gender, orientation, tags, bio } = req.body
	db.query('UPDATE users \
		SET (first_name, last_name, username, email, gender, orientation, tags, bio) \
		= ($1, $2, $3, $4, $5, $6, $7, $8) \
		WHERE user_id = $9 RETURNING *',
		[firstName, lastName, username, email, gender, orientation, tags, bio, req.params.id],
		(err, res) => {

			if (res && res.rows[0])
				resp.status(200).send(res.rows[0])
			else if (res)
				resp.status(500).send({ error: 'User not found' })
			else if (err.detail.startsWith('Key (email)'))
				resp.status(409).send({ error: 'email already exists' })
			else if (err.detail.startsWith('Key (username)'))
				resp.status(409).send({ error: 'username already exists' })
			else
				resp.status(500).send(err)
		})
})

usersRouter.delete('/:id', (req, resp) => {
	db.query('DELETE FROM users WHERE user_id = $1', [req.params.id], () => {
		resp.status(204).end()
	})
})

module.exports = usersRouter