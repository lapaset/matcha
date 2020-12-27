const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	req.token = authorization && authorization.toLowerCase().startsWith('bearer ')
		? authorization.substring(7)
		: null
	next()
}

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

const errorHandler = (err, req, response, next) => {

	if (err.name === 'JsonWebTokenError')
		return response.status(401).json({ error: 'Invalid token' })

	next(error)
}


module.exports = {
	requestLogger,
	unknownEndpoint,
	tokenExtractor,
	errorHandler
}