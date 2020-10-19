const verifyRouter = require('express').Router()
const db = require('../utils/db')

verifyRouter.get('/', (req, resp) => {
	console.log('req.query.token', req.query.token)
	db.query('UPDATE users SET verified = 1 WHERE token = $1',
		[req.query.token], (err, res) => {
			if (res && res.rows[0]) 
				resp.redirect('http://localhost:3000/login')
			else
				resp.redirect('http://localhost:3000')
	})
})

module.exports = verifyRouter