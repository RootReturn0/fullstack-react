import { useDispatch } from 'react-redux'

const NewAnecdote = () => {

    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.content.value
        event.target.content.value = ''

        dispatch({type: "anecdote/newAnecdote", payload: content})
        dispatch({type: "notification/setNotification", payload: `you created '${content}'`})
        setTimeout(() => {
            dispatch({type: "notification/clearNotification"})
        }, 5000)
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="content" /></div>
                <button>create</button>
            </form>
        </div>
    )
}

export default NewAnecdote