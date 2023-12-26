import axios from 'axios'

export const getAnecdotes = () =>
  axios.get('http://localhost:3001/anecdotes').then(res => res.data)

export const createAnecdote = (content) =>
  axios.post('http://localhost:3001/anecdotes', content).then(res => res.data)

export const updateAnecdote = (updateAnecdote) =>
  axios.put(`http://localhost:3001/anecdotes/${updateAnecdote.id}`, updateAnecdote).then(res => res.data)