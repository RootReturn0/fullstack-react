const testingRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await User.insertMany([
    {
      username: 'root',
      name: 'Superuser',
      passwordHash: await bcrypt.hash('sekret', 10),
    },
    {
      username: 'notroot',
      name: 'Not Superuser',
      passwordHash: await bcrypt.hash('sekret', 10),
    }
  ])

  response.status(204).end()
})

module.exports = testingRouter