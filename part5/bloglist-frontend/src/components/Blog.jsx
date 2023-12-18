import { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, setMessage, removeBlog, updateBlog }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  let deleteVisible = false

  const blogUser = blog.user
  if (blogUser) {
    const loginUser = window.localStorage.getItem('loggedBlogappUser')
    const user = JSON.parse(loginUser)
    if (user.id === blogUser.id) {
      deleteVisible = true
    }
  }

  const like = async (blog) => {
    blog.likes += 1
    updateBlog(blog)
  }

  const remove = async (blog) => {
    if (!window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    removeBlog(blog)
  }

  return <div style={{
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }}>
    <p><span>{blog.title}</span> <span>{blog.author}</span>
      <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
    </p>
    <div style={showWhenVisible} className='togglable'>
      <div>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <><button onClick={() => { like(blog) }}>like</button></></p>
        <p>{blogUser ? blogUser.name : ''}</p>
      </div>
    </div>
    <div style={{ display: deleteVisible ? '' : 'none' }}>
      <button onClick={() => {
        remove(blog)
      }}>remove</button>
    </div>
  </div>
}

export default Blog