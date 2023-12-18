import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/BlogForm'
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ 'content': null, 'type': 'success' })


  const setAndSortBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  const concatBlogs = (blogObject) => {
    blogObject.user = user
    const newBlogs = blogs.concat(blogObject)
    setAndSortBlogs(newBlogs)
  }

  const removeBlog = (blog) => {
    console.log('remove blog', blog)
    const newBlogs = blogs.filter(b => b.id !== blog.id)
    setBlogs(newBlogs)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setAndSortBlogs(blogs)
    }
    )
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
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
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
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




  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={() => handleLogout()}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} setMessage={setMessage} removeBlog={removeBlog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && blogList()}
      {user && <CreateBlogForm concatBlogs={concatBlogs} setMessage={setMessage} />}
    </div>
  )
}

export default App