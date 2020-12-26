const requestLogger = (req, res, next) => {
	console.log('Method:', req.method)
	console.log('Path:  ', req.path)
	console.log('Body:  ', req.body)
	console.log('---')
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	req.token = authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null
	next()
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	tokenExtractor
}