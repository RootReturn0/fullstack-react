import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { ListGroup } from 'react-bootstrap'

const UserView = () => {
  const { id } = useParams()
  const userDetails = useSelector((state) =>
    state.userBlog.find((user) => user.id === id)
  )
  return (
    <div>
      <h2>{userDetails.name}</h2>
      <h3>added blogs</h3>
      <ListGroup className="mt-3">
        {userDetails.blogs.map((blog) => (
          <ListGroup.Item key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default UserView
