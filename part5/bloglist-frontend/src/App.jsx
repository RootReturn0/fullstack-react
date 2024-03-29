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

  const setTimeoutMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage({ 'content': null, 'type': 'success' })
    }, 3000)
  }


  const setAndSortBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }


  const concatBlogs = (blogObject) => {
    blogObject.user = user
    const newBlogs = blogs.concat(blogObject)
    setAndSortBlogs(newBlogs)
  }

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      concatBlogs(savedBlog)
      setTimeoutMessage({ 'content': `a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'type': 'success' })
      return true
    } catch (exception) {
      setTimeoutMessage({ 'content': 'could not add blog', 'type': 'error' })
      return false
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      setTimeoutMessage({ 'content': `blog ${updatedBlog.title} by ${updatedBlog.author} updated`, 'type': 'success' })
    } catch (exception) {
      console.log(exception)
      setTimeoutMessage({ 'content': 'could not update blog', 'type': 'error' })
    }
  }


  const removeBlog =  async (blogObject) => {
    try {
      await blogService.remove(blogObject)
      const newBlogs = blogs.filter(b => b.id !== blogObject.id)
      setBlogs(newBlogs)
      setTimeoutMessage({ 'content': `blog ${blogObject.title} by ${blogObject.author} removed`, 'type': 'success' })
    } catch (exception) {
      setTimeoutMessage({ 'content': 'could not remove blog', 'type': 'error' })
    }
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
    ).catch(error => {
      console.log(error)
    })
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
      setTimeoutMessage({ 'content': 'wrong username or password', 'type': 'error' })
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
        <Blog key={blog.id} blog={blog} setMessage={setTimeoutMessage} updateBlog={updateBlog} removeBlog={removeBlog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && blogList()}
      {user && <CreateBlogForm concatBlogs={concatBlogs} setMessage={setTimeoutMessage} addBlog={addBlog} />}
    </div>
  )
}

export default App