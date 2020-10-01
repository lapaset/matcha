const userModel = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', (req, res) => {
	userModel.getUsers()
		.then(users => {
			res.status(200).send(users.rows)
		})
		.catch(error => {
			res.status(500).send(error)
		})
})

usersRouter.post('/', (req, res) => {
	userModel.createUser(req.body)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

usersRouter.put('/:id', (req, res) => {
	userModel.updateUser(req.body, req.params.id)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

usersRouter.delete('/:id', (req, res) => {
	userModel.deleteUser(req.params.id)
		.then(r => {
			res.status(200).send(r)
		})
		.catch(e => {
			res.status(500).send(e)
		})
})

module.exports = usersRouter