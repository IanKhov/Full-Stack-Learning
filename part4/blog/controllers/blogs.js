const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs ? user.blogs.concat(savedBlog._id) : [savedBlog._id]
  await user.save()

  const populated = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populated)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter
