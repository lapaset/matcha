const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
const usersRouter = require('./routers/users')
const tagsRouter = require('./routers/tags')
const loginRouter = require('./routers/login')
const middleware = require('./utils/middleware')
const verifyRouter = require('./routers/verify')
const resetRouter = require('./routers/reset')

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.enable('trust proxy')

app.use('/users', usersRouter)
app.use('/tags', tagsRouter)
app.use('/login', loginRouter)
app.use('/verify', verifyRouter)
app.use('/reset', resetRouter)

app.use(middleware.unknownEndpoint)

app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}.`)
})