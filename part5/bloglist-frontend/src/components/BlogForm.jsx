import { useState } from 'react'

import TogglableWithCancel from './TogglableWithCancel'
import blogService from '../services/blogs'

const BlogForm = ({ newBlog, setNewBlog, addBlog }) => (
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

const CreateBlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [visible, setVisible] = useState(false)

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      console.log('new blog', newBlog)
      const savedBlog = await blogService.create(newBlog)
      console.log('saved blog', savedBlog)

      props.concatBlogs(savedBlog)
      props.setMessage({ 'content': `a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'type': 'success' })
      setVisible(false)
    } catch (exception) {
      props.setMessage({ 'content': 'could not add blog', 'type': 'error' })
      setTimeout(() => {
        props.setMessage({ 'content': null, 'type': 'success' })
      }, 3000)
    }
  }

  return (<TogglableWithCancel buttonLabel="new blog" visible={visible} setVisible={setVisible}>
    <BlogForm
      newBlog={newBlog}
      setNewBlog={setNewBlog}
      addBlog={addBlog}
    />
  </TogglableWithCancel>)
}

export default CreateBlogForm