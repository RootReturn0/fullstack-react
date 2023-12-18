import { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, setMessage, removeBlog }) => {
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
    try {
      const updatedBlog = await blogService.update(blog)
      setMessage({ 'content': `blog ${updatedBlog.title} by ${updatedBlog.author} updated`, 'type': 'success' })
    } catch (exception) {
      console.log(exception)
      setMessage({ 'content': 'could not update blog', 'type': 'error' })
    }
  }

  const remove = async (blog) => {
    try {
      if (!window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
        return
      }
      await blogService.remove(blog)
      removeBlog(blog)
      setMessage({ 'content': `blog ${blog.title} by ${blog.author} removed`, 'type': 'success' })
    } catch (exception) {
      setMessage({ 'content': 'could not remove blog', 'type': 'error' })
    }
  }

  return <div style={{
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }}>
    {blog.title} {blog.author}
    <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
    <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
    <div style={showWhenVisible}>
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