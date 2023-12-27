import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import CreateBlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import UserTable from './components/UserTable'
import UserView from './components/UserView'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { initializeUser, setUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import loginService from './services/login'

import './index.css'
import { Form, Button, ListGroup } from 'react-bootstrap'

const App = () => {
  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  )
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const setTimeoutMessage = (message) => {
    dispatch(setNotification(message, 5))
  }

  const addBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject))
      setTimeoutMessage({
        content: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success',
      })
      return true
    } catch (exception) {
      console.log(exception)
      setTimeoutMessage({ content: 'could not add blog', type: 'error' })
      return false
    }
  }

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setTimeoutMessage({
        content: 'wrong username or password',
        type: 'error',
      })
    }
  }

  const LoginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button type="submit">login</Button>
      </Form>
    </div>
  )

  const BlogList = () => {
    // const style = {
    //   padding: 5,
    //   border: 'solid',
    //   borderWidth: 1,
    //   marginBottom: 5,
    //   marginTop: 5,
    // }
    return (
      <div>
        <CreateBlogForm setMessage={setTimeoutMessage} addBlog={addBlog} />
        {blogs.map((blog) => (
          <ListGroup key={blog.id} className="mt-3">
            <ListGroup.Item>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by
                {blog.author}
              </Link>
            </ListGroup.Item>
          </ListGroup>
        ))}
      </div>
    )
  }

  return (
    <div className="container">
      {user && <Navigation />}
      <Notification />
      <h2>blogs</h2>
      {!user && <LoginForm />}

      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route
          path="/"
          element={user ? <Navigate to="/blogs" /> : <Navigate to="/" />}
        />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/users/:id" element={<UserView />} />
      </Routes>
    </div>
  )
}

export default App
