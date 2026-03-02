const Blog = require('../models/blog')

const initialBlogs = [
    {
    title: "The story of Bob",
    author: "Bob1 Bob",
    url: "www.url.com"
    }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}
