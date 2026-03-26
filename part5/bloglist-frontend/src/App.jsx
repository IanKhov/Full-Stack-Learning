import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)

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

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const newBlog = { title, author, url }
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({ text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('create failed', error)
      setMessage({ text: 'error creating blog', type: 'error' })
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <h3>create new</h3>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App