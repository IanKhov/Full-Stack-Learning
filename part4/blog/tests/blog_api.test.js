const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app')

const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('Simple HTTP GET request', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    
    assert(response.body.length > 0)
    response.body.forEach(blog => {
      assert(blog.id !== undefined, 'blog should have id property')
      assert(blog._id === undefined, 'blog should not have _id property')
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "The story of Alice",
        author: "Alice Smith",
        url: "https://example.com/the-story-of-alice",
        likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('likes default to 0 if missing', async () => {
    const newBlog = {
        title: "Default Likes Test",
        author: "Test Author",
        url: "https://example.com/default-likes"
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('missing title returns 400', async () => {
    const newBlog = {
        author: "Test Author",
        url: "https://example.com/no-title",
        likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
})

test('missing url returns 400', async () => {
    const newBlog = {
        title: "Missing URL Test",
        author: "Test Author",
        likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
