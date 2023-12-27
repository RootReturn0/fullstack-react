import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    newBlog(state, action) {
      return [...state, action.payload]
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog))
    },
  },
})

// export const {voteBlog, newBlog} = blogSlice.actions
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(blogSlice.actions.setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    const userObject = {id: newBlog.user}
    const blogObject = {...newBlog, user: userObject}
    dispatch(blogSlice.actions.newBlog(blogObject))
  }
}

export const deleteBlog = (blogObject) => {
  return async (dispatch) => {
    await blogService.remove(blogObject)
    dispatch(blogSlice.actions.deleteBlog(blogObject.id))
  }
}

export const updateBlogInfo = (blogObject) => {
  return async (dispatch) => {
    await blogService.update(blogObject)
    dispatch(blogSlice.actions.updateBlog(blogObject))
  }
}

export default blogSlice.reducer
