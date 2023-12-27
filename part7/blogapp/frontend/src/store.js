import { configureStore } from '@reduxjs/toolkit'

import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import userBlogReducer from './reducers/userBlogReducer'

const store = configureStore({
    reducer: {
      blogs: blogReducer,
      notification: notificationReducer,
      user: userReducer,
      userBlog: userBlogReducer
    }
})

export default store