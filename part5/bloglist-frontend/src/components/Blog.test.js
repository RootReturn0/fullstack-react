import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'url',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} />)

  const elementTitle = screen.getByText('Component testing is done with react-testing-library')
  const elementAuthor = screen.getByText('author')
  const elementUrl = screen.getByText('url')
  const elementLikes = screen.getByText('likes 0')
  const elementToggle = container.querySelector('.togglable')

  expect(elementTitle).toBeDefined()
  expect(elementAuthor).toBeDefined()
  expect(elementUrl).toBeDefined()
  expect(elementLikes).toBeDefined()
  expect(elementToggle).toHaveStyle('display: none')
})

test('blog\'s details are shown after clicking the button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'url',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} />)
  const elementToggle = container.querySelector('.togglable')

  expect(elementToggle).toHaveStyle('display: none')

  const button = screen.getByText('view')
  await button.click()
  const elementToggleAfterClick = container.querySelector('.togglable')

  expect(elementToggleAfterClick).not.toHaveStyle('display: none')
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'url',
    likes: 0,
  }

  const mockUpdateBlogHandler = jest.fn()
  render(<Blog blog={blog} updateBlog={mockUpdateBlogHandler}/>)
  const button = screen.getByText('view')
  await button.click()

  const likeButton = screen.getByText('like')
  await likeButton.click()
  await likeButton.click()

  expect(mockUpdateBlogHandler.mock.calls.length).toBe(2)
})

test('create new blog', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'url'
  }

  const mockAddBlogHandler = jest.fn()
  const user = userEvent.setup()
  const { container } = render(<CreateBlogForm addBlog={mockAddBlogHandler}/>)

  const inputTitle = container.querySelector('#blog-title')
  const inputAuthor = container.querySelector('#blog-author')
  const inputUrl = container.querySelector('#blog-url')
  const button = screen.getByText('create')

  await user.type(inputTitle, blog.title)
  await user.type(inputAuthor, blog.author)
  await user.type(inputUrl, blog.url)
  await user.click(button)

  expect(mockAddBlogHandler.mock.calls.length).toBe(1)
  expect(mockAddBlogHandler.mock.calls[0][0]).toEqual(blog)
})