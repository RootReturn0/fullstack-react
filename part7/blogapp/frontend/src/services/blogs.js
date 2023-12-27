import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const getComments = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`${baseUrl}/${blog.id}/comments`, config)
  return response.data
}

const addComment = async (blog, comment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    { content: comment },
    config
  )
  return response.data
}

export default {
  getAll,
  setToken,
  create,
  update,
  remove,
  getComments,
  addComment,
}
