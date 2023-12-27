import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateBlogInfo, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

import { Button, ListGroup } from 'react-bootstrap'

const BlogView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])

  const { id } = useParams()
  const blogDetails = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )
  const user = useSelector((state) => state.user)
  if (!blogDetails || !user) {
    navigate('/blogs')
  }
  const deleteVisible = user.id === blogDetails.user.id

  useEffect(() => {
    blogService.getComments(blogDetails).then((comments) => {
      setComments(comments)
    })
  })

  const like = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      dispatch(updateBlogInfo(updatedBlog))
      dispatch(
        setNotification(
          {
            content: `blog ${updatedBlog.title} by ${updatedBlog.author} updated`,
            type: 'success',
          },
          5
        )
      )
    } catch (exception) {
      console.log(exception)
      dispatch(
        setNotification({ content: 'could not update blog', type: 'error' }, 5)
      )
    }
  }

  const remove = async (blog) => {
    if (!window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    try {
      dispatch(deleteBlog(blog))
      dispatch(
        setNotification(
          {
            content: `blog ${blog.title} by ${blog.author} removed`,
            type: 'success',
          },
          5
        )
      )
      navigate('/blogs')
    } catch (exception) {
      console.log(exception)
      dispatch(
        setNotification({ content: 'could not remove blog', type: 'error' }, 5)
      )
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    try {
      const newComment = await blogService.addComment(blogDetails, comment)
      console.log(newComment)
      setComments(comments.concat(newComment))
      dispatch(
        setNotification(
          {
            content: `comment added`,
            type: 'success',
          },
          5
        )
      )
    } catch (exception) {
      console.log(exception)
      dispatch(
        setNotification({ content: 'could not add comment', type: 'error' }, 5)
      )
    }
    event.target.comment.value = ''
  }

  return (
    <div>
      <h2>{blogDetails.title}</h2>
      <p>
        <a>{blogDetails.url}</a>
      </p>
      <p>
        likes {blogDetails.likes}{' '}
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            like(blogDetails)
          }}
        >
          like
        </Button>
      </p>
      <p>added by {blogDetails.author}</p>
      {deleteVisible && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            remove(blogDetails)
          }}
        >
          remove
        </Button>
      )}

      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input name="comment" />
        <Button variant="primary" size="sm" type="submit">
          add comment
        </Button>
      </form>
      <div className="mt-3">
        {' '}
        <ListGroup variant="flush">
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>{comment.content}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  )
}

export default BlogView
