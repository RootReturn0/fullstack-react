import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'

const Notification = ({ message }) => {
  if (message.content === null) {
    return
  }

  return (
    <div className={message.type}>
      {message.content}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ 'content': null, 'type': 'success' })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ 'content': 'wrong username or password', 'type': 'error' })
      setTimeout(() => {
        setMessage({ 'content': null, 'type': 'success' })
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const savedBlog = await blogService.create(newBlog)

      setBlogs(blogs.concat(savedBlog))
      setMessage({ 'content': `a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'type': 'success' })
    } catch (exception) {
      setMessage({ 'content': 'could not add blog', 'type': 'error' })
      setTimeout(() => {
        setMessage({ 'content': null, 'type': 'success' })
      }, 3000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
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

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            name="Title"
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            name="Url"
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={() => handleLogout()}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && createBlogForm()}
      {user && blogList()}
    </div>
  )
}

export default App