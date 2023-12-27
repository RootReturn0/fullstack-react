import { useState } from 'react'

import TogglableWithCancel from './TogglableWithCancel'
import { Button, Form, Row, Col } from 'react-bootstrap'

const BlogForm = ({ newBlog, setNewBlog, handleSubmit }) => (
  <div>
    <h2>create new</h2>
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Row>
          <Col md={1}>
            <Form.Label>title</Form.Label>
          </Col>{' '}
          <Col md={5}>
            {' '}
            <Form.Control
              type="text"
              name="title"
              value={newBlog.title}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, title: target.value })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <Form.Label>author</Form.Label>
          </Col>{' '}
          <Col md={5}>
            {' '}
            <Form.Control
              type="text"
              name="author"
              value={newBlog.author}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, author: target.value })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <Form.Label>url</Form.Label>
          </Col>{' '}
          <Col md={5}>
            {' '}
            <Form.Control
              type="text"
              name="url"
              value={newBlog.url}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, url: target.value })
              }
            />
          </Col>
        </Row>
      </Form.Group>
      <Button variant="success" size="sm" type="submit">
        create
      </Button>
    </Form>
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

  return (
    <TogglableWithCancel
      buttonLabel="new blog"
      visible={visible}
      setVisible={setVisible}
    >
      <BlogForm
        newBlog={newBlog}
        setNewBlog={setNewBlog}
        handleSubmit={create}
      />
    </TogglableWithCancel>
  )
}

export default CreateBlogForm
