import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearUser } from '../reducers/userReducer'

import { Button, Navbar, Nav } from 'react-bootstrap'

const Navigation = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    navigate('/')
  }

  const style = {
    padding: 5,
  }

  return (
    <div style={style}>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={style} to="/blogs">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={style} to="/users">
                users
              </Link>
            </Nav.Link>
          </Nav>
          {user.name} {' '}
          logged in{' '}
          <Button variant="danger" size="sm" onClick={() => handleLogout()}>
            logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default Navigation
