import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userBlogSlice = createSlice({
  name: 'userBlog',
  initialState: [],
  reducers: {
    setBlog(state, action) {
      return action.payload
    },
  },
})

export const initializeUserBlog = () => {
  return async (dispatch) => {
    const userBlogs = await userService.getAll()
    dispatch(userBlogSlice.actions.setBlog(userBlogs))
  }
}

export default userBlogSlice.reducer
