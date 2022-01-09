const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  //tokenin purkaminen palauttaa käyttäjän nimen ja id:n

  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(request.user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  //tallennetaan blogin ID käyttäjän tietoihin
  response.status(201).json(savedBlog.toJSON())
})

blogRouter.patch('/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: body.likes,
  }
  const addedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  })

  response.status(200).json(addedBlog.toJSON())
})

//Mikäli poistaja ei ole sama kuin lisääjä, poistaminen ei onnistu.
blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
    //tämänhetkistä käyttäjää, joka saadaan tokenin IDstä, verrataan poistettavan blogin luojaan
  } else if (request.user !== blogToDelete.user.toString()) {
    return response.status(401).json({ error: 'unauthorized user' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter
