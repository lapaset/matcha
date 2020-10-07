const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const tagsRouter = require('./controllers/tags')

app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)
app.use('/tags', tagsRouter)

app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}.`)
})