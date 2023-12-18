import { useState } from 'react'

import TogglableWithCancel from './TogglableWithCancel'
import blogService from '../services/blogs'

const BlogForm = ({ newBlog, setNewBlog, handleSubmit }) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={handleSubmit}>
      <div>
                title:
        <input
          id = "blog-title"
          type="text"
          value={newBlog.title}
          name="Title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
                author:
        <input
          id = "blog-author"
          type="text"
          value={newBlog.author}
          name="Author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
                url:
        <input
          id = "blog-url"
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

const CreateBlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [visible, setVisible] = useState(false)

  const create = async (event) => {
    event.preventDefault()

    const isSuccess = await addBlog(newBlog)
    console.log(isSuccess)
    if (isSuccess) {
      setNewBlog({ title: '', author: '', url: '' })
      setVisible(false)
    }
  }

  return (<TogglableWithCancel buttonLabel="new blog" visible={visible} setVisible={setVisible}>
    <BlogForm
      newBlog={newBlog}
      setNewBlog={setNewBlog}
      handleSubmit={create}
    />
  </TogglableWithCancel>)
}

export default CreateBlogForm