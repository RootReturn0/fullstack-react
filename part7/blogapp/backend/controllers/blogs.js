const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const data = request.body
  if (!data.title || !data.url) {
    return response.status(400).end()
  }

  if (!data.likes) {
    data.likes = 0
  }

  const user = request.user

  const blog = new Blog({ ...data, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'invalid user' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user ? body.user.id : request.user._id,
  }

  const originalBlog = await Blog.findById(request.params.id)

  if (originalBlog.user.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'invalid user' })
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(blog)
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('comments')
  response.json(blog.comments)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const comment = new Comment({ ...body })

  const blog = await Blog.findById(request.params.id)

  comment.blog = blog._id

  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)

  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = blogsRouter
