const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const cors = require('cors')
const logger = require('./utils/logger')
const {
  userExtractor,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
} = require('./utils/middleware')
const loginRouter = require('./controllers/login')

mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error in MongoDB connection', error.message))

app.use(cors())

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
