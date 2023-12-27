import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUserBlog } from '../reducers/userBlogReducer'

import { Table } from 'react-bootstrap'

const UserTable = () => {
  const userBlogs = useSelector((state) => state.userBlog)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUserBlog())
  })


  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>name</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {userBlogs.map((userBlog) => (
            <tr key={userBlog.id}>
              <td><Link to={`/users/${userBlog.id}`}>{userBlog.name}</Link></td>
              <td>{userBlog.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UserTable
