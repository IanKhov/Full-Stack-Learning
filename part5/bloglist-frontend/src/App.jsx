import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      if (user.token) {
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userData = await loginService.login({ username, password })
      setUser(userData)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(userData))
      if (userData.token) {
        blogService.setToken(userData.token)
      }
      setUsername('')
      setPassword('')
      setMessage({ text: `Welcome ${userData.name}`, type: 'success' })
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('login failed', error)
      setMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({ text: 'logged out', type: 'success' })
    setTimeout(() => setMessage(null), 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage({ text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setMessage(null), 5000)
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }
    } catch (error) {
      console.error('create failed', error)
      setMessage({ text: 'error creating blog', type: 'error' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLike = async (id, updatedBlog) => {
    try {
      const returned = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(b => {
        if (b.id === id || b._id === id) {
          const hasUserObject = typeof returned.user === 'object' && returned.user !== null
          return hasUserObject ? returned : { ...returned, user: b.user }
        }
        return b
      }))
    } catch (error) {
      console.error('like failed', error)
      setMessage({ text: 'error updating likes', type: 'error' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const sorted = blogs.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0))

  const handleRemove = async (id, blogTitle) => {
    const ok = window.confirm(`Remove blog '${blogTitle}'?`)
    if (!ok) return
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => (b.id || b._id) !== id))
      setMessage({ text: `removed '${blogTitle}'`, type: 'success' })
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('remove failed', error)
      setMessage({ text: 'error removing blog', type: 'error' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {sorted.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleRemove} currentUser={user} />
      )}
    </div>
  )
}

export default App
