import { useSelector, useDispatch } from 'react-redux'

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
        dispatch({type: "anecdote/voteAnecdote", payload: id})
        dispatch({type: "notification/setNotification", payload: `you voted for '${anecdotes.find(a => a.id === id).content}'`})
        setTimeout(() => {
            dispatch({type: "notification/clearNotification"})
        }, 5000)
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