import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const votedAnecdote = state.find(a => a.id === id)
      const changedAnecdote = { ...votedAnecdote, votes: votedAnecdote.votes + 1 }

      return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
    },
    newAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

// export const {voteAnecdote, newAnecdote} = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(anecdoteSlice.actions.setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(anecdoteSlice.actions.newAnecdote(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    await anecdoteService.vote(id)
    dispatch(anecdoteSlice.actions.voteAnecdote(id))
  }
}

export default anecdoteSlice.reducer