const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    author: 1,
  })
  response.json(users.map((user) => user.toJSON()))
})

userRouter.post('/', async (request, response) => {
  const body = request.body
  const numbers = /\d+/
  const numbersInName =
    typeof body.name === 'number' ? false : body.name.match(numbers)

  if (body.password && !numbersInName) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

  } else if (numbersInName) {
    response
      .status(400)
      .send({ error: 'numbers detected in name, use letters only' })
  } else {
    response.status(400).send({ error: 'password required' })
  }
})

module.exports = userRouter
