const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'username and password are required' })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'username and password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    if (error.code === 11000) {
      return response.status(400).json({ error: 'username must be unique' })
    }
    next(error)
  }
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = userRouter
