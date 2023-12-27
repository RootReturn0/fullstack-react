import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return null
    },
  },
})

export const setUser = (userObject) => {
  return async (dispatch) => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userObject))
    blogService.setToken(userObject.token)
    dispatch(userSlice.actions.setUser(userObject))
  }
}

export const initializeUser = () => {
  return async (dispatch) => {
    const user = window.localStorage.getItem('loggedBlogappUser')
    if (user) {
      const userObject = JSON.parse(user)
      blogService.setToken(userObject.token)
      dispatch(userSlice.actions.setUser(userObject))
    }
  }
}

export const clearUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(userSlice.actions.clearUser())
  }
}

export default userSlice.reducer
