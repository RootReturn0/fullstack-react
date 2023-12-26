import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes
        }
        return state.anecdotes.filter(
            (anecdote) =>
                anecdote.content
                    .toLowerCase()
                    .includes(state.filter.toLowerCase())
        )
    })

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    const vote = (id) => {
        dispatch(voteAnecdote(id))
        dispatch(setNotification(`you voted '${anecdotes.find(a => a.id === id).content}'`, 5))
    }

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList